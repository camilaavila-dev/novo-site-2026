/**
 * ADVERSARIAL COMBINATORIAL STRESS HARNESS — MILESTONE M3
 * Challenger 1 (Empirical Challenger)
 * 
 * Verificações Mandatórias de Estresse:
 * 1. Todas as 4^5 = 1024 combinações possíveis de opções do quiz Raio-X.
 * 2. Validação de scores finitos entre 0 e 100 sem NaN, sem divisão por zero.
 * 3. Mapeamento 100% determinístico e estrito para os 5 arquétipos canônicos válidos.
 * 4. Validação de determineBottlenecks: exatamente 2 gargalos distintos ordenados do menor para o maior score.
 * 5. Casos limites e polares: todas respostas 0, todas 100, empates de 2, 3, 4 e 5 vias.
 * 6. Limítrofes exatos de transição de arquétipos (D1..D5 nos limites de corte).
 * 7. Resiliência polimórfica de calculateScore (array de índices, array de scores, objetos, varargs).
 * 8. Renderização vetorial SVG de radar e geometria analítica.
 */

const assert = require('node:assert/strict');
const path = require('node:path');
const oracle = require('./helpers/math-oracle.js');
const rx = require('../js/raiox-core.js');

console.log('\x1b[35m' + '='.repeat(75) + '\x1b[0m');
console.log('\x1b[1m\x1b[36m  ADVERSARIAL COMBINATORIAL STRESS HARNESS — RAIO-X CORE (M3)\x1b[0m');
console.log('\x1b[35m' + '='.repeat(75) + '\x1b[0m\n');

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

const CANONICAL_ARCHETYPES = ['soberano', 'construtor', 'patriarca', 'acumulador', 'estrategista'];

// -----------------------------------------------------------------------------
// BLOCO 1: VARREDURA COMBINATÓRIA EXAUSTIVA (1024 COMBINAÇÕES DO QUIZ)
// -----------------------------------------------------------------------------

