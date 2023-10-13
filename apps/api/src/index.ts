import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
// TODO: Check for my own implementation of some middlewares
// import { etag } from '@bogeychan/elysia-etag';
// import { helmet } from 'elysia-helmet';
// import { requestID } from "elysia-requestid";

import { prisma } from './shared/prisma';
import { getUsersRoute } from './users';
import { getAuthRoute } from './auth';
import { swaggerConfig } from './swagger-options';
import { getCompaniesRoute } from './companies';
import { getTollPlazasRoute } from './toll-plazas';

async function startApp() {
  await prisma.$connect();

  const app = new Elysia()
    .use(cors())
    .use(swagger(swaggerConfig))
    .use(getAuthRoute())
    .use(getUsersRoute())
    .use(getCompaniesRoute())
    .use(getTollPlazasRoute())
    .listen(3000);

  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
}

function shutdown(code: number) {
  process.exit(code);
}

process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception', err);
  shutdown(1);
});

const onStop = (event: string) => {
  console.log(`Received ${event}`);
  shutdown(0);
};

['SIGINT', 'SIGTERM'].forEach((event) => process.on(event, onStop));

startApp();
