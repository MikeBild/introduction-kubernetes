import express from 'express'
import { PlaceOrderInput, totalCents } from './order.ts'
import type { Store } from './db.ts'
import { log } from './log.ts'

export type AppDeps = { store: Store; version: string; isShuttingDown: () => boolean }

export const createApp = ({ store, version, isShuttingDown }: AppDeps) => {
  const app = express()
  app.use(express.json({ limit: '100kb' }))

  // Liveness: lebt der Prozess? Keine Dependencies prüfen.
  app.get('/livez', (req, res) => {
    res.json({ status: 'ok' })
  })

  // Readiness: soll diese Instanz Traffic bekommen? Datenbank und Shutdown-Status.
  app.get('/readyz', async (req, res) => {
    const ready = !isShuttingDown() && (await store.ping().then(() => true, () => false))
    res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not ready' })
  })

  app.get('/version', (req, res) => {
    res.json({ version })
  })

  app.get('/products', async (req, res) => {
    res.json(await store.listProducts())
  })

  app.get('/orders', async (req, res) => {
    const orders = await store.listOrders()
    res.json(orders.map((order) => ({ ...order, totalCents: totalCents(order.items) })))
  })

  app.post('/orders', async (req, res) => {
    const input = PlaceOrderInput.safeParse(req.body)
    if (!input.success) {
      res.status(400).json({ message: 'invalid order', issues: input.error.issues })
      return
    }
    const result = await store.placeOrder(input.data)
    if (!result.ok) {
      res.status(409).json({ message: result.reason, productId: result.productId })
      return
    }
    log('info', 'order placed', { orderId: result.order.id, totalCents: totalCents(result.order.items) })
    res.status(201).json({ ...result.order, totalCents: totalCents(result.order.items) })
  })

  // Express 5 leitet Fehler aus async Handlern selbst hierher weiter.
  app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    log('error', 'request failed', { path: req.path, error: err instanceof Error ? err.message : String(err) })
    res.status(500).json({ message: 'internal error' })
  })

  return app
}
