*English · [Deutsch](README.de.md)*

# 10 · What is happening in the cluster right now?

Extra chapter, lesson `k8s-observability`. You install metrics-server and use built-in tools to find out what Pods need, what Kubernetes does and why a container restarted.

Prerequisite: the stack from exercise 08 is running in the namespace `werkstatt`.

## Task

1. Complete [`start/metrics-server/kustomization.yaml`](start/metrics-server/kustomization.yaml): `components.yaml` of metrics-server v0.9.1 as a resource,
   `https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.1/components.yaml`,
   and a JSON patch that appends `--kubelet-insecure-tls` to the `args`.
2. Complete [`start/observe.sh`](start/observe.sh): `kubectl top`, `kubectl events`, logs by label, a forced restart via SIGTERM, `describe` and `logs --previous`.

```bash
cd exercises/10-k8s-observability/start
bash observe.sh
```

## Acceptance criteria

- `kubectl top pods` shows around 45 MiB of memory and a few millicores per API Pod.
- `kubectl events` also shows the failed readiness probes during startup.
- After the restart, `describe pod` shows `Last State: Terminated` with `Exit Code: 0`, `logs --previous` shows `shutdown complete`.

`--kubelet-insecure-tls` belongs in local clusters only: the kubelets in kind have self-signed certificates. In the cloud the provider usually ships metrics-server already.

For traces and metrics across services you use OpenTelemetry. More on that in the observability lesson of the Node.js workshop.

Remove the `.skip` in `start/test/observability.test.ts` and run `npx vitest exercises/10-k8s-observability/start`.

## Reference solution

[`solution/metrics-server/kustomization.yaml`](solution/metrics-server/kustomization.yaml) and [`solution/observe.sh`](solution/observe.sh)
