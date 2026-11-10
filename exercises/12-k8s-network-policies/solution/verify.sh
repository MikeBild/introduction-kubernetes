#!/usr/bin/env bash
# Check that the policies take effect: allowed paths work, all others do not.
# Prerequisite: Envoy Gateway from exercise 08 is installed.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
kubectl -n werkstatt get networkpolicy

# probe <namespace> <host> <port>: opens a TCP connection from a throwaway Pod.
probe() {
  if kubectl -n "$1" run "probe-$RANDOM" -q --rm -i --restart=Never --image=busybox:1.37 -- \
    nc -z -w 3 "$2" "$3" 2>/dev/null; then echo "erreichbar: $1 → $2:$3"; else echo "blockiert:  $1 → $2:$3"; fi
}

# 1. An arbitrary Pod in the namespace werkstatt no longer reaches the API directly.
probe werkstatt shop-api 80

# 2. A Pod in the namespace default does not reach Postgres.
probe default postgres.werkstatt 5432

# 3. Through the Gateway it still works: Envoy may reach the API, the API may reach Postgres.
envoy=$(kubectl -n envoy-gateway-system get service \
  -l gateway.envoyproxy.io/owning-gateway-name=werkstatt -o jsonpath='{.items[0].metadata.name}')
kubectl -n envoy-gateway-system port-forward "service/$envoy" 8080:80 >/dev/null &
forward=$!
trap 'kill $forward' EXIT
sleep 3
curl -fs http://localhost:8080/api/readyz
echo
