# Yaml

- Declarative description of resources
- Support for multiple resource sections

```yaml
apiVersion: v1
kind: Service
metadata:
  name: couchdb
  labels:
    app: todo
    tier: database
  annotations:
    external-dns.alpha.kubernetes.io/hostname: couchdb.workshops.mikebild.com.
spec:
  selector:
    app: todo
    tier: database
  type: LoadBalancer
  ports:
    - port: 5984
      targetPort: 5984
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: couchdb
  labels:
    app: todo
    tier: database
spec:
  template:
    metadata:
      labels:
        app: todo
        tier: database
    spec:
      containers:
        - image: couchdb:2.2.0
          name: couchdb
          ports:
            - containerPort: 5984
```
