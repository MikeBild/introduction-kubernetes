#!/usr/bin/env bash
# Was passiert im Cluster? Ressourcen, Events, Logs und der Grund für einen Neustart.
# Voraussetzung: Der Stack aus Übung 08 läuft im Namespace werkstatt.
set -euo pipefail
cd "$(dirname "$0")"

# 1. metrics-server installieren und warten, bis die ersten Messwerte da sind.
kubectl apply -k metrics-server
kubectl -n kube-system rollout status deployment/metrics-server
until kubectl top pods -n werkstatt >/dev/null 2>&1; do sleep 5; done

# 2. CPU und Speicher je Node und je Pod.
kubectl top nodes
kubectl -n werkstatt top pods --sort-by=memory

# 3. Events: Was hat Kubernetes zuletzt getan oder vergeblich versucht?
kubectl -n werkstatt events --types=Warning,Normal | tail -n 10

# 4. Logs aller API-Pods über das Label, mit Präfix je Pod.
kubectl -n werkstatt logs -l app.kubernetes.io/name=shop-api --prefix --tail=3

# 5. Neustart erzwingen: SIGTERM an PID 1, die API fährt sauber herunter, das Kubelet startet sie neu.
#    SIGKILL von innen ignoriert der Kernel bei PID 1 – deshalb SIGTERM.
pod=$(kubectl -n werkstatt get pod -l app.kubernetes.io/name=shop-api -o jsonpath='{.items[0].metadata.name}')
kubectl -n werkstatt exec "$pod" -- /nodejs/bin/node -e 'process.kill(1, "SIGTERM")' || true
kubectl -n werkstatt wait --for=jsonpath='{.status.containerStatuses[0].restartCount}'=1 "pod/$pod" --timeout=60s

# 6. Warum? describe zeigt Last State und Exit Code, --previous die Logs des alten Containers.
kubectl -n werkstatt describe pod "$pod" | grep -A4 'Last State'
kubectl -n werkstatt logs "$pod" --previous --tail=3
