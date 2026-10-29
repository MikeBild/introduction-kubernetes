# 11 · Jede Identität bekommt nur ihre Rechte

Zusatzkapitel Sicherheit, Lektion `k8s-rbac`. Du gibst der API einen ServiceAccount ohne Token und der CI einen ServiceAccount, der ausrollen, aber keine Secrets lesen darf.

## Aufgabe

1. Ergänze [`start/rbac.yaml`](start/rbac.yaml):
   - ServiceAccount `shop-api` mit `automountServiceAccountToken: false`
   - ServiceAccount `deployer`, Role `deployer` (Deployments lesen und patchen; ReplicaSets, Pods und `pods/log` nur lesen) und RoleBinding `deployer`
2. Ergänze in [`start/shop-api.yaml`](start/shop-api.yaml) `serviceAccountName: shop-api` und `automountServiceAccountToken: false`.
3. Führ [`start/can-i.sh`](start/can-i.sh) aus.

```bash
cd exercises/11-k8s-rbac/start
bash can-i.sh
```

## Prüfkriterien

| Frage | Erwartet |
| --- | --- |
| `deployer` patcht Deployments in `werkstatt` | `yes` |
| `deployer` liest `pods/log` in `werkstatt` | `yes` |
| `deployer` liest Secrets in `werkstatt` | `no` |
| `deployer` patcht Deployments in `default` | `no` |
| `shop-api` listet Pods in `werkstatt` | `no` |

Eine Role gilt nur in ihrem Namespace. ClusterRoles gelten im ganzen Cluster – vergib sie sparsam. Gib nie `*` als Verb oder Resource.

Entferne in `start/test/rbac.test.ts` das `.skip` und führe `npx vitest exercises/11-k8s-rbac/start` aus.

## Lösung

[`solution/rbac.yaml`](solution/rbac.yaml) und [`solution/shop-api.yaml`](solution/shop-api.yaml)
