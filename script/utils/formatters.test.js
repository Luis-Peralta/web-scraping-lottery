import test from 'node:test';
import assert from 'node:assert/strict';
import { formatAIAnalysis } from '../aiAnalysis.js';
import { formatLotteryResult } from './lotteryFormatter.js';

test('formats Gemini output in Spanish and sorts every play', () => {
  const message = formatAIAnalysis({
    numerosFrecuentes: [90, 3, 42],
    numerosMenosFrecuentes: [77, 1, 18],
    jugadasSugeridas: [
      [50, 2, 31, 18, 9],
      [99, 4, 40, 12, 75],
      [60, 10, 30, 20, 40],
      [88, 6, 70, 15, 44],
    ],
  });

  assert.match(message, /Números más frecuentes/);
  assert.match(message, /Jugada 1: \[2, 9, 18, 31, 50\]/);
  assert.doesNotMatch(message, /Play|Most Frequent|Suggested/);
});

test('sorts drawn numbers and includes the estimated next jackpot', () => {
  const message = formatLotteryResult([{
    sorteo: 24,
    fecha: '27/08/26',
    results: {
      'number-1': 84,
      'number-2': 11,
      'number-3': 50,
    },
    pozo: {
      jackpot: 'Pozo 5 Aciertos',
      totalAccumulated: '$169.403.227,43',
      estimatedNextDraw: '279.586.648,99',
      vacant: true,
    },
  }]);

  assert.match(message, /\[ 11 - 50 - 84 \]/);
  assert.match(message, /Pozo estimado próximo sorteo:\* \$279\.586\.648,99/);
  assert.doesNotMatch(message, /Monto Acumulado/);
});
