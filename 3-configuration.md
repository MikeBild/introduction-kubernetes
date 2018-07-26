# Kubernetes Configuration Management

- [Environment Variables](#environment-variables)
- [Secrets](#secrets)
- [Resource Quotas](#resource-quotas)

## Environment Variables

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: envar-demo
  labels:
    purpose: demonstrate-envars
spec:
  containers:
    - name: envar-demo-container
      image: gcr.io/google-samples/node-hello:1.0
      env:
        - name: DEMO_GREETING
          value: 'Hello from the environment'
        - name: DEMO_FAREWELL
          value: 'Such a sweet sorrow'
```

## Secrets

### Create

```bash
kubectl create secret generic couchdb --from-literal=user=admin --from-literal=password=nimda
```

### List

```bash
kubectl get secret
```

### Delete

```bash
kubectl create secret generic couchdb
```

### Using secrets as Environment-Variables

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
    - name: mycontainer
      image: redis
      env:
        - name: COUCHDB_USER
          valueFrom:
            secretKeyRef:
              name: couchdb
              key: username
        - name: COUCHDB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: couchdb
              key: password
  restartPolicy: Never
```

## Resource Quotas

- Quota request and limits for CPU and Memory

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: todo-app
  labels:
    app: todo
    tier: frontend
spec:
  containers:
    - image: gcr.io/workshops-mikebild/todo-app:v1.0.0
      name: todo-app
      resources:
        limits:
          cpu: '200m'
          memory: '100Mi'
        requests:
          cpu: '20m'
          memory: '20Mi'
      ports:
        - containerPort: 8080
```
