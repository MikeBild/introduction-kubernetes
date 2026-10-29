#!/usr/bin/env bash
# Von 1.0.0 auf 1.1.0 ausrollen, ohne dass ein Request scheitert – und wieder zurück.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api

# 1. Last erzeugen: Ein Pod im Cluster fragt dreimal pro Sekunde /version und zählt Fehler.
kubectl -n werkstatt delete pod load --ignore-not-found
kubectl -n werkstatt run load --restart=Never --image=curlimages/curl:8.23.0 --command -- sh -c \
  'ok=0; fail=0; for i in $(seq 1 180); do if curl -fs -m 2 http://shop-api/version >/dev/null; then ok=$((ok+1)); else fail=$((fail+1)); fi; sleep 0.3; done; echo "ok=$ok fail=$fail"'
kubectl -n werkstatt wait --for=condition=Ready pod/load

# 2. Neue Version ausrollen und den Grund in der History festhalten.
kubectl -n werkstatt set image deployment/shop-api api=shop-api:1.1.0
kubectl -n werkstatt annotate deployment/shop-api kubernetes.io/change-cause="shop-api 1.1.0" --overwrite
kubectl -n werkstatt rollout status deployment/shop-api
kubectl -n werkstatt rollout history deployment/shop-api

# 3. Zurück auf die vorherige Revision.
kubectl -n werkstatt rollout undo deployment/shop-api
kubectl -n werkstatt rollout status deployment/shop-api

# 4. Ergebnis der Last: fail=0 heißt kein einziger verlorener Request.
kubectl -n werkstatt wait --for=jsonpath='{.status.phase}'=Succeeded pod/load --timeout=120s
kubectl -n werkstatt logs load
kubectl -n werkstatt delete pod load
