import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { Client } from 'minio';
import { storage as storageConfig } from '../config.js';

const { bucket, ...config } = storageConfig;

export const client = new Client(config);

export const bucketName = bucket;

export const putFromMulter = async (reqFile) => {
  const objectName = `${randomUUID()}${extname(reqFile.originalname)}`;
  const metadata = {
    'Content-Type': reqFile.mimetype,
    'X-Original-Name': reqFile.originalname,
  };
  await client.fPutObject(bucketName, objectName, reqFile.path, metadata);
  return { bucketName, objectName }
}

export const getObject = (bucket, object) =>
  new Promise((resolve, reject) => {
    client.getObject(bucket, object, function (err, dataStream) {
      if (err) {
        return reject(err);
      }
      return resolve(dataStream);
    });
  });