runChallenge('CH-M3-01: Exaustão Combinatória de 4^5 = 1024 estados de resposta do Quiz', () => {
  const questions = rx.questions;
  assert.strictEqual(questions.length, 5, 'Devem existir exatamente 5 questões');

  const archetypeCounts = {
    soberano: 0,
    construtor: 0,
    patriarca: 0,
    acumulador: 0,
    estrategista: 0
  };

  let combinationCount = 0;

  for (let i1 = 0; i1 < 4; i1++) {
    for (let i2 = 0; i2 < 4; i2++) {
      for (let i3 = 0; i3 < 4; i3++) {
        for (let i4 = 0; i4 < 4; i4++) {
          for (let i5 = 0; i5 < 4; i5++) {
            combinationCount++;

            const s1 = questions[0].options[i1].score;
            const s2 = questions[1].options[i2].score;
            const s3 = questions[2].options[i3].score;
            const s4 = questions[3].options[i4].score;
            const s5 = questions[4].options[i5].score;

            // 1. Executa no core e no oráculo
            const coreRes = rx.calculateScore([s1, s2, s3, s4, s5]);
            const oracleScore = oracle.calculateRaioXScore(s1, s2, s3, s4, s5);
            const oracleArq = oracle.determineArchetype(s1, s2, s3, s4, s5);
            const oracleGaps = oracle.determineBottlenecks(s1, s2, s3, s4, s5);

            // 2. Verificação de integridade numérica
            assert.ok(!isNaN(coreRes.overallScore), `Overall score não pode ser NaN para [${s1},${s2},${s3},${s4},${s5}]`);
            assert.ok(isFinite(coreRes.overallScore), 'Overall score deve ser finito');
            assert.ok(coreRes.overallScore >= 0 && coreRes.overallScore <= 100, `Score deve estar entre 0 e 100 (obtido: ${coreRes.overallScore})`);
            assert.strictEqual(coreRes.overallScore, oracleScore.overallScore, 'Score deve ser idêntico ao do oráculo matemático');

            // 3. Verificação de dimensões
            assert.strictEqual(coreRes.dimensionScores.D1, s1);
            assert.strictEqual(coreRes.dimensionScores.D2, s2);
            assert.strictEqual(coreRes.dimensionScores.D3, s3);
            assert.strictEqual(coreRes.dimensionScores.D4, s4);
            assert.strictEqual(coreRes.dimensionScores.D5, s5);

            // 4. Verificação de arquétipo canônico
            assert.ok(CANONICAL_ARCHETYPES.includes(coreRes.archetype.id), `Arquétipo ${coreRes.archetype.id} deve ser um dos 5 canônicos`);
            assert.strictEqual(coreRes.archetype.id, oracleArq.id, `Arquétipo ${coreRes.archetype.id} deve bater com oráculo ${oracleArq.id}`);
            assert.ok(typeof coreRes.archetype.name === 'string' && coreRes.archetype.name.length > 0);
            assert.ok(typeof coreRes.archetype.badge === 'string' && coreRes.archetype.badge.length > 0);
            assert.ok(typeof coreRes.archetype.color === 'string' && coreRes.archetype.color.startsWith('#'));

            archetypeCounts[coreRes.archetype.id]++;

            // 5. Verificação dos gargalos
            assert.strictEqual(coreRes.bottlenecks.length, 2, 'Devem ser retornados exatamente 2 gargalos');
            assert.notStrictEqual(coreRes.bottlenecks[0].key, coreRes.bottlenecks[1].key, 'Os 2 gargalos devem ter chaves distintas');
            assert.ok(coreRes.bottlenecks[0].score <= coreRes.bottlenecks[1].score, 'Gargalos devem estar ordenados do menor para o maior score');
            
            const minScorePossible = Math.min(s1, s2, s3, s4, s5);
            assert.strictEqual(coreRes.bottlenecks[0].score, minScorePossible, 'Primeiro gargalo deve ter o menor score de todos');

            assert.strictEqual(coreRes.bottlenecks[0].key, oracleGaps[0].key);
            assert.strictEqual(coreRes.bottlenecks[1].key, oracleGaps[1].key);
            assert.ok(coreRes.bottlenecks[0].tag && coreRes.bottlenecks[0].risk && coreRes.bottlenecks[0].solution, 'Gargalo 1 deve conter metadados analíticos');
            assert.ok(coreRes.bottlenecks[1].tag && coreRes.bottlenecks[1].risk && coreRes.bottlenecks[1].solution, 'Gargalo 2 deve conter metadados analíticos');

            // 6. Verificação de URLs
            assert.ok(coreRes.consultationUrl.includes('score=' + coreRes.overallScore));
            assert.ok(coreRes.consultationUrl.includes('arq=' + coreRes.archetype.id));
            assert.ok(coreRes.consultationUrl.includes('gap1=' + coreRes.bottlenecks[0].key));
            assert.ok(coreRes.consultationUrl.includes('gap2=' + coreRes.bottlenecks[1].key));
            assert.ok(coreRes.whatsappUrl.startsWith('https://wa.me/5515999999999?text='));
            assert.ok(!coreRes.consultationUrl.includes('NaN'));
            assert.ok(!coreRes.consultationUrl.includes('undefined'));
            assert.ok(!coreRes.whatsappUrl.includes('NaN'));
            assert.ok(!coreRes.whatsappUrl.includes('undefined'));

            // 7. Radar points
            const radarPts = rx.generateRadarPoints(s1, s2, s3, s4, s5);
            assert.strictEqual(radarPts.length, 5);
            radarPts.forEach(pt => {
              assert.ok(Number.isFinite(pt.x) && !isNaN(pt.x));
              assert.ok(Number.isFinite(pt.y) && !isNaN(pt.y));
              assert.ok(pt.x >= 65 && pt.x <= 335, `x=${pt.x} fora dos limites [65, 335]`);
              assert.ok(pt.y >= 65 && pt.y <= 335, `y=${pt.y} fora dos limites [65, 335]`);
            });
          }
        }
      }
    }
  }

  assert.strictEqual(combinationCount, 1024, 'Total de combinações avaliadas deve ser exatamente 1024');

  // Verifica que TODOS os 5 arquétipos são alcançáveis no espaço do quiz
  console.log('   Distribuição dos 1024 estados entre os Arquétipos:');
  for (const [arqId, count] of Object.entries(archetypeCounts)) {
    const pct = ((count / 1024) * 100).toFixed(1);
    console.log(`   - ${arqId.padEnd(13)}: ${String(count).padStart(4)} ocorrências (${pct}%)`);
    assert.ok(count > 0, `O arquétipo '${arqId}' deve ser alcançável por ao menos uma combinação do quiz`);
  }
});

// -----------------------------------------------------------------------------
// BLOCO 2: POLIMORFISMO DE ENTRADA (calculateScore)
// -----------------------------------------------------------------------------

