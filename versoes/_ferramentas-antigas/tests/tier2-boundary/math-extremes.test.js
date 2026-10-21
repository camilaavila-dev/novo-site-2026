/**
 * TIER 2 - BOUNDARY & CORNER CASES: LIMITES MATEMÁTICOS & FINANCEIROS EXTREMOS
 * 
 * Testa a robustez do motor de cálculo em cenários de estresse numérico:
 * - P0 = 0 (investidor iniciando do zero sem capital inicial)
 * - PMT = 0 (investidor vivendo de renda / sem novos aportes)
 * - Capital ultra-elevado (P0 = R$ 50M, PMT = R$ 200k/mês) sem overflow numérico
 * - Inflação extrema superior à rentabilidade nominal (taxa real negativa)
 * - Cenário onde o crossover de soberania não é atingido no prazo estipulado
 * - Limites de SWR (2,5% a 5,0%)
 * - Pontuações extremas do Raio-X (todos zeros, todos 100, assimetrias polares)
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const oracle = require('../helpers/math-oracle');

describe('Tier 2: Limites Matemáticos & Financeiros Extremos', () => {

  test('T2-M1: P0 = 0 (Investidor iniciando do zero absoluto com aportes mensais)', () => {
    const p0 = 0;
    const pmt = 5000;
    const rReal = oracle.calculateRealRate(0.115, 0.045);
    const months = 120; // 10 anos

    const result = oracle.calculateAccumulation(p0, pmt, rReal, months);
    assert.strictEqual(result.timeline[0].balance, 0, 'Saldo no mês 0 deve ser exatamente 0');
    assert.ok(result.finalBalance > pmt * months, 'Com juros compostos, saldo final deve superar os aportes brutos');
    assert.ok(!isNaN(result.finalBalance), 'Saldo não deve ser NaN');
    assert.ok(isFinite(result.finalBalance), 'Saldo deve ser finito');
  });

  test('T2-M2: PMT = 0 (Patrimônio estático sem novos aportes, apenas capitalização composta)', () => {
    const p0 = 1000000;
    const pmt = 0;
    const rReal = oracle.calculateRealRate(0.10, 0.04);
    const months = 60; // 5 anos

    const result = oracle.calculateAccumulation(p0, pmt, rReal, months);
    assert.strictEqual(result.totalInvested, p0, 'Total investido deve permanecer igual a P0');
    assert.ok(result.finalBalance > p0, 'Capital deve crescer exclusivamente pelos juros reais');
    // Saldo analítico esperado: P0 * (1 + rm)^60 = P0 * (1 + rReal)^5
    const expected = p0 * Math.pow(1 + rReal, 5);
    assert.ok(
      Math.abs(result.finalBalance - expected) <= 10,
      `Saldo acumulado (${result.finalBalance}) deve coincidir com juros compostos analíticos (${Math.round(expected)})`
    );
  });

  test('T2-M3: Capital Ultra-High-Net-Worth (P0 = R$ 50M, PMT = R$ 200k/mês) sem perda de precisão', () => {
    const p0 = 50000000;
    const pmt = 200000;
    const rReal = oracle.calculateRealRate(0.12, 0.04);
    const months = 240; // 20 anos

    const result = oracle.calculateAccumulation(p0, pmt, rReal, months);
    assert.ok(result.finalBalance > 100000000, 'Saldo final deve ultrapassar R$ 100 milhões');
    assert.ok(Number.isSafeInteger(result.finalBalance), 'Resultado deve se manter dentro de inteiros seguros do JS');
  });

  test('T2-M4: Inflação extrema superior à taxa nominal (Taxa Real Negativa)', () => {
    // Cenário de estagflação: Selic em 6%, IPCA em 9% -> rReal negativo
    const rNom = 0.06;
    const iInf = 0.09;
    const rReal = oracle.calculateRealRate(rNom, iInf);

    assert.ok(rReal < 0, 'Taxa real de Fisher deve ser estritamente negativa');
    assert.ok(
      Math.abs(rReal - ((1.06 / 1.09) - 1)) < 1e-9,
      'Cálculo de Fisher deve ser matematicamente consistente mesmo no território negativo'
    );

    // Acumulação com taxa real negativa e PMT = 0 deve corroer o poder de compra real
    const acc = oracle.calculateAccumulation(1000000, 0, rReal, 120);
    assert.ok(acc.finalBalance < 1000000, 'Poder de compra real deve diminuir ao longo do tempo');
  });

  test('T2-M5: Meta inalcançável no horizonte (P(N) < P_soberania) - Retorno seguro sem quebra', () => {
    // Despesa meta altíssima de R$ 100k/mês com aporte irrisório de R$ 100/mês e P0=0
    const despesaMeta = 100000;
    const rReal = oracle.calculateRealRate(0.08, 0.04);
    const sov = oracle.calculateSovereignty(0, 100, rReal, despesaMeta, 0.035, 120);

    assert.strictEqual(
      sov.sovereigntyMonth,
      null,
      'Quando o capital não atinge a meta no prazo limite, sovereigntyMonth deve ser null (e não quebrar)'
    );
    assert.strictEqual(
      sov.sovereigntyYear,
      null,
      'sovereigntyYear deve ser null'
    );
  });

  test('T2-M6: Variação da Taxa Segura de Retirada (SWR de 2,5% a 5,0%)', () => {
    const despesa = 20000;
    // SWR conservador de 2.5% exige patrimônio maior: (20k*12)/0.025 = R$ 9.600.000
    const sovCons = oracle.calculateSovereignty(0, 5000, 0.06, despesa, 0.025);
    // SWR agressivo de 5.0% exige patrimônio menor: (20k*12)/0.05 = R$ 4.800.000
    const sovAgr = oracle.calculateSovereignty(0, 5000, 0.06, despesa, 0.05);

    assert.strictEqual(sovCons.targetCapital, 9600000, 'SWR 2.5% deve exigir R$ 9,6M');
    assert.strictEqual(sovAgr.targetCapital, 4800000, 'SWR 5.0% deve exigir R$ 4,8M');
    assert.ok(
      sovCons.targetCapital > sovAgr.targetCapital,
      'SWR mais conservador deve demandar capital de soberania estritamente maior'
    );
  });

  test('T2-M7: Casos Polares do Diagnóstico Raio-X (Scores 0, Scores 100 e Assimetria Crítica)', () => {
    // Caso 1: Todos scores em 0
    const zeroScore = oracle.calculateRaioXScore(0, 0, 0, 0, 0);
    assert.strictEqual(zeroScore.overallScore, 0, 'Score de todas dimensões em 0 deve ser 0');
    const zeroPoints = oracle.generateRadarPoints(0, 0, 0, 0, 0);
    zeroPoints.forEach(p => {
      assert.strictEqual(p.x, 200, 'Vértice 0 deve colapsar no centro');
      assert.strictEqual(p.y, 200, 'Vértice 0 deve colapsar no centro');
    });

    // Caso 2: Todos scores em 100
    const maxScore = oracle.calculateRaioXScore(100, 100, 100, 100, 100);
    assert.strictEqual(maxScore.overallScore, 100, 'Score de todas dimensões em 100 deve ser 100');
    const arqMax = oracle.determineArchetype(100, 100, 100, 100, 100);
    assert.strictEqual(arqMax.id, 'soberano', 'Todos 100 deve mapear para Soberano Blindado');

    // Caso 3: Empate nos 2 menores gargalos
    const gaps = oracle.determineBottlenecks(50, 50, 50, 50, 50);
    assert.strictEqual(gaps.length, 2, 'Mesmo com pontuações idênticas, retorna exatamente 2 gargalos');
  });
});
