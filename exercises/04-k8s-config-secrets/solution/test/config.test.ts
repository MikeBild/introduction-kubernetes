import { describe, expect, it } from 'vitest'
import { container, find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const objects = lazy(() => manifests(`${import.meta.dirname}/..`))
const config = lazy(() => find(objects, 'ConfigMap', 'shop-api-config'))
const api = lazy(() => container(find(objects, 'Deployment', 'shop-api')))
const env = (name: string) => api.env?.find((e: { name: string }) => e.name === name)

describe('04 ConfigMaps und Secrets', () => {
  it('hält Werte ohne Geheimnisse in der ConfigMap', () => {
    expect(Object.keys(config.data).sort()).toEqual(['DB_HOST', 'DB_NAME', 'DB_USER', 'PORT'])
    expect(JSON.stringify(config.data)).not.toMatch(/werkstatt|PASSWORD/i)
  })

  it('liest die ConfigMap komplett mit envFrom ein', () => {
    expect(api.envFrom).toEqual([{ configMapRef: { name: 'shop-api-config' } }])
  })

  it('holt nur das Passwort aus dem Secret', () => {
    expect(env('DB_PASSWORD')?.valueFrom).toEqual({ secretKeyRef: { name: 'shop-db', key: 'POSTGRES_PASSWORD' } })
  })

  it('setzt DATABASE_URL aus Variablen zusammen, ohne Passwort im Klartext', () => {
    const url = env('DATABASE_URL')?.value
    expect(url).toBe('postgres://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):5432/$(DB_NAME)')
    expect(JSON.stringify(api)).not.toContain('werkstatt@')
  })
})
