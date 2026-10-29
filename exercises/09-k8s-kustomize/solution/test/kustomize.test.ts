import { describe, expect, it } from 'vitest'
import { container, find, kustomize, lazy } from '../../../../scripts/lib/manifests.ts'

// Rendert die Overlays mit kubectl kustomize – wie kubectl apply -k.
const dir = `${import.meta.dirname}/..`
const dev = lazy(() => kustomize(`${dir}/overlays/dev`))
const prod = lazy(() => kustomize(`${dir}/overlays/prod`))

describe('09 Kustomize', () => {
  it('legt jede Umgebung in einen eigenen Namespace', () => {
    for (const [objects, ns] of [[dev, 'werkstatt-dev'], [prod, 'werkstatt-prod']] as const) {
      expect(find(objects, 'Namespace', ns)).toBeDefined()
      for (const obj of objects.filter((o) => o.kind !== 'Namespace')) expect(obj.metadata.namespace).toBe(ns)
    }
  })

  it('setzt Replicas und Image-Tag je Umgebung', () => {
    const devApi = find(dev, 'Deployment', 'shop-api')
    const prodApi = find(prod, 'Deployment', 'shop-api')
    expect([devApi.spec.replicas, container(devApi).image]).toEqual([1, 'shop-api:1.1.0'])
    expect([prodApi.spec.replicas, container(prodApi).image]).toEqual([3, 'shop-api:1.0.0'])
  })

  it('erzeugt die ConfigMap mit Hash und verweist darauf', () => {
    const config = dev.find((o) => o.kind === 'ConfigMap' && o.metadata.name.startsWith('shop-api-config-'))
    expect(config?.data).toMatchObject({ DB_HOST: 'postgres', PORT: '3000' })
    expect(container(find(dev, 'Deployment', 'shop-api')).envFrom).toEqual([{ configMapRef: { name: config?.metadata.name } }])
  })

  it('patcht nur in prod den Speicher von Postgres', () => {
    const memory = (objects: typeof dev) => container(find(objects, 'StatefulSet', 'postgres'), 'postgres').resources.limits.memory
    expect(memory(prod)).toBe('1Gi')
    expect(memory(dev)).toBe('512Mi')
  })

  it('setzt das gemeinsame Label part-of überall', () => {
    for (const obj of dev) expect(obj.metadata.labels?.['app.kubernetes.io/part-of']).toBe('werkstatt-shop')
  })
})
