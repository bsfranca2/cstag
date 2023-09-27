FROM node:lts-alpine
WORKDIR /app
COPY packages/ /app/packages/
COPY services/api/ /app/services/api/
RUN npm ci --prefix /app/packages/logger --only-production --no-optional
RUN npm ci --prefix /app/packages/elasticsearch --only-production --no-optional
RUN npm ci --prefix /app/packages/rabbitmq --only-production --no-optional
WORKDIR /app/services/api
RUN npm ci --only-production --no-optional
RUN npx prisma generate
USER node
CMD ["node", "./src/index.js"]
