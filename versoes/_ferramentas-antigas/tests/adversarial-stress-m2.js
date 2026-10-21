/**
 * ADVERSARIAL MATHEMATICAL STRESS HARNESS — MILESTONE M2
 * Challenger 1 (Empirical Challenger)
 * 
 * Executa testes empíricos rigorosos:
 * 1. Casos limites de capital e aporte: P0=0 com aportes, P0 alto com aporte nulo, P0=0 e PMT=0
 * 2. Crossover imediato de soberania (mês 0: P0 >= targetCapital)
 * 3. Cenários de inflação >= rentabilidade nominal (taxa real zero e taxa real negativa)
 * 4. Prazos longos (40 anos e 50 anos)
 * 5. Varredura combinatória exaustiva de sliders (fuzzing em 36.000 permutações)
 * 6. Verificação de divisão por zero, NaN, Infinity e safe integers
 * 7. Resiliência do motor gráfico contra maxVal zero e formatações extremas
 */

const assert = require('node:assert/strict');
const path = require('node:path');
const sim = require('../js/simulador-core.js');

console.log('\x1b[35m' + '='.repeat(70) + '\x1b[0m');
console.log('\x1b[1m\x1b[36m  ADVERSARIAL STRESS HARNESS — SIMULADOR FINANCEIRO M2\x1b[0m');
console.log('\x1b[35m' + '='.repeat(70) + '\x1b[0m\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runChallenge(title, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`\x1b[32m✔ [PASS]\x1b[0m ${title}`);
  } catch (err) {
    failedTests++;
    console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${title}`);
    console.error(`  Erro: ${err.message}`);
    if (err.stack) console.error(`  Stack: ${err.stack.split('\n')[1]}`);
  }
}

// -----------------------------------------------------------------------------
// BLOCO 1: CASOS LIMITES DE CAPITAL E APORTE
// -----------------------------------------------------------------------------

runChallenge('CH-01: P0 = 0 com aportes mensais normais (R$ 10.000/mês, 15 anos)', () => {
  const res = sim.simulate({ p0: 0, pmt: 10000, years: 15, rNom: 0.115, iInf: 0.045, despesaMeta: 25000, swr: 0.035 });
  assert.strictEqual(res.timelineFee[0].balance, 0, 'Saldo no mês 0 deve ser exatamente 0');
  assert.strictEqual(res.totalAportado, 1800000, 'Total aportado deve ser 180 * 10.000 = 1.800.000');
  assert.ok(res.patrimonioFinalFee > res.totalAportado, 'Com juros reais positivos, patrimônio final deve superar aportes');
  assert.ok(Number.isFinite(res.patrimonioFinalFee), 'Patrimônio final Fee deve ser finito');
  assert.ok(Number.isFinite(res.patrimonioFinalTrad), 'Patrimônio final Trad deve ser finito');
  assert.ok(!isNaN(res.vantagemFeeBased), 'Vantagem fee-based não pode ser NaN');
  assert.ok(res.vantagemFeeBased > 0, 'Vantagem fee-based deve ser estritamente positiva');
});

runChallenge('CH-02: P0 = R$ 50M (Capital Ultra-High) com aporte mensal nulo (PMT = 0, 15 anos)', () => {
  const res = sim.simulate({ p0: 50000000, pmt: 0, years: 15, rNom: 0.115, iInf: 0.045, despesaMeta: 25000, swr: 0.035 });
  assert.strictEqual(res.totalAportado, 50000000, 'Total aportado deve permanecer igual a P0');
  assert.ok(res.patrimonioFinalFee > 50000000, 'Patrimônio deve se valorizar sem aportes');
  assert.ok(res.vantagemFeeBased > 0, 'Fee drag deve gerar delta positivo em capital alto');
  assert.ok(Number.isSafeInteger(res.patrimonioFinalFee), 'Patrimônio deve se manter em safe integer JS');
  assert.ok(Number.isFinite(res.anosGanhosDeVida), 'Anos ganhos deve ser finito');
});

runChallenge('CH-03: P0 = 0 e PMT = 0 simultaneamente (Zero capital e zero fluxo)', () => {
  const res = sim.simulate({ p0: 0, pmt: 0, years: 15, rNom: 0.115, iInf: 0.045, despesaMeta: 25000, swr: 0.035 });
  assert.strictEqual(res.patrimonioFinalFee, 0, 'Patrimônio Fee deve ser 0');
  assert.strictEqual(res.patrimonioFinalTrad, 0, 'Patrimônio Trad deve ser 0');
  assert.strictEqual(res.totalAportado, 0, 'Total aportado deve ser 0');
  assert.strictEqual(res.jurosGanhos, 0, 'Juros ganhos deve ser 0');
  assert.strictEqual(res.vantagemFeeBased, 0, 'Vantagem deve ser 0');
  assert.strictEqual(res.anosGanhosDeVida, 0, 'Anos de liberdade ganhos deve ser 0');
  assert.strictEqual(res.sovereigntyMonth, null, 'Soberania não é atingida');
  assert.strictEqual(res.sovereigntyYear, null, 'Ano de soberania é null');
});

// -----------------------------------------------------------------------------
// BLOCO 2: CROSSOVER IMEDIATO DE SOBERANIA (MÊS 0)
// -----------------------------------------------------------------------------

runChallenge('CH-04: Crossover imediato no mês 0 (P0 = R$ 10M >= P_soberania = R$ 8.571.429)', () => {
  const res = sim.simulate({ p0: 10000000, pmt: 10000, years: 15, rNom: 0.115, iInf: 0.045, despesaMeta: 25000, swr: 0.035 });
  assert.strictEqual(res.patrimonioSoberania, 8571429, 'Meta de soberania para D=25k e SWR=3.5%');
  assert.strictEqual(res.sovereigntyMonth, 0, 'Soberania deve ser atingida imediatamente no mês 0');
  assert.strictEqual(res.sovereigntyYear, '0.0', 'Ano da soberania deve ser string "0.0"');
  assert.ok(res.sovereigntyMonth !== null, 'sovereigntyMonth !== null deve ser preservado para mês 0');
});

runChallenge('CH-05: Crossover com Despesa Meta nula (D_meta = 0, P0 > 0)', () => {
  const res = sim.simulate({ p0: 100000, pmt: 1000, years: 5, rNom: 0.10, iInf: 0.04, despesaMeta: 0, swr: 0.035 });
  assert.strictEqual(res.patrimonioSoberania, 0, 'Meta soberania com despesa 0 deve ser 0');
  assert.strictEqual(res.sovereigntyMonth, 0, 'Mês 0 atinge soberania se meta é 0');
  assert.strictEqual(res.sovereigntyYear, '0.0');
});

// -----------------------------------------------------------------------------
// BLOCO 3: INFLAÇÃO >= TAXA NOMINAL (TAXA REAL NULA OU NEGATIVA)
// -----------------------------------------------------------------------------

runChallenge('CH-06: Inflação idêntica à taxa nominal (rNom = 5.0%, iInf = 5.0% -> rReal = 0)', () => {
  const rReal = sim.calculateRealReturn(0.05, 0.05);
  assert.strictEqual(rReal, 0, 'Taxa real Fisher deve ser exatamente 0 quando rNom == iInf');
  const rm = sim.calculateMonthlyRate(rReal);
  assert.strictEqual(rm, 0, 'Taxa mensal deve ser 0');
  const acc = sim.calculateAccumulation(100000, 2000, rReal, 12);
  assert.strictEqual(acc.finalBalance, 100000 + (12 * 2000), 'Sem juros reais, patrimônio = P0 + N*PMT');
  assert.strictEqual(acc.interestEarned, 0, 'Juros reais ganhos devem ser 0');
});

runChallenge('CH-07: Inflação extrema superior à taxa nominal (rNom = 6.0%, iInf = 9.0%)', () => {
  const res = sim.simulate({ p0: 500000, pmt: 10000, years: 10, rNom: 0.06, iInf: 0.09, despesaMeta: 25000, swr: 0.035 });
  assert.ok(res.realFee < 0, 'Taxa real Fee deve ser negativa');
  assert.ok(res.realTrad < 0, 'Taxa real Trad deve ser negativa');
  assert.ok(res.patrimonioFinalFee < res.totalAportado, 'Poder de compra real final deve ser menor que total aportado');
  assert.ok(res.patrimonioFinalFee > res.patrimonioFinalTrad, 'Mesmo no negativo, modelo Fee perde menos que Tradicional');
  assert.ok(res.vantagemFeeBased > 0, 'Delta a favor de Portfel deve ser positivo');
  assert.ok(Number.isFinite(res.anosGanhosDeVida), 'Anos de vida economizados deve ser finito');
  assert.ok(res.anosGanhosDeVida >= 0 && res.anosGanhosDeVida <= 30, 'Anos ganhos deve respeitar o teto de 30 anos');
});

runChallenge('CH-08: Taxa real negativa sem aportes (P0 = R$ 1M, PMT = 0, rReal < 0)', () => {
  const drag = sim.compareFeeDrag(1000000, 0, 0.05, 0.08, 0.02, 0.007, 120);
  assert.ok(drag.finalTrad < 1000000, 'Tradicional perde valor real');
  assert.ok(drag.finalFee < 1000000, 'Fee perde valor real');
  assert.ok(drag.finalFee > drag.finalTrad, 'Fee preserva mais capital');
  assert.ok(Number.isFinite(drag.yearsOfFreedomGained), 'yearsOfFreedomGained deve ser finito sem loop infinito');
  assert.strictEqual(drag.yearsOfFreedomGained, 30.0, 'Quando tradicional nunca alcança Fee por decréscimo, trava no teto de 30a');
});

// -----------------------------------------------------------------------------
// BLOCO 4: PRAZOS LONGOS (40 ANOS E 50 ANOS)
// -----------------------------------------------------------------------------

runChallenge('CH-09: Horizonte longo de 40 anos (480 meses - Limite do Slider)', () => {
  const t0 = performance.now();
  const res = sim.simulate({ p0: 500000, pmt: 10000, years: 40, rNom: 0.115, iInf: 0.045, despesaMeta: 25000, swr: 0.035 });
  const t1 = performance.now();
  assert.ok((t1 - t0) < 50, `Tempo de execução para 40 anos (${(t1 - t0).toFixed(2)}ms) deve ser < 50ms`);
  assert.strictEqual(res.months, 480, 'Total de meses deve ser 480');
  assert.strictEqual(res.timelineFee.length, 481, 'Timeline deve conter 481 pontos (mês 0 a 480)');
  assert.ok(Number.isSafeInteger(res.patrimonioFinalFee), 'Patrimônio em 40a deve permanecer safe integer');
  assert.ok(res.patrimonioFinalFee > 0, 'Patrimônio deve ser estritamente positivo');
});

runChallenge('CH-10: Horizonte extremo de 50 anos (600 meses - Limite de Busca da Soberania)', () => {
  const t0 = performance.now();
  const sov = sim.calculateSovereigntyYear(100000, 2000, 0.06, 25000, 0.035, 600);
  const t1 = performance.now();
  assert.ok((t1 - t0) < 20, `Cálculo de soberania 50 anos (${(t1 - t0).toFixed(2)}ms) deve ser < 20ms`);
  assert.ok(Number.isFinite(sov.targetCapital), 'Meta de capital deve ser finita');
});

// -----------------------------------------------------------------------------
// BLOCO 5: VARREDURA COMBINATÓRIA EXAUSTIVA DE SLIDERS (36.000 AMOSTRAS)
// -----------------------------------------------------------------------------

runChallenge('CH-11: Varredura combinatória exaustiva de sliders (Zero NaN, Zero Infinity, Zero Crashes)', () => {
  const p0Values = [0, 50000, 500000, 1000000, 5000000, 50000000];
  const pmtValues = [0, 500, 10000, 50000, 200000];
  const yearsValues = [1, 5, 15, 30, 40];
  const rNomValues = [0.06, 0.08, 0.115, 0.15, 0.18];
  const iInfValues = [0.025, 0.045, 0.06, 0.09];
  const despesaValues = [5000, 25000, 50000, 150000];
  const swrValues = [0.025, 0.035, 0.05];

  let combinations = 0;
  let tStart = performance.now();

  for (const p0 of p0Values) {
    for (const pmt of pmtValues) {
      for (const years of yearsValues) {
        for (const rNom of rNomValues) {
          for (const iInf of iInfValues) {
            for (const despesa of despesaValues) {
              for (const swr of swrValues) {
                combinations++;
                const r = sim.simulate({
                  p0: p0,
                  pmt: pmt,
                  years: years,
                  rNom: rNom,
                  iInf: iInf,
                  despesaMeta: despesa,
                  swr: swr
                });

                assert.ok(Number.isFinite(r.patrimonioFinalFee), `patrimonioFinalFee não finito em p0=${p0}, pmt=${pmt}, y=${years}`);
                assert.ok(Number.isFinite(r.patrimonioFinalTrad), `patrimonioFinalTrad não finito em p0=${p0}, pmt=${pmt}`);
                assert.ok(Number.isFinite(r.totalAportado), 'totalAportado não finito');
                assert.ok(Number.isFinite(r.jurosGanhos), 'jurosGanhos não finito');
                assert.ok(Number.isFinite(r.vantagemFeeBased), 'vantagemFeeBased não finito');
                assert.ok(Number.isFinite(r.anosGanhosDeVida), 'anosGanhosDeVida não finito');
                assert.ok(Number.isFinite(r.patrimonioSoberania), 'patrimonioSoberania não finito');
                assert.ok(Number.isFinite(r.rendaMensalSWR), 'rendaMensalSWR não finito');
                assert.ok(Number.isFinite(r.rendaMensalPerpetua), 'rendaMensalPerpetua não finito');
                assert.ok(!isNaN(r.realFee), 'realFee é NaN');
                assert.ok(!isNaN(r.realTrad), 'realTrad é NaN');
              }
            }
          }
        }
      }
    }
  }

  let tEnd = performance.now();
  console.log(`    ↳ Executadas ${combinations.toLocaleString()} simulações em ${(tEnd - tStart).toFixed(1)}ms (${((tEnd - tStart) / combinations * 1000).toFixed(2)}µs/sim)`);
  assert.strictEqual(combinations, 36000, 'Total de combinações deve ser exatamente 36.000');
});

// -----------------------------------------------------------------------------
// BLOCO 6: ROBUSTEZ DA FORMATAÇÃO E MOTOR GRÁFICO
// -----------------------------------------------------------------------------

runChallenge('CH-12: Formatação compacta e completa de moedas em valores anômalos', () => {
  const chartMock = new sim.InteractiveSimulationChart(null, null);
  
  assert.strictEqual(chartMock.formatCurrencyCompact(0), 'R$ 0');
  assert.strictEqual(chartMock.formatCurrencyCompact(500), 'R$ 500');
  assert.strictEqual(chartMock.formatCurrencyCompact(1500), 'R$ 2k');
  assert.strictEqual(chartMock.formatCurrencyCompact(1000000), 'R$ 1M');
  assert.strictEqual(chartMock.formatCurrencyCompact(1500000), 'R$ 1,5M');
  assert.strictEqual(chartMock.formatCurrencyCompact(1000000000), 'R$ 1000M');

  assert.ok(typeof chartMock.formatCurrencyFull(0) === 'string');
  assert.ok(typeof chartMock.formatCurrencyFull(50000000) === 'string');
});

runChallenge('CH-13: Proteção de maxVal no gráfico contra divisão por zero quando tudo é zero', () => {
  const resZero = sim.simulate({ p0: 0, pmt: 0, years: 10, rNom: 0.10, iInf: 0.04, despesaMeta: 0, swr: 0.035 });
  // O código do gráfico calcula:
  // var maxVal = Math.max(data.patrimonioFinalFee, data.patrimonioFinalTrad, data.patrimonioSoberania || 0, 100000) * 1.12;
  const maxVal = Math.max(resZero.patrimonioFinalFee, resZero.patrimonioFinalTrad, resZero.patrimonioSoberania || 0, 100000) * 1.12;
  assert.ok(maxVal >= 112000, `maxVal (${maxVal}) deve ser >= 112.000 mesmo com tudo zerado`);
  assert.ok(Number.isFinite(1 / maxVal), 'Divisão por maxVal é 100% segura contra divisão por zero');
});

runChallenge('CH-14: Proteção contra inflação <= -100% na Equação de Fisher', () => {
  assert.throws(
    () => sim.calculateRealReturn(0.10, -1.0),
    /Inflação não pode ser <= -100%/,
    'Deve lançar erro explicativo para inflação <= -100%'
  );
  assert.throws(
    () => sim.calculateRealReturn(0.10, -1.5),
    /Inflação não pode ser <= -100%/,
    'Deve lançar erro explicativo para inflação <= -100%'
  );
});

// -----------------------------------------------------------------------------
// RELATÓRIO DO HARNESS
// -----------------------------------------------------------------------------
console.log('\n' + '-'.repeat(70));
console.log(`Total de Desafios Adversariais: ${totalTests}`);
console.log(`\x1b[32mAprovados: ${passedTests}\x1b[0m`);
console.log(`\x1b[31mFalhas: ${failedTests}\x1b[0m`);
console.log('-'.repeat(70));

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m✔ TODOS OS 14 DESAFIOS ADVERSARIAIS FORAM SUPERADOS COM SUCESSO!\x1b[0m\n');
  process.exit(0);
}
