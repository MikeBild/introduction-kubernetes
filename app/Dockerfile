# syntax=docker/dockerfile:1

# Stage 1: install dependencies with npm – npm and the shell stay in this stage.
FROM node:26-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# Stage 2: distroless – only Node.js, no shell, no package manager.
# The nonroot tag runs as user 65532. The entrypoint is already node.
FROM gcr.io/distroless/nodejs26-debian13:nonroot
ARG APP_VERSION=1.0.0
ENV NODE_ENV=production APP_VERSION=${APP_VERSION}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
EXPOSE 3000
CMD ["src/main.ts"]
