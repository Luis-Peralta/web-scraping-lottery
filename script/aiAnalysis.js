import { generatePrompt } from './services/geminiConnection.js';
import { prompts } from './utils/prompts.js';
import { getData } from './services/mongoConnection.js';

export async function aiAnalysis() {
  const dbData = await getData();
  const lastResults = dbData.map((item) => [item.results] );
  let prompt = prompts.promptLottery({ data: lastResults });
  let instruction = prompts.lotteryMorePredictic;
  let analysis = '';
  
  try {
    console.log('\x1b[36mGenerating AI analysis...\x1b[0m');
    analysis = await generatePrompt({ prompt, instruction });
    console.log('\x1b[32mAI analysis generated successfully!\x1b[0m');
    console.log('\x1b[33mAnalysis:\x1b[0m', analysis.text);
    return analysis.text;
  } catch (error) {
    console.error('Error generating prompt:', error);
    return;
  }
} 
