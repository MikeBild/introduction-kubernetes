// Konfiguration kommt aus der Umgebung. Ohne gültige Config kein Start.
export type Config = { port: number; databaseUrl: string; version: string }

export const readConfig = (env: NodeJS.ProcessEnv = process.env): Config => {
  const port = Number(env.PORT ?? 3000)
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error(`PORT ist ungültig: ${env.PORT}. Setz eine ganze Zahl von 1 bis 65535, etwa 3000.`)
  const databaseUrl = env.DATABASE_URL
  if (!databaseUrl)
    throw new Error('DATABASE_URL fehlt. Setz die Variable, etwa postgres://postgres:werkstatt@db:5432/shop.')
  return { port, databaseUrl, version: env.APP_VERSION ?? 'dev' }
}
