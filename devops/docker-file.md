## docker
```shell
#   Base Node
FROM node:14.21.3-alpine AS base

WORKDIR /tdms-console
COPY . /tdms-console
RUN npm install --registry=http://registry.npmmirror.com
RUN npm run build:prod

# Nginx  web
FROM nginx:latest
COPY --from=base /tdms-console/dist /usr/app/console/dist/
COPY config/tdms-console.conf /etc/nginx/conf.d/default.conf
COPY config/nginx.conf /etc/nginx/nginx.conf


```
