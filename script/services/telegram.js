import TelegramBot from 'node-telegram-bot-api';
import config from '@config';

const token = config.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

