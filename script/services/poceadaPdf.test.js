import test from 'node:test';
import assert from 'node:assert/strict';
import { extractEstimatedJackpot } from './poceadaPdf.js';

test('extracts an Argentine-formatted estimated jackpot', () => {
  const text = 'POZO ESTIMADO PRÓXIMO SORTEO: $ 165.448.294,81';
  assert.equal(extractEstimatedJackpot(text), '165.448.294,81');
});

test('supports text extracted with spaces between letters', () => {
  const text = 'P O Z O  E S T I M A D O  P R O X I M O  S O R T E O: $ 9.876.543,21';
  assert.equal(extractEstimatedJackpot(text), '9.876.543,21');
});

test('returns null for missing or malformed values', () => {
  assert.equal(extractEstimatedJackpot('No hay pozo estimado'), null);
  assert.equal(extractEstimatedJackpot('POZO ESTIMADO PRÓXIMO SORTEO: $ desconocido'), null);
});
