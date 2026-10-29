import { describe, expect, it } from 'vitest'
import { find, lazy, manifests, script } from '../../../../scripts/lib/manifests.ts'

const dir = `${import.meta.dirname}/..`
const objects = lazy(() => manifests(dir))
const service = lazy(() => find(objects, 'Service', 'shop-api'))
const deployment = lazy(() => find(objects, 'Deployment', 'shop-api'))
const tryIt = script(dir, 'try.sh')

// Entferne .skip, wenn du loslegst.
describe.skip('03 Services', () => {
  it('ist ein ClusterIP-Service im Namespace werkstatt', () => {
    expect(service.metadata.namespace).toBe('werkstatt')
    expect(service.spec.type ?? 'ClusterIP').toBe('ClusterIP')
  })

  it('wählt genau die Pods des Deployments', () => {
    expect(deployment.spec.template.metadata.labels).toMatchObject(service.spec.selector)
  })

  it('bildet Port 80 auf den benannten Port http ab', () => {
    expect(service.spec.ports).toEqual([{ name: 'http', port: 80, targetPort: 'http' }])
  })

  it('testet von innen per DNS-Namen und von außen per port-forward', () => {
    expect(tryIt).toMatch(/kubectl -n werkstatt run curl .*curlimages\/curl:[\d.]+ .*http:\/\/shop-api\//)
    expect(tryIt).toMatch(/port-forward service\/shop-api 8080:80/)
  })
})
