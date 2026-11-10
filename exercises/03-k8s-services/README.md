*English · [Deutsch](README.de.md)*

# 03 · A Service gives Pods a stable name

Lesson `k8s-services`. Pods come and go, and so do their IP addresses. You put a Service in front of the API and talk to it from inside and from outside.

## Task

1. Complete [`start/service.yaml`](start/service.yaml): `type: ClusterIP`, selector `app.kubernetes.io/name: shop-api`, port `80` named `http` targeting the named container port `http`.
2. Complete [`start/try.sh`](start/try.sh): show the Service and EndpointSlices, request `http://shop-api/products` from a throwaway Pod, request `/version` from your machine via `port-forward`.

```bash
cd exercises/03-k8s-services/start
bash try.sh
```

## Acceptance criteria

- The EndpointSlice shows as many IP addresses as there are Pods ready.
- The throwaway Pod reaches the API at `http://shop-api` – within the same namespace the short name is enough, otherwise `shop-api.werkstatt.svc.cluster.local`.
- `curl localhost:8080/version` returns `{"version":"1.0.0"}` as long as `port-forward` is running.

`port-forward` is a tool for development and troubleshooting, not a path for real traffic. You build the entry point for traffic from outside with the Gateway API.

Remove the `.skip` in `start/test/service.test.ts` and run `npx vitest exercises/03-k8s-services/start`.

## Reference solution

[`solution/service.yaml`](solution/service.yaml) and [`solution/try.sh`](solution/try.sh)
