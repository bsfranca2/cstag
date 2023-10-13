import type { ElysiaSwaggerConfig } from '@elysiajs/swagger/src/types';

export const swaggerConfig: ElysiaSwaggerConfig = {
  autoDarkMode: false,
  documentation: {
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
};
