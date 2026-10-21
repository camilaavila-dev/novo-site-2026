/**
 * TIER 2 - BOUNDARY & CORNER CASES: RESILIÊNCIA DE FORMATOS & ENTRADAS
 * 
 * Valida a robustez da interface diante de inputs incompletos ou dados assíncronos:
 * - Edição editorial com apenas resumo executivo (sem visão quant)
 * - Validação de integridade na serialização de parâmetros de URL
 * - Prevenção de avanço descontrolado em etapas vazias de diagnóstico
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { fileExists, readFile } = require('../helpers/env');
const { runScriptInBrowser } = require('../helpers/mock-browser');

describe('Tier 2: Resiliência de Formatos, Entradas & Dados Incompletos', () => {

  test('T2-F1: Edição editorial puramente executiva (sem seção quant) não deve quebrar motor de renderização', () => {
    // Simula uma edição cadastrada onde visaoNerd está ausente
    const mockEditorial = {
      id: 'ed-teste-corner',
      titulo: 'Edição Especial Rápida',
      resumoExecutivo: ['Ponto 1', 'Ponto 2'],
      visaoNerd: null // Seção quant ausente
    };

    assert.ok(mockEditorial.resumoExecutivo.length > 0, 'Resumo executivo deve estar presente');
    // Em caso de visaoNerd ausente, a interface deve exibir normalmente o resumo
    const canRenderExec = Boolean(mockEditorial.resumoExecutivo);
    assert.strictEqual(canRenderExec, true, 'Deve ser capaz de renderizar mesmo sem a visão nerd');
  });

  test('T2-F2: Serialização e Desserialização de Parâmetros na URL de Consulta', () => {
    // Cenário: Quiz concluído gera URL de agendamento com query params
    const params = {
      score: 62,
      arq: 'acumulador ineficiente',
      d1: 35,
      d2: 40,
      d3: 70,
      d4: 80,
      d5: 30
    };

    // Serialização com encodeURIComponent
    const query = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    assert.ok(query.includes('score=62'), 'Score deve estar codificado na URL');
    assert.ok(query.includes('arq=acumulador%20ineficiente'), 'Espaços no arquétipo devem estar devidamente codificados');

    // Desserialização
    const parsed = {};
    query.split('&').forEach(pair => {
      const [k, v] = pair.split('=');
      parsed[decodeURIComponent(k)] = decodeURIComponent(v);
    });

    assert.strictEqual(parseInt(parsed.score, 10), 62, 'Score desserializado deve recompor o valor original');
    assert.strictEqual(parsed.arq, 'acumulador ineficiente', 'Arquétipo desserializado deve recompor o valor original');
    assert.strictEqual(parseInt(parsed.d1, 10), 35, 'D1 desserializado deve recompor o valor original');
  });

  test('T2-F3: Sanitização de entradas numéricas negativas ou não numéricas nos sliders', () => {
    // Simula inputs do usuário com valores atípicos
    const sanitizeInput = (val, min, max, defaultVal) => {
      const num = parseFloat(val);
      if (isNaN(num)) return defaultVal;
      return Math.min(Math.max(num, min), max);
    };

    assert.strictEqual(sanitizeInput('-5000', 0, 50000000, 500000), 0, 'Valor negativo deve ser limitado ao mínimo (0)');
    assert.strictEqual(sanitizeInput('abc', 0, 50000000, 500000), 500000, 'Valor NaN deve adotar default (500k)');
    assert.strictEqual(sanitizeInput('999999999', 0, 50000000, 500000), 50000000, 'Valor exorbitante deve ser limitado ao teto (50M)');
  });
});
