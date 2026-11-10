#!/usr/bin/env bash
# Reach the Service from inside and from outside.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api

# TODO 3: Show the Service and its EndpointSlices (-l kubernetes.io/service-name=shop-api).

# TODO 4: Query http://shop-api/products from a throwaway Pod (curlimages/curl:8.23.0, --rm -i --restart=Never).

# TODO 5: Tunnel with kubectl port-forward service/shop-api 8080:80 and query /version.
