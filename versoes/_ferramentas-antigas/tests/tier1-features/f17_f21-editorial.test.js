/**
 * TIER 1 - FEATURES F17 a F21: TERMINAL EDITORIAL INTERATIVO (RADAR MACRO & NEWSLETTER)
 * 
 * Valida a camada editorial, o Termômetro Macroeconômico e o modo duplo de leitura:
 * - F17: Base declarativa desacoplada data/editorial.js (window.EDITORIAL_DATA)
 * - F18: Termômetro com 5 métricas macroeconômicas e sentimento de mercado
 * - F19: Alternador "Resumo Executivo (1 min)" vs "Visão Nerd/Quant do Leo"
 * - F20: Callout em 4 quadrantes ("O que isso muda no seu patrimônio?")
 * - F21: Filtro por categorias/busca e caixa de captura VIP da Newsletter
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { fileExists, readFile, getMode } = require('../helpers/env');
const { runScriptInBrowser } = require('../helpers/mock-browser');

describe('Tier 1: F17 a F21 - Terminal Editorial Interativo & Radar Macroeconômico', () => {
  const editorialDataExists = fileExists('data/editorial.js');
  const blogHtmlExists = fileExists('blog.html');
  const blogJsExists = fileExists('js/blog-core.js');

  test('F17-1: Estrutura e integridade de window.EDITORIAL_DATA (Marco M4)', (t) => {
    if (!editorialDataExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M4 pendente: data/editorial.js ainda não criado pelo Worker M4');
        return;
      }
      assert.fail('Arquivo data/editorial.js é obrigatório no modo estrito');
    }

    const code = readFile('data/editorial.js');
    const ctx = runScriptInBrowser(code, 'editorial.js');
    const data = ctx.window.EDITORIAL_DATA;

    assert.ok(data, 'data/editorial.js deve exportar window.EDITORIAL_DATA');
    assert.ok(
      data.macroPulse || data.termometroMacro,
      'EDITORIAL_DATA deve conter objeto de pulso macroeconômico (macroPulse ou termometroMacro)'
    );
    assert.ok(Array.isArray(data.editions), 'EDITORIAL_DATA deve conter array editions');
    assert.ok(data.editions.length > 0, 'Deve haver ao menos 1 edição cadastrada');
  });

  test('F18-1: Termômetro Macroeconômico com 5 métricas essenciais e indicador de sentimento', (t) => {
    if (!editorialDataExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M4 pendente');
        return;
      }
      assert.fail('data/editorial.js ausente');
    }

    const code = readFile('data/editorial.js');
    const ctx = runScriptInBrowser(code, 'editorial.js');
    const data = ctx.window.EDITORIAL_DATA;
    const pulse = data.macroPulse || data.termometroMacro;

    // Sentimento de mercado (0 a 100)
    const sentiment = pulse.sentimentScore ?? pulse.sentimentoGeral?.score;
    assert.ok(typeof sentiment === 'number', 'Sentimento deve ser numérico');
    assert.ok(sentiment >= 0 && sentiment <= 100, 'Sentimento deve estar na faixa de 0 a 100');

    // 5 Métricas obrigatórias
    const codeStr = code.toLowerCase();
    assert.ok(codeStr.includes('selic'), 'Termômetro deve monitorar Selic / CDI');
    assert.ok(codeStr.includes('ipca'), 'Termômetro deve monitorar IPCA');
    assert.ok(codeStr.includes('usd') || codeStr.includes('dolar'), 'Termômetro deve monitorar Câmbio USD');
    assert.ok(codeStr.includes('sp500') || codeStr.includes('s&p'), 'Termômetro deve monitorar S&P 500');
    assert.ok(codeStr.includes('ibov'), 'Termômetro deve monitorar Ibovespa');
  });

  test('F19-1: Presença do modo duplo de leitura em cada edição cadastrada', (t) => {
    if (!editorialDataExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M4 pendente');
        return;
      }
      assert.fail('data/editorial.js ausente');
    }

    const code = readFile('data/editorial.js');
    const ctx = runScriptInBrowser(code, 'editorial.js');
    const data = ctx.window.EDITORIAL_DATA;

    for (const ed of data.editions) {
      const hasExec = Boolean(ed.executiveSummary || ed.resumoExecutivo);
      const hasQuant = Boolean(ed.quantDeepDive || ed.visaoNerd);
      assert.ok(hasExec, `Edição ${ed.id || ed.titulo} deve conter resumo executivo de 1 minuto`);
      assert.ok(hasQuant, `Edição ${ed.id || ed.titulo} deve conter análise aprofundada quantitativa`);
    }
  });

  test('F20-1: Matriz de impacto patrimonial em 4 quadrantes', (t) => {
    if (!editorialDataExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M4 pendente');
        return;
      }
      assert.fail('data/editorial.js ausente');
    }

    const code = readFile('data/editorial.js');
    const ctx = runScriptInBrowser(code, 'editorial.js');
    const data = ctx.window.EDITORIAL_DATA;

    const first = data.editions[0];
    const impact = first.impactMatrix || first.oQueMudaNoPatrimonio;
    assert.ok(impact, 'Edição deve conter objeto de impacto patrimonial');

    const keys = Object.keys(impact).map(k => k.toLowerCase());
    assert.ok(keys.some(k => k.includes('renda') || k.includes('fixa')), 'Deve mapear impacto em Renda Fixa');
    assert.ok(keys.some(k => k.includes('acao') || k.includes('acoes') || k.includes('bolsa')), 'Deve mapear impacto em Ações');
    assert.ok(keys.some(k => k.includes('offshore') || k.includes('dolar') || k.includes('cambio')), 'Deve mapear impacto Offshore/Câmbio');
  });

  test('F21-1: Filtro de categorias e captura de Newsletter em blog.html (Marco M4)', (t) => {
    if (!blogHtmlExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M4 pendente: blog.html ainda não criado pelo Worker M4');
        return;
      }
      assert.fail('blog.html é obrigatório no modo estrito');
    }

    const blogHtml = readFile('blog.html');
    assert.match(blogHtml, /<input[^>]*type=["']email["']/i, 'blog.html deve conter input de captura de e-mail');
    assert.match(blogHtml, /data-category|data-tag|\.filter-pill/i, 'blog.html deve conter seletores de filtro por categoria');
  });
});
