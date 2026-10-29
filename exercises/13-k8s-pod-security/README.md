# 13 · Der Namespace lässt nur sichere Pods zu

Zusatzkapitel Sicherheit, Lektion `k8s-pod-security`. Du schaltest im Namespace `werkstatt` die Pod Security Admission mit dem Profil `restricted` ein und passt die API daran an.

## Aufgabe

1. Ergänze in [`start/00-namespace.yaml`](start/00-namespace.yaml) die Labels `pod-security.kubernetes.io/enforce: restricted`, `enforce-version: latest` und `warn: restricted`.
2. Ergänze in [`start/shop-api.yaml`](start/shop-api.yaml):
   - am Pod: `runAsNonRoot: true`, `runAsUser` und `runAsGroup` 65532 (der User `nonroot` des Distroless-Images), `seccompProfile: RuntimeDefault`, `automountServiceAccountToken: false`
   - am Container: `allowPrivilegeEscalation: false`, `readOnlyRootFilesystem: true`, `capabilities.drop: [ALL]`

[`start/postgres.yaml`](start/postgres.yaml) ist schon angepasst: Postgres läuft als User 999 mit `fsGroup: 999`.

```bash
kubectl delete namespace werkstatt          # frisch anfangen
cd exercises/13-k8s-pod-security/start
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
kubectl -n werkstatt run test --image=busybox:1.37 --restart=Never -- sleep 5
```

## Prüfkriterien

- Alle Pods im Namespace laufen.
- Der Test-Pod mit `busybox` wird abgelehnt: `violates PodSecurity "restricted:latest"` – mit der Liste der fehlenden Einstellungen.
- `kubectl -n werkstatt exec deployment/shop-api -- /nodejs/bin/node -e "require('fs').writeFileSync('/app/x', 'y')"` scheitert mit `EROFS`.

Das Label `warn` zeigt Verstöße schon beim `kubectl apply` an. Willst du einen bestehenden Namespace umstellen, setz zuerst nur `warn` und `audit` und erst dann `enforce`.

Entferne in `start/test/pod-security.test.ts` das `.skip` und führe `npx vitest exercises/13-k8s-pod-security/start` aus.

## Lösung

[`solution/00-namespace.yaml`](solution/00-namespace.yaml) und [`solution/shop-api.yaml`](solution/shop-api.yaml)
