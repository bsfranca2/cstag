import morgan from 'morgan';

morgan.token('id', function getId(req) {
  return req.id;
});

// eslint-disable-next-line import/no-default-export
export default morgan(function (tokens, req, res) {
  const message = [
    tokens.id(req, res),
    new Date().toISOString(),
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
  ].join(' ');
  return JSON.stringify({ level: 'info', message });
});
