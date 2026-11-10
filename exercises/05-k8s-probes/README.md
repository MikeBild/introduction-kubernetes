*English · [Deutsch](README.de.md)*

# 05 · Probes tell Kubernetes what is going on with the Pod

Lesson `k8s-probes`. The API has `/livez` and `/readyz`. You wire them up with a startup, liveness and readiness probe.

## Task

In [`start/shop-api.yaml`](start/shop-api.yaml), add three probes via `httpGet` on the named port `http`:

1. `startupProbe` on `/livez`: every 2 seconds, up to 15 attempts.
2. `livenessProbe` on `/livez`: if the process hangs, the kubelet restarts the container. Do not check the database.
3. `readinessProbe` on `/readyz`: if Postgres is gone, the Service takes the Pod out of routing.

```bash
cd exercises/05-k8s-probes/start
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api

# take Postgres away for a moment and watch
kubectl -n werkstatt scale statefulset/postgres --replicas=0
kubectl -n werkstatt get pods -w                 # API Pods: READY 0/1, but no restart
kubectl -n werkstatt scale statefulset/postgres --replicas=1
```

## Acceptance criteria

- Without Postgres the API Pods show `0/1`, `RESTARTS` stays `0`.
- `kubectl -n werkstatt get endpointslices -l kubernetes.io/service-name=shop-api -o jsonpath='{.items[0].endpoints[*].conditions.ready}'` then shows `false false false`: the Service no longer sends traffic there.
- With Postgres back, the Pods become `1/1` again, without a restart.

If the liveness probe checks the database, Kubernetes restarts all API Pods during a brief Postgres outage and makes things worse.

Remove the `.skip` in `start/test/probes.test.ts` and run `npx vitest exercises/05-k8s-probes/start`.

## Reference solution

[`solution/shop-api.yaml`](solution/shop-api.yaml)
