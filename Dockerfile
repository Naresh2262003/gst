FROM node:20-alpine3.19 AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY .npmrc .

RUN npm i

COPY . .

RUN npm run build

FROM nginx:latest as prod

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf.tmpl /etc/nginx/nginx.conf.tmpl

EXPOSE 80/tcp

CMD /bin/sh -c "envsubst '\$UPSTREAM_URL' < /etc/nginx/nginx.conf.tmpl > /etc/nginx/nginx.conf && /usr/sbin/nginx -g 'daemon off;'"