*English · [Deutsch](README.de.md)*

# 11 · Every identity gets only its own permissions

Extra chapter on security, lesson `k8s-rbac`. You give the API a ServiceAccount without a token and the CI a ServiceAccount that may roll out but not read Secrets.

## Task

1. Complete [`start/rbac.yaml`](start/rbac.yaml):
   - ServiceAccount `shop-api` with `automountServiceAccountToken: false`
   - ServiceAccount `deployer`, Role `deployer` (read and patch Deployments; ReplicaSets, Pods and `pods/log` read only) and RoleBinding `deployer`
2. In [`start/shop-api.yaml`](start/shop-api.yaml), add `serviceAccountName: shop-api` and `automountServiceAccountToken: false`.
3. Run [`start/can-i.sh`](start/can-i.sh).

```bash
cd exercises/11-k8s-rbac/start
bash can-i.sh
```

## Acceptance criteria

| Question | Expected |
| --- | --- |
| `deployer` patches Deployments in `werkstatt` | `yes` |
| `deployer` reads `pods/log` in `werkstatt` | `yes` |
| `deployer` reads Secrets in `werkstatt` | `no` |
| `deployer` patches Deployments in `default` | `no` |
| `shop-api` lists Pods in `werkstatt` | `no` |

A Role applies only within its namespace. ClusterRoles apply across the whole cluster – grant them sparingly. Never use `*` as a verb or resource.

Remove the `.skip` in `start/test/rbac.test.ts` and run `npx vitest exercises/11-k8s-rbac/start`.

## Reference solution

[`solution/rbac.yaml`](solution/rbac.yaml) and [`solution/shop-api.yaml`](solution/shop-api.yaml)
