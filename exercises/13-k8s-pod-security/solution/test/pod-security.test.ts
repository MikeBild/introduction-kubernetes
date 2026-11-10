import { describe, expect, it } from 'vitest'
import { container, find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const objects = lazy(() => manifests(`${import.meta.dirname}/..`))
const namespace = lazy(() => find(objects, 'Namespace', 'werkstatt'))
const pod = lazy(() => find(objects, 'Deployment', 'shop-api').spec.template.spec)
const api = lazy(() => container(find(objects, 'Deployment', 'shop-api')))
const postgres = lazy(() => find(objects, 'StatefulSet', 'postgres').spec.template.spec)

describe('13 Pod Security', () => {
  it('enforces the restricted profile in the namespace', () => {
    expect(namespace.metadata.labels).toMatchObject({
      'pod-security.kubernetes.io/enforce': 'restricted',
      'pod-security.kubernetes.io/warn': 'restricted',
    })
  })

  it('starts the API as nonroot with seccomp and without a token', () => {
    expect(pod.securityContext).toEqual({
      runAsNonRoot: true,
      runAsUser: 65532,
      runAsGroup: 65532,
      seccompProfile: { type: 'RuntimeDefault' },
    })
    expect(pod.automountServiceAccountToken).toBe(false)
  })

  it('takes all capabilities and write access away from the container', () => {
    expect(api.securityContext).toEqual({
      allowPrivilegeEscalation: false,
      readOnlyRootFilesystem: true,
      capabilities: { drop: ['ALL'] },
    })
  })

  it('runs Postgres as nonroot too', () => {
    expect(postgres.securityContext).toMatchObject({ runAsNonRoot: true, runAsUser: 999, fsGroup: 999 })
    expect(postgres.containers[0].securityContext.capabilities).toEqual({ drop: ['ALL'] })
  })
})
