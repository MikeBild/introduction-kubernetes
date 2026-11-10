import { describe, expect, it } from 'vitest'
import { container, find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const objects = lazy(() => manifests(`${import.meta.dirname}/..`))
const deployment = lazy(() => find(objects, 'Deployment', 'shop-api'))
const api = lazy(() => container(deployment))

describe('02 Deployments', () => {
  it('lives in the namespace werkstatt and keeps two replicas', () => {
    expect(deployment.metadata.namespace).toBe('werkstatt')
    expect(deployment.spec.replicas).toBe(2)
  })

  it('selects its Pods by the same label the template sets', () => {
    const selector = deployment.spec.selector.matchLabels
    expect(selector).toEqual({ 'app.kubernetes.io/name': 'shop-api' })
    expect(deployment.spec.template.metadata.labels).toMatchObject(selector)
  })

  it('starts the locally loaded image without a pull', () => {
    expect(api.image).toBe('shop-api:1.0.0')
    expect(api.imagePullPolicy).toBe('IfNotPresent')
  })

  it('names the container port', () => {
    expect(api.ports).toEqual([{ name: 'http', containerPort: 3000 }])
  })

  it('reaches Postgres by the Service name', () => {
    expect(JSON.stringify(api.env)).toContain('@postgres:5432/shop')
  })
})
