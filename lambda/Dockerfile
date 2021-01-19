FROM node:dubnium-alpine
LABEL email="wmc151567@gmail.com"

RUN apk add --no-cache bash

WORKDIR /app

RUN yarn install

COPY package.json /app
COPY yarn.lock /app

RUN yarn --verbose

COPY ./ ./


