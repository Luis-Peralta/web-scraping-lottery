import dotenv from 'dotenv';
import process from 'process';

dotenv.config({ override: true });

const { 
  ALL_DATA, 
  COLLECTION, 
  DB_NAME,
  SAVE_DATA,
  SEND_AI_ANALYSIS,
  URL,
  DB_URI,
  FROM_NUMBER,
  GEMINI_API_KEY,
  TO_NUMBER,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TELEGRAM_BOT_TOKEN,
} = process.env;

export default {
  ALL_DATA,
  COLLECTION,
  DB_NAME,
  SAVE_DATA,
  SEND_AI_ANALYSIS,
  URL,
  DB_URI,
  FROM_NUMBER,
  GEMINI_API_KEY,
  TO_NUMBER,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TELEGRAM_BOT_TOKEN,
};
