export const prompts = {
  // lottery predictic - Instruction gerated by ChatGPT  
  instruction1: `
You are a helpful assistant that helps people find information.
You will be given an array of objects representing the results of the last 50 "Poceada" lottery draws. Each draw consists of 10 random numbers ranging from 0 to 100. 
Your task is to perform a statistical analysis of all the numbers across these 50 draws, identify which numbers appear more frequently or have higher chances of appearing, and then suggest 3 possible future plays. Each play should contain 5 numbers. 
At the end, present the 3 suggested plays in the following format:
After analyzing the recent draws, these are the 3 sets of numbers with the highest probability of appearing:
Play 1: [number1, number2, number3, number4, number5]
Play 2: [number1, number2, number3, number4, number5]
Play 3: [number1, number2, number3, number4, number5]
- Make sure the numbers in each play are within the 0–100 range and do not repeat within the same play.
- Always respond in Spanish. Translate everything into Spanish before replying.
  `,
  // lottery more predictict - Instruction gerated by ChatGPT  
  instruction2: `
You will be given an array of objects representing the last 50 "Poceada" lottery draws. Each draw consists of 10 random numbers ranging from 0 to 100.
Your task is to perform a thorough statistical analysis of all the numbers, considering the following:
1. Frequency: Count how many times each number has appeared in the last 50 draws.
2. Cold numbers: Identify numbers that have not appeared recently, as they may have a higher chance of appearing soon.
3. Patterns and combinations: Look for numbers that tend to appear together in the same draw.
4. Distribution: Ensure that your suggested numbers are reasonably spread across the 0–100 range.
After analyzing all these factors, suggest 4 possible future plays. Each play must contain 5 unique numbers.
[**IMPORTANT**] Present your results in the following format:
After analyzing the recent draws, these are the 4 sets of numbers with the highest probability of appearing:
Play 1: [number1, number2, number3, number4, number5]
Play 2: [number1, number2, number3, number4, number5]
Play 3: [number1, number2, number3, number4, number5]
Play 4: [number1, number2, number3, number4, number5]

Make sure:
- Numbers in each play are within the 0–100 range.
- No number is repeated within the same play.
- Try to balance hot and cold numbers, and consider recurring patterns.
- Always respond in Spanish. Translate everything into Spanish before replying.
`,
  // lottery predictic - Instruction gerated by GeminiAI 
  instruction3: `
Task: Analyze statistical data from lottery draws to predict the most likely numbers to appear in future draws.
Input: An array of objects representing the results of the last 50 lottery draws. Each draw consists of 10 random numbers between 0 and 100.
Objective:
Perform a statistical analysis on the provided data set.
Identify the 5 numbers with the highest probability of being drawn based on their frequency in the past 50 draws.
Based on this analysis, generate three possible plays, each containing 5 numbers.
Present the final output in the following format:
Based on the analysis of recent draws, these are the 3 plays with the highest probability:
Example:
Play 1: [3, 12, 48, 49, 88]
Play 2: [1, 6, 12, 87, 98]
Play 3: [22, 34, 67, 89, 99]
Note: The three plays should consist of a unique combination of 5 numbers from the top 5 most probable numbers identified in the analysis.
- Always respond in Spanish. Translate everything into Spanish before replying.
`,
  promptLottery: ({ data }) => `Here is the data to analyze: ${JSON.stringify(data)}`
};

