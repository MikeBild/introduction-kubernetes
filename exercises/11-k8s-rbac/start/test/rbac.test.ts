import { describe, expect, it } from 'vitest'
import { find, lazy, manifests, script } from '../../../../scripts/lib/manifests.ts'

const dir = `${import.meta.dirname}/..`
const objects = lazy(() => manifests(dir))
const role = lazy(() => find(objects, 'Role', 'deployer'))
const binding = lazy(() => find(objects, 'RoleBinding', 'deployer'))
const canI = script(dir, 'can-i.sh')

// Entferne .skip, wenn du loslegst.
describe.skip('11 RBAC', () => {
  it('gibt der API einen eigenen ServiceAccount ohne Token', () => {
    expect(find(objects, 'ServiceAccount', 'shop-api').automountServiceAccountToken).toBe(false)
    const pod = find(objects, 'Deployment', 'shop-api').spec.template.spec
    expect(pod.serviceAccountName).toBe('shop-api')
    expect(pod.automountServiceAccountToken).toBe(false)
  })

  it('erlaubt dem deployer Deployments zu patchen, aber keine Secrets', () => {
    const deployments = role.rules.find((r: { resources: string[] }) => r.resources.includes('deployments'))
    expect(deployments.verbs).toEqual(expect.arrayContaining(['get', 'patch']))
    expect(JSON.stringify(role.rules)).not.toMatch(/secrets|\*/)
  })

  it('bleibt mit Role und RoleBinding im Namespace werkstatt', () => {
    expect(role.metadata.namespace).toBe('werkstatt')
    expect(binding.roleRef).toEqual({ apiGroup: 'rbac.authorization.k8s.io', kind: 'Role', name: 'deployer' })
    expect(binding.subjects).toEqual([{ kind: 'ServiceAccount', name: 'deployer', namespace: 'werkstatt' }])
  })

  it('prüft Rechte mit kubectl auth can-i --as', () => {
    expect(canI).toMatch(/system:serviceaccount:werkstatt:deployer/)
    expect(canI).toMatch(/check get secrets -n werkstatt --as "\$deployer"/)
  })
})
