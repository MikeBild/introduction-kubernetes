import { describe, expect, it } from 'vitest'
import { container, find, lazy, manifests, script } from '../../../../scripts/lib/manifests.ts'

const dir = `${import.meta.dirname}/..`
const deployment = lazy(() => find(manifests(dir), 'Deployment', 'shop-api'))
const api = lazy(() => container(deployment))
const rollout = script(dir, 'rollout.sh')

describe('07 Rolling Updates', () => {
  it('rolls out Pod by Pod without losing capacity', () => {
    expect(deployment.spec.replicas).toBe(3)
    expect(deployment.spec.strategy).toEqual({ type: 'RollingUpdate', rollingUpdate: { maxSurge: 1, maxUnavailable: 0 } })
  })

  it('waits until a new Pod has been ready for a while', () => {
    expect(deployment.spec.minReadySeconds).toBeGreaterThan(0)
  })

  it('gives routing time before the Pod stops', () => {
    expect(api.lifecycle.preStop).toEqual({ sleep: { seconds: 5 } })
    expect(deployment.spec.template.spec.terminationGracePeriodSeconds).toBeGreaterThan(5)
  })

  it('needs the readiness probe for the rollout', () => {
    expect(api.readinessProbe.httpGet.path).toBe('/readyz')
  })

  it('rolls out, follows the rollout and rolls back', () => {
    expect(rollout).toMatch(/kubectl -n werkstatt set image deployment\/shop-api api=shop-api:1\.1\.0/)
    expect(rollout).toMatch(/kubernetes\.io\/change-cause=/)
    expect(rollout).toMatch(/rollout history deployment\/shop-api/)
    expect(rollout).toMatch(/rollout undo deployment\/shop-api/)
  })
})
