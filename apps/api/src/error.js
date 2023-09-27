import { createLogger } from '@cstag/logger';
const logger = createLogger();

export class ResponseError extends Error {
  constructor(statusCode, message, cause) {
    // se apenas passar statusCode e cause como parametro
    if (message instanceof Error) {
      super(message.message, { cause: message });
      this.statusCode = statusCode;
      this.response = message.message
        ? {
            errors: [{ message: message.message }],
          }
        : undefined;
      return;
    }

    super(message, { cause });
    this.statusCode = statusCode;
    this.response = message
      ? {
          errors: [{ message }],
        }
      : undefined;
  }
}

const isProduction = process.env.NODE_ENV === 'production';
export const errorHandler = (err, _, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  logger.error(err.message, { errorCause: err.cause?.message });
  if (err instanceof ResponseError) {
    res.status(err.statusCode).json(err.response);
  } else if (isProduction) {
    res.status(500).json({
      errors: [{ message: 'Internal server error' }],
    });
  } else {
    res.status(500).json({
      errors: [{ message: err.message, stack: err.stack }],
    });
  }
};
