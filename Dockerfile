FROM registry.gosuslugi.local/build_images/node:14.17.5 as build

WORKDIR /opt
COPY *.json .npmrc ./
RUN npm i
COPY . .
RUN npm run build:portal:all

FROM registry.gosuslugi.local/base_images/nginx:1.13.10-1_centos-7.5

COPY --from=build --chown=1000:1000 /opt/dist/sf-portal-st html/sf-portal-st
