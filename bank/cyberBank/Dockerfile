FROM node:22-alpine

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci || npm ci

COPY . /app

RUN apk update && apk add bash
RUN chmod +x ./run.sh
