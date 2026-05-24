import config from '../config.js';
import { sendMessage } from './services/telegram.js';
import { giveLuckyNumbers } from './luckyNumbers.js';
import { aiAnalysis } from './aiAnalysis.js';
import { isLotteryDay } from './utils/date.js';
import { getData } from './services/mongoConnection.js';
import { formatLotteryResult } from './utils/lotteryFormatter.js';

const sendAIAnalysis = config.SEND_AI_ANALYSIS === 'true';
// @ts-ignore
const lastResult = await getData({ limit: 1 });

// AI analysis
const makeBodyMessage = async () => {
  if (sendAIAnalysis) {
    const analysis = await aiAnalysis();
    return analysis;
  } else {
    return `Los números de la suerte para la próxima poceada son: ${giveLuckyNumbers().toString().replace(/,/g, ', ')}`;
  }
};

// Daily Jackpot status
const sendJackpotStatus = async () => {
  await sendMessage(formatLotteryResult(lastResult), { parse_mode: 'Markdown' });
};

(async () => {
  if(isLotteryDay()) {
    const body = await makeBodyMessage();
    await sendJackpotStatus();
    await sendMessage(body);
  } else {
    console.log('Today the lucky numbers don\'t send :( ');
    await sendJackpotStatus();
  }
})();
