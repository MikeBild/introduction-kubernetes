# 07 · Ein Update ohne Downtime ist ein Rollout

Lektion `k8s-rolling-updates`. Du rollst `shop-api:1.1.0` aus, während ein Pod im Cluster dauernd Requests schickt, und rollst wieder zurück. Kein Request darf scheitern.

## Aufgabe

1. Ergänze in [`start/shop-api.yaml`](start/shop-api.yaml):
   - `replicas: 3`, `minReadySeconds: 5`, `revisionHistoryLimit: 5`
   - `strategy` `RollingUpdate` mit `maxSurge: 1` und `maxUnavailable: 0`
   - `terminationGracePeriodSeconds: 30` und `lifecycle.preStop.sleep.seconds: 5`
2. Ergänze in [`start/rollout.sh`](start/rollout.sh): `kubectl set image` auf `shop-api:1.1.0`, Annotation `kubernetes.io/change-cause`, `rollout status`, `rollout history`, `rollout undo`.

```bash
cd exercises/07-k8s-rolling-updates/start
bash rollout.sh
```

## Prüfkriterien

- Der Last-Pod meldet am Ende `ok=180 fail=0`.
- `rollout history` zeigt die Revision mit `shop-api 1.1.0`.
- Nach `rollout undo` liefert `/version` wieder `1.0.0`.

## Warum so?

- `maxUnavailable: 0` hält immer alle drei Replicas bereit, `maxSurge: 1` startet einen zusätzlichen Pod.
- Die Readiness Probe aus Übung 05 entscheidet, wann ein neuer Pod Traffic bekommt.
- Beim Stoppen bekommt der Pod SIGTERM, während Service und Gateway ihn noch kurz im Routing haben. Der `preStop`-Hook mit `sleep` wartet diese Zeit ab, bevor die API herunterfährt. Die `sleep`-Action ist seit Kubernetes 1.34 stabil (GA, General Availability) und braucht keine Shell im Image – wichtig für Distroless.

`kubectl rollout undo` ändert das Deployment am Manifest vorbei. Hält dein Git-Repo den Soll-Zustand, setz die alte Version danach auch dort.

Entferne in `start/test/rollout.test.ts` das `.skip` und führe `npx vitest exercises/07-k8s-rolling-updates/start` aus.

## Lösung

[`solution/shop-api.yaml`](solution/shop-api.yaml) und [`solution/rollout.sh`](solution/rollout.sh)
