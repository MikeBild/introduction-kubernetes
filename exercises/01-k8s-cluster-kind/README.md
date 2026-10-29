# 01 · Kubernetes gleicht Soll und Ist ab

Lektion `k8s-cluster-kind`. Du legst mit kind einen lokalen Cluster mit drei Nodes an und lädst das Image der Werkstatt-Shop-API hinein.

## Warum kind?

- kind startet Upstream-Kubernetes per kubeadm, so wie viele Cloud-Cluster es auch tun.
- Ein Cluster mit mehreren Nodes ist eine Config-Datei, kein Zusatzwerkzeug.
- `kind load docker-image` bringt lokale Images ohne Registry auf alle Nodes.
- kind ist ein Projekt der Kubernetes SIG Testing und läuft in der CI von Kubernetes selbst.

k3d startet k3s und bringt Traefik, einen Load Balancer und weitere Extras mit. Das ist bequem, verdeckt aber genau die Konzepte, die du hier lernst.

## Aufgabe

1. Ergänze in [`start/kind-config.yaml`](start/kind-config.yaml) zwei Worker Nodes und leg das Node-Image mit Digest fest:
   `kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5`
2. Ergänze [`start/setup.sh`](start/setup.sh): Cluster anlegen, Nodes zeigen, `shop-api:1.0.0` und `shop-api:1.1.0` bauen, beide mit `kind load docker-image` laden.

```bash
brew install kind            # oder: https://kind.sigs.k8s.io/docs/user/quick-start/
cd exercises/01-k8s-cluster-kind/start
bash setup.sh
```

## Prüfkriterien

- `kubectl get nodes` zeigt `werkstatt-control-plane`, `werkstatt-worker` und `werkstatt-worker2` mit Status `Ready` und Version `v1.37.0`.
- `docker exec werkstatt-worker crictl images | grep shop-api` zeigt beide Tags.
- `kubectl get pods -n kube-system` zeigt API-Server, etcd, Scheduler und Controller Manager.

Aufräumen am Ende des Workshops: `kind delete cluster --name werkstatt`.

Entferne in `start/test/cluster.test.ts` das `.skip` und führe `npx vitest exercises/01-k8s-cluster-kind/start` aus.

## Lösung

[`solution/kind-config.yaml`](solution/kind-config.yaml) und [`solution/setup.sh`](solution/setup.sh)
