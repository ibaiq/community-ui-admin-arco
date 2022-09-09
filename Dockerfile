FROM node:lts-alpine as build

# npm镜像，解决报错而引入
RUN npm config set registry https://registry.npm.taobao.org
RUN npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine as production-stage

RUN rm /etc/nginx/conf.d/default.conf

ADD nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
