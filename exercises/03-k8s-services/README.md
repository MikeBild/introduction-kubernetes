# 03 · Ein Service gibt Pods einen festen Namen

Lektion `k8s-services`. Pods kommen und gehen, ihre IP-Adressen auch. Du stellst der API einen Service voran und sprichst sie von innen und von außen an.

## Aufgabe

1. Ergänze [`start/service.yaml`](start/service.yaml): `type: ClusterIP`, Selector `app.kubernetes.io/name: shop-api`, Port `80` mit dem Namen `http` auf den benannten Container-Port `http`.
2. Ergänze [`start/try.sh`](start/try.sh): Service und EndpointSlices zeigen, aus einem Wegwerf-Pod `http://shop-api/products` abfragen, per `port-forward` von deinem Rechner aus `/version` abfragen.

```bash
cd exercises/03-k8s-services/start
bash try.sh
```

## Prüfkriterien

- Die EndpointSlice zeigt so viele IP-Adressen, wie Pods bereit sind.
- Der Wegwerf-Pod erreicht die API unter `http://shop-api` – im selben Namespace reicht der kurze Name, sonst `shop-api.werkstatt.svc.cluster.local`.
- `curl localhost:8080/version` liefert `{"version":"1.0.0"}`, solange `port-forward` läuft.

`port-forward` ist ein Werkzeug für Entwicklung und Fehlersuche, kein Weg für echten Traffic. Den Eingang für Traffic von außen baust du mit der Gateway API.

Entferne in `start/test/service.test.ts` das `.skip` und führe `npx vitest exercises/03-k8s-services/start` aus.

## Lösung

[`solution/service.yaml`](solution/service.yaml) und [`solution/try.sh`](solution/try.sh)
