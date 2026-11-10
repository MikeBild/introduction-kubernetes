import { describe, expect, it } from 'vitest'
import { find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const objects = lazy(() => manifests(`${import.meta.dirname}/..`))
const deny = lazy(() => find(objects, 'NetworkPolicy', 'default-deny-ingress'))
const toApi = lazy(() => find(objects, 'NetworkPolicy', 'allow-gateway-to-api'))
const toDb = lazy(() => find(objects, 'NetworkPolicy', 'allow-api-to-postgres'))

describe('12 NetworkPolicies', () => {
  it('first denies all incoming traffic in the namespace', () => {
    expect(deny.spec).toEqual({ podSelector: {}, policyTypes: ['Ingress'] })
  })

  it('lets only the Gateway reach the API, only on port http', () => {
    expect(toApi.spec.podSelector.matchLabels).toEqual({ 'app.kubernetes.io/name': 'shop-api' })
    expect(toApi.spec.ingress).toEqual([
      {
        from: [{ namespaceSelector: { matchLabels: { 'kubernetes.io/metadata.name': 'envoy-gateway-system' } } }],
        ports: [{ port: 'http' }],
      },
    ])
  })

  it('lets only the API reach Postgres, only on port 5432', () => {
    expect(toDb.spec.podSelector.matchLabels).toEqual({ 'app.kubernetes.io/name': 'postgres' })
    expect(toDb.spec.ingress).toEqual([
      { from: [{ podSelector: { matchLabels: { 'app.kubernetes.io/name': 'shop-api' } } }], ports: [{ port: 5432 }] },
    ])
  })
})
