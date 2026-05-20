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

const makeBodyMessage = async () => {
  if (sendAIAnalysis) {
    const analysis = await aiAnalysis();
    return analysis;
  } else {
    return `Los números de la suerte para la próxima poceada son: ${giveLuckyNumbers().toString().replace(/,/g, ', ')}`;
  }
};

(async () => {
  if(isLotteryDay()) {
    const body = await makeBodyMessage();
    await sendMessage(formatLotteryResult(lastResult), { parse_mode: 'Markdown' });
    await sendMessage(body);
  } else {
    console.log('Today the lucky numbers don\'t send :( ');
  }
})();
