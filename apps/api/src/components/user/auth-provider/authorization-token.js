import { createSecretKey } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { jwtSecret } from '../../../config.js';

const secretKey = createSecretKey(jwtSecret, 'utf8');

export const AuthorizationToken = {
  async verify(token) {
    const { payload } = await jwtVerify(token, secretKey);
    return { userId: payload.sub, tenant: payload.tenant };
  },

  async generateToken({ tenant, userId }) {
    return await new SignJWT({ tenant })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime('12h')
      .sign(secretKey);
  },
};
