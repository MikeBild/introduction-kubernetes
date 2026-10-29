FROM node:8.12.0-alpine

STOPSIGNAL SIGINT
RUN apk add --no-cache dumb-init

LABEL name "todo-graphql"

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install --production
COPY . /app

EXPOSE 8080

CMD ["dumb-init", "npm", "start"]