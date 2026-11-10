*English · [Deutsch](README.de.md)*

# Exercises: Kubernetes

Exercise repository for the second part of the workshop “Docker & Kubernetes”. For every Kubernetes lesson you find an exercise here with a starting point, tests and a reference solution. All exercises revolve around the same application, the workshop shop API: products, orders with line items made of `productId`, `quantity` and `priceCents`, money always in whole cents.

## What you learn

- Create a local cluster with kind and run the API as a Deployment
- Services, configuration, probes, resources and rollouts without downtime
- Gateway API, Kustomize, observability and hardening with permissions and policies

## Prerequisites

You find the Docker part of the workshop in [MikeBild/introduction-docker](https://github.com/MikeBild/introduction-docker).

1. **Docker** – Docker Desktop or Docker Engine. kind starts every node as a container.
2. **kind** and **kubectl** – `brew install kind kubectl` or the guides on [kind.sigs.k8s.io](https://kind.sigs.k8s.io/docs/user/quick-start/) and [kubernetes.io](https://kubernetes.io/docs/tasks/tools/). kubectl already ships with Kustomize.
3. **Node.js 26** – `nvm use` reads the version from [`.nvmrc`](.nvmrc). You need Node.js for the tests.

**Stack (October 2026):** Kubernetes 1.37 locally with kind v0.33 · Gateway API v1.6 with Envoy Gateway v1.9 · Kustomize in kubectl · metrics-server v0.9 · Node.js 26 in a Distroless image · Express 5 · Postgres 18 · TypeScript strict as ESM · Vitest

## Setup

Clone the repository, install the dependencies, check everything:

```bash
git clone https://github.com/MikeBild/introduction-kubernetes.git
cd introduction-kubernetes
npm ci
npm run check        # tsc, Vitest and comparison of the given manifests – without a cluster
```

Create the cluster and load the images – that is exercise 01:

```bash
bash exercises/01-k8s-cluster-kind/solution/setup.sh
```

## How to work on an exercise

1. Read the README of the exercise and complete the files in `start/` at the TODO comments.
2. Apply the manifests with `kubectl apply -f .` or run the script of the exercise.
3. Remove the `.skip` in `start/test/*.test.ts` and run `npx vitest exercises/<nr>/start`.
4. Compare with the reference solution in `solution/`.

Every exercise is self-contained: `cd exercises/<nr>/start` and `kubectl apply -f .` are enough. That is why the given manifests live as a copy in every folder. If you change `app/k8s/`, `npm run sync` redistributes the copies; `npm run check` reports outdated copies.

The tests read the manifests and check the important decisions; for Kustomize they render with `kubectl kustomize`. They do not need a cluster. Whether everything really runs is shown by the scripts in the exercises; the CI applies the solutions 02 to 08 in a kind cluster.

## Exercises

| # | Lesson | ID | Exercise |
| --- | --- | --- | --- |
| 01 | Kubernetes constantly reconciles desired and actual state | `k8s-cluster-kind` | [exercises/01-k8s-cluster-kind](exercises/01-k8s-cluster-kind) |
| 02 | You start Deployments, not Pods | `k8s-deployments` | [exercises/02-k8s-deployments](exercises/02-k8s-deployments) |
| 03 | A Service gives Pods a stable name | `k8s-services` | [exercises/03-k8s-services](exercises/03-k8s-services) |
| 04 | Configuration does not belong in the image | `k8s-config-secrets` | [exercises/04-k8s-config-secrets](exercises/04-k8s-config-secrets) |
| 05 | Probes tell Kubernetes when a Pod is working | `k8s-probes` | [exercises/05-k8s-probes](exercises/05-k8s-probes) |
| 06 | Requests schedule, limits cap | `k8s-resources` | [exercises/06-k8s-resources](exercises/06-k8s-resources) |
| 07 | An update without downtime is a rollout | `k8s-rolling-updates` | [exercises/07-k8s-rolling-updates](exercises/07-k8s-rolling-updates) |
| 08 | Gateway API replaces Ingress | `k8s-gateway-api` | [exercises/08-k8s-gateway-api](exercises/08-k8s-gateway-api) |

### Extra chapters

| # | Lesson | ID | Exercise |
| --- | --- | --- | --- |
| 09 | One base, multiple environments | `k8s-kustomize` | [exercises/09-k8s-kustomize](exercises/09-k8s-kustomize) |
| 10 | Events, logs and metrics show what happens in the cluster | `k8s-observability` | [exercises/10-k8s-observability](exercises/10-k8s-observability) |
| 11 | Who may do what in the cluster? | `k8s-rbac` | [exercises/11-k8s-rbac](exercises/11-k8s-rbac) |
| 12 | In the cluster, everyone can talk to everyone at first | `k8s-network-policies` | [exercises/12-k8s-network-policies](exercises/12-k8s-network-policies) |
| 13 | A Pod needs fewer permissions than it gets | `k8s-pod-security` | [exercises/13-k8s-pod-security](exercises/13-k8s-pod-security) |

Exercises 02 to 08 build on each other: the starting point of 05 is the solution of 04, and so on. The extra chapters require the stack from 08; 11 to 13 cover security. You can still start at any number.

## Why kind, Gateway API and Kustomize?

- **kind** starts upstream Kubernetes via kubeadm in Docker containers, with several nodes from one config file. Local images get into the cluster with `kind load docker-image`, no registry needed. k3d, by contrast, starts k3s with Traefik and further extras that hide exactly the concepts this is about.
- **Gateway API instead of Ingress:** The Ingress API is frozen, Ingress NGINX has been retired since March 2026. The Gateway API is the successor, Envoy Gateway a conformant implementation.
- **Kustomize instead of Helm:** Kustomize is built into kubectl and stays plain YAML without a template language. You need Helm to install third-party charts, not for your own manifests.

## Structure

```text
app/                     workshop shop API: Express 5, postgres.js, zod
  Dockerfile             Distroless image, ARG APP_VERSION for 1.0.0 and 1.1.0
  k8s/                   given: Namespace and Postgres 18 as StatefulSet
exercises/
  02-k8s-deployments/
    README.md            task, steps, acceptance criteria
    start/               your starting point with TODO comments
      00-namespace.yaml  given, applied first
      postgres.yaml      given
      shop-api.yaml      your task
      test/*.test.ts     tests with describe.skip – remove .skip when you begin the exercise
    solution/            one possible solution, same structure
archive/2018/            the 2018 material, archive only
```

## Packages

The app uses three packages, each for a reason:

- `express` 5 – HTTP routing; errors from async handlers reach the error handler without an extra package.
- `postgres` (postgres.js) – SQL as tagged template, parameters never in the SQL text, pool and transactions built in.
- `zod` 4 – the same schema for orders as in the frontend of the workshop shop.

Plus, for development: `typescript`, `vitest`, `@types/node`, `@types/express` and `yaml` for the manifest tests.

## Cleanup

```bash
kind delete cluster --name werkstatt
docker image rm shop-api:1.0.0 shop-api:1.1.0
```

## Workshop and slides

- Workshop: [“Docker & Kubernetes”](https://workshops.mikebild.dev/w/docker-kubernetes/remote/)
- Slides: [slides.mikebild.dev/introduction-kubernetes](https://slides.mikebild.dev/introduction-kubernetes.html)
- PDF: [slides.mikebild.dev/introduction-kubernetes.pdf](https://slides.mikebild.dev/introduction-kubernetes.pdf)

## Archive

The first version from 2018 (Minikube, Google Cloud, Ingress with nginx, Node.js with Yarn) lives unchanged under [`archive/2018/`](archive/2018/) and is neither built nor tested.

## License

[MIT](LICENSE)
