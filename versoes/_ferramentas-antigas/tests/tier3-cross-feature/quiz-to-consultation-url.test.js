/**
 * TIER 3 - CROSS-FEATURE COMBINATIONS: INTEGRAÇÃO QUIZ -> CTA DE CONSULTA
 * 
 * Valida a cadeia de integração completa entre o diagnóstico interativo,
 * a classificação de arquétipos, a identificação de gargalos e a geração
 * da URL de agendamento pré-parametrizada para a reunião com Leonardo.
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const oracle = require('../helpers/math-oracle');

describe('Tier 3: Cross-Feature - Quiz Raio-X -> URL de Consulta Estratégica', () => {

  test('T3-Q1: Cadeia completa de respostas -> Score -> Arquétipo -> Gargalos -> URL', () => {
    // Cenário: Usuário seleciona opções resultando em:
    // D1 (Offshore) = 35 (sintética local)
    // D2 (Tributário) = 40 (isenções táticas)
    // D3 (Sucessório) = 70 (previdência)
    // D4 (Liquidez) = 80 (reserva de conforto)
    // D5 (Fiduciário) = 30 (assessor comissionado)
    const { overallScore } = oracle.calculateRaioXScore(35, 40, 70, 80, 30);
    assert.strictEqual(overallScore, 51);

    const archetype = oracle.determineArchetype(35, 40, 70, 80, 30);
    // D5=30 <= 35 e D2=40 <= 50 -> Deve ser Acumulador Ineficiente
    assert.strictEqual(archetype.id, 'acumulador');

    const bottlenecks = oracle.determineBottlenecks(35, 40, 70, 80, 30);
    // Menores são D5 (30) e D1 (35)
    assert.strictEqual(bottlenecks[0].key, 'D5');
    assert.strictEqual(bottlenecks[1].key, 'D1');

    // Construção da URL de consulta pré-preenchida
    const baseUrl = 'https://leonardoarruda.com.br/#contato';
    const params = new URLSearchParams({
      score: overallScore,
      arq: archetype.id,
      gap1: bottlenecks[0].key,
      gap2: bottlenecks[1].key,
      d1: 35,
      d2: 40,
      d3: 70,
      d4: 80,
      d5: 30
    });

    const fullUrl = `${baseUrl}?${params.toString()}`;
    assert.ok(fullUrl.includes('score=51'), 'URL gerada deve conter score=51');
    assert.ok(fullUrl.includes('arq=acumulador'), 'URL gerada deve conter arq=acumulador');
    assert.ok(fullUrl.includes('gap1=D5'), 'URL deve indicar gargalo fiduciário primário');
    assert.ok(fullUrl.includes('gap2=D1'), 'URL deve indicar gargalo offshore secundário');
  });

  test('T3-Q2: Recuperação de estado e pré-alimentação a partir da Query String', () => {
    // Simula a recepção da URL pelo formulário da Home ou modal
    const simulatedUrl = 'https://leonardoarruda.com.br/#contato?score=88&arq=soberano&d1=90&d2=85&d3=95&d4=80&d5=90';
    
    // Suporta query string tanto antes do hash quanto após o hash (estilo SPA)
    const queryPart = simulatedUrl.includes('?') ? simulatedUrl.substring(simulatedUrl.indexOf('?') + 1) : '';
    const params = new URLSearchParams(queryPart);

    const restoredScore = parseInt(params.get('score'), 10);
    const restoredArq = params.get('arq');
    const d1 = parseInt(params.get('d1'), 10);
    const d5 = parseInt(params.get('d5'), 10);

    assert.strictEqual(restoredScore, 88, 'Score recuperado com integridade');
    assert.strictEqual(restoredArq, 'soberano', 'Arquétipo recuperado com integridade');
    assert.strictEqual(d1, 90, 'Dimensão D1 recuperada com integridade');
    assert.strictEqual(d5, 90, 'Dimensão D5 recuperada com integridade');

    // Revalidação do arquétipo a partir dos dados recuperados
    const recheckedArq = oracle.determineArchetype(
      parseInt(params.get('d1'), 10),
      parseInt(params.get('d2'), 10),
      parseInt(params.get('d3'), 10),
      parseInt(params.get('d4'), 10),
      parseInt(params.get('d5'), 10)
    );
    assert.strictEqual(recheckedArq.id, 'soberano', 'Recomposição do arquétipo coincide deterministicamente');
  });
});
