/**
 * TIER 2 - BOUNDARY & CORNER CASES: RESPONSIVIDADE EM VIEWPORTS EXTREMAS
 * 
 * Valida a integridade do layout e regras CSS nas viewports canônicas:
 * - 390x844 (iPhone 14/15/16)
 * - 430x932 (iPhone 14/15/16 Pro Max)
 * - 1440x900 (Desktop)
 * - Dispositivos em orientação horizontal (Landscape / max-height reduzido)
 * - Ausência de overflow horizontal
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { readFile, fileExists } = require('../helpers/env');

describe('Tier 2: Viewports Mobile Extremas & Consistência de Breakpoints', () => {
  const indexHtml = readFile('index.html');
  const sharedCssExists = fileExists('css/shared-outlier.css');

  test('T2-V1: Breakpoint mobile padronizado em 900px (Thumb Zone)', () => {
    let css = indexHtml;
    if (sharedCssExists) {
      css += '\n' + readFile('css/shared-outlier.css');
    }

    assert.match(
      css,
      /@media\s*\(\s*max-width:\s*900px\s*\)/i,
      'Deve haver media query padronizada em max-width: 900px para layout de smartphone'
    );
  });

  test('T2-V2: Tipografia fluida com função clamp() para adaptação entre 390px e 1440px', () => {
    // clamp() garante que títulos em 390px não estoure a tela e em 1440px fiquem monumentais
    assert.match(
      indexHtml,
      /font-size:\s*clamp\([^)]+\)/i,
      'Títulos devem utilizar clamp() para dimensionamento fluido entre mobile e desktop'
    );
  });

  test('T2-V3: Prevenção de overflow horizontal na viewport estreita (390px)', () => {
    let css = indexHtml;
    if (sharedCssExists) {
      css += '\n' + readFile('css/shared-outlier.css');
    }

    assert.match(
      css,
      /overflow-x:\s*hidden/i,
      'Deve declarar overflow-x: hidden para eliminar scroll horizontal indesejado'
    );
  });

  test('T2-V4: Adaptação em modo paisagem (Landscape / max-height reduzido)', () => {
    if (sharedCssExists) {
      const sharedCss = readFile('css/shared-outlier.css');
      // No modo paisagem móvel (ex: 844x390), a dock inferior ou cabeçalho deve ser compacto
      const hasLandscapeMedia = /@media[^{]*(orientation:\s*landscape|max-height:\s*5\d\dpx)/i.test(sharedCss);
      // É uma boa prática recomendada para evitar oclusão de tela
      assert.ok(
        hasLandscapeMedia || sharedCss.includes('bottom-dock'),
        'Estilos devem prever comportamento adaptativo em telas de altura reduzida'
      );
    }
  });

  test('T2-V5: Regra box-sizing: border-box aplicada universalmente', () => {
    assert.match(
      indexHtml,
      /\*\s*\{[^}]*box-sizing:\s*border-box/i,
      'index.html deve aplicar box-sizing: border-box universalmente'
    );
  });
});
