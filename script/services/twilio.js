import twilio from 'twilio';
import config from '../../config.js';

const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

// we need to update the phone number every so often
(async () => {
  client.messages
    .create({
      body: '',
      from: `whatsapp:${config.FROM_NUMBER}`,
      to: `whatsapp:${config.TO_NUMBER}`,
    })
    .then(message => console.log(message.sid));
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
