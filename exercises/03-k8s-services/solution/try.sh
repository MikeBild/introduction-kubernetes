#!/usr/bin/env bash
# Reach the Service from inside and from outside.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api

# 1. Which Pods are behind the Service? The EndpointSlices show their IPs.
kubectl -n werkstatt get service shop-api
kubectl -n werkstatt get endpointslices -l kubernetes.io/service-name=shop-api

# 2. From inside: a throwaway Pod queries the Service by its DNS name.
kubectl -n werkstatt run curl -q --rm -i --restart=Never --image=curlimages/curl:8.23.0 -- \
  curl -fs http://shop-api/products

# 3. From outside: port-forward tunnels a local port to the Service.
kubectl -n werkstatt port-forward service/shop-api 8080:80 >/dev/null &
forward=$!
trap 'kill $forward' EXIT
sleep 2
curl -fs http://localhost:8080/version
echo
