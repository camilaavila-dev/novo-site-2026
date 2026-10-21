/**
 * TIER 4 - REAL-WORLD APPLICATION SCENARIOS: JORNADA COMPLETA DE CONVERSÃO
 * 
 * Simula a jornada de ponta a ponta de um investidor High Net Worth (Empresário):
 * 1. Descoberta na Home (Proposta de valor, credenciais CEA, números Portfel)
 * 2. Simulação de Soberania Financeira e cálculo do Delta Fee-Based
 * 3. Diagnóstico Raio-X com Radar Pentagonal e identificação de gargalos
 * 4. Conversão final com agendamento estratégico pré-parametrizado
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const oracle = require('../helpers/math-oracle');

describe('Tier 4: Cenário de Aplicação Real 1 - Jornada Completa do Investidor de Elite', () => {

  test('T4-J1: Simulação completa da jornada: Descoberta -> Simulação -> Raio-X -> Conversão', () => {
    // ESTÁGIO 1: DESCOBERTA (Home)
    // Perfil do visitante: Empresário de 42 anos, patrimônio líquido de R$ 1.500.000, aporte de R$ 20.000/mês
    const p0 = 1500000;
    const pmt = 20000;
    const despesaMeta = 35000; // Deseja viver com R$ 35k/mês na soberania
    const swr = 0.035;

    // ESTÁGIO 2: LABORATÓRIO QUANTITATIVO (Simulador)
    const rNom = 0.115;
    const iInf = 0.045;
    const cTrad = 0.020;
    const cFee = 0.007;
    const months = 180; // Horizonte de 15 anos

    const sim = oracle.compareFeeDrag(p0, pmt, rNom, iInf, cTrad, cFee, months);
    // Validação do impacto no patrimônio do empresário
    assert.ok(sim.finalFee > sim.finalTrad, 'Patrimônio no modelo Fee-Based deve superar o tradicional');
    assert.ok(sim.feeDelta > 1000000, 'Delta gerado pela consultoria deve ultrapassar R$ 1 milhão para este perfil');
    assert.ok(sim.yearsOfFreedomGained >= 1.5, 'Ganho de liberdade deve representar mais de 1,5 anos de trabalho poupado em 15 anos');

    // Em 20 anos (240 meses), ganho de liberdade atinge 2,7 anos e delta > R$ 2,1M
    const sim20 = oracle.compareFeeDrag(p0, pmt, rNom, iInf, cTrad, cFee, 240);
    assert.ok(sim20.yearsOfFreedomGained >= 2.5, 'Em 20 anos, liberdade ganha supera 2,5 anos');
    assert.ok(sim20.feeDelta > 2000000, 'Em 20 anos, delta patrimonial supera R$ 2 milhões');

    // Cálculo do ano da soberania para capital meta de R$ 12M
    const rReal = oracle.calculateRealRate(rNom - cFee, iInf);
    const sov = oracle.calculateSovereignty(p0, pmt, rReal, despesaMeta, swr);
    assert.strictEqual(sov.targetCapital, 12000000, 'Capital soberano para R$ 35k/mês com SWR 3.5% é R$ 12M');
    assert.strictEqual(sov.sovereigntyYear, '18.1', 'Ano da soberania é calculado deterministicamente em 18.1 anos');

    // ESTÁGIO 3: DIAGNÓSTICO PATRIMONIAL (Raio-X)
    // O empresário responde ao quiz:
    // D1 (Offshore) = 0 (100% no Brasil)
    // D2 (Tributário) = 40 (isenções táticas básicas)
    // D3 (Sucessório) = 0 (inventário tradicional judicial)
    // D4 (Liquidez) = 10 (mais de 70% em imóveis e na empresa própria)
    // D5 (Fiduciário) = 30 (assessor comissionado de corretora)
    const d1 = 0, d2 = 40, d3 = 0, d4 = 10, d5 = 30;

    const { overallScore } = oracle.calculateRaioXScore(d1, d2, d3, d4, d5);
    assert.strictEqual(overallScore, 16, 'Score global de blindagem deve ser 16 (Patrimônio Vulnerável)');

    const arq = oracle.determineArchetype(d1, d2, d3, d4, d5);
    // Com D4=10 e D1=0, o arquétipo analítico é O Construtor Exposto
    assert.strictEqual(arq.id, 'construtor', 'Arquétipo identificado deve ser O Construtor Exposto');

    const bottlenecks = oracle.determineBottlenecks(d1, d2, d3, d4, d5);
    // Menores são D1 (0) e D3 (0)
    assert.ok(bottlenecks.some(b => b.key === 'D1'), 'D1 deve ser identificado como gargalo crítico');
    assert.ok(bottlenecks.some(b => b.key === 'D3'), 'D3 deve ser identificado como gargalo crítico');

    // ESTÁGIO 4: CONVERSÃO & AGENDAMENTO DA REUNIÃO
    const ctaPayload = {
      score: overallScore,
      arq: arq.id,
      gap1: bottlenecks[0].key,
      gap2: bottlenecks[1].key,
      p0,
      pmt
    };

    assert.strictEqual(ctaPayload.score, 16);
    assert.strictEqual(ctaPayload.arq, 'construtor');
    assert.ok(ctaPayload.p0 >= 1000000, 'Patrimônio de alta renda qualifica o lead como Private Wealth');
  });
});
