#!/usr/bin/env bash
# Den Service von innen und von außen ansprechen.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api

# TODO 3: Zeig den Service und seine EndpointSlices (-l kubernetes.io/service-name=shop-api).

# TODO 4: Frag aus einem Wegwerf-Pod (curlimages/curl:8.23.0, --rm -i --restart=Never) http://shop-api/products ab.

# TODO 5: Tunnel mit kubectl port-forward service/shop-api 8080:80 und frag /version ab.
