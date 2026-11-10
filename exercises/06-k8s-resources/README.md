*English · [Deutsch](README.de.md)*

# 06 · Without requests, the scheduler schedules blindly

Lesson `k8s-resources`. You give the API requests and a memory limit that match the Node.js heap.

## Task

In [`start/shop-api.yaml`](start/shop-api.yaml), add to the container `api`:

1. `resources.requests`: `cpu: 100m`, `memory: 512Mi`.
2. `resources.limits`: `memory: 512Mi`, no CPU limit.

```bash
cd exercises/06-k8s-resources/start
kubectl apply -f .
kubectl -n werkstatt rollout status deployment/shop-api
kubectl describe node werkstatt-worker | grep -A8 'Allocated resources'
kubectl -n werkstatt exec deployment/shop-api -- /nodejs/bin/node \
  -e "console.log(require('v8').getHeapStatistics().heap_size_limit / 1048576)"
```

## Acceptance criteria

- `describe node` counts the requests of the API Pods under `Allocated resources`.
- The Node.js heap is around 268 MB, about half of the limit.
- `kubectl -n werkstatt get pod -l app.kubernetes.io/name=shop-api -o jsonpath='{.items[0].status.qosClass}'` shows `Burstable`.

## Why this way?

- **Requests** are what the scheduler reserves on the node. Without requests it schedules blindly.
- **Memory limit equal to request:** If the container exceeds the limit, the kernel kills it (`OOMKilled`). With limit equal to request, you never count on memory the node does not guarantee.
- **No CPU limit:** A CPU limit throttles the process even when the node is idle. The CPU request still secures your share.
- **Node.js 26 heap:** Node.js reads the limit from the cgroup and takes about half of it as heap, but never less than roughly 256 MB. Measured: a limit of 512Mi yields 268 MB, 1Gi yields 536 MB, 256Mi still yields 262 MB. Below 512Mi the heap is therefore larger than half, and the container risks hitting the limit before the garbage collector steps in. If you need less than 512Mi, set the heap yourself: `NODE_OPTIONS=--max-old-space-size=160` with a limit of 256Mi.

Remove the `.skip` in `start/test/resources.test.ts` and run `npx vitest exercises/06-k8s-resources/start`.

## Reference solution

[`solution/shop-api.yaml`](solution/shop-api.yaml)
