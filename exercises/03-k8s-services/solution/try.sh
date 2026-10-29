#!/usr/bin/env bash
# Den Service von innen und von außen ansprechen.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api

# 1. Welche Pods stehen hinter dem Service? Die EndpointSlices zeigen ihre IPs.
kubectl -n werkstatt get service shop-api
kubectl -n werkstatt get endpointslices -l kubernetes.io/service-name=shop-api

# 2. Von innen: ein Wegwerf-Pod fragt den Service über seinen DNS-Namen.
kubectl -n werkstatt run curl -q --rm -i --restart=Never --image=curlimages/curl:8.23.0 -- \
  curl -fs http://shop-api/products

# 3. Von außen: port-forward tunnelt einen lokalen Port zum Service.
kubectl -n werkstatt port-forward service/shop-api 8080:80 >/dev/null &
forward=$!
trap 'kill $forward' EXIT
sleep 2
curl -fs http://localhost:8080/version
echo
