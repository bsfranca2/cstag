import { randomBytes, scryptSync } from 'node:crypto';
import { InsecurePasswordError } from './user-errors.js';

const encryptPassword = (password, salt) => {
  return scryptSync(password, salt, 32).toString('hex');
};

const hashPassword = (password) => {
  const salt = randomBytes(16).toString('hex');
  return encryptPassword(password, salt) + salt;
};

export const comparePassword = (password, hash) => {
  const salt = hash.slice(64);
  const originalPassHash = hash.slice(0, 64);
  const currentPassHash = encryptPassword(password, salt);
  return originalPassHash === currentPassHash;
};

const isAppropriateLength = (value) => {
  return value.length >= 6 && value.length <= 100;
};

export const createPassword = (value) => {
  if (!isAppropriateLength(value)) {
    /**
     * Password with more than 100 characters are insecure?
     * Maybe throw a specific error
     */
    throw new InsecurePasswordError();
  }

  return hashPassword(value);
};