runChallenge('CH-M3-02: Suporte polimórfico a múltiplos formatos de chamada de calculateScore', () => {
  const sampleScores = [35, 40, 70, 80, 30]; // D1=35, D2=40, D3=70, D4=80, D5=30

  // 1. Array de scores
  const res1 = rx.calculateScore(sampleScores);
  assert.strictEqual(res1.overallScore, 51);
  assert.strictEqual(res1.archetype.id, 'acumulador');

  // 2. Argumentos separados (varargs: d1, d2, d3, d4, d5)
  const res2 = rx.calculateScore(35, 40, 70, 80, 30);
  assert.strictEqual(res2.overallScore, 51);
  assert.strictEqual(res2.archetype.id, 'acumulador');
  assert.deepStrictEqual(res1.dimensionScores, res2.dimensionScores);

  // 3. Objeto com chaves maiúsculas { D1, D2, D3, D4, D5 }
  const res3 = rx.calculateScore({ D1: 35, D2: 40, D3: 70, D4: 80, D5: 30 });
  assert.strictEqual(res3.overallScore, 51);
  assert.strictEqual(res3.archetype.id, 'acumulador');

  // 4. Objeto com chaves minúsculas { d1, d2, d3, d4, d5 }
  const res4 = rx.calculateScore({ d1: 35, d2: 40, d3: 70, d4: 80, d5: 30 });
  assert.strictEqual(res4.overallScore, 51);
  assert.strictEqual(res4.archetype.id, 'acumulador');

  // 5. Array de índices de opções (ex: [1, 1, 2, 2, 1] onde opt1 de Q1=35, Q2=40, Q3=70, Q4=80, Q5=30)
  const res5 = rx.calculateScore([1, 1, 2, 2, 1]);
  assert.strictEqual(res5.overallScore, 51);
  assert.strictEqual(res5.archetype.id, 'acumulador');

  // 6. Chamada sem parâmetros ou com valores inválidos -> fallback seguro sem crash
  const resEmpty = rx.calculateScore();
  assert.strictEqual(resEmpty.overallScore, 0);
  assert.strictEqual(resEmpty.archetype.id, 'construtor'); // D4=0 <= 45 e D1=0 <= 40
  assert.strictEqual(resEmpty.bottlenecks.length, 2);
});

// -----------------------------------------------------------------------------
// BLOCO 3: CASOS LIMITES E POLARES (ZERO, 100, EMPATES DE PONTUAÇÃO)
// -----------------------------------------------------------------------------

runChallenge('CH-M3-03: Caso limite polar: Todas as dimensões em ZERO absoluto', () => {
  const res = rx.calculateScore([0, 0, 0, 0, 0]);
  assert.strictEqual(res.overallScore, 0, 'Score geral deve ser 0');
  assert.strictEqual(res.archetype.id, 'construtor', 'D4=0 e D1=0 classifica como construtor');
  assert.strictEqual(res.bottlenecks.length, 2, 'Deve ter 2 gargalos');
  assert.strictEqual(res.bottlenecks[0].score, 0);
  assert.strictEqual(res.bottlenecks[1].score, 0);
  assert.notStrictEqual(res.bottlenecks[0].key, res.bottlenecks[1].key, 'Gargalos devem ser chaves distintas mesmo no empate de 0');

  const pts = rx.generateRadarPoints(0, 0, 0, 0, 0);
  pts.forEach(p => {
    assert.strictEqual(p.x, 200, 'Ponto X em score 0 deve ser centro (200)');
    assert.strictEqual(p.y, 200, 'Ponto Y em score 0 deve ser centro (200)');
  });
});

runChallenge('CH-M3-04: Caso limite polar: Todas as dimensões em 100 (Soberano Máximo)', () => {
  const res = rx.calculateScore([100, 100, 100, 100, 100]);
  assert.strictEqual(res.overallScore, 100, 'Score geral deve ser 100');
  assert.strictEqual(res.archetype.id, 'soberano', 'Todas dimensões 100 deve ser Soberano');
  assert.strictEqual(res.bottlenecks.length, 2);
  assert.strictEqual(res.bottlenecks[0].score, 100);
  assert.strictEqual(res.bottlenecks[1].score, 100);
  assert.notStrictEqual(res.bottlenecks[0].key, res.bottlenecks[1].key);

  const pts = rx.generateRadarPoints(100, 100, 100, 100, 100);
  // Ponto 0 (D1 - Offshore, topo vertical): x=200, y=200-135=65
  assert.strictEqual(pts[0].x, 200);
  assert.strictEqual(pts[0].y, 65);
});

