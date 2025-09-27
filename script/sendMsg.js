import config from '../config.js';
import { sendMessage } from './services/telegram.js';
import { giveLuckyNumbers } from './luckyNumbers.js';
import { aiAnalysis } from './aiAnalysis.js';

const date = new Date().toUTCString();
const sendAIAnalysis = config.SEND_AI_ANALYSIS === 'true';

const makeBodyMessage = async () => {
  if (sendAIAnalysis) {
    const analysis = await aiAnalysis();
    return analysis;
  } else {
    return `Los números de la suerte para la próxima poceada son: ${giveLuckyNumbers().toString().replace(/,/g, ', ')}`;
  }
};

// we need to update the phone number every so often
(async () => {
  if( date.includes('Thu') || date.includes('Sat') || date.includes('Tue') ) {
    const body = await makeBodyMessage();
    await sendMessage(body);
  } else {
    console.log('Today the lucky numbers don\'t send :( ');
  }
})();
