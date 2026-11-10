*English · [Deutsch](README.de.md)*

# 13 · The namespace admits only secure Pods

Extra chapter on security, lesson `k8s-pod-security`. You enable Pod Security Admission with the `restricted` profile in the namespace `werkstatt` and adapt the API to it.

## Task

1. In [`start/00-namespace.yaml`](start/00-namespace.yaml), add the labels `pod-security.kubernetes.io/enforce: restricted`, `enforce-version: latest` and `warn: restricted`.
2. In [`start/shop-api.yaml`](start/shop-api.yaml), add:
   - on the Pod: `runAsNonRoot: true`, `runAsUser` and `runAsGroup` 65532 (the user `nonroot` of the Distroless image), `seccompProfile: RuntimeDefault`, `automountServiceAccountToken: false`
   - on the container: `allowPrivilegeEscalation: false`, `readOnlyRootFilesystem: true`, `capabilities.drop: [ALL]`

[`start/postgres.yaml`](start/postgres.yaml) is already adapted: Postgres runs as user 999 with `fsGroup: 999`.

```bash
kubectl delete namespace werkstatt          # start fresh
cd exercises/13-k8s-pod-security/start
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
kubectl -n werkstatt run test --image=busybox:1.37 --restart=Never -- sleep 5
```

## Acceptance criteria

- All Pods in the namespace are running.
- The test Pod with `busybox` is rejected: `violates PodSecurity "restricted:latest"` – with the list of missing settings.
- `kubectl -n werkstatt exec deployment/shop-api -- /nodejs/bin/node -e "require('fs').writeFileSync('/app/x', 'y')"` fails with `EROFS`.

The `warn` label shows violations already at `kubectl apply`. If you want to migrate an existing namespace, set only `warn` and `audit` first, and `enforce` only after that.

Remove the `.skip` in `start/test/pod-security.test.ts` and run `npx vitest exercises/13-k8s-pod-security/start`.

## Reference solution

[`solution/00-namespace.yaml`](solution/00-namespace.yaml) and [`solution/shop-api.yaml`](solution/shop-api.yaml)
