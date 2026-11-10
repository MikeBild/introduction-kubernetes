#!/usr/bin/env bash
# What is happening in the cluster? Resources, events, logs and the reason for a restart.
# Prerequisite: the stack from exercise 08 is running in the namespace werkstatt.
set -euo pipefail
cd "$(dirname "$0")"

# 1. Install metrics-server and wait until the first metrics arrive.
kubectl apply -k metrics-server
kubectl -n kube-system rollout status deployment/metrics-server
until kubectl top pods -n werkstatt >/dev/null 2>&1; do sleep 5; done

# 2. CPU and memory per node and per Pod.
kubectl top nodes
kubectl -n werkstatt top pods --sort-by=memory

# 3. Events: what has Kubernetes done or tried in vain recently?
kubectl -n werkstatt events --types=Warning,Normal | tail -n 10

# 4. Logs of all API Pods via the label, with a prefix per Pod.
kubectl -n werkstatt logs -l app.kubernetes.io/name=shop-api --prefix --tail=3

# 5. Force a restart: SIGTERM to PID 1, the API shuts down cleanly, the kubelet restarts it.
#    The kernel ignores SIGKILL from inside for PID 1 – hence SIGTERM.
pod=$(kubectl -n werkstatt get pod -l app.kubernetes.io/name=shop-api -o jsonpath='{.items[0].metadata.name}')
kubectl -n werkstatt exec "$pod" -- /nodejs/bin/node -e 'process.kill(1, "SIGTERM")' || true
kubectl -n werkstatt wait --for=jsonpath='{.status.containerStatuses[0].restartCount}'=1 "pod/$pod" --timeout=60s

# 6. Why? describe shows Last State and Exit Code, --previous the logs of the old container.
kubectl -n werkstatt describe pod "$pod" | grep -A4 'Last State'
kubectl -n werkstatt logs "$pod" --previous --tail=3
