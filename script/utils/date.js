const dateNow = new Date();
/**
 * Get the current date in Argentina timezone
 * @type {Intl.DateTimeFormatOptions}
 */
const opts = {
  timeZone: 'America/Argentina/Buenos_Aires',
  weekday: 'short',
};

const days = ['Thu', 'Sun', 'Tue'];

/**
 * Check if today is a lottery day (Thursday, Sunday, or Tuesday)
 * @returns {boolean} True if today is a lottery day, false otherwise
 */
export function isLotteryDay() {
  const day = dateNow.toLocaleDateString('en-US', opts);
  return days.includes(day);
};
