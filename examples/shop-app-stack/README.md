# Micro-Frontends in Practice

## Prerequisites

- Node.js LTE

### Local

- Start order
  - Gateway
  - Catalog
  - GraphQL-API
  - Home
  - Docs
  - Contact
  - Catalog

#### Setup

Import initial documents using [Excel CouchDB import tool](https://github.com/MikeBild/excel-couchdb-import).

```bash
...
```

### Docker/Kubernetes Stack

### Google Cloud Deployment

## Architecture

### Gateway

Serves locally on http://localhost:7000

- Service-Discovery via File
- Service-Discovery via Docker/Kubernetes
- Service-Discovery via Google-Cloud API

### Home-App

Serves locally on http://localhost:7010

### Docs-App

Serves locally on http://localhost:7020

### Products-App

Serves locally on http://localhost:7030

- GraphQL Lokal State Management
- GraphQL Caching
- GraphQL Subscription

### Contact-App

Serves locally on http://localhost:7040

Coming Soon:

- Send E-Mail to recipient

### Catalog-API-App

Serves locally on http://localhost:8000

Coming Soon:

- PouchDB Master/Master Replication to CouchDB
- Change Notifications

### GraphQL-API-App

Serves locally on http://localhost:9000

Coming Soon:

- Node Interface
- Validation and DomainErrors
- Batching & Caching with Dataloader
- Cursor based Paging and Collection
- Authentication and Viewer Query
- Subscription
- Custom Scalars
- Custom Directives
- Apollo Engine Integration

### Components-Library-App

Serves locally on http://localhost:5000

Coming soon:

- More components

## Coming Soon

- Service Discovery
- More Server-Side-Rendering
- Authentication/Authorisation
- Translation
- Better App-Shell
- Backoffice-App
- Real-Time Subscriptions

## More resources

### React

- [React Introduction](https://github.com/mikebild/introduction-react)
- [Refunk](https://github.com/jxnblk/refunk)
- [Refunk](https://github.com/acdlite/recompose)
- [Reunify](https://github.com/codecommission/reunify)

### Node.js

- [Node.js Introduction](https://github.com/mikebild/introduction-nodejs)
- [Node HTTP Proxy](https://github.com/nodejitsu/node-http-proxy)

### more more more

- [GraphQL Introduction](https://github.com/mikebild/introduction-graphql)
- [Atomic Design](http://atomicdesign.bradfrost.com/)
- [Micro-Frontends](https://micro-frontends.org/)
- [12 Factor Apps](https://12factor.net/)
- [PouchDB](https://pouchdb.com/)
- [CouchDB](http://couchdb.apache.org/)
