import { t } from 'elysia';
import type { Static } from '@sinclair/typebox';

export const signInSchema = t.Object({
  email: t.String(),
  password: t.String(),
});

export type SignInDto = Static<typeof signInSchema>;
