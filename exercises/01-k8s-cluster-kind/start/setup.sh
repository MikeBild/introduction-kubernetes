#!/usr/bin/env bash
# Create the cluster, build the API image and load it into the cluster.
set -euo pipefail
cd "$(dirname "$0")"
app=../../../app

# TODO 3: Create the cluster with kind create cluster --config kind-config.yaml.

# TODO 4: Show cluster-info for the context kind-werkstatt and the nodes with kubectl get nodes -o wide.

# TODO 5: Build shop-api:1.0.0 and shop-api:1.1.0 from "$app" (--build-arg APP_VERSION=…).

# TODO 6: Load both images onto all nodes with kind load docker-image --name werkstatt.

# TODO 7: Look at the Pods in the namespace kube-system.
