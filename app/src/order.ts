import { z } from 'zod'

// Domäne des Werkstatt-Shops: Geld immer in ganzen Cent, IDs als Branded Types.
export type ProductId = string & { readonly __brand: 'ProductId' }
export type OrderId = string & { readonly __brand: 'OrderId' }

export type Product = { id: ProductId; name: string; priceCents: number; stock: number }
export type OrderItem = { productId: ProductId; quantity: number; priceCents: number }
export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type Order = {
  id: OrderId
  customerId: string
  items: OrderItem[]
  status: OrderStatus
  createdAt: string
}

export const OrderItemInput = z.strictObject({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
})
export const PlaceOrderInput = z.strictObject({
  customerId: z.string().min(1),
  items: z.array(OrderItemInput).min(1),
})
export type PlaceOrderInput = z.infer<typeof PlaceOrderInput>

export const totalCents = (items: readonly OrderItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)

export type PriceResult =
  | { ok: true; items: OrderItem[] }
  | { ok: false; reason: 'unknown-product' | 'out-of-stock'; productId: string }

// Pure Function: Positionen mit aktuellem Preis und Bestand prüfen.
export const priceItems = (input: PlaceOrderInput, products: readonly Product[]): PriceResult => {
  const byId = new Map(products.map((product) => [product.id as string, product]))
  const items: OrderItem[] = []
  for (const { productId, quantity } of input.items) {
    const product = byId.get(productId)
    if (!product) return { ok: false, reason: 'unknown-product', productId }
    if (product.stock < quantity) return { ok: false, reason: 'out-of-stock', productId }
    items.push({ productId: product.id, quantity, priceCents: product.priceCents })
  }
  return { ok: true, items }
}
