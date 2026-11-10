import { describe, expect, it } from 'vitest'
import { lazy, parse, read, script } from '../../../../scripts/lib/manifests.ts'

const dir = `${import.meta.dirname}/..`
const kustomization = lazy(() => parse(read(`${dir}/metrics-server`, 'kustomization.yaml'))[0]!)
const observe = script(dir, 'observe.sh')

// Remove .skip when you start the exercise.
describe.skip('10 Observability', () => {
  it('installs metrics-server in a pinned version', () => {
    expect(kustomization.resources).toEqual([
      'https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.1/components.yaml',
    ])
  })

  it('allows the self-signed certificates of the kind kubelets only via a patch', () => {
    expect(kustomization.patches[0].target).toMatchObject({ kind: 'Deployment', name: 'metrics-server' })
    expect(kustomization.patches[0].patch).toContain('--kubelet-insecure-tls')
  })

  it('reads resources, events and logs', () => {
    expect(observe).toMatch(/kubectl top nodes/)
    expect(observe).toMatch(/top pods --sort-by=memory/)
    expect(observe).toMatch(/kubectl -n werkstatt events/)
    expect(observe).toMatch(/logs -l app\.kubernetes\.io\/name=shop-api --prefix/)
  })

  it('finds the reason for a restart', () => {
    expect(observe).toMatch(/describe pod/)
    expect(observe).toMatch(/logs "\$pod" --previous/)
  })
})
