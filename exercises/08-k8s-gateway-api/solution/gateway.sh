#!/usr/bin/env bash
# Envoy Gateway installieren, den Stack mit Gateway und HTTPRoute anwenden, von außen testen.
set -euo pipefail
cd "$(dirname "$0")"

# 1. Envoy Gateway: CRDs der Gateway API und der Controller in einem Manifest.
kubectl apply --server-side -f https://github.com/envoyproxy/gateway/releases/download/v1.9.3/install.yaml
kubectl -n envoy-gateway-system wait --for=condition=Available deployment/envoy-gateway --timeout=5m

# 2. Stack, GatewayClass, Gateway und HTTPRoute anwenden.
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
# Accepted reicht lokal. Programmed bleibt False (AddressNotAssigned), bis ein Load Balancer
# eine Adresse vergibt – in der Cloud tut das der Provider, in kind niemand.
kubectl -n werkstatt wait --for=condition=Accepted gateway/werkstatt --timeout=2m
kubectl -n werkstatt get gateway,httproute

# 3. Der Controller startet je Gateway einen Envoy-Proxy mit eigenem Service.
#    kind hat keinen Load Balancer – port-forward reicht zum Testen.
envoy=$(kubectl -n envoy-gateway-system get service \
  -l gateway.envoyproxy.io/owning-gateway-namespace=werkstatt,gateway.envoyproxy.io/owning-gateway-name=werkstatt \
  -o jsonpath='{.items[0].metadata.name}')
kubectl -n envoy-gateway-system wait --for=condition=Ready pod \
  -l gateway.envoyproxy.io/owning-gateway-name=werkstatt --timeout=2m
kubectl -n envoy-gateway-system port-forward "service/$envoy" 8080:80 >/dev/null &
forward=$!
trap 'kill $forward' EXIT
sleep 3

curl -fs http://localhost:8080/api/products
echo
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/admin   # 404: keine Route
