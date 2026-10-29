# Todo GraphQL Backend

## Service

```bash
kubectl apply -f service.yaml
```

## Deployment

```bash
docker build -t gcr.io/workshops-mikebild/todo-app-graphql:v1.0.0 .
docker push gcr.io/workshops-mikebild/todo-app-graphql:v1.0.0
```

```bash
kubectl apply -f deployment.yaml
```

## Scale Deployment

```bash
kubectl scale --replicas=2 -f deployment.yaml
```

## Beta Deployments

```bash
docker build -t gcr.io/workshops-mikebild/todo-app-graphql:v1.1.0 .
docker push gcr.io/workshops-mikebild/todo-app-graphql:v1.1.0
```

```bash
kubectl apply -f deployment-beta.yaml
```