runChallenge('CH-M3-05: Empates combinatórios em determineBottlenecks (2, 3, 4 e 5 vias)', () => {
  // Empate de 5 vias: [50, 50, 50, 50, 50]
  const gaps5 = rx.determineBottlenecks(50, 50, 50, 50, 50);
  assert.strictEqual(gaps5.length, 2);
  assert.strictEqual(gaps5[0].score, 50);
  assert.strictEqual(gaps5[1].score, 50);
  assert.notStrictEqual(gaps5[0].key, gaps5[1].key);

  // Empate de 4 vias nos menores: [10, 10, 10, 10, 90]
  const gaps4 = rx.determineBottlenecks(10, 10, 10, 10, 90);
  assert.strictEqual(gaps4.length, 2);
  assert.strictEqual(gaps4[0].score, 10);
  assert.strictEqual(gaps4[1].score, 10);
  assert.notStrictEqual(gaps4[0].key, gaps4[1].key);

  // Empate de 3 vias nos menores: [20, 20, 20, 60, 70]
  const gaps3 = rx.determineBottlenecks(20, 20, 20, 60, 70);
  assert.strictEqual(gaps3.length, 2);
  assert.strictEqual(gaps3[0].score, 20);
  assert.strictEqual(gaps3[1].score, 20);
  assert.notStrictEqual(gaps3[0].key, gaps3[1].key);

  // Empate de 2 vias no segundo lugar: [15, 30, 30, 70, 80]
  const gaps2 = rx.determineBottlenecks(15, 30, 30, 70, 80);
  assert.strictEqual(gaps2.length, 2);
  assert.strictEqual(gaps2[0].score, 15);
  assert.strictEqual(gaps2[1].score, 30);
  assert.notStrictEqual(gaps2[0].key, gaps2[1].key);
});

// -----------------------------------------------------------------------------
// BLOCO 4: TESTES ADVERSARIAIS DE LIMITES DE CLASSIFICAÇÃO DE ARQUÉTIPOS
// -----------------------------------------------------------------------------

runChallenge('CH-M3-06: Teste adversarial de fronteira do Soberano Blindado', () => {
  // Condição: overallScore >= 85 E todas as dimensões >= 70

  // 1. Caso limite exato PASS: overallScore = 85, todas = 85
  const a1 = rx.determineArchetype(85, 85, 85, 85, 85);
  assert.strictEqual(a1.id, 'soberano');

  // 2. Limite exato: dimensões no piso 70, mas com média >= 85:
  // (70 + 70 + 100 + 100 + 100) / 5 = 440 / 5 = 88 -> Soberano
  const a2 = rx.determineArchetype(70, 70, 100, 100, 100);
  assert.strictEqual(a2.id, 'soberano');

  // 3. Adversarial FAIL: overallScore = 85, mas D1 = 69 (abaixo de 70)
  // (69 + 89 + 89 + 89 + 89) / 5 = 425 / 5 = 85
  const a3 = rx.determineArchetype(69, 89, 89, 89, 89);
  assert.notStrictEqual(a3.id, 'soberano', 'D1=69 deve impedir arquétipo Soberano');

  // 4. Adversarial FAIL: overallScore = 84 (Math.round((84*5)/5) = 84), todas = 84 >= 70
  const a4 = rx.determineArchetype(84, 84, 84, 84, 84);
  assert.notStrictEqual(a4.id, 'soberano', 'Score 84 deve impedir Soberano');
  assert.strictEqual(a4.id, 'estrategista');

  // 5. Adversarial FAIL nos outros pilares individuais < 70
  assert.strictEqual(rx.determineArchetype(90, 69, 90, 90, 90).id, 'estrategista');
  assert.strictEqual(rx.determineArchetype(90, 90, 69, 90, 90).id, 'estrategista');
  assert.strictEqual(rx.determineArchetype(90, 90, 90, 69, 90).id, 'estrategista');
  assert.strictEqual(rx.determineArchetype(90, 90, 90, 90, 69).id, 'estrategista');
});

runChallenge('CH-M3-07: Teste adversarial de fronteira do Construtor Exposto', () => {
  // Condição: D4 <= 45 E D1 <= 40

  // 1. Limite exato PASS: D4=45, D1=40
  const a1 = rx.determineArchetype(40, 60, 60, 45, 60);
  assert.strictEqual(a1.id, 'construtor');

  // 2. Limite FAIL: D4=46, D1=40
  const a2 = rx.determineArchetype(40, 60, 60, 46, 60);
  assert.notStrictEqual(a2.id, 'construtor');

  // 3. Limite FAIL: D4=45, D1=41
  const a3 = rx.determineArchetype(41, 60, 60, 45, 60);
  assert.notStrictEqual(a3.id, 'construtor');
});

