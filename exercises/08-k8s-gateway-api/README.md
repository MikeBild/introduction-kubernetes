*English · [Deutsch](README.de.md)*

# 08 · The Gateway API replaces Ingress

Lesson `k8s-gateway-api`. You install Envoy Gateway and make the API reachable from outside under `/api` – with GatewayClass, Gateway and HTTPRoute.

## Why Gateway API instead of Ingress?

- The Ingress API is frozen: it gets no new features.
- Ingress NGINX, the most widespread Ingress controller, has been retired since March 2026 and no longer receives security updates.
- The Gateway API (`gateway.networking.k8s.io/v1`, currently v1.6) separates roles: the platform team chooses the GatewayClass, cluster operations the Gateway, the app team only writes HTTPRoutes. Headers, weights and rewrites are part of the specification instead of vendor-specific annotations.

Envoy Gateway belongs to the Envoy project of the CNCF, implements the Gateway API conformantly and installs with a single manifest.

## Task

1. Complete [`start/gateway.yaml`](start/gateway.yaml):
   - GatewayClass `envoy` with `controllerName: gateway.envoyproxy.io/gatewayclass-controller`
   - Gateway `werkstatt` with one listener `http` on port 80, only for routes from its own namespace
   - HTTPRoute `shop-api`: `PathPrefix /api` to the Service `shop-api`, port 80, with `URLRewrite` `ReplacePrefixMatch: /`
2. Run [`start/gateway.sh`](start/gateway.sh). It installs Envoy Gateway v1.9.3, applies everything and tests via `port-forward`.

```bash
cd exercises/08-k8s-gateway-api/start
bash gateway.sh
```

## Acceptance criteria

- `curl localhost:8080/api/products` returns three products.
- `curl localhost:8080/admin` returns 404: there is no route.
- `kubectl -n werkstatt get gateway` shows `PROGRAMMED False` with the reason `AddressNotAssigned`.

The last point is expected locally: Envoy Gateway creates a Service of type `LoadBalancer` per Gateway. In the cloud the provider assigns the address, in kind nobody does. That is why you test via `port-forward`. If you want a real address locally, start [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind).

Remove the `.skip` in `start/test/gateway.test.ts` and run `npx vitest exercises/08-k8s-gateway-api/start`.

## Reference solution

[`solution/gateway.yaml`](solution/gateway.yaml)
