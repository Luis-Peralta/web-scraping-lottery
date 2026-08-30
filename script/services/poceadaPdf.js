import { PDFParse } from 'pdf-parse';

const estimatedJackpotPattern = /P\s*O\s*Z\s*O\s+E\s*S\s*T\s*I\s*M\s*A\s*D\s*O\s+P\s*R\s*[ÓO]\s*X\s*I\s*M\s*O\s+S\s*O\s*R\s*T\s*E\s*O\s*:\s*\$\s*((?:\d{1,3}(?:\.\d{3})+|\d+),\d{2})/iu;

/**
 * Extracts the estimated jackpot for the next draw from Poceada PDF text.
 *
 * @param {string} text
 * @returns {string | null}
 */
export function extractEstimatedJackpot(text) {
  if (typeof text !== 'string') {
    return null;
  }

  return text.match(estimatedJackpotPattern)?.[1] ?? null;
}

/**
 * Downloads a Poceada results PDF and extracts its estimated next jackpot.
 *
 * @param {string} pdfUrl
 * @returns {Promise<string | null>}
 */
export async function extractEstimatedJackpotFromPdf(pdfUrl) {
  const parser = new PDFParse({ url: pdfUrl });

  try {
    const result = await parser.getText();
    return extractEstimatedJackpot(result.text);
  } finally {
    await parser.destroy();
  }
}
