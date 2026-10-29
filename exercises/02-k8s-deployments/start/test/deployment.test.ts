import { describe, expect, it } from 'vitest'
import { container, find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const objects = lazy(() => manifests(`${import.meta.dirname}/..`))
const deployment = lazy(() => find(objects, 'Deployment', 'shop-api'))
const api = lazy(() => container(deployment))

// Entferne .skip, wenn du loslegst.
describe.skip('02 Deployments', () => {
  it('liegt im Namespace werkstatt und hält zwei Replicas', () => {
    expect(deployment.metadata.namespace).toBe('werkstatt')
    expect(deployment.spec.replicas).toBe(2)
  })

  it('wählt seine Pods über dasselbe Label, das das Template setzt', () => {
    const selector = deployment.spec.selector.matchLabels
    expect(selector).toEqual({ 'app.kubernetes.io/name': 'shop-api' })
    expect(deployment.spec.template.metadata.labels).toMatchObject(selector)
  })

  it('startet das lokal geladene Image ohne Pull', () => {
    expect(api.image).toBe('shop-api:1.0.0')
    expect(api.imagePullPolicy).toBe('IfNotPresent')
  })

  it('benennt den Port des Containers', () => {
    expect(api.ports).toEqual([{ name: 'http', containerPort: 3000 }])
  })

  it('erreicht Postgres über den Service-Namen', () => {
    expect(JSON.stringify(api.env)).toContain('@postgres:5432/shop')
  })
})
