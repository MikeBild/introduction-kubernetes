# 02 · Du startest Deployments, keine Pods

Lektion `k8s-deployments`. Du beschreibst die Werkstatt-Shop-API als Deployment mit zwei Replicas. Namespace und Postgres sind gegeben.

## Aufgabe

Ergänze [`start/shop-api.yaml`](start/shop-api.yaml):

1. Deployment `shop-api` im Namespace `werkstatt` mit `replicas: 2`.
2. Selector und Pod-Labels `app.kubernetes.io/name: shop-api`.
3. Container `api` mit Image `shop-api:1.0.0` und `imagePullPolicy: IfNotPresent` – das Image liegt per `kind load` schon auf den Nodes.
4. `containerPort: 3000` mit dem Namen `http`.
5. `DATABASE_URL=postgres://postgres:werkstatt@postgres:5432/shop` als `env`.

```bash
cd exercises/02-k8s-deployments/start
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
kubectl -n werkstatt get deployment,replicaset,pods -o wide
kubectl -n werkstatt delete pod -l app.kubernetes.io/name=shop-api --wait=false
kubectl -n werkstatt get pods -w      # das Deployment ersetzt die Pods sofort, Abbruch mit Strg+C
```

Gegeben sind [`00-namespace.yaml`](start/00-namespace.yaml) und [`postgres.yaml`](start/postgres.yaml): Secret, Init-Skript als ConfigMap, Headless Service und StatefulSet mit Postgres 18. Die Nummer im Dateinamen sorgt dafür, dass `kubectl apply -f .` den Namespace zuerst anlegt.

## Prüfkriterien

- Zwei Pods `shop-api-…` laufen, möglichst auf verschiedenen Worker Nodes.
- Löschst du einen Pod, legt das ReplicaSet sofort einen neuen an.
- `kubectl -n werkstatt logs deployment/shop-api` zeigt `server started`.

Das Passwort steht hier noch im Klartext im Manifest. Die Lektion zu ConfigMaps und Secrets räumt das auf.

Entferne in `start/test/deployment.test.ts` das `.skip` und führe `npx vitest exercises/02-k8s-deployments/start` aus.

## Lösung

[`solution/shop-api.yaml`](solution/shop-api.yaml)
