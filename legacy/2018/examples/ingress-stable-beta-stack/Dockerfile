FROM node:8.12.0-alpine

RUN apk add --no-cache dumb-init

LABEL name "ingress-app"
EXPOSE 8080
STOPSIGNAL SIGINT
ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install --production

COPY . /app

ENTRYPOINT dumb-init npm start