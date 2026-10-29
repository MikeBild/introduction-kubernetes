# [External-DNS](https://github.com/kubernetes-incubator/external-dns)

> On K8s cluster creation all Google Cloud Service rights should be enabled!

```bash
kubectl create clusterrolebinding external-dns --clusterrole=cluster-admin --user=mike@mikebild.com
kubectl apply -f external-dns-deployment.yaml
```
