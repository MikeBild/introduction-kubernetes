#!/usr/bin/env bash
# Von 1.0.0 auf 1.1.0 ausrollen, ohne dass ein Request scheitert – und wieder zurück.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api

# Last: Ein Pod im Cluster fragt dreimal pro Sekunde /version und zählt Fehler.
kubectl -n werkstatt delete pod load --ignore-not-found
kubectl -n werkstatt run load --restart=Never --image=curlimages/curl:8.23.0 --command -- sh -c \
  'ok=0; fail=0; for i in $(seq 1 180); do if curl -fs -m 2 http://shop-api/version >/dev/null; then ok=$((ok+1)); else fail=$((fail+1)); fi; sleep 0.3; done; echo "ok=$ok fail=$fail"'
kubectl -n werkstatt wait --for=condition=Ready pod/load

# TODO 4: Roll mit kubectl set image auf shop-api:1.1.0 aus und setz die Annotation kubernetes.io/change-cause.

# TODO 5: Verfolge den Rollout mit rollout status und zeig rollout history.

# TODO 6: Geh mit rollout undo auf die vorherige Revision zurück.

# Ergebnis der Last: fail=0 heißt kein einziger verlorener Request.
kubectl -n werkstatt wait --for=jsonpath='{.status.phase}'=Succeeded pod/load --timeout=120s
kubectl -n werkstatt logs load
kubectl -n werkstatt delete pod load
