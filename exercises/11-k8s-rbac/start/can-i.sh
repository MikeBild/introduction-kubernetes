#!/usr/bin/env bash
# Rechte prüfen, ohne etwas kaputt zu machen: kubectl auth can-i mit --as.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api

deployer=system:serviceaccount:werkstatt:deployer
api=system:serviceaccount:werkstatt:shop-api

# can-i endet mit Exit-Code 1 bei "no" – deshalb || true.
check() { printf '%-60s ' "$*"; kubectl auth can-i "$@" || true; }

check patch deployments -n werkstatt --as "$deployer"   # yes: ausrollen
check get pods/log -n werkstatt --as "$deployer"        # yes: Logs lesen
check get secrets -n werkstatt --as "$deployer"         # no: keine Secrets
check patch deployments -n default --as "$deployer"     # no: nur im eigenen Namespace
check list pods -n werkstatt --as "$api"                # no: die API darf gar nichts

# Alles, was der deployer darf, auf einen Blick.
kubectl auth can-i --list -n werkstatt --as "$deployer" | grep -E "^(Resources|deployments|pods|replicasets)"

# Der Pod der API hat kein Token gemountet.
kubectl -n werkstatt get pod -l app.kubernetes.io/name=shop-api \
  -o jsonpath='{.items[0].spec.serviceAccountName} {.items[0].spec.automountServiceAccountToken}{"\n"}'
