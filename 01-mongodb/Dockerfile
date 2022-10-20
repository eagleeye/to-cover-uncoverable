FROM node:18.10.0-alpine3.16

COPY package*.json .

RUN npm i

COPY . .

ENTRYPOINT npm test