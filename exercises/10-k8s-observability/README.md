# 10 · Was passiert gerade im Cluster?

Zusatzkapitel, Lektion `k8s-observability`. Du installierst metrics-server und findest mit Bordmitteln heraus, was Pods brauchen, was Kubernetes tut und warum ein Container neu gestartet ist.

Voraussetzung: Der Stack aus Übung 08 läuft im Namespace `werkstatt`.

## Aufgabe

1. Ergänze [`start/metrics-server/kustomization.yaml`](start/metrics-server/kustomization.yaml): `components.yaml` von metrics-server v0.9.1 als Resource,
   `https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.1/components.yaml`,
   und ein JSON-Patch, der `--kubelet-insecure-tls` an die `args` hängt.
2. Ergänze [`start/observe.sh`](start/observe.sh): `kubectl top`, `kubectl events`, Logs per Label, ein erzwungener Neustart per SIGTERM, `describe` und `logs --previous`.

```bash
cd exercises/10-k8s-observability/start
bash observe.sh
```

## Prüfkriterien

- `kubectl top pods` zeigt je API-Pod rund 45 MiB Speicher und wenige Millicores.
- `kubectl events` zeigt auch die fehlgeschlagenen Readiness Probes beim Start.
- `describe pod` zeigt nach dem Neustart `Last State: Terminated` mit `Exit Code: 0`, `logs --previous` zeigt `shutdown complete`.

`--kubelet-insecure-tls` gehört nur in lokale Cluster: Die Kubelets in kind haben selbstsignierte Zertifikate. In der Cloud bringt der Provider metrics-server meist schon mit.

Für Traces und Metriken über Services hinweg nutzt du OpenTelemetry. Mehr dazu in der Lektion zu Observability im Node.js-Workshop.

Entferne in `start/test/observability.test.ts` das `.skip` und führe `npx vitest exercises/10-k8s-observability/start` aus.

## Lösung

[`solution/metrics-server/kustomization.yaml`](solution/metrics-server/kustomization.yaml) und [`solution/observe.sh`](solution/observe.sh)
