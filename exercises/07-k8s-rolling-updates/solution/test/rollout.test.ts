import { describe, expect, it } from 'vitest'
import { container, find, lazy, manifests, script } from '../../../../scripts/lib/manifests.ts'

const dir = `${import.meta.dirname}/..`
const deployment = lazy(() => find(manifests(dir), 'Deployment', 'shop-api'))
const api = lazy(() => container(deployment))
const rollout = script(dir, 'rollout.sh')

describe('07 Rolling Updates', () => {
  it('rollt Pod für Pod aus, ohne Kapazität zu verlieren', () => {
    expect(deployment.spec.replicas).toBe(3)
    expect(deployment.spec.strategy).toEqual({ type: 'RollingUpdate', rollingUpdate: { maxSurge: 1, maxUnavailable: 0 } })
  })

  it('wartet, bis ein neuer Pod eine Weile bereit ist', () => {
    expect(deployment.spec.minReadySeconds).toBeGreaterThan(0)
  })

  it('gibt dem Routing Zeit, bevor der Pod stoppt', () => {
    expect(api.lifecycle.preStop).toEqual({ sleep: { seconds: 5 } })
    expect(deployment.spec.template.spec.terminationGracePeriodSeconds).toBeGreaterThan(5)
  })

  it('braucht für den Rollout die Readiness Probe', () => {
    expect(api.readinessProbe.httpGet.path).toBe('/readyz')
  })

  it('rollt aus, verfolgt den Rollout und rollt zurück', () => {
    expect(rollout).toMatch(/kubectl -n werkstatt set image deployment\/shop-api api=shop-api:1\.1\.0/)
    expect(rollout).toMatch(/kubernetes\.io\/change-cause=/)
    expect(rollout).toMatch(/rollout history deployment\/shop-api/)
    expect(rollout).toMatch(/rollout undo deployment\/shop-api/)
  })
})
