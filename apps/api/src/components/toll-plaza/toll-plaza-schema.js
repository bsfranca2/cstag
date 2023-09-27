export const importSheet = {
  type: 'object',
  additionalProperties: true,
  properties: {
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        description: {
          type: 'string',
        },
        startAt: {
          type: 'string',
          format: 'date-time',
        },
        endAt: {
          type: 'string',
          format: 'date-time',
        },
      },
      required: ['startAt', 'endAt'],
    },
  },
  required: ['body'],
};

export const getPeriod = {
  type: 'object',
  additionalProperties: true,
  properties: {
    params: {
      type: 'object',
      additionalProperties: false,
      properties: {
        tollPlazaPeriodId: {
          type: 'string',
          format: 'uuid',
        },
      },
      required: ['tollPlazaPeriodId'],
    },
  },
  required: ['params'],
};

export const updatePeriod = {
  type: 'object',
  additionalProperties: true,
  properties: {
    params: {
      type: 'object',
      additionalProperties: false,
      properties: {
        tollPlazaPeriodId: {
          type: 'string',
          format: 'uuid',
        },
      },
      required: ['tollPlazaPeriodId'],
    },
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        description: {
          type: 'string',
        },
        startAt: {
          type: 'string',
          format: 'date-time',
        },
        endAt: {
          type: 'string',
          format: 'date-time',
        },
        inactived: {
          type: 'boolean',
        },
      },
      anyOf: [
        { required: ['description'] },
        { required: ['startAt'] },
        { required: ['endAt'] },
        { required: ['inactived'] },
      ],
    },
  },
  required: ['params', 'body'],
};

export const duplicatePeriod = {
  type: 'object',
  additionalProperties: true,
  properties: {
    params: {
      type: 'object',
      additionalProperties: false,
      properties: {
        tollPlazaPeriodId: {
          type: 'string',
          format: 'uuid',
        },
      },
      required: ['tollPlazaPeriodId'],
    },
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        description: {
          type: 'string',
        },
        startAt: {
          type: 'string',
          format: 'date-time',
        },
        endAt: {
          type: 'string',
          format: 'date-time',
        },
      },
      required: ['startAt', 'endAt'],
    },
  },
  required: ['params', 'body'],
};

export const listTollPlazas = {
  type: 'object',
  additionalProperties: true,
  properties: {
    query: {
      type: 'object',
      additionalProperties: false,
      properties: {
        tollPlazaPeriodId: {
          type: 'string',
          format: 'uuid',
        },
        fullRoadName: {
          type: 'string',
        },
        perPage: {
          type: ['string', 'number'],
        },
        page: {
          type: ['string', 'number'],
        },
      },
    },
  },
};

export const updateTollPlaza = {
  type: 'object',
  additionalProperties: true,
  properties: {
    params: {
      type: 'object',
      additionalProperties: false,
      properties: {
        tollPlazaId: {
          type: 'string',
          format: 'uuid',
        },
      },
      required: ['tollPlazaId'],
    },
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        associateCompany: {
          type: 'string',
        },
        highway: {
          type: 'string',
        },
        km: {
          type: 'string',
        },
        fullRoadName: {
          type: 'string',
        },
        category: {
          type: 'number',
          minimum: 1,
          maximum: 69,
        },
        value: {
          type: ['number', 'string'],
        },
      },
      anyOf: [
        { required: ['associateCompany'] },
        { required: ['highway'] },
        { required: ['km'] },
        { required: ['fullRoadName'] },
        { required: ['category'] },
        { required: ['value'] },
      ],
    },
  },
  required: ['params', 'body'],
};

export const createTollPlaza = {
  type: 'object',
  additionalProperties: true,
  properties: {
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        tollPlazaPeriodId: {
          type: 'string',
          format: 'uuid',
        },
        associateCompany: {
          type: 'string',
        },
        highway: {
          type: 'string',
        },
        km: {
          type: 'string',
        },
        fullRoadName: {
          type: 'string',
        },
        category: {
          type: 'number',
          minimum: 1,
          maximum: 69,
        },
        value: {
          type: ['number', 'string'],
        },
      },
      required: [
        'tollPlazaPeriodId',
        'associateCompany',
        'highway',
        'km',
        'fullRoadName',
        'category',
        'value',
      ],
    },
  },
};
