import { Router } from 'express';
import { getValidationMiddleware } from '../../middleware/validation.js';
import { login, loginAs, me } from './auth-provider/auth-controller.js';
import * as authSchemas from './auth-provider/auth-schema.js';
import {
  authenticateMiddleware,
  tenantMiddleware,
} from './auth-provider/middleware/index.js';
import {
  list,
  create,
  update,
  generateResetPasswordToken,
  resetPassword,
} from './user-controller.js';
import * as userSchemas from './user-schema.js';

export const getRouter = () => {
  const router = Router();

  router.post(
    '/login',
    getValidationMiddleware(authSchemas.login),
    tenantMiddleware.fromReqBody,
    login
  );
  router.get('/me', authenticateMiddleware, me);
  router.get('/loginAs/:userId', authenticateMiddleware.only.admin, loginAs);

  router.use('/users', authenticateMiddleware.only.admin);
  router
    .route('/users')
    .get(list)
    .post(getValidationMiddleware(userSchemas.create), create);
  router.patch(
    '/users/:userId',
    getValidationMiddleware(userSchemas.update),
    update
  );
  router.get('/users/:userId/resetPassword', generateResetPasswordToken);

  router.post(
    '/resetPassword',
    getValidationMiddleware(userSchemas.resetPassword),
    tenantMiddleware.fromReqBody,
    resetPassword
  );

  return router;
};
