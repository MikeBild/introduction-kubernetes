import { createApp } from './app.ts'
import { readConfig } from './config.ts'
import { createStore } from './db.ts'
import { log } from './log.ts'

const config = readConfig()
const store = createStore(config.databaseUrl)
let shuttingDown = false

const app = createApp({ store, version: config.version, isShuttingDown: () => shuttingDown })
const server = app.listen(config.port, () => {
  log('info', 'server started', { port: config.port, version: config.version })
})

// SIGTERM kommt bei docker stop und bei jedem Rollout: fertig machen, dann gehen.
const shutdown = (signal: NodeJS.Signals) => {
  log('info', 'shutdown started', { signal })
  shuttingDown = true
  setTimeout(() => process.exit(1), 10_000).unref()
  server.close(async () => {
    await store.close()
    log('info', 'shutdown complete')
    process.exit(0)
  })
}

process.once('SIGTERM', shutdown)
process.once('SIGINT', shutdown)
