import { Elysia } from 'elysia';
import { importTollPlazaSheetSchema } from './usecases';

export const getTollPlazasRoute = () => {
  const route = new Elysia().group('/toll-plazas-period', (app) =>
    app
      .post(
        '/sheet',
        ({ body }) => {
          console.log(body.sheet);
          // Code here...
        },
        {
          body: importTollPlazaSheetSchema,
          type: 'multipart/form-data',
        }
      )
      .get('/', () => {
        // Code here...
      })
  );

  return route;
};
