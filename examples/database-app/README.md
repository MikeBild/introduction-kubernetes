# CouchDB

## Service

```bash
kubectl apply -f service.yaml
```

## Secrets

```bash
kubectl create secret generic couchdb --from-literal=username=admin --from-literal=password=nimda
```

## Persistent Volumne

> Per Node Google Cloud Volume!

```bash
kubectl apply -f persistent-volume-claim.yaml
```

## Deployment

```bash
docker build -t gcr.io/workshops-mikebild/couchdb-app:v1.0.0 .
docker push gcr.io/workshops-mikebild/couchdb-app:v1.0.0
```

```bash
kubectl apply -f deployment.yaml
```
