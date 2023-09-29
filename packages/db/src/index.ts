import { PrismaClient as OriginalPrismaClient } from '@prisma/client';
import knex from 'knex'

export const prisma = new OriginalPrismaClient();
export type PrismaClient = typeof prisma;
export { Prisma } from '@prisma/client';

export const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
})
