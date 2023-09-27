import { CompanyCNPJ } from './company-cnpj.js';

const uuidPattern =
  '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

export const create = {
  type: 'object',
  additionalProperties: true,
  properties: {
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: {
          type: 'string',
        },
        cnpj: {
          type: 'string',
          pattern: CompanyCNPJ.pattern(),
        },
        headquarterId: {
          type: 'string',
          pattern: uuidPattern,
        },
      },
      required: ['name', 'cnpj'],
    },
  },
  required: ['body'],
};
