*English · [Deutsch](README.de.md)*

# 02 · You start Deployments, not Pods

Lesson `k8s-deployments`. You describe the workshop shop API as a Deployment with two replicas. Namespace and Postgres are given.

## Task

Complete [`start/shop-api.yaml`](start/shop-api.yaml):

1. Deployment `shop-api` in the namespace `werkstatt` with `replicas: 2`.
2. Selector and Pod labels `app.kubernetes.io/name: shop-api`.
3. Container `api` with image `shop-api:1.0.0` and `imagePullPolicy: IfNotPresent` – the image is already on the nodes thanks to `kind load`.
4. `containerPort: 3000` named `http`.
5. `DATABASE_URL=postgres://postgres:werkstatt@postgres:5432/shop` as `env`.

```bash
cd exercises/02-k8s-deployments/start
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
kubectl -n werkstatt get deployment,replicaset,pods -o wide
kubectl -n werkstatt delete pod -l app.kubernetes.io/name=shop-api --wait=false
kubectl -n werkstatt get pods -w      # the Deployment replaces the Pods immediately, stop with Ctrl+C
```

[`00-namespace.yaml`](start/00-namespace.yaml) and [`postgres.yaml`](start/postgres.yaml) are given: Secret, init script as ConfigMap, headless Service and StatefulSet with Postgres 18. The number in the file name makes sure that `kubectl apply -f .` creates the namespace first.

## Acceptance criteria

- Two Pods `shop-api-…` are running, preferably on different worker nodes.
- If you delete a Pod, the ReplicaSet creates a new one immediately.
- `kubectl -n werkstatt logs deployment/shop-api` shows `server started`.

The password is still in plain text in the manifest here. The lesson on ConfigMaps and Secrets cleans that up.

Remove the `.skip` in `start/test/deployment.test.ts` and run `npx vitest exercises/02-k8s-deployments/start`.

## Reference solution

[`solution/shop-api.yaml`](solution/shop-api.yaml)
