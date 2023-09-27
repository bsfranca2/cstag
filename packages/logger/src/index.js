import winston from 'winston';

export const createLogger = (scope, service) => {
  return winston.createLogger({
    defaultMeta: { scope, service },
    transports: [new winston.transports.Console()],
  });
};
