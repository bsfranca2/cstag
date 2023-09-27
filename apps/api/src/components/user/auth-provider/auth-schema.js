export const login = {
  type: 'object',
  additionalProperties: true,
  properties: {
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        tenant: {
          type: 'string',
          minLength: 1,
        },
        username: {
          type: 'string',
          minLength: 1,
        },
        password: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['tenant', 'username', 'password'],
    },
  },
  required: ['body'],
};
