#!/usr/bin/env bash
# Cluster anlegen, das Image der API bauen und in den Cluster laden.
set -euo pipefail
cd "$(dirname "$0")"
app=../../../app

# 1. Cluster aus der Config: ein Control Plane Node, zwei Worker Nodes.
kind create cluster --config kind-config.yaml

# 2. kubectl spricht jetzt mit dem Context kind-werkstatt.
kubectl cluster-info --context kind-werkstatt
kubectl get nodes -o wide

# 3. Zwei Versionen der API bauen: 1.0.0 und 1.1.0 für das Rolling Update.
docker build -t shop-api:1.0.0 --build-arg APP_VERSION=1.0.0 "$app"
docker build -t shop-api:1.1.0 --build-arg APP_VERSION=1.1.0 "$app"

# 4. Images direkt auf alle Nodes laden – ohne Registry.
kind load docker-image shop-api:1.0.0 shop-api:1.1.0 --name werkstatt

# 5. Was läuft schon? Die Komponenten des Control Plane im Namespace kube-system.
kubectl get pods -n kube-system
