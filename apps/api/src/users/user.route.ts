import { Elysia } from 'elysia';
import {
  createUser,
  createUserCompany,
  createUserCompanySchema,
  createUserSchema,
  deleteUserCompany,
  getUserById,
  getUsers,
  updateUser,
  updateUserSchema,
} from './usecases';
import { auth } from '~/auth';

export const getUsersRoute = () => {
  const route = new Elysia({ prefix: '/users' })
    .use(auth)
    .guard(
      {
        detail: {
          tags: ['users'],
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
        app
          .post(
            '/',
            async ({ body, set }) => {
              const response = await createUser(body);
              set.status = 201;
              return response;
            },
            {
              body: createUserSchema,
            }
          )
          .get('/', async (c) => {
            console.log(c);
            const response = await getUsers();
            return response;
          })
          .get('/:userId', async ({ params }) => {
            const dto = { userId: parseInt(params.userId) };
            const response = await getUserById(dto);
            return response;
          })
          .patch(
            '/:userId',
            async ({ body, params }) => {
              const dto = {
                userId: parseInt(params.userId),
                ...body,
              };
              const response = await updateUser(dto);
              return response;
            },
            {
              body: updateUserSchema,
            }
          )
          .post(
            '/:userId/companies',
            async ({ body, params, set }) => {
              const data = {
                userId: parseInt(params.userId),
                ...body,
              };
              const response = await createUserCompany(data);
              set.status = 201;
              return response;
            },
            {
              body: createUserCompanySchema,
            }
          )
          .delete('/:userId/companies/:companyId', async ({ params, set }) => {
            const data = {
              userId: parseInt(params.userId),
              companyId: parseInt(params.companyId),
            };
            await deleteUserCompany(data);
            set.status = 204;
          })
    )
    .get(
      '/me',
      ({ user, companyId }) => {
        return {
          ...user,
          activeCompanyId: companyId ?? null,
          companies: user!.companies.map(({ company, activeAt }) => ({
            ...company,
            activeAt,
          })),
        };
      },
      {
        beforeHandle: ({ user }) => {
          if (!user) {
            return new Response('Unauthorized', { status: 401 });
          }
        },
        detail: {
          tags: ['auth'],
        },
      }
    );
  return route;
};
