/* eslint-disable no-undef */
import 'dotenv/config';
import twilio from 'twilio';
import { giveLuckyNumbers } from './luckyNumbers.js';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const date = new Date().toUTCString();

// we need to update the phone number  every so often
if( date.includes('Thu') || date.includes('Sat') || date.includes('Tue') ) {
  client.messages
    .create({
      body: `Los números de la suerte para la próxima poceada son: ${giveLuckyNumbers().toString().replaceAll(',',', ')}`,
      from: process.env.FROM_NUMBER,
      to: process.env.TO_NUMBER
    })
    .then(message => console.log(message.sid));
} else {
  console.log('Today the lucky numbers don\'t send :( ');
}

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
