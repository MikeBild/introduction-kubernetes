import type { AddressInfo } from 'node:net'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createApp } from '../src/app.ts'
import type { Store } from '../src/db.ts'
import { priceItems, totalCents, type Order, type OrderId, type Product } from '../src/order.ts'

const products: Product[] = [
  { id: 'p-hammer' as Product['id'], name: 'Schlosserhammer 500 g', priceCents: 1990, stock: 2 },
]

// Store im Speicher: Die HTTP-Schicht lässt sich ohne Postgres testen.
const fakeStore = (healthy: () => boolean): Store => {
  const orders: Order[] = []
  return {
    ping: async () => {
      if (!healthy()) throw new Error('db down')
    },
    listProducts: async () => products,
    listOrders: async () => orders,
    placeOrder: async (input) => {
      const priced = priceItems(input, products)
      if (!priced.ok) return priced
      const order: Order = {
        id: `o-${orders.length + 1}` as OrderId,
        customerId: input.customerId,
        items: priced.items,
        status: 'placed',
        createdAt: new Date(0).toISOString(),
      }
      orders.push(order)
      return { ok: true, order }
    },
    close: async () => {},
  }
}

let dbUp = true
let shuttingDown = false
let base = ''
let close = () => {}

beforeAll(async () => {
  const app = createApp({ store: fakeStore(() => dbUp), version: 'test', isShuttingDown: () => shuttingDown })
  const server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  base = `http://localhost:${(server.address() as AddressInfo).port}`
  close = () => server.close()
})
afterAll(() => close())

const post = (path: string, body: unknown) =>
  fetch(`${base}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })

describe('Werkstatt-Shop API', () => {
  it('berechnet Summen in ganzen Cent', () => {
    expect(totalCents([{ productId: products[0]!.id, quantity: 3, priceCents: 1990 }])).toBe(5970)
  })

  it('legt eine Bestellung an und antwortet mit 201', async () => {
    const res = await post('/orders', { customerId: 'c-1', items: [{ productId: 'p-hammer', quantity: 2 }] })
    expect(res.status).toBe(201)
    expect(await res.json()).toMatchObject({ status: 'placed', totalCents: 3980 })
  })

  it('lehnt ungültige Eingaben mit 400 ab', async () => {
    const res = await post('/orders', { customerId: 'c-1', items: [] })
    expect(res.status).toBe(400)
  })

  it('meldet zu wenig Bestand mit 409', async () => {
    const res = await post('/orders', { customerId: 'c-1', items: [{ productId: 'p-hammer', quantity: 5 }] })
    expect(res.status).toBe(409)
  })

  it('trennt Liveness von Readiness', async () => {
    dbUp = false
    expect((await fetch(`${base}/livez`)).status).toBe(200)
    expect((await fetch(`${base}/readyz`)).status).toBe(503)
    dbUp = true
    expect((await fetch(`${base}/readyz`)).status).toBe(200)
  })

  it('meldet sich im Shutdown nicht mehr bereit', async () => {
    shuttingDown = true
    expect((await fetch(`${base}/readyz`)).status).toBe(503)
    shuttingDown = false
  })

  it('nennt seine Version', async () => {
    expect(await (await fetch(`${base}/version`)).json()).toEqual({ version: 'test' })
  })
})
