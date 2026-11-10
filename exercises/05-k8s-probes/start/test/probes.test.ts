import { describe, expect, it } from 'vitest'
import { container, find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const api = lazy(() => container(find(manifests(`${import.meta.dirname}/..`), 'Deployment', 'shop-api')))

// Remove .skip when you start the exercise.
describe.skip('05 Probes', () => {
  it('waits with a startup probe until the process responds', () => {
    expect(api.startupProbe.httpGet).toEqual({ path: '/livez', port: 'http' })
    expect(api.startupProbe.periodSeconds * api.startupProbe.failureThreshold).toBeGreaterThanOrEqual(30)
  })

  it('checks liveness without dependencies via /livez', () => {
    expect(api.livenessProbe.httpGet).toEqual({ path: '/livez', port: 'http' })
  })

  it('checks readiness with the database via /readyz', () => {
    expect(api.readinessProbe.httpGet).toEqual({ path: '/readyz', port: 'http' })
  })

  it('reports readiness more often than liveness', () => {
    expect(api.readinessProbe.periodSeconds).toBeLessThan(api.livenessProbe.periodSeconds)
  })
})
