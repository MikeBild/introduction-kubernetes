import { describe, expect, it } from 'vitest'
import { lazy, parse, read, script } from '../../../../scripts/lib/manifests.ts'

const dir = `${import.meta.dirname}/..`
const config = lazy(() => parse(read(dir, 'kind-config.yaml'))[0]!)
const setup = script(dir, 'setup.sh')

// Remove .skip when you start the exercise.
describe.skip('01 Cluster with kind', () => {
  it('describes one control plane node and two worker nodes', () => {
    const roles = config.nodes.map((node: { role: string }) => node.role)
    expect(roles).toEqual(['control-plane', 'worker', 'worker'])
  })

  it('pins the node image to Kubernetes 1.37 with digest', () => {
    for (const node of config.nodes) expect(node.image).toMatch(/^kindest\/node:v1\.37\.\d+@sha256:[0-9a-f]{64}$/)
  })

  it('creates the cluster from the config', () => {
    expect(setup).toMatch(/kind create cluster --config kind-config\.yaml/)
  })

  it('builds both versions of the API and loads them into the cluster without a registry', () => {
    expect(setup).toMatch(/docker build -t shop-api:1\.0\.0/)
    expect(setup).toMatch(/docker build -t shop-api:1\.1\.0/)
    expect(setup).toMatch(/kind load docker-image shop-api:1\.0\.0 shop-api:1\.1\.0 --name werkstatt/)
  })
})
