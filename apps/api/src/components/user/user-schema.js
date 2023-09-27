import { Admin, User } from './user-roles.js';

export const create = {
  type: 'object',
  additionalProperties: true,
  properties: {
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        username: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        password: {
          type: 'string',
          minLength: 6,
          maxLength: 100,
        },
        role: {
          type: 'string',
          enum: [Admin, User],
        },
        companyId: {
          type: 'string',
          format: 'uuid',
        },
      },
      required: ['username', 'password', 'role'],
      if: {
        properties: {
          role: {
            const: User,
          },
        },
      },
      // eslint-disable-next-line unicorn/no-thenable
      then: {
        required: ['companyId'],
      },
      else: {
        properties: {
          companyId: {
            const: null,
          },
        },
      },
    },
  },
  required: ['body'],
};

export const update = {
  type: 'object',
  additionalProperties: true,
  properties: {
    params: {
      type: 'object',
      additionalProperties: false,
      properties: {
        userId: {
          type: 'string',
          format: 'uuid',
        },
      },
      required: ['userId'],
    },
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        password: {
          type: 'string',
          minLength: 6,
          maxLength: 100,
        },
      },
      required: ['password'],
    },
  },
  required: ['params', 'body'],
};

export const resetPassword = {
  type: 'object',
  additionalProperties: true,
  properties: {
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        tenant: {
          type: 'string',
        },
        userId: {
          type: 'string',
          format: 'uuid',
        },
        resetToken: {
          type: 'string',
        },
        password: {
          type: 'string',
          minLength: 6,
          maxLength: 100,
        },
      },
      required: ['tenant', 'userId', 'resetToken', 'password'],
    },
  },
  required: ['body'],
};
