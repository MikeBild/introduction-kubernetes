import { describe, expect, it } from 'vitest'
import { lazy, parse, read, script } from '../../../../scripts/lib/manifests.ts'

const dir = `${import.meta.dirname}/..`
const config = lazy(() => parse(read(dir, 'kind-config.yaml'))[0]!)
const setup = script(dir, 'setup.sh')

// Entferne .skip, wenn du mit der Übung beginnst.
describe.skip('01 Cluster mit kind', () => {
  it('beschreibt einen Control Plane Node und zwei Worker Nodes', () => {
    const roles = config.nodes.map((node: { role: string }) => node.role)
    expect(roles).toEqual(['control-plane', 'worker', 'worker'])
  })

  it('legt das Node-Image auf Kubernetes 1.37 mit Digest fest', () => {
    for (const node of config.nodes) expect(node.image).toMatch(/^kindest\/node:v1\.37\.\d+@sha256:[0-9a-f]{64}$/)
  })

  it('legt den Cluster aus der Config an', () => {
    expect(setup).toMatch(/kind create cluster --config kind-config\.yaml/)
  })

  it('baut beide Versionen der API und lädt sie ohne Registry in den Cluster', () => {
    expect(setup).toMatch(/docker build -t shop-api:1\.0\.0/)
    expect(setup).toMatch(/docker build -t shop-api:1\.1\.0/)
    expect(setup).toMatch(/kind load docker-image shop-api:1\.0\.0 shop-api:1\.1\.0 --name werkstatt/)
  })
})
