import { createLogger } from '@cstag/logger';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import localize from 'ajv-i18n/localize/pt-BR/index.js';

const logger = createLogger('api:validation');
const ajv = new Ajv({
  logger: {
    log: (msg) => logger.info('AJV Validation INFO ' + msg),
    warn: (msg) => logger.warn('AJV Validation WARN ' + msg),
    error: (msg) => logger.error('AJV Validation ERROR ' + msg),
  },
  allErrors: true,
  removeAdditional: true,
  allowUnionTypes: true,
});
addFormats(ajv);

export const getValidationMiddleware = (schema) => {
  const validate = ajv.compile(schema);

  return (req, res, next) => {
    const data = {
      params: req.params,
      headers: req.headers,
      query: req.query,
      body: req.body,
    };
    if (validate(data)) {
      return next();
    } else {
      localize(validate.errors);
      return res.status(400).json({
        errors: [{ message: ajv.errorsText(validate.errors) }],
      });
    }
  };
};