runChallenge('CH-M3-08: Teste adversarial de fronteira do Patriarca Tradicionalista', () => {
  // Condição: D3 <= 35 E D1 <= 40 (e não capturado por Construtor, ou seja, D4 > 45)

  // 1. Limite exato PASS: D3=35, D1=40, D4=50
  const a1 = rx.determineArchetype(40, 60, 35, 50, 60);
  assert.strictEqual(a1.id, 'patriarca');

  // 2. Limite FAIL: D3=36, D1=40
  const a2 = rx.determineArchetype(40, 60, 36, 50, 60);
  assert.notStrictEqual(a2.id, 'patriarca');

  // 3. Precedência Construtor vs Patriarca:
  // Se D1 <= 40 E D4 <= 45 E D3 <= 35 -> Construtor tem precedência
  const a3 = rx.determineArchetype(30, 60, 20, 40, 60);
  assert.strictEqual(a3.id, 'construtor', 'Construtor deve ter precedência hierárquica');
});

runChallenge('CH-M3-09: Teste adversarial de fronteira do Acumulador Ineficiente', () => {
  // Condição: D5 <= 35 E D2 <= 50 (e não capturado pelos anteriores)

  // 1. Limite exato PASS: D5=35, D2=50, D1=50, D4=50, D3=50
  const a1 = rx.determineArchetype(50, 50, 50, 50, 35);
  assert.strictEqual(a1.id, 'acumulador');

  // 2. Limite FAIL: D5=36, D2=50
  const a2 = rx.determineArchetype(50, 50, 50, 50, 36);
  assert.strictEqual(a2.id, 'estrategista');

  // 3. Limite FAIL: D5=35, D2=51
  const a3 = rx.determineArchetype(50, 51, 50, 50, 35);
  assert.strictEqual(a3.id, 'estrategista');
});

// -----------------------------------------------------------------------------
// BLOCO 5: RESILIÊNCIA CONTRA INPUTS INVÁLIDOS E INJEÇÃO
// -----------------------------------------------------------------------------

runChallenge('CH-M3-10: Tratamento de exceções em calculateRaioXScore com scores inválidos', () => {
  // 1. Scores < 0 devem lançar Error
  assert.throws(() => rx.calculateRaioXScore(-1, 50, 50, 50, 50), /Scores dimensionais devem estar entre 0 e 100/);

  // 2. Scores > 100 devem lançar Error
  assert.throws(() => rx.calculateRaioXScore(50, 101, 50, 50, 50), /Scores dimensionais devem estar entre 0 e 100/);

  // 3. Scores não numéricos devem lançar Error
  assert.throws(() => rx.calculateRaioXScore('50', 50, 50, 50, 50), /Scores dimensionais devem estar entre 0 e 100/);
  assert.throws(() => rx.calculateRaioXScore(NaN, 50, 50, 50, 50), /Scores dimensionais devem estar entre 0 e 100/);
});

runChallenge('CH-M3-11: Resiliência de renderRadarChart contra elementos nulos e dados vazios', () => {
  // 1. Chamada sem elemento não deve lançar exceção
  assert.doesNotThrow(() => rx.renderRadarChart(null, { D1: 50, D2: 50, D3: 50, D4: 50, D5: 50 }));
  assert.doesNotThrow(() => rx.renderRadarChart('non-existent-id', { D1: 50, D2: 50, D3: 50, D4: 50, D5: 50 }));

  // 2. Mock element para validar renderização de SVG
  let mockHtml = '';
  const mockSvgEl = {
    tagName: 'svg',
    set innerHTML(val) { mockHtml = val; },
    get innerHTML() { return mockHtml; }
  };

  rx.renderRadarChart(mockSvgEl, { D1: 75, D2: 80, D3: 35, D4: 45, D5: 90 });
  assert.ok(mockHtml.includes('id="radar-data-poly"'), 'Deve conter polígono de dados');
  assert.ok(mockHtml.includes('points='), 'Deve conter atributo points');
  assert.ok(mockHtml.includes('rx-pulse-ring'), 'Deve conter anéis de pulso luminescentes');
  assert.ok(mockHtml.includes('D1 · Offshore'), 'Deve conter rótulos dos eixos');
});

// -----------------------------------------------------------------------------
// RELATÓRIO FINAL DO HARNESS
// -----------------------------------------------------------------------------

console.log('\n' + '-'.repeat(75));
console.log(`\x1b[1mTOTAL DE TESTES ADVERSARIAIS: ${totalTests}\x1b[0m`);
console.log(`\x1b[32mPASSARAM: ${passedTests}\x1b[0m`);
console.log(`\x1b[31mFALHARAM: ${failedTests}\x1b[0m`);
console.log('-'.repeat(75) + '\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m✔ TODOS OS TESTES DE ESTRESSE COMBINATÓRIO PASSARAM COM SUCESSO!\x1b[0m\n');
}
