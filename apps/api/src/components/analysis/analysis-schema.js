export const searchTicketAnalyzes = {
  type: 'object',
  additionalProperties: true,
  properties: {
    query: {
      type: 'object',
      additionalProperties: false,
      properties: {
        term: {
          type: ['string', 'number'],
        },
        ticketType: {
          type: 'string',
          enum: ['TICKET', 'TOLL_VALLEY_TICKET'],
        },
        invoice: {
          type: ['string', 'number'],
        },
        licensePlate: {
          type: 'string',
        },
        divergence: {
          type: 'string',
          enum: ['With', 'Without', 'Neutral', 'Positive', 'Negative'],
        },
        startAt: {
          type: 'string',
          format: 'date-time',
        },
        endAt: {
          type: 'string',
          format: 'date-time',
        },
        operatorCompany: {
          type: 'string',
          enum: ['SemParar'],
        },
        page: {
          type: 'integer',
          minimum: 1,
        },
        perPage: {
          type: 'integer',
          minimum: 0,
        },
      },
    },
  },
  required: ['query'],
};

export const searchTripAnalyzes = {
  type: 'object',
  additionalProperties: true,
  properties: {
    query: {
      type: 'object',
      additionalProperties: false,
      properties: {
        statistics: {
          type: 'boolean',
        },
        trip: {
          type: ['string', 'number'],
        },
        licensePlate: {
          type: 'string',
        },
        divergence: {
          type: 'string',
          enum: ['With', 'Without', 'Credit', 'Debit'],
        },
        startAt: {
          type: 'string',
          format: 'date-time',
        },
        endAt: {
          type: 'string',
          format: 'date-time',
        },
        page: {
          type: 'integer',
          minimum: 1,
        },
        perPage: {
          type: 'integer',
          minimum: 0,
        },
      },
    },
  },
  required: ['query'],
};
