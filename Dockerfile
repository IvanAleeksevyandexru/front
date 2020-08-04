FROM node:12.16.1 AS compile-image

WORKDIR /opt/ng
COPY package.json yarn.lock ./
RUN /bin/sh -c yarn install

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
RUN ng build --prod
RUN yarn lint
