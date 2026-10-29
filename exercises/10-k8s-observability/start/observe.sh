#!/usr/bin/env bash
# Was passiert im Cluster? Ressourcen, Events, Logs und der Grund für einen Neustart.
# Voraussetzung: Der Stack aus Übung 08 läuft im Namespace werkstatt.
set -euo pipefail
cd "$(dirname "$0")"

kubectl apply -k metrics-server
kubectl -n kube-system rollout status deployment/metrics-server
until kubectl top pods -n werkstatt >/dev/null 2>&1; do sleep 5; done

# TODO 3: Zeig kubectl top für Nodes und für die Pods in werkstatt, sortiert nach Speicher.

# TODO 4: Zeig die letzten zehn Events im Namespace (kubectl events).

# TODO 5: Zeig die Logs aller API-Pods über das Label, mit --prefix.

# TODO 6: Schick PID 1 eines API-Pods ein SIGTERM, warte auf restartCount 1
#         und zeig mit describe den Last State und mit logs --previous die alten Logs.
