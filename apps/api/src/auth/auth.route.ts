import { Elysia } from 'elysia';
import { signIn, signInSchema } from './usecases';
import { auth } from './auth.middleware';

export const getAuthRoute = () => {
  const route = new Elysia().use(auth).post(
    '/login',
    async ({ body, jwt }) => {
      const response = await signIn(body, jwt.sign);
      return response;
    },
    {
      body: signInSchema,
      detail: {
        tags: ['auth'],
      },
    }
  );
  return route;
};
