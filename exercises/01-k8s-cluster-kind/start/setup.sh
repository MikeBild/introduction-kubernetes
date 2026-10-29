#!/usr/bin/env bash
# Cluster anlegen, das Image der API bauen und in den Cluster laden.
set -euo pipefail
cd "$(dirname "$0")"
app=../../../app

# TODO 3: Leg den Cluster mit kind create cluster --config kind-config.yaml an.

# TODO 4: Zeig cluster-info für den Context kind-werkstatt und die Nodes mit kubectl get nodes -o wide.

# TODO 5: Bau shop-api:1.0.0 und shop-api:1.1.0 aus "$app" (--build-arg APP_VERSION=…).

# TODO 6: Lade beide Images mit kind load docker-image --name werkstatt auf alle Nodes.

# TODO 7: Sieh dir die Pods im Namespace kube-system an.
