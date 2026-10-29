# 04 · Konfiguration gehört nicht ins Image

Lektion `k8s-config-secrets`. Du ziehst die Konfiguration der API in eine ConfigMap und holst das Passwort aus dem Secret `shop-db`.

## Aufgabe

1. Ergänze [`start/config.yaml`](start/config.yaml): ConfigMap `shop-api-config` mit `PORT`, `DB_HOST`, `DB_NAME` und `DB_USER`. Das Passwort gehört nicht hinein.
2. Ändere [`start/shop-api.yaml`](start/shop-api.yaml):
   - `envFrom` liest die ConfigMap komplett ein.
   - `DB_PASSWORD` kommt per `secretKeyRef` aus dem Secret `shop-db`, Key `POSTGRES_PASSWORD`.
   - `DATABASE_URL` setzt du mit `$(DB_USER)`, `$(DB_PASSWORD)`, `$(DB_HOST)` und `$(DB_NAME)` zusammen.

```bash
cd exercises/04-k8s-config-secrets/start
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
kubectl -n werkstatt get secret shop-db -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d
```

## Prüfkriterien

- Im Manifest der API steht kein Passwort mehr.
- `kubectl -n werkstatt exec deployment/shop-api -- /nodejs/bin/node -e "console.log(process.env.DATABASE_URL)"` zeigt die zusammengesetzte URL.
- Die Pods werden `Ready`, die API erreicht also Postgres.

Ein Secret ist nur Base64-kodiert, nicht verschlüsselt. Schütz es mit RBAC (Role-Based Access Control), aktiviere Encryption at Rest im Cluster und leg echte Secrets nie im Klartext ins Git-Repo – nutz dafür etwa External Secrets oder Sealed Secrets.

Ändert sich eine ConfigMap, die per `envFrom` eingelesen wird, merken laufende Pods das nicht. Starte sie mit `kubectl -n werkstatt rollout restart deployment/shop-api` neu. Kustomize löst das mit einem Hash im Namen, siehe Übung 09.

Entferne in `start/test/config.test.ts` das `.skip` und führe `npx vitest exercises/04-k8s-config-secrets/start` aus.

## Lösung

[`solution/config.yaml`](solution/config.yaml) und [`solution/shop-api.yaml`](solution/shop-api.yaml)
