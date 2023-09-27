import { tmpdir } from 'node:os';
import multer from 'multer';

export const fileMiddleware = multer({
  dest: tmpdir(),
});
