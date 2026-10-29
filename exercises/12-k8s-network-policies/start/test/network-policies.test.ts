import { describe, expect, it } from 'vitest'
import { find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const objects = lazy(() => manifests(`${import.meta.dirname}/..`))
const deny = lazy(() => find(objects, 'NetworkPolicy', 'default-deny-ingress'))
const toApi = lazy(() => find(objects, 'NetworkPolicy', 'allow-gateway-to-api'))
const toDb = lazy(() => find(objects, 'NetworkPolicy', 'allow-api-to-postgres'))

// Entferne .skip, wenn du loslegst.
describe.skip('12 NetworkPolicies', () => {
  it('verbietet zuerst jeden eingehenden Traffic im Namespace', () => {
    expect(deny.spec).toEqual({ podSelector: {}, policyTypes: ['Ingress'] })
  })

  it('lässt nur das Gateway an die API, nur auf Port http', () => {
    expect(toApi.spec.podSelector.matchLabels).toEqual({ 'app.kubernetes.io/name': 'shop-api' })
    expect(toApi.spec.ingress).toEqual([
      {
        from: [{ namespaceSelector: { matchLabels: { 'kubernetes.io/metadata.name': 'envoy-gateway-system' } } }],
        ports: [{ port: 'http' }],
      },
    ])
  })

  it('lässt nur die API an Postgres, nur auf Port 5432', () => {
    expect(toDb.spec.podSelector.matchLabels).toEqual({ 'app.kubernetes.io/name': 'postgres' })
    expect(toDb.spec.ingress).toEqual([
      { from: [{ podSelector: { matchLabels: { 'app.kubernetes.io/name': 'shop-api' } } }], ports: [{ port: 5432 }] },
    ])
  })
})
