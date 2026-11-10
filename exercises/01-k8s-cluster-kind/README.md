*English · [Deutsch](README.de.md)*

# 01 · Kubernetes reconciles desired and actual state

Lesson `k8s-cluster-kind`. You create a local cluster with three nodes using kind and load the image of the workshop shop API into it.

## Why kind?

- kind starts upstream Kubernetes via kubeadm, just like many cloud clusters do.
- A cluster with several nodes is one config file, not an extra tool.
- `kind load docker-image` puts local images on all nodes without a registry.
- kind is a project of the Kubernetes SIG Testing and runs in the CI of Kubernetes itself.

k3d starts k3s and brings Traefik, a load balancer and further extras. That is convenient, but hides exactly the concepts you learn here.

## Task

1. In [`start/kind-config.yaml`](start/kind-config.yaml), add two worker nodes and pin the node image with its digest:
   `kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5`
2. Complete [`start/setup.sh`](start/setup.sh): create the cluster, show the nodes, build `shop-api:1.0.0` and `shop-api:1.1.0`, load both with `kind load docker-image`.

```bash
brew install kind            # or: https://kind.sigs.k8s.io/docs/user/quick-start/
cd exercises/01-k8s-cluster-kind/start
bash setup.sh
```

## Acceptance criteria

- `kubectl get nodes` shows `werkstatt-control-plane`, `werkstatt-worker` and `werkstatt-worker2` with status `Ready` and version `v1.37.0`.
- `docker exec werkstatt-worker crictl images | grep shop-api` shows both tags.
- `kubectl get pods -n kube-system` shows the API server, etcd, the scheduler and the controller manager.

Cleanup at the end of the workshop: `kind delete cluster --name werkstatt`.

Remove the `.skip` in `start/test/cluster.test.ts` and run `npx vitest exercises/01-k8s-cluster-kind/start`.

## Reference solution

[`solution/kind-config.yaml`](solution/kind-config.yaml) and [`solution/setup.sh`](solution/setup.sh)
