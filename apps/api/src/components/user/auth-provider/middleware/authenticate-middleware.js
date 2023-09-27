import { getPrismaClientManager } from '@cstag/db';
import { ResponseError } from '../../../../error.js';
import { AuthorizationToken } from '../authorization-token.js';

/** @param {import("express").Request} req */
async function verifyToken(req) {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new ResponseError(
      401,
      null,
      new Error('Missing authorization header')
    );
  }

  const token = authorization.slice(7);
  try {
    return await AuthorizationToken.verify(token);
  } catch (error) {
    throw new ResponseError(401, null, error);
  }
}

/** @param {import("../../userRoles").Role} role */
export function getAuthenticateMiddleware(role) {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  async function authenticateMiddleware(req, res, next) {
    try {
      const { tenant, userId } = await verifyToken(req);
      req.tenant = tenant;
      req.userId = userId;
      req.repository = getPrismaClientManager().getClient(tenant);
      req.needRole = role;
      req.user = await req.repository.user.findUnique({
        where: { id: userId },
        include: { company: true },
      });

      if (req.needRole && req.user.role !== req.needRole) {
        throw new ResponseError(
          403,
          null,
          new Error(`Forbidden need=${role} current=${req.user.role}`)
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  }
  return authenticateMiddleware;
}
