# Ingress App

> **Attention: Ingress takes about 10 minutes to start up.**

## Docker build and push

### v1

```bash
docker build -t gcr.io/workshops-mikebild/ingress-app:v1.0.0 .
docker push gcr.io/workshops-mikebild/ingress-app:v1.0.0
```

### v2

```bash
docker build -t gcr.io/workshops-mikebild/ingress-app:v2.0.0 .
docker push gcr.io/workshops-mikebild/ingress-app:v2.0.0
```

## Static IP and Ingress

```bash
gcloud compute addresses create ingress-static-ip --global
```

## Deployment

```bash
kubectl apply -f ingress-fanout.yaml
```

```bash
kubectl apply -f deployment-v1.yaml -f deployment-v2.yaml -f service-v1.yaml -f service-v2.yaml -f ingress-fanout.yaml
```

## Cleanup

```bash
kubectl delete -f deployment-v1.yaml -f deployment-v2.yaml -f service-v1.yaml -f service-v2.yaml -f ingress-fanout.yaml
```

```bash
gcloud compute addresses delete ingress-static-ip
```
