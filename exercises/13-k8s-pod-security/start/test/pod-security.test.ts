import { describe, expect, it } from 'vitest'
import { container, find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const objects = lazy(() => manifests(`${import.meta.dirname}/..`))
const namespace = lazy(() => find(objects, 'Namespace', 'werkstatt'))
const pod = lazy(() => find(objects, 'Deployment', 'shop-api').spec.template.spec)
const api = lazy(() => container(find(objects, 'Deployment', 'shop-api')))
const postgres = lazy(() => find(objects, 'StatefulSet', 'postgres').spec.template.spec)

// Entferne .skip, wenn du loslegst.
describe.skip('13 Pod Security', () => {
  it('setzt im Namespace das Profil restricted durch', () => {
    expect(namespace.metadata.labels).toMatchObject({
      'pod-security.kubernetes.io/enforce': 'restricted',
      'pod-security.kubernetes.io/warn': 'restricted',
    })
  })

  it('startet die API als nonroot mit Seccomp und ohne Token', () => {
    expect(pod.securityContext).toEqual({
      runAsNonRoot: true,
      runAsUser: 65532,
      runAsGroup: 65532,
      seccompProfile: { type: 'RuntimeDefault' },
    })
    expect(pod.automountServiceAccountToken).toBe(false)
  })

  it('nimmt dem Container alle Capabilities und das Schreibrecht', () => {
    expect(api.securityContext).toEqual({
      allowPrivilegeEscalation: false,
      readOnlyRootFilesystem: true,
      capabilities: { drop: ['ALL'] },
    })
  })

  it('lässt auch Postgres als nonroot laufen', () => {
    expect(postgres.securityContext).toMatchObject({ runAsNonRoot: true, runAsUser: 999, fsGroup: 999 })
    expect(postgres.containers[0].securityContext.capabilities).toEqual({ drop: ['ALL'] })
  })
})
