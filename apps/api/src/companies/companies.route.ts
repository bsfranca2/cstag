import { Elysia } from 'elysia';
import { auth } from '~/auth';
import { listCompanies, switchCompany } from './usecases';

export const getCompaniesRoute = () => {
  const route = new Elysia({ prefix: '/companies' })
    .use(auth)
    .guard(
      {
        detail: {
          tags: ['companies'],
        },
        beforeHandle: ({ user }) => {
          if (!user) {
            return new Response('Unauthorized', { status: 401 });
          }
        },
      },
      (app) =>
        app.get('/:companyId/switch', async ({ params, user, jwt }) => {
          const dto = {
            userId: user!.id,
            companyId: parseInt(params.companyId),
          };
          const response = await switchCompany(dto, jwt.sign);
          return response;
        })
    )
    .guard(
      {
        detail: {
          tags: ['companies'],
        },
        beforeHandle: ({ user }) => {
          if (!user) {
            return new Response('Unauthorized', { status: 401 });
          }
          if (!user?.isAdmin) {
            return new Response('Forbidden', { status: 403 });
          }
        },
      },
      (app) =>
        app.get('/', async () => {
          const response = await listCompanies();
          return response;
        })
    );
  return route;
};
