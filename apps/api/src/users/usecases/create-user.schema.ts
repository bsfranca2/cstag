import { t } from 'elysia';
import type { Static } from '@sinclair/typebox';

export const createUserSchema = t.Object({
  name: t.String(),
  email: t.String(),
  password: t.String(),
  isAdmin: t.Boolean(),
});

export type CreateUserDto = Static<typeof createUserSchema>;
