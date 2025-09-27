import TelegramBot from 'node-telegram-bot-api';
import config from '@config';

const token = config.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

async function getChatId() {
  let chatId;
  bot.on('message', (msg) => {
    chatId = msg.chat.id;
    console.log('Message Received', msg.text);
    console.log('ChatId:', msg.chat.id);
  });
  return chatId;
};

async function sendTelegramMessage(message = '') {
  try {
    await bot.sendMessage(config.TELEGRAM_CHAT_ID, message);
    console.log('Message sent to Telegram successfully');
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};

export { sendTelegramMessage };

getChatId();