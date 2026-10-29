# 12 · Erst alles verbieten, dann Wege erlauben

Zusatzkapitel Sicherheit, Lektion `k8s-network-policies`. Ab Werk erreicht jeder Pod jeden Pod. Du schränkst das auf die Wege ein, die der Werkstatt-Shop braucht: Gateway zur API, API zu Postgres.

Voraussetzung: Envoy Gateway aus Übung 08 ist installiert.

## Aufgabe

Ergänze [`start/network-policies.yaml`](start/network-policies.yaml):

1. `default-deny-ingress`: leerer `podSelector`, `policyTypes: [Ingress]`, keine Regeln.
2. `allow-gateway-to-api`: Pods `shop-api` nehmen nur Traffic aus dem Namespace `envoy-gateway-system` an, nur auf Port `http`.
3. `allow-api-to-postgres`: Pods `postgres` nehmen nur Traffic von Pods `shop-api` an, nur auf Port 5432.

```bash
cd exercises/12-k8s-network-policies/start
bash verify.sh
```

## Prüfkriterien

- `blockiert:  werkstatt → shop-api:80` – auch Pods im eigenen Namespace kommen nicht mehr direkt an die API.
- `blockiert:  default → postgres.werkstatt:5432`
- Über das Gateway liefert `/api/readyz` weiterhin `{"status":"ready"}`.

kind setzt NetworkPolicies mit seinem Standard-Netzwerk kindnet durch, geprüft mit kind v0.33. Nicht jedes Plugin tut das: Ohne Unterstützung im Container Network Interface, kurz CNI, werden Policies still ignoriert. Prüf deshalb immer mit einem Gegentest wie `verify.sh`.

Die Health Checks des Kubelets kommen vom Node selbst und bleiben erlaubt. Ausgehenden Traffic schränkst du mit `policyTypes: [Egress]` ein. Denk dann an DNS: Port 53 zu CoreDNS im Namespace `kube-system`.

Entferne in `start/test/network-policies.test.ts` das `.skip` und führe `npx vitest exercises/12-k8s-network-policies/start` aus.

## Lösung

[`solution/network-policies.yaml`](solution/network-policies.yaml) und [`solution/verify.sh`](solution/verify.sh)
