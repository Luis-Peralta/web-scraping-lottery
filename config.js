import dotenv from 'dotenv';
import process from 'process';

dotenv.config({ override: true });

/**
 * Configuration object containing environment variables
 * @typedef {Object} Config
 */
export default {
  ALL_DATA: process.env.ALL_DATA ?? '',
  COLLECTION: process.env.COLLECTION ?? '',
  DB_NAME: process.env.DB_NAME ?? '',
  SAVE_DATA: process.env.SAVE_DATA ?? '',
  SEND_AI_ANALYSIS: process.env.SEND_AI_ANALYSIS ?? 'false',
  URL: process.env.URL ?? '',
  DB_URI: process.env.DB_URI ?? '',
  FROM_NUMBER: process.env.FROM_NUMBER ?? '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
  TO_NUMBER: process.env.TO_NUMBER ?? '',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ?? '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ?? '',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ?? '',
};
