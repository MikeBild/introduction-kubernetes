import { describe, expect, it } from 'vitest'
import { lazy, parse, read, script } from '../../../../scripts/lib/manifests.ts'

const dir = `${import.meta.dirname}/..`
const kustomization = lazy(() => parse(read(`${dir}/metrics-server`, 'kustomization.yaml'))[0]!)
const observe = script(dir, 'observe.sh')

// Entferne .skip, wenn du mit der Übung beginnst.
describe.skip('10 Observability', () => {
  it('installiert metrics-server in einer festen Version', () => {
    expect(kustomization.resources).toEqual([
      'https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.1/components.yaml',
    ])
  })

  it('erlaubt nur per Patch die selbstsignierten Zertifikate der kind-Kubelets', () => {
    expect(kustomization.patches[0].target).toMatchObject({ kind: 'Deployment', name: 'metrics-server' })
    expect(kustomization.patches[0].patch).toContain('--kubelet-insecure-tls')
  })

  it('liest Ressourcen, Events und Logs', () => {
    expect(observe).toMatch(/kubectl top nodes/)
    expect(observe).toMatch(/top pods --sort-by=memory/)
    expect(observe).toMatch(/kubectl -n werkstatt events/)
    expect(observe).toMatch(/logs -l app\.kubernetes\.io\/name=shop-api --prefix/)
  })

  it('findet den Grund für einen Neustart', () => {
    expect(observe).toMatch(/describe pod/)
    expect(observe).toMatch(/logs "\$pod" --previous/)
  })
})
