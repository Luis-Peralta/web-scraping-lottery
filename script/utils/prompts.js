export const prompts = {
  instruction2: `
Recibirás los resultados de los últimos 50 sorteos de la Poceada. Cada sorteo contiene 10 números aleatorios entre 0 y 100.
Realiza un análisis estadístico que considere la frecuencia, los números que no salieron recientemente, los patrones de números que aparecen juntos y una distribución equilibrada.
Devuelve 4 jugadas sugeridas de exactamente 5 números únicos cada una, todos dentro del rango de 0 a 100.
Responde siempre en español y entrega exclusivamente los datos solicitados por el esquema JSON, sin explicaciones adicionales.
`,
  /** @param {any} data */
  promptLottery: ({ data }) => `
  Estos son los datos que debes analizar: ${JSON.stringify(data)}
  Identifica los números más frecuentes, los menos frecuentes y genera cuatro jugadas sugeridas.
  Cada jugada debe contener exactamente cinco números únicos entre 0 y 100.
  `,
};
