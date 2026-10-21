/**
 * TIER 1 - FEATURE F03: NAVEGAÇÃO SUPERIOR UNIFICADA
 * 
 * Valida o header institucional, comportamento de scroll, links de ancoragem
 * e consistência de navegação entre páginas.
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { fileExists, readFile, getMode } = require('../helpers/env');
const { hasElementWithId, extractLinks } = require('../helpers/dom-parser');

describe('Tier 1: F03 - Navegação Superior Unificada', () => {
  const indexHtml = readFile('index.html');
  const sharedNavExists = fileExists('js/shared-navigation.js');

  test('F03-1: Presença do elemento #site-nav e logotipo institucional', () => {
    assert.ok(hasElementWithId(indexHtml, 'site-nav'), 'Elemento #site-nav deve existir no topo');
    assert.match(
      indexHtml,
      /01-logo-completa-leonardo-portfel-texto-branco-transparente\.png/i,
      'Header deve exibir a logo completa com canal alfa limpo'
    );
  });

  test('F03-2: Presença e integridade dos links de ancoragem fundamentais na Home', () => {
    const links = extractLinks(indexHtml);
    const hrefs = links.map(l => l.href);

    assert.ok(hrefs.includes('#sobre'), 'Link para #sobre deve existir no menu');
    assert.ok(hrefs.includes('#servicos'), 'Link para #servicos deve existir no menu');
    assert.ok(hrefs.includes('#metodo'), 'Link para #metodo deve existir no menu');
    assert.ok(hrefs.includes('#presenca'), 'Link para #presenca deve existir no menu');
  });

  test('F03-3: Presença do script de transição dinâmica do header no scroll', () => {
    assert.match(
      indexHtml,
      /scrollY\s*>\s*50|pageYOffset\s*>\s*60/i,
      'Script deve escutar scroll para transição do header'
    );
    assert.match(indexHtml, /backdropFilter/i, 'Transição deve aplicar backdropFilter blur no scroll');
  });

  test('F03-4: Presença da barra de progresso de leitura (#prog) no topo', () => {
    assert.ok(hasElementWithId(indexHtml, 'prog'), 'Elemento #prog deve estar presente');
    assert.match(
      indexHtml,
      /bar\.style\.width\s*=/i,
      'Script deve calcular o scroll percentual para o elemento #prog'
    );
  });

  test('F03-5: Inicializador de navegação compartilhada js/shared-navigation.js (Marco M1)', (t) => {
    if (!sharedNavExists) {
      if (getMode() === 'progressive') {
        t.skip('Marco M1 pendente: js/shared-navigation.js ainda não criado pelo Worker M1');
        return;
      }
      assert.fail('Arquivo js/shared-navigation.js é obrigatório no modo estrito');
    }

    const navJs = readFile('js/shared-navigation.js');
    assert.match(
      navJs,
      /initOutlierNavigation/i,
      'js/shared-navigation.js deve expor initOutlierNavigation'
    );
  });
});
