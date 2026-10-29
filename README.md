# Übungen: Kubernetes

Übungs-Repo zum zweiten Teil des Workshops „Docker & Kubernetes“. Zu jeder Kubernetes-Lektion findest du hier eine Übung mit Startpunkt, Tests und Lösung. Alle Übungen drehen sich um dieselbe Anwendung, die Werkstatt-Shop-API: Produkte, Bestellungen mit Positionen aus `productId`, `quantity` und `priceCents`, Geld immer in ganzen Cent.

## Was du lernst

- Einen lokalen Cluster mit kind anlegen und die API als Deployment betreiben
- Services, Konfiguration, Probes, Ressourcen und Rollouts ohne Downtime
- Gateway API, Kustomize, Observability und Absicherung mit Rechten und Policies

## Voraussetzungen

Den Docker-Teil des Workshops findest du in [MikeBild/introduction-docker](https://github.com/MikeBild/introduction-docker).

1. **Docker** – Docker Desktop oder Docker Engine. kind startet jeden Node als Container.
2. **kind** und **kubectl** – `brew install kind kubectl` oder die Anleitungen auf [kind.sigs.k8s.io](https://kind.sigs.k8s.io/docs/user/quick-start/) und [kubernetes.io](https://kubernetes.io/docs/tasks/tools/). kubectl bringt Kustomize schon mit.
3. **Node.js 26** – `nvm use` liest die Version aus [`.nvmrc`](.nvmrc). Node.js brauchst du für die Tests.

**Stack (Oktober 2026):** Kubernetes 1.37 lokal mit kind v0.33 · Gateway API v1.6 mit Envoy Gateway v1.9 · Kustomize in kubectl · metrics-server v0.9 · Node.js 26 im Distroless-Image · Express 5 · Postgres 18 · TypeScript strict als ESM · Vitest

## Einrichten

Repo klonen, Abhängigkeiten installieren, alles prüfen:

```bash
git clone https://github.com/MikeBild/introduction-kubernetes.git
cd introduction-kubernetes
npm ci
npm run check        # tsc, Vitest und Abgleich der gegebenen Manifeste – ohne Cluster
```

Cluster anlegen und Images laden – das ist Übung 01:

```bash
bash exercises/01-k8s-cluster-kind/solution/setup.sh
```

## So arbeitest du mit einer Übung

1. Lies die README der Übung und ergänze die Dateien in `start/` an den TODO-Kommentaren.
2. Wende die Manifeste mit `kubectl apply -f .` an oder führe das Skript der Übung aus.
3. Entferne in `start/test/*.test.ts` das `.skip` und führe `npx vitest exercises/<nr>/start` aus.
4. Vergleiche mit der Lösung in `solution/`.

Jede Übung ist eigenständig: `cd exercises/<nr>/start` und `kubectl apply -f .` reichen. Die gegebenen Manifeste liegen deshalb als Kopie in jedem Ordner. Änderst du `app/k8s/`, verteilt `npm run sync` die Kopien neu; `npm run check` meldet veraltete Kopien.

Die Tests lesen die Manifeste und prüfen die wichtigen Entscheidungen, für Kustomize rendern sie mit `kubectl kustomize`. Einen Cluster brauchen sie nicht. Ob alles wirklich läuft, zeigen dir die Skripte in den Übungen; die CI wendet die Lösungen 02 bis 08 in einem kind-Cluster an.

## Übungen

| # | Lektion | ID | Übung |
| --- | --- | --- | --- |
| 01 | Kubernetes gleicht Soll und Ist ab | `k8s-cluster-kind` | [exercises/01-k8s-cluster-kind](exercises/01-k8s-cluster-kind) |
| 02 | Du startest Deployments, keine Pods | `k8s-deployments` | [exercises/02-k8s-deployments](exercises/02-k8s-deployments) |
| 03 | Ein Service gibt Pods einen festen Namen | `k8s-services` | [exercises/03-k8s-services](exercises/03-k8s-services) |
| 04 | Konfiguration gehört nicht ins Image | `k8s-config-secrets` | [exercises/04-k8s-config-secrets](exercises/04-k8s-config-secrets) |
| 05 | Probes sagen Kubernetes, was mit dem Pod los ist | `k8s-probes` | [exercises/05-k8s-probes](exercises/05-k8s-probes) |
| 06 | Ohne Requests plant der Scheduler blind | `k8s-resources` | [exercises/06-k8s-resources](exercises/06-k8s-resources) |
| 07 | Ein Update ohne Downtime ist ein Rollout | `k8s-rolling-updates` | [exercises/07-k8s-rolling-updates](exercises/07-k8s-rolling-updates) |
| 08 | Die Gateway API löst Ingress ab | `k8s-gateway-api` | [exercises/08-k8s-gateway-api](exercises/08-k8s-gateway-api) |

### Zusatzkapitel

| # | Lektion | ID | Übung |
| --- | --- | --- | --- |
| 09 | Eine Basis, mehrere Umgebungen | `k8s-kustomize` | [exercises/09-k8s-kustomize](exercises/09-k8s-kustomize) |
| 10 | Was passiert gerade im Cluster? | `k8s-observability` | [exercises/10-k8s-observability](exercises/10-k8s-observability) |
| 11 | Jede Identität bekommt nur ihre Rechte | `k8s-rbac` | [exercises/11-k8s-rbac](exercises/11-k8s-rbac) |
| 12 | Erst alles verbieten, dann Wege erlauben | `k8s-network-policies` | [exercises/12-k8s-network-policies](exercises/12-k8s-network-policies) |
| 13 | Der Namespace lässt nur sichere Pods zu | `k8s-pod-security` | [exercises/13-k8s-pod-security](exercises/13-k8s-pod-security) |

Die Übungen 02 bis 08 bauen aufeinander auf: Der Startpunkt von 05 ist die Lösung von 04 und so weiter. Die Zusatzkapitel setzen den Stack aus 08 voraus, 11 bis 13 behandeln Sicherheit. Du kannst trotzdem bei jeder Nummer einsteigen.

## Warum kind, Gateway API und Kustomize?

- **kind** startet Upstream-Kubernetes per kubeadm in Docker-Containern, mit mehreren Nodes aus einer Config-Datei. Lokale Images kommen per `kind load docker-image` ohne Registry in den Cluster. k3d startet dagegen k3s mit Traefik und weiteren Extras, die genau die Konzepte verdecken, um die es hier geht.
- **Gateway API statt Ingress:** Die Ingress-API ist eingefroren, Ingress NGINX ist seit März 2026 eingestellt. Die Gateway API ist der Nachfolger, Envoy Gateway eine konforme Implementierung.
- **Kustomize statt Helm:** Kustomize steckt in kubectl und bleibt reines YAML ohne Template-Sprache. Helm brauchst du, um fremde Charts zu installieren, nicht für deine eigenen Manifeste.

## Aufbau

```text
app/                     Werkstatt-Shop-API: Express 5, postgres.js, zod
  Dockerfile             Distroless-Image, ARG APP_VERSION für 1.0.0 und 1.1.0
  k8s/                   gegeben: Namespace und Postgres 18 als StatefulSet
exercises/
  02-k8s-deployments/
    README.md            Aufgabe, Ablauf, Prüfkriterien
    start/               dein Startpunkt mit TODO-Kommentaren
      00-namespace.yaml  gegeben, wird zuerst angewendet
      postgres.yaml      gegeben
      shop-api.yaml      deine Aufgabe
      test/*.test.ts     Tests mit describe.skip – entferne .skip, wenn du mit der Übung beginnst
    solution/            eine mögliche Lösung, gleiche Struktur
legacy/2018/             das Material von 2018, nur als Archiv
```

## Pakete

Die App nutzt drei Pakete, jedes mit einem Grund:

- `express` 5 – HTTP-Routing; Fehler aus async Handlern landen ohne Zusatzpaket im Error Handler.
- `postgres` (postgres.js) – SQL als Tagged Template, Parameter nie im SQL-Text, Pool und Transaktionen eingebaut.
- `zod` 4 – dasselbe Schema für Bestellungen wie im Frontend des Werkstatt-Shops.

Dazu für die Entwicklung: `typescript`, `vitest`, `@types/node`, `@types/express` und `yaml` für die Tests der Manifeste.

## Aufräumen

```bash
kind delete cluster --name werkstatt
docker image rm shop-api:1.0.0 shop-api:1.1.0
```

## Workshop und Folien

- Workshop: [„Docker & Kubernetes“](https://workshops.mikebild.dev/w/docker-kubernetes/remote/)
- Folien: [slides.mikebild.dev/introduction-kubernetes](https://slides.mikebild.dev/introduction-kubernetes.html)

## Archiv

Die erste Fassung von 2018 (Minikube, Google Cloud, Ingress mit nginx, Node.js mit Yarn) liegt unverändert unter [`legacy/2018/`](legacy/2018/) und wird weder gebaut noch getestet.

## Lizenz

[MIT](LICENSE)
