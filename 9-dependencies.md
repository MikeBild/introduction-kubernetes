# Dependencies

- [Labels and Selectors](#labels-and-selectors)
- [Annotations](#annotations)

## Labels and Selectors

- Attach metadata to Kubernetes objects
- Map organizational structures onto system objects in a loosely coupled fashion
- Selectors identifies a set of objects by labels (AND concatenated by default)

### Example

_`service.yaml`_

```yaml
apiVersion: v1
kind: Service
spec:
  selector:
    app: todo
    tier: frontend
spec:
  ...
```

_`deployment.yaml`_

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: todo-app
  labels:
    app: todo
    tier: frontend
spec: ...
```

## Annotations

- Add metadata as additional informations

```yaml
apiVersion: v1
kind: Service
metadata:
  annotations:
    external-dns.alpha.kubernetes.io/hostname: todo-app.workshops.mikebild.com.
spec: ...
```
