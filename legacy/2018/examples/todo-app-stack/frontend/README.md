# Todo-App React/GraphQL Frontend

## Service

```bash
kubectl apply -f service.yaml
```

## Stable Deployment

```bash
docker build -t gcr.io/workshops-mikebild/todo-app-ui:v1.0.0 .
docker push gcr.io/workshops-mikebild/todo-app-ui:v1.0.0
```

```bash
kubectl apply -f deployment.yaml
```

## Scale Deployment

```bash
kubectl scale --replicas=2 -f deployment.yaml
```
