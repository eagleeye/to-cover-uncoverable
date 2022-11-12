FROM node:18.10.0-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . ./

ENTRYPOINT node src/server.js