FROM node:16-alpine as base

FROM base as deps

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile

FROM deps as builder

WORKDIR /app

COPY . .
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_LANG
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
ENV REACT_APP_LANG=${REACT_APP_LANG}

RUN yarn build

FROM nginx:1.15

WORKDIR /app

COPY --from=builder /app/build/ /usr/share/nginx/html
