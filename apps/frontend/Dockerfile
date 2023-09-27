FROM node:lts-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./services/frontend/package.json /app/
COPY ./services/frontend/yarn.lock /app/
RUN yarn install
COPY ./services/frontend/ /app
RUN yarn build

FROM nginx:1.20-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY infra/prod/nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
