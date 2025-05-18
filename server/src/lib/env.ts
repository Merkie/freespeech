import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT + '';
export const JWT_SECRET = process.env.JWT_SECRET + '';
export const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID + '';
export const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY + '';
export const R2_ENDPOINT = process.env.R2_ENDPOINT + '';
export const R2_BUCKET = process.env.R2_BUCKET + '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET + '';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID + '';
export const CLIENT_HOST = process.env.CLIENT_HOST + '';

export function init() {
  if (PORT.length === 0) throw new Error('PORT is not set');
  if (JWT_SECRET.length === 0) throw new Error('JWT_SECRET is not set');
  if (R2_ACCESS_KEY_ID.length === 0)
    throw new Error('R2_ACCESS_KEY_ID is not set');
  if (R2_SECRET_ACCESS_KEY.length === 0)
    throw new Error('R2_SECRET_ACCESS_KEY is not set');
  if (R2_ENDPOINT.length === 0) throw new Error('R2_ENDPOINT is not set');
  if (R2_BUCKET.length === 0) throw new Error('R2_BUCKET is not set');
  if (GOOGLE_CLIENT_SECRET.length === 0)
    throw new Error('GOOGLE_CLIENT_SECRET is not set');
  if (GOOGLE_CLIENT_ID.length === 0)
    throw new Error('GOOGLE_CLIENT_ID is not set');
}
