/**
 * TIER 1 - FEATURE F02: DESIGN SYSTEM & TOKENS UNIFICADOS
 * 
 * Valida a coerência da paleta Obsidiana, Violeta Luminescente e Esmeralda Neon,
 * a tipografia Cormorant Garamond, DM Sans e JetBrains Mono, e a estrutura de tokens.
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { fileExists, readFile, getMode } = require('../helpers/env');
const { extractCssVariables } = require('../helpers/dom-parser');

describe('Tier 1: F02 - Design System & Tokens Unificados', () => {
  const indexHtml = readFile('index.html');
  const sharedCssExists = fileExists('css/shared-outlier.css');

  test('F02-1: Declaração e valores canônicos da paleta Obsidian/Violet/Emerald em :root', () => {
    let cssText = '';
    if (sharedCssExists) {
      cssText = readFile('css/shared-outlier.css');
    } else {
      const match = indexHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      cssText = match ? match[1] : '';
    }

    // Limpa comentários para garantir extração fidedigna de chaves
    const cleanCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const vars = extractCssVariables(cleanCss);

    // Validação de fundo e superfícies obsidiana
    assert.ok(vars['--bg'], 'Token --bg deve existir');
    assert.match(vars['--bg'].toLowerCase(), /#04020c/, 'Token --bg deve ser #04020C (Obsidiana Profunda)');

    // Validação dos acentos violeta institucional
    assert.ok(vars['--vio'], 'Token --vio deve existir');
    assert.match(vars['--vio'].toLowerCase(), /#3b36cc/, 'Token --vio deve ser #3B36CC');
    assert.ok(vars['--vio2'], 'Token --vio2 deve existir');
    assert.match(vars['--vio2'].toLowerCase(), /#6b66e8/, 'Token --vio2 deve ser #6B66E8');

    // Validação de esmeralda neon (telemetria e sucesso)
    assert.ok(vars['--grn'], 'Token --grn deve existir');
    assert.match(vars['--grn'].toLowerCase(), /#1cd98a/, 'Token --grn deve ser #1CD98A');

    // Validação dos tons de texto
    assert.ok(vars['--txt'], 'Token --txt deve existir');
    assert.match(vars['--txt'].toLowerCase(), /#ede8d5/, 'Token --txt deve ser #EDE8D5 (Pergaminho Nobre)');
  });

  test('F02-2: Declaração das três famílias tipográficas fundamentais', () => {
    let cssText = '';
    if (sharedCssExists) {
      cssText = readFile('css/shared-outlier.css');
    } else {
      const match = indexHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      cssText = match ? match[1] : '';
    }

    const cleanCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const vars = extractCssVariables(cleanCss);

    // Tipografia display serifada
    assert.ok(vars['--d'], 'Token tipográfico --d deve existir');
    assert.match(vars['--d'], /Cormorant Garamond/i, 'Token --d deve referenciar Cormorant Garamond');

    // Tipografia interface sans-serif
    assert.ok(vars['--s'], 'Token tipográfico --s deve existir');
    assert.match(vars['--s'], /DM Sans/i, 'Token --s deve referenciar DM Sans');

    // Tipografia telemetria monospace
    assert.ok(vars['--m'], 'Token tipográfico --m deve existir');
    assert.match(vars['--m'], /JetBrains Mono/i, 'Token --m deve referenciar JetBrains Mono');
  });

  test('F02-3: Importação de Google Fonts nas páginas principais com preconnect', () => {
    assert.match(indexHtml, /fonts\.googleapis\.com/i, 'index.html deve conter link para Google Fonts');
    assert.match(indexHtml, /Cormorant\+Garamond/i, 'Google Fonts deve incluir Cormorant Garamond');
    assert.match(indexHtml, /DM\+Sans/i, 'Google Fonts deve incluir DM Sans');
    assert.match(indexHtml, /JetBrains\+Mono/i, 'Google Fonts deve incluir JetBrains Mono');
    assert.match(indexHtml, /rel=["']preconnect["']/i, 'Deve usar preconnect para performance');
  });

  test('F02-4: Presença dos efeitos visuais característicos (grain overlay e cursor dinâmico)', () => {
    // Grain analógico contra frieza digital
    assert.match(indexHtml, /id=["']grain["']|class=["'][^"']*grain/i, 'Overlay grain deve estar presente');
    assert.match(indexHtml, /feTurbulence/i, 'Filtro SVG turbulence do grain deve estar presente');

    // Cursor dinâmico duplo
    assert.match(indexHtml, /id=["']c-dot["']/i, 'Ponto central do cursor #c-dot deve estar presente');
    assert.match(indexHtml, /id=["']c-ring["']/i, 'Anel magnético #c-ring deve estar presente');
  });

  test('F02-5: Verificação do arquivo compartilhado css/shared-outlier.css (Marco M1)', (t) => {
    if (!sharedCssExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M1 pendente: css/shared-outlier.css ainda não criado pelo Worker M1');
        return;
      }
      assert.fail('Arquivo css/shared-outlier.css obrigatório');
    }

    const sharedCss = readFile('css/shared-outlier.css');
    assert.ok(sharedCss.length > 500, 'css/shared-outlier.css deve conter definições substanciais');
    assert.match(sharedCss, /--bg:/, 'css/shared-outlier.css deve declarar tokens em :root');
    assert.match(sharedCss, /backdrop-filter/i, 'css/shared-outlier.css deve conter utilitários de glassmorphism');
  });
});
