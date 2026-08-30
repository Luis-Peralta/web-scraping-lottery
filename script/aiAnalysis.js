import { generatePrompt } from './services/geminiConnection.js';
import { prompts } from './utils/prompts.js';
import { getData } from './services/mongoConnection.js';
import { Type } from '@google/genai';

const lotteryAnalysisSchema = {
  type: Type.OBJECT,
  required: ['numerosFrecuentes', 'numerosMenosFrecuentes', 'jugadasSugeridas'],
  properties: {
    numerosFrecuentes: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER, minimum: 0, maximum: 100 },
    },
    numerosMenosFrecuentes: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER, minimum: 0, maximum: 100 },
    },
    jugadasSugeridas: {
      type: Type.ARRAY,
      minItems: '4',
      maxItems: '4',
      items: {
        type: Type.ARRAY,
        minItems: '5',
        maxItems: '5',
        items: { type: Type.INTEGER, minimum: 0, maximum: 100 },
      },
    },
  },
};

/** @param {unknown} value */
const sortedUniqueNumbers = (value) => Array.isArray(value)
  ? [...new Set(value.map(Number).filter(number => Number.isInteger(number) && number >= 0 && number <= 100))]
    .sort((a, b) => a - b)
  : [];

/**
 * Formats structured Gemini data into a deterministic Spanish message.
 * @param {any} analysis
 * @returns {string}
 */
export function formatAIAnalysis(analysis) {
  const frequent = sortedUniqueNumbers(analysis?.numerosFrecuentes);
  const lessFrequent = sortedUniqueNumbers(analysis?.numerosMenosFrecuentes);
  const plays = Array.isArray(analysis?.jugadasSugeridas)
    ? analysis.jugadasSugeridas.map(sortedUniqueNumbers).slice(0, 4)
    : [];

  if (plays.length !== 4 || plays.some(play => play.length !== 5)) {
    throw new Error('Gemini returned invalid suggested plays.');
  }

  const formattedPlays = plays
    .map((play, index) => `  - ❇️ Jugada ${index + 1}: [${play.join(', ')}]`)
    .join('\n');

  return `⭐ Números más frecuentes: [${frequent.join(', ')}]
📊 Números menos frecuentes: [${lessFrequent.join(', ')}]
🔢 Jugadas sugeridas:
Después de analizar los sorteos recientes, estas son las 4 jugadas con mayor probabilidad de salir:
${formattedPlays}`;
}

export async function aiAnalysis() {
  const dbData = await getData();
  const lastResults = dbData.map((item) => [item.results] );
  const prompt = prompts.promptLottery({ data: lastResults });
  const instruction = prompts.instruction2;
  /** @type {any} */
  let analysis;
  
  try {
    console.log('\x1b[36mGenerating AI analysis...\x1b[0m');
    analysis = await generatePrompt({ prompt, instruction, responseSchema: lotteryAnalysisSchema });
    const formattedAnalysis = formatAIAnalysis(JSON.parse(analysis.text));
    console.log('\x1b[32mAI analysis generated successfully!\x1b[0m');
    console.log('\x1b[33mAnalysis:\x1b[0m', formattedAnalysis);
    return formattedAnalysis;
  } catch (error) {
    console.error('Error generating prompt:', error);
    return;
  }
} 
