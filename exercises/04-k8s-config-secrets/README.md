*English · [Deutsch](README.de.md)*

# 04 · Configuration does not belong in the image

Lesson `k8s-config-secrets`. You move the configuration of the API into a ConfigMap and take the password from the Secret `shop-db`.

## Task

1. Complete [`start/config.yaml`](start/config.yaml): ConfigMap `shop-api-config` with `PORT`, `DB_HOST`, `DB_NAME` and `DB_USER`. The password does not belong in it.
2. Change [`start/shop-api.yaml`](start/shop-api.yaml):
   - `envFrom` reads the whole ConfigMap.
   - `DB_PASSWORD` comes from the Secret `shop-db`, key `POSTGRES_PASSWORD`, via `secretKeyRef`.
   - You assemble `DATABASE_URL` from `$(DB_USER)`, `$(DB_PASSWORD)`, `$(DB_HOST)` and `$(DB_NAME)`.

```bash
cd exercises/04-k8s-config-secrets/start
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
kubectl -n werkstatt get secret shop-db -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d
```

## Acceptance criteria

- The manifest of the API no longer contains a password.
- `kubectl -n werkstatt exec deployment/shop-api -- /nodejs/bin/node -e "console.log(process.env.DATABASE_URL)"` shows the assembled URL.
- The Pods become `Ready`, so the API reaches Postgres.

A Secret is only Base64-encoded, not encrypted. Protect it with RBAC (Role-Based Access Control), enable Encryption at Rest in the cluster and never put real secrets in plain text into the Git repository – use External Secrets or Sealed Secrets, for example.

If a ConfigMap that is read via `envFrom` changes, running Pods do not notice. Restart them with `kubectl -n werkstatt rollout restart deployment/shop-api`. Kustomize solves this with a hash in the name, see exercise 09.

Remove the `.skip` in `start/test/config.test.ts` and run `npx vitest exercises/04-k8s-config-secrets/start`.

## Reference solution

[`solution/config.yaml`](solution/config.yaml) and [`solution/shop-api.yaml`](solution/shop-api.yaml)
