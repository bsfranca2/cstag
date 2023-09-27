export const create = {
  type: 'object',
  additionalProperties: true,
  properties: {
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        operatorCompany: {
          type: 'string',
          enum: ['SemParar'],
        },
      },
      required: ['operatorCompany'],
    },
  },
  required: ['body'],
};
