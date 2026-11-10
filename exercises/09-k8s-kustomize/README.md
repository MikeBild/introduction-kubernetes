*English · [Deutsch](README.de.md)*

# 09 · One base, multiple environments

Extra chapter, lesson `k8s-kustomize`. You turn the manifests into a Kustomize base and derive `dev` and `prod` from it.

## Why Kustomize instead of Helm?

- Kustomize is built into kubectl: `kubectl apply -k` and `kubectl kustomize`, no extra tool.
- Base and overlays stay plain YAML. Every file can be read and checked with `kubectl apply`, without a template language.
- For your own applications with a few environments, that is enough.

You need Helm v4 to install and update third-party packages such as databases or controllers as a chart. For your own manifests, a template language is usually more than you need.

## Task

1. Complete [`start/base/kustomization.yaml`](start/base/kustomization.yaml): `namespace: werkstatt`, a label `app.kubernetes.io/part-of: werkstatt-shop` for all objects, and replace `config.yaml` with a `configMapGenerator` holding the same values. Delete `config.yaml` afterwards.
2. Complete [`start/overlays/dev/kustomization.yaml`](start/overlays/dev/kustomization.yaml): namespace `werkstatt-dev`, one replica, image tag `1.1.0`.
3. Complete [`start/overlays/prod/kustomization.yaml`](start/overlays/prod/kustomization.yaml): namespace `werkstatt-prod`, three replicas, image tag `1.0.0` and a JSON patch that sets the memory limit of Postgres to `1Gi`.

```bash
cd exercises/09-k8s-kustomize/start
kubectl kustomize overlays/dev            # render and read
kubectl apply -k overlays/dev
kubectl apply -k overlays/prod
kubectl diff -k overlays/prod             # what would change?
kubectl delete -k overlays/dev && kubectl delete -k overlays/prod
```

## Acceptance criteria

- `kubectl -n werkstatt-dev get deployment shop-api` shows `1/1`, in `werkstatt-prod` `3/3`.
- The name of the ConfigMap ends in a hash, such as `shop-api-config-b96ghbmtkk`, and the Deployment references it.
- If you change a value in the generator, the hash changes – and the Deployment rolls out again.

Remove the `.skip` in `start/test/kustomize.test.ts` and run `npx vitest exercises/09-k8s-kustomize/start`. The test renders the overlays with `kubectl kustomize`.

## Reference solution

[`solution/base/kustomization.yaml`](solution/base/kustomization.yaml), [`solution/overlays/dev/kustomization.yaml`](solution/overlays/dev/kustomization.yaml) and [`solution/overlays/prod/kustomization.yaml`](solution/overlays/prod/kustomization.yaml)
