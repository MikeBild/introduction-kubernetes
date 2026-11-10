#!/usr/bin/env bash
# Install Envoy Gateway, apply the stack with Gateway and HTTPRoute, test from outside.
set -euo pipefail
cd "$(dirname "$0")"

# 1. Envoy Gateway: the Gateway API CRDs and the controller in one manifest.
kubectl apply --server-side -f https://github.com/envoyproxy/gateway/releases/download/v1.9.3/install.yaml
kubectl -n envoy-gateway-system wait --for=condition=Available deployment/envoy-gateway --timeout=5m

# 2. Apply the stack, GatewayClass, Gateway and HTTPRoute.
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
# Accepted is enough locally. Programmed stays False (AddressNotAssigned) until a load balancer
# assigns an address – in the cloud the provider does that, in kind nobody does.
kubectl -n werkstatt wait --for=condition=Accepted gateway/werkstatt --timeout=2m
kubectl -n werkstatt get gateway,httproute

# 3. The controller starts one Envoy proxy with its own Service per Gateway.
#    kind has no load balancer – port-forward is enough for testing.
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
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/admin   # 404: no route
