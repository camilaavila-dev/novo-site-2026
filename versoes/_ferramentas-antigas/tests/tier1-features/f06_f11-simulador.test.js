/**
 * TIER 1 - FEATURES F06 a F11: LABORATÓRIO DE CALCULADORAS & SIMULADOR DE LIBERDADE
 * 
 * Valida a exatidão matemática determinística das equações financeiras:
 * - F06: Equação de Fisher e Safe Withdrawal Rate (SWR 3,5%)
 * - F07: Ponto de Crossover do Ano da Soberania Financeira
 * - F08: Modelagem do Fee Drag (Tradicional 2,0% vs Fee-Based 0,7%)
 * - F09: Métrica de Anos de Liberdade Ganhos
 * - F10: Sliders táteis com formatação JetBrains Mono
 * - F11: Elemento visual do Gráfico de Acumulação (Canvas ou SVG)
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { fileExists, readFile, getMode } = require('../helpers/env');
const oracle = require('../helpers/math-oracle');
const { runScriptInBrowser } = require('../helpers/mock-browser');

describe('Tier 1: F06 a F11 - Simulador de Liberdade Financeira & Engenharia Patrimonial', () => {
  const simuladorHtmlExists = fileExists('simulador.html');
  const simuladorJsExists = fileExists('js/simulador-core.js');

  test('F06-1: Validação analítica exata da Equação de Fisher (Oracle vs Spec)', () => {
    // Parâmetros padrão: rNom = 11.5% a.a., iInf = 4.5% a.a.
    const rReal = oracle.calculateRealRate(0.115, 0.045);
    const expected = (1.115 / 1.045) - 1; // ~0.0669856...

    assert.ok(
      Math.abs(rReal - expected) < 1e-9,
      `Taxa real deve ser exatamente Fisher: calculado ${rReal}, esperado ${expected}`
    );
    assert.strictEqual(
      (rReal * 100).toFixed(4),
      '6.6986',
      'Taxa real percentual formatada em 4 casas decimais deve ser 6.6986%'
    );
  });

  test('F06-2: Cálculo da taxa mensal equivalente por juros compostos', () => {
    const rReal = oracle.calculateRealRate(0.115, 0.045);
    const rm = oracle.calculateMonthlyRate(rReal);
    // (1 + rm)^12 deve recompor exatamente (1 + rReal)
    const recomposed = Math.pow(1 + rm, 12) - 1;
    assert.ok(
      Math.abs(recomposed - rReal) < 1e-9,
      'Capitalização de rm em 12 meses deve recompor a taxa real anual'
    );
  });

  test('F07-1: Crossover Point do Ano da Soberania Financeira via SWR (3,5%)', () => {
    // Despesa meta: R$ 25.000/mês. SWR = 3,5% a.a.
    // Patrimônio Soberano: (25.000 * 12) / 0.035 = R$ 8.571.428,57
    const despesaMeta = 25000;
    const swr = 0.035;
    const rReal = oracle.calculateRealRate(0.115, 0.045);

    const sov = oracle.calculateSovereignty(500000, 10000, rReal, despesaMeta, swr);
    assert.strictEqual(
      sov.targetCapital,
      8571429,
      'Patrimônio necessário para soberania com D=25k e SWR=3.5% deve ser R$ 8.571.429'
    );
    assert.ok(
      sov.sovereigntyMonth > 0,
      'Mês da soberania deve ser um valor positivo'
    );
  });

  test('F08-1: Modelagem determinística do Fee Drag (Diferencial Fee-Based vs Tradicional)', () => {
    // P0 = 500k, PMT = 10k, 15 anos (180 meses), rNom = 11.5%, iInf = 4.5%
    // Tradicional cTrad = 2.0% -> rNet = 9.5%
    // Fee-Based cFee = 0.7% -> rNet = 10.8%
    const drag = oracle.compareFeeDrag(500000, 10000, 0.115, 0.045, 0.020, 0.007, 180);

    // Valores canônicos estipulados no Survey 2:
    // Final Fee-Based: R$ 4.078.918 (+/- 50)
    // Final Tradicional: R$ 3.611.208 (+/- 50)
    // Delta Ganho: R$ 467.710 (+/- 100)
    assert.ok(
      Math.abs(drag.finalFee - 4078918) <= 50,
      `Patrimônio Fee-Based 15a deve ser ~4.078.918, obtido: ${drag.finalFee}`
    );
    assert.ok(
      Math.abs(drag.finalTrad - 3611208) <= 50,
      `Patrimônio Tradicional 15a deve ser ~3.611.208, obtido: ${drag.finalTrad}`
    );
    assert.ok(
      Math.abs(drag.feeDelta - 467710) <= 100,
      `Delta líquido a favor do cliente deve ser ~467.710, obtido: ${drag.feeDelta}`
    );
  });

  test('F09-1: Conversão da vantagem patrimonial em "Anos de Liberdade Ganhos"', () => {
    const drag = oracle.compareFeeDrag(500000, 10000, 0.115, 0.045, 0.020, 0.007, 180);
    assert.ok(
      drag.yearsOfFreedomGained > 0,
      'Anos de liberdade ganhos deve ser um valor estritamente positivo'
    );
    assert.ok(
      drag.yearsOfFreedomGained >= 1.0 && drag.yearsOfFreedomGained <= 5.0,
      `Anos de liberdade (${drag.yearsOfFreedomGained}) deve estar na faixa razoável esperada de 1 a 5 anos`
    );
  });

  test('F10-1 e F11-1: Interface Contract window.OutlierSimulador & Estrutura HTML (Marco M2)', (t) => {
    if (!simuladorJsExists || !simuladorHtmlExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M2 pendente: simulador.html / js/simulador-core.js ainda não criado pelo Worker M2');
        return;
      }
      assert.fail('simulador.html e js/simulador-core.js são obrigatórios no modo estrito');
    }

    const simHtml = readFile('simulador.html');
    const simJs = readFile('js/simulador-core.js');

    // Validação de sliders e display monospace
    assert.match(simHtml, /<input[^>]*type=["']range["']/i, 'simulador.html deve conter sliders (input type=range)');
    assert.match(simHtml, /font-family:[^;]*JetBrains Mono|var\(--m\)/i, 'Displays numéricos devem usar JetBrains Mono');

    // Validação de elemento gráfico (Canvas ou SVG)
    assert.match(simHtml, /<canvas|<svg/i, 'simulador.html deve conter canvas ou svg para renderização viva');

    // Validação da API do módulo client-side
    const ctx = runScriptInBrowser(simJs, 'simulador-core.js');
    const api = ctx.window.OutlierSimulador;
    assert.ok(api, 'js/simulador-core.js deve expor window.OutlierSimulador');
    assert.strictEqual(typeof api.calculateRealReturn, 'function', 'Deve implementar calculateRealReturn');
    assert.strictEqual(typeof api.calculateAccumulation, 'function', 'Deve implementar calculateAccumulation');
    assert.strictEqual(typeof api.compareFeeDrag, 'function', 'Deve implementar compareFeeDrag');
  });
});
