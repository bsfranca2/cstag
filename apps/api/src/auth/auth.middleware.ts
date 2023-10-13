import bearer from '@elysiajs/bearer';
import jwt from '@elysiajs/jwt';
import { Elysia } from 'elysia';
import { configService } from '~/shared/config';
import { type UserCached, userCacheService } from '~/users';

export const auth = new Elysia({ name: 'auth' })
  .use(jwt({ secret: configService.jwtSecret }))
  .use(bearer())
  .derive(async ({ jwt, bearer }) => {
    const payload = await jwt.verify(bearer);
    if (!payload || !payload.sub) {
      return {};
    }
    const user = await userCacheService.findByUnique({ id: +payload.sub });
    if (!user) {
      // TODO: Throw error user not found
      return {};
    }
    const companyId = payload.aud ? +payload.aud : undefined;
    return {
      user: user as UserCached | undefined,
      companyId: companyId as number | undefined,
    };
  });
