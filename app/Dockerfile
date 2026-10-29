# syntax=docker/dockerfile:1

# Stage 1: Dependencies mit npm installieren – npm und Shell bleiben in dieser Stage.
FROM node:26-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# Stage 2: Distroless – nur Node.js, keine Shell, kein Paketmanager.
# Das Tag nonroot startet als User 65532. Der Entrypoint ist bereits node.
FROM gcr.io/distroless/nodejs26-debian13:nonroot
ARG APP_VERSION=1.0.0
ENV NODE_ENV=production APP_VERSION=${APP_VERSION}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
EXPOSE 3000
CMD ["src/main.ts"]
