import { describe, expect, it } from 'vitest'
import { find, lazy, manifests, script } from '../../../../scripts/lib/manifests.ts'

const dir = `${import.meta.dirname}/..`
const objects = lazy(() => manifests(dir))
const service = lazy(() => find(objects, 'Service', 'shop-api'))
const deployment = lazy(() => find(objects, 'Deployment', 'shop-api'))
const tryIt = script(dir, 'try.sh')

// Remove .skip when you start the exercise.
describe.skip('03 Services', () => {
  it('is a ClusterIP Service in the namespace werkstatt', () => {
    expect(service.metadata.namespace).toBe('werkstatt')
    expect(service.spec.type ?? 'ClusterIP').toBe('ClusterIP')
  })

  it('selects exactly the Pods of the Deployment', () => {
    expect(deployment.spec.template.metadata.labels).toMatchObject(service.spec.selector)
  })

  it('maps port 80 to the named port http', () => {
    expect(service.spec.ports).toEqual([{ name: 'http', port: 80, targetPort: 'http' }])
  })

  it('tests from inside by DNS name and from outside by port-forward', () => {
    expect(tryIt).toMatch(/kubectl -n werkstatt run curl .*curlimages\/curl:[\d.]+ .*http:\/\/shop-api\//)
    expect(tryIt).toMatch(/port-forward service\/shop-api 8080:80/)
  })
})
