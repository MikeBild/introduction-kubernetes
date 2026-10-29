# 05 · Probes sagen Kubernetes, was mit dem Pod los ist

Lektion `k8s-probes`. Die API hat `/livez` und `/readyz`. Du verbindest sie mit Startup, Liveness und Readiness Probe.

## Aufgabe

Ergänze in [`start/shop-api.yaml`](start/shop-api.yaml) drei Probes per `httpGet` auf den benannten Port `http`:

1. `startupProbe` auf `/livez`: alle 2 Sekunden, bis zu 15 Versuche.
2. `livenessProbe` auf `/livez`: Hängt der Prozess, startet das Kubelet den Container neu. Keine Datenbank prüfen.
3. `readinessProbe` auf `/readyz`: Ist Postgres weg, nimmt der Service den Pod aus dem Routing.

```bash
cd exercises/05-k8s-probes/start
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api

# Postgres kurz wegnehmen und zusehen
kubectl -n werkstatt scale statefulset/postgres --replicas=0
kubectl -n werkstatt get pods -w                 # API-Pods: READY 0/1, aber kein Neustart
kubectl -n werkstatt scale statefulset/postgres --replicas=1
```

## Prüfkriterien

- Ohne Postgres zeigen die API-Pods `0/1`, `RESTARTS` bleibt `0`.
- `kubectl -n werkstatt get endpointslices -l kubernetes.io/service-name=shop-api -o jsonpath='{.items[0].endpoints[*].conditions.ready}'` zeigt dann `false false false`: Der Service schickt keinen Traffic mehr hin.
- Mit Postgres werden die Pods wieder `1/1`, ohne Neustart.

Prüft die Liveness Probe die Datenbank, startet Kubernetes bei einem kurzen Ausfall von Postgres alle API-Pods neu und macht es schlimmer.

Entferne in `start/test/probes.test.ts` das `.skip` und führe `npx vitest exercises/05-k8s-probes/start` aus.

## Lösung

[`solution/shop-api.yaml`](solution/shop-api.yaml)
