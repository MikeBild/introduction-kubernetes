import type { AddressInfo } from 'node:net'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createApp } from '../src/app.ts'
import type { Store } from '../src/db.ts'
import { priceItems, totalCents, type Order, type OrderId, type Product } from '../src/order.ts'

const products: Product[] = [
  { id: 'p-hammer' as Product['id'], name: 'Schlosserhammer 500 g', priceCents: 1990, stock: 2 },
]

// In-memory store: the HTTP layer can be tested without Postgres.
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

describe('Workshop shop API', () => {
  it('calculates totals in whole cents', () => {
    expect(totalCents([{ productId: products[0]!.id, quantity: 3, priceCents: 1990 }])).toBe(5970)
  })

  it('creates an order and responds with 201', async () => {
    const res = await post('/orders', { customerId: 'c-1', items: [{ productId: 'p-hammer', quantity: 2 }] })
    expect(res.status).toBe(201)
    expect(await res.json()).toMatchObject({ status: 'placed', totalCents: 3980 })
  })

  it('rejects invalid input with 400', async () => {
    const res = await post('/orders', { customerId: 'c-1', items: [] })
    expect(res.status).toBe(400)
  })

  it('reports insufficient stock with 409', async () => {
    const res = await post('/orders', { customerId: 'c-1', items: [{ productId: 'p-hammer', quantity: 5 }] })
    expect(res.status).toBe(409)
  })

  it('separates liveness from readiness', async () => {
    dbUp = false
    expect((await fetch(`${base}/livez`)).status).toBe(200)
    expect((await fetch(`${base}/readyz`)).status).toBe(503)
    dbUp = true
    expect((await fetch(`${base}/readyz`)).status).toBe(200)
  })

  it('reports not ready during shutdown', async () => {
    shuttingDown = true
    expect((await fetch(`${base}/readyz`)).status).toBe(503)
    shuttingDown = false
  })

  it('reports its version', async () => {
    expect(await (await fetch(`${base}/version`)).json()).toEqual({ version: 'test' })
  })
})
