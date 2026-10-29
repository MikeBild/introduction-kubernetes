# 06 · Ohne Requests plant der Scheduler blind

Lektion `k8s-resources`. Du gibst der API Requests und ein Memory-Limit, passend zum Heap von Node.js.

## Aufgabe

Ergänze in [`start/shop-api.yaml`](start/shop-api.yaml) am Container `api`:

1. `resources.requests`: `cpu: 100m`, `memory: 512Mi`.
2. `resources.limits`: `memory: 512Mi`, kein CPU-Limit.

```bash
cd exercises/06-k8s-resources/start
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
kubectl describe node werkstatt-worker | grep -A8 'Allocated resources'
kubectl -n werkstatt exec deployment/shop-api -- /nodejs/bin/node \
  -e "console.log(require('v8').getHeapStatistics().heap_size_limit / 1048576)"
```

## Prüfkriterien

- `describe node` zählt die Requests der API-Pods unter `Allocated resources`.
- Der Heap von Node.js liegt bei rund 268 MB, also etwa der Hälfte des Limits.
- `kubectl -n werkstatt get pod -l app.kubernetes.io/name=shop-api -o jsonpath='{.items[0].status.qosClass}'` zeigt `Burstable`.

## Warum so?

- **Requests** reserviert der Scheduler auf dem Node. Ohne Requests plant er blind.
- **Memory-Limit gleich Request:** Überschreitet der Container das Limit, beendet der Kernel ihn (`OOMKilled`). Mit Limit gleich Request rechnest du nie mit Speicher, den der Node nicht garantiert.
- **Kein CPU-Limit:** Ein CPU-Limit bremst den Prozess auch dann, wenn der Node frei ist. Der CPU-Request sichert dir trotzdem deinen Anteil.
- **Heap von Node.js 26:** Node.js liest das Limit aus der cgroup und nimmt etwa die Hälfte als Heap, aber nie weniger als rund 256 MB. Gemessen: Limit 512Mi ergibt 268 MB, 1Gi ergibt 536 MB, 256Mi ergibt trotzdem 262 MB. Unter 512Mi ist der Heap also größer als die Hälfte, und der Container läuft Gefahr, vor dem Garbage Collector am Limit zu scheitern. Brauchst du weniger als 512Mi, setz den Heap selbst: `NODE_OPTIONS=--max-old-space-size=160` bei einem Limit von 256Mi.

Entferne in `start/test/resources.test.ts` das `.skip` und führe `npx vitest exercises/06-k8s-resources/start` aus.

## Lösung

[`solution/shop-api.yaml`](solution/shop-api.yaml)
