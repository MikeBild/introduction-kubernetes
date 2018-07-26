# Deployments

- [Deployment](#deployment)
- [Scale](#scale)
- [Auto-Scale](#auto-scale)
- [Manage Release](#manage-releases)

## Deployment

`kubectl apply -f deployment.yaml

_`deployment.yaml`_

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: app
    tier: frontend
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: app
        tier: frontend
        channel: stable
    spec:
      containers:
        - image: gcr.io/workshops-mikebild/my-app:v1.0.0
          name: my-app
          ports:
            - containerPort: 8080
          env:
            - name: PORT
              value: '8080'
```

## Scale

```bash
kubectl scale --replicas=2 -f my-deployment.yaml
```

## Auto-Scale

```bash
kubectl autoscale --min=2 --max=10 --cpu-percent=80 -f my-deployment.yaml
```

## Manage Releases

> Manage Releases

### History

```bash
kubectl rollout history deployments my-deployment
```

### Undo

```bash
kubectl rollout undo deployments my-deployment
```
