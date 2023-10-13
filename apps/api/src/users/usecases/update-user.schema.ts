import { t } from 'elysia';
import type { Static } from '@sinclair/typebox';

import { createUserSchema } from './create-user.schema';

export const updateUserSchema = t.Partial(t.Pick(createUserSchema, ['name', 'email', 'isAdmin']));

export type UpdateUserDto = Static<typeof updateUserSchema> & {
  userId: number;
};
