# 08 · Die Gateway API löst Ingress ab

Lektion `k8s-gateway-api`. Du installierst Envoy Gateway und machst die API unter `/api` von außen erreichbar – mit GatewayClass, Gateway und HTTPRoute.

## Warum Gateway API statt Ingress?

- Die Ingress-API ist eingefroren: Sie bekommt keine neuen Features mehr.
- Ingress NGINX, der verbreitetste Ingress Controller, ist seit März 2026 eingestellt und bekommt keine Sicherheits-Updates mehr.
- Die Gateway API (`gateway.networking.k8s.io/v1`, aktuell v1.6) trennt Rollen: Das Plattform-Team wählt die GatewayClass, der Cluster-Betrieb das Gateway, das App-Team schreibt nur HTTPRoutes. Header, Gewichte und Rewrites stehen in der Spezifikation statt in herstellerspezifischen Annotations.

Envoy Gateway gehört zum Envoy-Projekt der CNCF, implementiert die Gateway API konform und lässt sich mit einem Manifest installieren.

## Aufgabe

1. Ergänze [`start/gateway.yaml`](start/gateway.yaml):
   - GatewayClass `envoy` mit `controllerName: gateway.envoyproxy.io/gatewayclass-controller`
   - Gateway `werkstatt` mit einem Listener `http` auf Port 80, nur für Routen aus dem eigenen Namespace
   - HTTPRoute `shop-api`: `PathPrefix /api` auf den Service `shop-api`, Port 80, mit `URLRewrite` `ReplacePrefixMatch: /`
2. Führ [`start/gateway.sh`](start/gateway.sh) aus. Es installiert Envoy Gateway v1.9.3, wendet alles an und testet per `port-forward`.

```bash
cd exercises/08-k8s-gateway-api/start
bash gateway.sh
```

## Prüfkriterien

- `curl localhost:8080/api/products` liefert drei Produkte.
- `curl localhost:8080/admin` liefert 404: Es gibt keine Route.
- `kubectl -n werkstatt get gateway` zeigt `PROGRAMMED False` mit dem Grund `AddressNotAssigned`.

Der letzte Punkt ist lokal erwartet: Envoy Gateway legt je Gateway einen Service vom Typ `LoadBalancer` an. In der Cloud vergibt der Provider die Adresse, in kind tut das niemand. Deshalb testest du per `port-forward`. Wer lokal eine echte Adresse will, startet [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind).

Entferne in `start/test/gateway.test.ts` das `.skip` und führe `npx vitest exercises/08-k8s-gateway-api/start` aus.

## Lösung

[`solution/gateway.yaml`](solution/gateway.yaml)
