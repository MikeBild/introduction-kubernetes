#!/usr/bin/env bash
# Check permissions without breaking anything: kubectl auth can-i with --as.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api

deployer=system:serviceaccount:werkstatt:deployer
api=system:serviceaccount:werkstatt:shop-api

# can-i exits with code 1 on "no" – hence || true.
check() { printf '%-60s ' "$*"; kubectl auth can-i "$@" || true; }

check patch deployments -n werkstatt --as "$deployer"   # yes: roll out
check get pods/log -n werkstatt --as "$deployer"        # yes: read logs
check get secrets -n werkstatt --as "$deployer"         # no: no Secrets
check patch deployments -n default --as "$deployer"     # no: only in its own namespace
check list pods -n werkstatt --as "$api"                # no: the API may do nothing at all

# Everything the deployer may do, at a glance.
kubectl auth can-i --list -n werkstatt --as "$deployer" | grep -E "^(Resources|deployments|pods|replicasets)"

# The API Pod has no token mounted.
kubectl -n werkstatt get pod -l app.kubernetes.io/name=shop-api \
  -o jsonpath='{.items[0].spec.serviceAccountName} {.items[0].spec.automountServiceAccountToken}{"\n"}'
