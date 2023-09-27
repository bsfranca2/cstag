import { Admin, User } from '../../user-roles.js';
import { getAuthenticateMiddleware } from './authenticate-middleware.js';
import {
  getTenantMidddleware,
  getTenantFromBody,
} from './tenant-middleware.js';

export const authenticateMiddleware = getAuthenticateMiddleware();
authenticateMiddleware.only = {
  admin: getAuthenticateMiddleware(Admin),
  user: getAuthenticateMiddleware(User),
};
export const tenantMiddleware = {
  fromReqBody: getTenantMidddleware(getTenantFromBody),
};
