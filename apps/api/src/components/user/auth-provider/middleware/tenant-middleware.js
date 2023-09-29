import { prisma } from '@cstag/db';

/** @param {import("express").Request} req */
export function getTenantFromBody(req) {
  return req.body.tenant;
}

/**
 * @param {function(import("express").Request): string} getter
 */
export function getTenantMidddleware(getter) {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  function tenantMiddleware(req, res, next) {
    try {
      req.tenant = getter(req);
      req.repository = prisma;
      next();
    } catch (error) {
      next(error);
    }
  }
  return tenantMiddleware;
}
