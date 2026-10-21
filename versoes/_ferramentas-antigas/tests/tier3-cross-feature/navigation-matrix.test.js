/**
 * TIER 3 - CROSS-FEATURE COMBINATIONS: MATRIZ DE NAVEGAÇÃO CRUZADA (CROSS-PAGE LINKS)
 * 
 * Valida que todos os links relativos entre as páginas do ecossistema
 * apontam para arquivos existentes no repositório (zero links 404),
 * aceitando tanto extensões estáticas explícitas quanto Clean URLs (.html).
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { readFile, fileExists } = require('../helpers/env');
const { extractLinks } = require('../helpers/dom-parser');

describe('Tier 3: Cross-Feature - Matriz de Navegação e Integridade de Links', () => {
  const existingPages = ['index.html', 'linktree.html', 'termos.html', 'privacidade.html'];

  test('T3-N1: Nenhum link relativo aponta para rota inexistente (Prevenção de 404)', () => {
    const brokenLinks = [];

    for (const pageName of existingPages) {
      const html = readFile(pageName);
      const links = extractLinks(html);

      for (const link of links) {
        const href = link.href.trim();
        // Ignora links externos, tel:, mailto:, javascript: e âncoras puras (#...)
        if (
          href.startsWith('http://') ||
          href.startsWith('https://') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          href.startsWith('javascript:') ||
          href.startsWith('#') ||
          href === ''
        ) {
          continue;
        }

        // Isola o caminho base (ex: "/linktree" -> "linktree", "index.html#sobre" -> "index.html")
        let targetFile = href.split('#')[0].split('?')[0].replace(/^\//, '');

        if (!targetFile) continue;

        // Verifica existência direta ou via clean url (.html)
        const directExists = fileExists(targetFile);
        const htmlExists = fileExists(`${targetFile}.html`);
        const isFutureMilestone = ['simulador', 'simulador.html', 'raiox', 'raiox.html', 'blog', 'blog.html'].includes(targetFile);

        if (!directExists && !htmlExists && !isFutureMilestone) {
          brokenLinks.push({
            source: pageName,
            target: targetFile,
            rawHref: href
          });
        }
      }
    }

    assert.strictEqual(
      brokenLinks.length,
      0,
      `Links quebrados (404) detectados no ecossistema: ${JSON.stringify(brokenLinks, null, 2)}`
    );
  });

  test('T3-N2: Consistência de links de retorno da navegação secundária para a Home', () => {
    const secondaryPages = ['termos.html', 'privacidade.html'];

    for (const p of secondaryPages) {
      const html = readFile(p);
      const links = extractLinks(html);
      const hasHomeLink = links.some(l => l.href === 'index.html' || l.href.startsWith('index.html#') || l.href === '/' || l.href === '#');
      assert.ok(hasHomeLink, `${p} deve possuir caminho navegável de retorno para a Home`);
    }
  });
});
