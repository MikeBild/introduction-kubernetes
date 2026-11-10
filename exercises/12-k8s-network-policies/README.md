*English · [Deutsch](README.de.md)*

# 12 · Deny everything first, then allow paths

Extra chapter on security, lesson `k8s-network-policies`. Out of the box, every Pod can reach every Pod. You restrict that to the paths the workshop shop needs: Gateway to API, API to Postgres.

Prerequisite: Envoy Gateway from exercise 08 is installed.

## Task

Complete [`start/network-policies.yaml`](start/network-policies.yaml):

1. `default-deny-ingress`: empty `podSelector`, `policyTypes: [Ingress]`, no rules.
2. `allow-gateway-to-api`: Pods `shop-api` accept traffic only from the namespace `envoy-gateway-system`, only on port `http`.
3. `allow-api-to-postgres`: Pods `postgres` accept traffic only from Pods `shop-api`, only on port 5432.

```bash
cd exercises/12-k8s-network-policies/start
bash verify.sh
```

## Acceptance criteria

- `blockiert:  werkstatt → shop-api:80` (“blocked”) – even Pods in the same namespace no longer reach the API directly.
- `blockiert:  default → postgres.werkstatt:5432`
- Through the Gateway, `/api/readyz` still returns `{"status":"ready"}`.

kind enforces NetworkPolicies with its default network kindnet, verified with kind v0.33. Not every plugin does: without support in the Container Network Interface, CNI for short, policies are silently ignored. So always check with a counter-test like `verify.sh`.

The health checks of the kubelet come from the node itself and remain allowed. You restrict outgoing traffic with `policyTypes: [Egress]`. Then remember DNS: port 53 to CoreDNS in the namespace `kube-system`.

Remove the `.skip` in `start/test/network-policies.test.ts` and run `npx vitest exercises/12-k8s-network-policies/start`.

## Reference solution

[`solution/network-policies.yaml`](solution/network-policies.yaml) and [`solution/verify.sh`](solution/verify.sh)
