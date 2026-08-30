import { GoogleGenAI } from '@google/genai';
import config from '../../config.js';

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

/**
 * *Function to generate a prompt using Gemini API
 * @param {Object} params - Parameters for the function
 * @param {String} [params.model] - Model to use (default: 'gemini-2.5-flash')
 * @param {String} params.prompt - The prompt to send to the model
 * @param {String} params.instruction - System instruction to guide the model's behavior
 * @param {Object} [params.responseSchema] - Optional schema for a structured JSON response
 * @returns {Promise<Object>} - The response from the Gemini API
 */
export async function generatePrompt({ model = 'gemini-2.5-flash', prompt, instruction, responseSchema }) {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: instruction,
      ...(responseSchema && {
        responseMimeType: 'application/json',
        responseSchema,
      }),
    },
  });
  
  return response;
}
