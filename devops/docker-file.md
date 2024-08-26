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


环境变量
```shell
#   Base Node
FROM registry.iyunxin.cn:5000/node:14.21.3 AS base

WORKDIR /source-code
COPY . /source-code
RUN npm install
ARG ENVIRONMENT
# 根据环境参数执行不同的构建命令
RUN if [ "$ENVIRONMENT" = "production" ]; then \
        echo "开始生产环境打包" && \
        npm run build:prod; \
    elif [ "$ENVIRONMENT" = "develop" ]; then \
         echo "开始开发环境打包" && \
         npm run build:dev && \
         ls;\
    else \
        echo "Unknown environment: $ENVIRONMENT" && \
        exit 1; \
    fi

# Nginx  web
FROM registry.huaqingcloud.com:5000/hqcloud/nginx:latest
COPY --from=base /source-code/dist/ /usr/xiaoyou/management-dist/

COPY config/web-nginx.conf /etc/nginx/conf.d/default.conf
COPY config/nginx.conf /etc/nginx/nginx.conf
```
