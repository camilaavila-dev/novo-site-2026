/**
 * TIER 1 - FEATURE F04: MOBILE BOTTOM FLOATING DOCK
 * 
 * Valida a existência, ergonomia e marcação da barra de navegação tátil
 * inferior projetada para a zona do polegar em smartphones de tela grande.
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { fileExists, readFile, getMode } = require('../helpers/env');

describe('Tier 1: F04 - Mobile Bottom Floating Dock', () => {
  const sharedNavExists = fileExists('js/shared-navigation.js');
  const sharedCssExists = fileExists('css/shared-outlier.css');

  test('F04-1: Presença da especificação dos 5 itens da Dock tátil', (t) => {
    if (!sharedNavExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M1 pendente: js/shared-navigation.js ainda não criado pelo Worker M1');
        return;
      }
      assert.fail('Arquivo js/shared-navigation.js é obrigatório');
    }

    const navCode = readFile('js/shared-navigation.js');

    // 5 pontos de contato obrigatórios
    assert.match(navCode, /index\.html/i, 'Dock deve conter link para Home (index.html)');
    assert.match(navCode, /simulador\.html/i, 'Dock deve conter link para Simulador (simulador.html)');
    assert.match(navCode, /raiox\.html/i, 'Dock deve conter link para Raio-X (raiox.html)');
    assert.match(navCode, /blog\.html/i, 'Dock deve conter link para Radar/Blog (blog.html)');
    assert.match(navCode, /dock-cta|Agendar|contato|cta/i, 'Dock deve conter CTA de agendamento em destaque');
  });

  test('F04-2: Acessibilidade e rótulos semânticos (aria-label)', (t) => {
    if (!sharedNavExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M1 pendente');
        return;
      }
      assert.fail('Arquivo js/shared-navigation.js ausente');
    }

    const navCode = readFile('js/shared-navigation.js');
    assert.match(navCode, /aria-label/i, 'Dock deve conter aria-label descritivo para leitores de tela');
  });

  test('F04-3: Posicionamento fixo na base e respeito ao Safe Area Inset (iOS)', (t) => {
    if (!sharedCssExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M1 pendente: css/shared-outlier.css ainda não criado');
        return;
      }
      assert.fail('css/shared-outlier.css ausente');
    }

    const css = readFile('css/shared-outlier.css');
    assert.match(css, /position:\s*fixed/i, 'Dock mobile deve ser fixada na viewport');
    assert.match(css, /bottom:/i, 'Dock mobile deve se posicionar na base');
    assert.match(css, /safe-area-inset-bottom/i, 'Dock deve respeitar env(safe-area-inset-bottom)');
  });

  test('F04-4: Ativação em viewports mobile (max-width <= 900px)', (t) => {
    if (!sharedCssExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M1 pendente: css/shared-outlier.css ainda não criado');
        return;
      }
      assert.fail('css/shared-outlier.css ausente');
    }

    const css = readFile('css/shared-outlier.css');
    assert.match(css, /@media[^{]*max-width:\s*(900|768)px/i, 'Dock deve ser ativada por media query mobile');
  });

  test('F04-5: Efeito glassmorphism e backdrop-filter no estilo da Dock', (t) => {
    if (!sharedCssExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M1 pendente: css/shared-outlier.css ainda não criado');
        return;
      }
      assert.fail('css/shared-outlier.css ausente');
    }

    const css = readFile('css/shared-outlier.css');
    assert.match(css, /backdrop-filter:\s*blur/i, 'Dock deve aplicar backdrop-filter: blur');
  });
});
