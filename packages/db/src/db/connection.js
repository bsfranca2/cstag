/**
 * @param {string} tenant
 * @param {Object} options
 * @param {boolean} options.parse
 * @returns
 */
export const getConnection = (tenant, options = {}) => {
  const env =
    process.env[`${tenant?.toUpperCase()}_DATABASE_URL`] ||
    process.env.CONSULT_DATABASE_URL;

  if (options.parse) {
    const { username, password, hostname, port, pathname, searchParams } =
      new URL(env);
    return {
      user: username,
      password,
      host: hostname,
      port,
      database: pathname.slice(1),
      schema: searchParams.get('schema'),
    };
  }

  return env;
};
