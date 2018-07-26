# Introduction to Kubernetes

- [Concepts & Architecture](1-concepts-architecture.md)
  - [Components](1-concepts-architecture.md#components)
  - [Setup](1-concepts-architecture.md#setup)
  - [Docker Containers](https://github.com/MikeBild/introduction-docker)
- [CLI](2-cli.md)
  - [Cheat Sheet](2-cli.md#cheat-sheet)
  - [Context and Configuration](2-cli.md#context-and-configuration)
  - [Creating Objects](2-cli.md#creating-objects)
  - [Viewing, Finding Resources](2-cli.md#viewing-finding-resources)
  - [Updating Resources](2-cli.md#updating-resources)
  - [Scaling Resources](2-cli.md#scaling-resources)
  - [Deleting Resources](2-cli.md#deleting-resources)
  - [Interacting with Pods](2-cli.md#interacting-with-pods)
  - [Interacting with Nodes and Cluster](2-cli.md#interacting-with-nodes-and-cluster)
- [Configuration Management](3-configuration.md)
  - [Environment Variables](3-configuration.md#environment-variables)
  - [Secrets](3-configuration.md#secrets)
  - [Resource Quotas](3-configuration.md#resource-quotas)
- [Hands-On](handson.md)
  - [Google Cloud](handson.md#google-cloud)
    - DNS
    - LoadBalancer
  - [Minikube](handson.md#minikube)
  - [Dashboard](handson.md#dashboard)
- [Example Stacks](examples/README.md)
  - [Todo App (Frontend, Backend, Database)](examples/todo-app-stack/README.md)
  - [Shop App (Frontends, Micro-Services, Database)](examples/shop-app-stack/README.md)
- [Orchestration](4-orchestration.md)
- [Declarative Configuration using YAML](5-yaml.md)
- [Jobs / CronJons](6-jobs.md)
- [Deployments](7-deployments.md)
  - [Deployment](7-deployments.md#deployment)
  - [Scale](7-deployments.md#scale)
  - [Auto-Scale](7-deployments.md#auto-scale)
  - [Manage Release](7-deployments.md#manage-releases)
- [Services](8-services.md)
  - [Types](8-services.md#types)
    - [NodePort](8-services.md#NodePort)
    - [LoadBalancer](8-services.md#loadbalancer)
  - [Monitoring & Health-Checks](8-services.md#monitoring-and-health-checks)
    - [Readiness Probe](8-services.md#readiness-probe)
    - [Liveness Probe](8-services.md#liveness-probe)
    - [Init-Container](8-services.md#init-container)
- [Dependencies](9-dependencies.md)
  - [Labels and Selectors](9-dependencies.md#labels-and-selectors)
  - [Annotations](9-dependencies.md#annotations)
- [Ingress](10-ingress.md)
- [Storing States](11-store-states.md)
  - [Persistent Disks](11-store-states.md#persistent-disks)
  - [Persistent Volume Claim](11-store-states.md#persistent-volume-claim)
  - [Usage of PVC](11-store-states.md#usage-of-pvc)
  - [Examples](11-store-states.md#examples)

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public [GitHub issue tracker](https://github.com/MikeBild/introduction-kubernetes/issues).

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

## Thanks

You like this **Kubernetes introduction** and you want to see what coming next? Follow me on Twitter [`@mikebild`](https://twitter.com/mikebild).

Enjoy!
