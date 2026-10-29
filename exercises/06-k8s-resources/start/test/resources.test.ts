import { describe, expect, it } from 'vitest'
import { container, find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const api = lazy(() => container(find(manifests(`${import.meta.dirname}/..`), 'Deployment', 'shop-api')))
const requests = lazy(() => api.resources.requests)
const limits = lazy(() => api.resources.limits)

// Entferne .skip, wenn du mit der Übung beginnst.
describe.skip('06 Ressourcen', () => {
  it('reserviert CPU und Speicher per Request', () => {
    expect(requests).toEqual({ cpu: '100m', memory: '512Mi' })
  })

  it('begrenzt den Speicher auf den Request', () => {
    expect(limits.memory).toBe(requests.memory)
  })

  it('setzt kein CPU-Limit', () => {
    expect(limits.cpu).toBeUndefined()
  })

  it('lässt dem Heap von Node.js genug Luft (mindestens 512Mi)', () => {
    expect(Number.parseInt(limits.memory)).toBeGreaterThanOrEqual(512)
  })
})
