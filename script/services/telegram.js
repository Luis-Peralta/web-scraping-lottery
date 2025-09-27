import TelegramBot from 'node-telegram-bot-api';
import config from '../../config.js';

const token = config.TELEGRAM_BOT_TOKEN;
const chatId = config.TELEGRAM_CHAT_ID;
const bot = new TelegramBot(token, {polling: true});

/**
 * Get Chat ID from Telegram messages
 * @returns {number} chatId
 */
// eslint-disable-next-line no-unused-vars
function getChatId() {
  let chatId = 0;
  bot.on('message', (msg) => {
    chatId = msg.chat.id;
    console.log('Message Received', msg.text);
    console.log('ChatId:', msg.chat.id);
  });
  return chatId;
};

/**
 * Send message to Telegram chat
 * @param {string} message - Message to send
 */
async function sendMessage(message = '') {
  try {
    await bot.sendMessage(chatId, message);
    console.log('Message sent to Telegram successfully');
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};

export { sendMessage };
