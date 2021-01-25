FROM node:dubnium-alpine
LABEL email="wmc151567@gmail.com"

RUN apk add --no-cache bash

WORKDIR /app

RUN yarn install

COPY package.json /app
COPY yarn.lock /app

RUN yarn --verbose

COPY src /app/src
COPY tsconfig.json /app
COPY tsconfig.build.json /app

# env file 추후 배포/개발환경 개발시 수정 필요
COPY production.env /app

RUN yarn build

ENV NODE_ENV production

CMD ["yarn", "start:prod"]
