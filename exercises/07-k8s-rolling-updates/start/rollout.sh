#!/usr/bin/env bash
# Roll out from 1.0.0 to 1.1.0 without a single failed request – and back again.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api

# Load: a Pod in the cluster requests /version three times per second and counts failures.
kubectl -n werkstatt delete pod load --ignore-not-found
kubectl -n werkstatt run load --restart=Never --image=curlimages/curl:8.23.0 --command -- sh -c \
  'ok=0; fail=0; for i in $(seq 1 180); do if curl -fs -m 2 http://shop-api/version >/dev/null; then ok=$((ok+1)); else fail=$((fail+1)); fi; sleep 0.3; done; echo "ok=$ok fail=$fail"'
kubectl -n werkstatt wait --for=condition=Ready pod/load

# TODO 4: Roll out to shop-api:1.1.0 with kubectl set image and set the annotation kubernetes.io/change-cause.

# TODO 5: Follow the rollout with rollout status and show rollout history.

# TODO 6: Go back to the previous revision with rollout undo.

# Result of the load: fail=0 means not a single lost request.
kubectl -n werkstatt wait --for=jsonpath='{.status.phase}'=Succeeded pod/load --timeout=120s
kubectl -n werkstatt logs load
kubectl -n werkstatt delete pod load
