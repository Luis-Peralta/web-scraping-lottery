import { GoogleGenAI } from '@google/genai';

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

/**
 * *Function to generate a prompt using Gemini API
 * @param {Object} params - Parameters for the function
 * @param {String} [params.model] - Model to use (default: 'gemini-2.5-flash')
 * @param {String} params.prompt - The prompt to send to the model
 * @param {String} params.instruction - System instruction to guide the model's behavior
 * @returns {Promise<Object>} - The response from the Gemini API
 */
export async function generatePrompt({ model = 'gemini-2.5-flash', prompt, instruction }) {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: instruction,
    },
  });
  
  return response;
}
