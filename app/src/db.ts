import postgres from 'postgres'
import { randomUUID } from 'node:crypto'
import { priceItems, type Order, type OrderId, type PlaceOrderInput, type PriceResult, type Product } from './order.ts'

export type Store = {
  ping: () => Promise<void>
  listProducts: () => Promise<Product[]>
  listOrders: () => Promise<Order[]>
  placeOrder: (input: PlaceOrderInput) => Promise<{ ok: true; order: Order } | Extract<PriceResult, { ok: false }>>
  close: () => Promise<void>
}

type ProductRow = { id: string; name: string; price_cents: number; stock: number }
type OrderRow = { id: string; customer_id: string; status: Order['status']; created_at: Date; items: Order['items'] }

const toProduct = (row: ProductRow): Product => ({
  id: row.id as Product['id'],
  name: row.name,
  priceCents: row.price_cents,
  stock: row.stock,
})

const toOrder = (row: OrderRow): Order => ({
  id: row.id as OrderId,
  customerId: row.customer_id,
  status: row.status,
  createdAt: row.created_at.toISOString(),
  items: row.items,
})

export const createStore = (databaseUrl: string): Store => {
  const sql = postgres(databaseUrl, { max: 10, idle_timeout: 20 })

  return {
    ping: async () => {
      await sql`select 1`
    },
    listProducts: async () => (await sql<ProductRow[]>`select * from products order by id`).map(toProduct),
    listOrders: async () =>
      (
        await sql<OrderRow[]>`
          select o.id, o.customer_id, o.status, o.created_at,
                 coalesce(json_agg(json_build_object(
                   'productId', i.product_id, 'quantity', i.quantity, 'priceCents', i.price_cents
                 ) order by i.product_id) filter (where i.order_id is not null), '[]') as items
          from orders o left join order_items i on i.order_id = o.id
          group by o.id order by o.created_at desc`
      ).map(toOrder),
    placeOrder: (input) =>
      sql.begin(async (tx) => {
        const ids = input.items.map((item) => item.productId)
        const products = (await tx<ProductRow[]>`select * from products where id in ${tx(ids)} for update`).map(toProduct)
        const priced = priceItems(input, products)
        if (!priced.ok) return priced
        const order: Order = {
          id: randomUUID() as OrderId,
          customerId: input.customerId,
          items: priced.items,
          status: 'placed',
          createdAt: new Date().toISOString(),
        }
        await tx`insert into orders (id, customer_id, status, created_at)
                 values (${order.id}, ${order.customerId}, ${order.status}, ${order.createdAt})`
        for (const item of order.items) {
          await tx`insert into order_items (order_id, product_id, quantity, price_cents)
                   values (${order.id}, ${item.productId}, ${item.quantity}, ${item.priceCents})`
          await tx`update products set stock = stock - ${item.quantity} where id = ${item.productId}`
        }
        return { ok: true as const, order }
      }),
    close: () => sql.end({ timeout: 5 }),
  }
}
