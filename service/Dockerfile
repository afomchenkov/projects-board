# stage 1: install dependencies
FROM node:22-alpine3.19 AS dependencies

WORKDIR /app

RUN apk add --no-cache bash curl dos2unix

COPY service/package.json ./
COPY service/yarn.lock ./

RUN yarn install

# stage 2: build the app
FROM dependencies AS build

WORKDIR /app

COPY service ./

RUN yarn build

# stage 3: start production app
FROM node:22-alpine3.19 AS production

WORKDIR /app

ENTRYPOINT [ "yarn", "start:prod" ]

EXPOSE 8080