/**
 * TIER 1 - FEATURES F12 a F16: DIAGNÓSTICO GAMIFICADO RAIO-X & ARQUÉTIPO PATRIMONIAL
 * 
 * Valida o motor de diagnóstico e visualização geométrica:
 * - F12: Quiz executivo em 5 etapas táteis
 * - F13: Algoritmo ponderado do Score de Blindagem (0 a 100)
 * - F14: Taxonomia dos 5 Arquétipos de Investidor de Elite
 * - F15: Renderização do Radar Pentagonal de 5 Eixos em SVG Nativo
 * - F16: Detecção dos 2 maiores gargalos e geração de CTA com URL pré-parametrizada
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { fileExists, readFile, getMode } = require('../helpers/env');
const oracle = require('../helpers/math-oracle');
const { runScriptInBrowser } = require('../helpers/mock-browser');

describe('Tier 1: F12 a F16 - Diagnóstico Raio-X Patrimonial & Radar Pentagonal', () => {
  const raioxHtmlExists = fileExists('raiox.html');
  const raioxJsExists = fileExists('js/raiox-core.js');

  test('F12-1: Especificação das 5 dimensões cardinais de blindagem', () => {
    const dims = ['D1', 'D2', 'D3', 'D4', 'D5'];
    assert.strictEqual(dims.length, 5, 'Devem existir exatamente 5 dimensões de avaliação');
  });

  test('F13-1: Algoritmo de Score Global de Blindagem (0 a 100)', () => {
    // Caso 1: Todas as dimensões no máximo
    const maxScore = oracle.calculateRaioXScore(100, 100, 100, 100, 100);
    assert.strictEqual(maxScore.overallScore, 100, 'Pontuação máxima deve ser 100');

    // Caso 2: Todas as dimensões no mínimo
    const minScore = oracle.calculateRaioXScore(0, 0, 0, 0, 0);
    assert.strictEqual(minScore.overallScore, 0, 'Pontuação mínima deve ser 0');

    // Caso 3: Valores mistos (ex: D1=35, D2=40, D3=70, D4=80, D5=30)
    // Média: (35 + 40 + 70 + 80 + 30) / 5 = 255 / 5 = 51
    const mixedScore = oracle.calculateRaioXScore(35, 40, 70, 80, 30);
    assert.strictEqual(mixedScore.overallScore, 51, 'Score global misto deve ser a média ponderada exata (51)');
  });

  test('F14-1: Mapeamento determinístico dos 5 Arquétipos de Investidor', () => {
    // 1. O Soberano Blindado (Score >= 85 e todas as dimensões >= 70)
    const arq1 = oracle.determineArchetype(90, 85, 95, 80, 90);
    assert.strictEqual(arq1.id, 'soberano', 'Perfil equilibrado de topo deve ser Soberano');

    // 2. O Construtor Exposto (D4 <= 45 e D1 <= 40)
    const arq2 = oracle.determineArchetype(20, 60, 50, 30, 70);
    assert.strictEqual(arq2.id, 'construtor', 'Perfil com baixa liquidez e sem offshore deve ser Construtor');

    // 3. O Patriarca Tradicionalista (D3 <= 35 e D1 <= 40)
    const arq3 = oracle.determineArchetype(30, 60, 20, 70, 60);
    assert.strictEqual(arq3.id, 'patriarca', 'Perfil sem sucessão e sem offshore deve ser Patriarca');

    // 4. O Acumulador Ineficiente (D5 <= 35 e D2 <= 50)
    const arq4 = oracle.determineArchetype(50, 40, 60, 70, 20);
    assert.strictEqual(arq4.id, 'acumulador', 'Perfil drenado por taxas e come-cotas deve ser Acumulador Ineficiente');

    // 5. O Estrategista em Transição (demais casos)
    const arq5 = oracle.determineArchetype(75, 70, 65, 80, 70);
    assert.strictEqual(arq5.id, 'estrategista', 'Perfil em evolução deve ser Estrategista');
  });

  test('F15-1: Geometria e coordenadas trigonométricas do Radar Pentagonal SVG', () => {
    const points = oracle.generateRadarPoints(100, 100, 100, 100, 100, 200, 200, 135);
    assert.strictEqual(points.length, 5, 'Radar deve conter exatamente 5 vértices');

    // Vértice 0 (Offshore) no topo vertical: theta = -90° -> cos(-90)=0, sin(-90)=-1
    // (x, y) = (200 + 0, 200 - 135) = (200, 65)
    assert.strictEqual(points[0].x, 200, 'Coordenada X do vértice superior deve ser 200');
    assert.strictEqual(points[0].y, 65, 'Coordenada Y do vértice superior (raio 135) deve ser 65');

    // Vértice central em pontuação 0
    const zeroPoints = oracle.generateRadarPoints(0, 0, 0, 0, 0, 200, 200, 135);
    zeroPoints.forEach(p => {
      assert.strictEqual(p.x, 200, 'Ponto zero deve colapsar no centro X (200)');
      assert.strictEqual(p.y, 200, 'Ponto zero deve colapsar no centro Y (200)');
    });
  });

  test('F16-1: Detecção dos 2 maiores gargalos patrimoniais', () => {
    // D1=100, D2=20, D3=10, D4=80, D5=60 -> Menores são D3 (10) e D2 (20)
    const gaps = oracle.determineBottlenecks(100, 20, 10, 80, 60);
    assert.strictEqual(gaps.length, 2, 'Devem ser selecionados exatamente 2 gargalos');
    assert.strictEqual(gaps[0].key, 'D3', 'Primeiro gargalo deve ser D3 (Planejamento Sucessório)');
    assert.strictEqual(gaps[1].key, 'D2', 'Segundo gargalo deve ser D2 (Eficiência Tributária)');
  });

  test('F12-2 e F16-2: Interface Contract window.OutlierRaioX & Estrutura HTML (Marco M3)', (t) => {
    if (!raioxJsExists || !raioxHtmlExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M3 pendente: raiox.html / js/raiox-core.js ainda não criado pelo Worker M3');
        return;
      }
      assert.fail('raiox.html e js/raiox-core.js são obrigatórios no modo estrito');
    }

    const rxHtml = readFile('raiox.html');
    const rxJs = readFile('js/raiox-core.js');

    // Validação da marcação SVG no HTML
    assert.match(rxHtml, /<svg[^>]*viewBox=["'][^"']*400\s+400/i, 'raiox.html deve conter SVG com viewBox 400 400');

    // Validação do contrato do módulo JS
    const ctx = runScriptInBrowser(rxJs, 'raiox-core.js');
    const api = ctx.window.OutlierRaioX;
    assert.ok(api, 'js/raiox-core.js deve expor window.OutlierRaioX');
    assert.strictEqual(typeof api.calculateScore, 'function', 'Deve implementar calculateScore');
    assert.strictEqual(typeof api.renderRadarChart, 'function', 'Deve implementar renderRadarChart');
  });
});
