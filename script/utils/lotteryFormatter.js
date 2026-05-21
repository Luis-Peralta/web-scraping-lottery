/**
 * Formats the last lottery result into a visually appealing Spanish message for Telegram.
 * @param {any[]} resultList
 * @returns {string}
 */
export const formatLotteryResult = (resultList) => {
  if (!Array.isArray(resultList) || resultList.length === 0) {
    return '⚠️ No se encontraron resultados del último sorteo.';
  }
  
  const result = resultList[0];
  const { sorteo, fecha, results, pozo } = result;
  
  // Extract and format numbers, padding them with 0 if necessary
  const numbers = Object.keys(results || {})
    .filter(key => key.startsWith('number-'))
    .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]))
    .map(key => String(results[key]).padStart(2, '0'))
    .join(' - ');
    
  const jackpotName = pozo?.jackpot || pozo?.jackpotFive || 'Pozo';
  const accumulated = pozo?.totalAccumulated || 'N/A';
  const vacantStatus = pozo?.vacant 
    ? '🔴 *VACANTE*' 
    : `🟢 *GANADOR/ES: ${pozo?.winnersNumber || 1}*`;

  return `📊 *RESULTADOS DEL ÚLTIMO SORTEO* 📊

📅 *Fecha:* ${fecha || 'N/A'}
🔄 *Sorteo N°:* ${sorteo || 'N/A'}

🔢 *Números Sorteados:* 
\`[ ${numbers || 'N/A'} ]\`

💰 *${jackpotName}* 💰
💵 *Monto Acumulado:* ${accumulated}
🏆 *Estado:* ${vacantStatus}`;
};
