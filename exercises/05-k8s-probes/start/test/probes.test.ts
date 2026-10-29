import { describe, expect, it } from 'vitest'
import { container, find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const api = lazy(() => container(find(manifests(`${import.meta.dirname}/..`), 'Deployment', 'shop-api')))

// Entferne .skip, wenn du mit der Übung beginnst.
describe.skip('05 Probes', () => {
  it('wartet mit einer Startup Probe, bis der Prozess antwortet', () => {
    expect(api.startupProbe.httpGet).toEqual({ path: '/livez', port: 'http' })
    expect(api.startupProbe.periodSeconds * api.startupProbe.failureThreshold).toBeGreaterThanOrEqual(30)
  })

  it('prüft Liveness ohne Abhängigkeiten über /livez', () => {
    expect(api.livenessProbe.httpGet).toEqual({ path: '/livez', port: 'http' })
  })

  it('prüft Readiness mit Datenbank über /readyz', () => {
    expect(api.readinessProbe.httpGet).toEqual({ path: '/readyz', port: 'http' })
  })

  it('meldet Readiness öfter als Liveness', () => {
    expect(api.readinessProbe.periodSeconds).toBeLessThan(api.livenessProbe.periodSeconds)
  })
})
