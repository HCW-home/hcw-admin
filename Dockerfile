FROM node:16 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
RUN npx ng build --configuration=production --build-optimizer --aot --output-hashing=all --vendor-chunk

FROM nginxinc/nginx-unprivileged:latest
COPY --from=builder /usr/src/app/dist/hug-at-home-admin/ /usr/share/nginx/html/
COPY nginx-docker.conf.template /etc/nginx/templates/default.conf.template

RUN sed -i  's/\(default_type.*\)/\1\n    proxy_headers_hash_bucket_size 128;/g' /etc/nginx/nginx.conf