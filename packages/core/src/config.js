export const storage = Object.freeze({
  endPoint: process.env.STORAGE_ENDPOINT,
  accessKey: process.env.STORAGE_ACCESS_KEY,
  secretKey: process.env.STORAGE_SECRET_KEY,
  region: process.env.STORAGE_REGION,
  bucket: process.env.STORAGE_BUCKET || null,
});
