#!/usr/bin/env bash
# Prüfen, dass die Policies greifen: erlaubte Wege gehen, alle anderen nicht.
# Voraussetzung: Envoy Gateway aus Übung 08 ist installiert.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
kubectl -n werkstatt get networkpolicy

# probe <namespace> <host> <port>: öffnet eine TCP-Verbindung aus einem Wegwerf-Pod.
probe() {
  if kubectl -n "$1" run "probe-$RANDOM" -q --rm -i --restart=Never --image=busybox:1.37 -- \
    nc -z -w 3 "$2" "$3" 2>/dev/null; then echo "erreichbar: $1 → $2:$3"; else echo "blockiert:  $1 → $2:$3"; fi
}

# 1. Ein beliebiger Pod im Namespace werkstatt erreicht die API nicht mehr direkt.
probe werkstatt shop-api 80

# 2. Ein Pod im Namespace default erreicht Postgres nicht.
probe default postgres.werkstatt 5432

# 3. Über das Gateway geht es weiter: Envoy darf die API erreichen, die API Postgres.
envoy=$(kubectl -n envoy-gateway-system get service \
  -l gateway.envoyproxy.io/owning-gateway-name=werkstatt -o jsonpath='{.items[0].metadata.name}')
kubectl -n envoy-gateway-system port-forward "service/$envoy" 8080:80 >/dev/null &
forward=$!
trap 'kill $forward' EXIT
sleep 3
curl -fs http://localhost:8080/api/readyz
echo
