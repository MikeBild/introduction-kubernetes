# 09 · Eine Basis, mehrere Umgebungen

Zusatzkapitel, Lektion `k8s-kustomize`. Du machst aus den Manifesten eine Kustomize-Basis und leitest daraus `dev` und `prod` ab.

## Warum Kustomize statt Helm?

- Kustomize steckt in kubectl: `kubectl apply -k` und `kubectl kustomize`, kein Zusatzwerkzeug.
- Basis und Overlays bleiben reines YAML. Jede Datei lässt sich mit `kubectl apply` lesen und prüfen, ohne Template-Sprache.
- Für eigene Anwendungen mit wenigen Umgebungen reicht das.

Helm v4 brauchst du, um fremde Pakete wie Datenbanken oder Controller als Chart zu installieren und zu aktualisieren. Für deine eigenen Manifeste ist eine Template-Sprache meist mehr, als du brauchst.

## Aufgabe

1. Ergänze [`start/base/kustomization.yaml`](start/base/kustomization.yaml): `namespace: werkstatt`, ein Label `app.kubernetes.io/part-of: werkstatt-shop` für alle Objekte, und ersetz `config.yaml` durch einen `configMapGenerator` mit denselben Werten. Lösch `config.yaml` danach.
2. Ergänze [`start/overlays/dev/kustomization.yaml`](start/overlays/dev/kustomization.yaml): Namespace `werkstatt-dev`, eine Replica, Image-Tag `1.1.0`.
3. Ergänze [`start/overlays/prod/kustomization.yaml`](start/overlays/prod/kustomization.yaml): Namespace `werkstatt-prod`, drei Replicas, Image-Tag `1.0.0` und ein JSON-Patch, der das Memory-Limit von Postgres auf `1Gi` setzt.

```bash
cd exercises/09-k8s-kustomize/start
kubectl kustomize overlays/dev            # rendern und lesen
kubectl apply -k overlays/dev
kubectl apply -k overlays/prod
kubectl diff -k overlays/prod             # was würde sich ändern?
kubectl delete -k overlays/dev && kubectl delete -k overlays/prod
```

## Prüfkriterien

- `kubectl -n werkstatt-dev get deployment shop-api` zeigt `1/1`, in `werkstatt-prod` `3/3`.
- Der Name der ConfigMap endet auf einen Hash, etwa `shop-api-config-b96ghbmtkk`, und das Deployment verweist darauf.
- Änderst du einen Wert im Generator, ändert sich der Hash – und das Deployment rollt neu aus.

Entferne in `start/test/kustomize.test.ts` das `.skip` und führe `npx vitest exercises/09-k8s-kustomize/start` aus. Der Test rendert die Overlays mit `kubectl kustomize`.

## Lösung

[`solution/base/kustomization.yaml`](solution/base/kustomization.yaml), [`solution/overlays/dev/kustomization.yaml`](solution/overlays/dev/kustomization.yaml) und [`solution/overlays/prod/kustomization.yaml`](solution/overlays/prod/kustomization.yaml)
