/* eslint-disable no-undef */
import 'dotenv/config';
import twilio from 'twilio';
import { giveLuckyNumbers } from './luckyNumbers.js';
import { aiAnalysis } from './aiAnalysis.js';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const date = new Date().toUTCString();
const sendAIAnalysis = process.env.SEND_AI_ANALYSIS === 'true';

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
    client.messages
      .create({
        body,
        from: process.env.FROM_NUMBER,
        to: process.env.TO_NUMBER ?? ''
      })
      .then(message => console.log(message.sid));
  } else {
    console.log('Today the lucky numbers don\'t send :( ');
  }
})();

/*
******Code to send to multiple numbers !!! DON'T REMOVE*****
const numbersToMessage = ['number1, 'number2'];

numbersToMessage.forEach(async number => {
  const message = await client.messages.create({
    body: `Los números de la suerte para la proxima poceada son: ${giveLuckyNumbers()}`,
    from: 'from_number',
    to: number
  });
  console.log(message.status);
});*/
