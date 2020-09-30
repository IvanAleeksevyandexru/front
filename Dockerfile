#FROM node:12.16.1 AS build-image

#WORKDIR /app
#COPY package.json yarn.lock ./
#RUN yarn install

#COPY . ./
#RUN yarn library:build
#RUN yarn build

FROM nginx
COPY ./dist/epgu-form-frontend/ /usr/share/nginx/html
COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY checkUrl.sh /docker-entrypoint.d/30-checkUrl.sh
RUN chmod +x /docker-entrypoint.d/30-checkUrl.sh


EXPOSE 80/tcp
