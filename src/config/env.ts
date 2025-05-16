import * as dotenv from 'dotenv';
dotenv.config(); // this will load .env into process.env

export const env = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};