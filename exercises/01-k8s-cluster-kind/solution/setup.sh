#!/usr/bin/env bash
# Create the cluster, build the API image and load it into the cluster.
set -euo pipefail
cd "$(dirname "$0")"
app=../../../app

# 1. Cluster from the config: one control plane node, two worker nodes.
kind create cluster --config kind-config.yaml

# 2. kubectl now talks to the context kind-werkstatt.
kubectl cluster-info --context kind-werkstatt
kubectl get nodes -o wide

# 3. Build two versions of the API: 1.0.0 and 1.1.0 for the rolling update.
docker build -t shop-api:1.0.0 --build-arg APP_VERSION=1.0.0 "$app"
docker build -t shop-api:1.1.0 --build-arg APP_VERSION=1.1.0 "$app"

# 4. Load the images directly onto all nodes – without a registry.
kind load docker-image shop-api:1.0.0 shop-api:1.1.0 --name werkstatt

# 5. What is already running? The control plane components in the namespace kube-system.
kubectl get pods -n kube-system
