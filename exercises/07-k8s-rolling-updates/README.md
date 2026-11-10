*English · [Deutsch](README.de.md)*

# 07 · An update without downtime is a rollout

Lesson `k8s-rolling-updates`. You roll out `shop-api:1.1.0` while a Pod in the cluster keeps sending requests, and roll back again. No request may fail.

## Task

1. In [`start/shop-api.yaml`](start/shop-api.yaml), add:
   - `replicas: 3`, `minReadySeconds: 5`, `revisionHistoryLimit: 5`
   - `strategy` `RollingUpdate` with `maxSurge: 1` and `maxUnavailable: 0`
   - `terminationGracePeriodSeconds: 30` and `lifecycle.preStop.sleep.seconds: 5`
2. In [`start/rollout.sh`](start/rollout.sh), add: `kubectl set image` to `shop-api:1.1.0`, annotation `kubernetes.io/change-cause`, `rollout status`, `rollout history`, `rollout undo`.

```bash
cd exercises/07-k8s-rolling-updates/start
bash rollout.sh
```

## Acceptance criteria

- The load Pod reports `ok=180 fail=0` at the end.
- `rollout history` shows the revision with `shop-api 1.1.0`.
- After `rollout undo`, `/version` returns `1.0.0` again.

## Why this way?

- `maxUnavailable: 0` always keeps all three replicas ready, `maxSurge: 1` starts one additional Pod.
- The readiness probe from exercise 05 decides when a new Pod receives traffic.
- On shutdown the Pod receives SIGTERM while Service and Gateway still have it in routing for a moment. The `preStop` hook with `sleep` waits out this time before the API shuts down. The `sleep` action has been stable since Kubernetes 1.34 (GA, General Availability) and needs no shell in the image – important for Distroless.

`kubectl rollout undo` changes the Deployment behind the manifest's back. If your Git repository holds the desired state, set the old version there as well afterwards.

Remove the `.skip` in `start/test/rollout.test.ts` and run `npx vitest exercises/07-k8s-rolling-updates/start`.

## Reference solution

[`solution/shop-api.yaml`](solution/shop-api.yaml) and [`solution/rollout.sh`](solution/rollout.sh)
