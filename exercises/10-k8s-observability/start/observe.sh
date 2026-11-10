#!/usr/bin/env bash
# What is happening in the cluster? Resources, events, logs and the reason for a restart.
# Prerequisite: the stack from exercise 08 is running in the namespace werkstatt.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -k metrics-server
kubectl -n kube-system rollout status deployment/metrics-server
until kubectl top pods -n werkstatt >/dev/null 2>&1; do sleep 5; done

# TODO 3: Show kubectl top for nodes and for the Pods in werkstatt, sorted by memory.

# TODO 4: Show the last ten events in the namespace (kubectl events).

# TODO 5: Show the logs of all API Pods via the label, with --prefix.

# TODO 6: Send SIGTERM to PID 1 of an API Pod, wait for restartCount 1
#         and show the Last State with describe and the old logs with logs --previous.
