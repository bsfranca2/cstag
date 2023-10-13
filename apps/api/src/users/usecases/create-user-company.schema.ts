import { t } from 'elysia';
import type { Static } from '@sinclair/typebox';

export const createUserCompanySchema = t.Object({
  companyId: t.Number(),
});

export type CreateUserCompanyDto = Static<typeof createUserCompanySchema> & {
  userId: number;
};
