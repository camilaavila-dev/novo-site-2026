/**
 * TIER 1 - FEATURE F25: ATUALIZAÇÃO DO LINKTREE (HUB MOBILE-FIRST)
 * 
 * Valida a página linktree.html, suas rotas atualizadas para o novo ecossistema,
 * badges de autoridade e consistência visual.
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { readFile, getMode } = require('../helpers/env');
const { extractLinks, auditSpaceBeforeBr } = require('../helpers/dom-parser');

describe('Tier 1: F25 - Atualização do Linktree (linktree.html)', () => {
  const linktreeHtml = readFile('linktree.html');

  test('F25-1: Presença dos badges de autoridade (CEA, Portfel, Grupo Primo)', () => {
    assert.match(linktreeHtml, /CEA|ANBIMA/i, 'linktree.html deve conter badge de certificação CEA');
    assert.match(linktreeHtml, /Portfel/i, 'linktree.html deve mencionar a plataforma Portfel');
    assert.match(linktreeHtml, /Grupo Primo/i, 'linktree.html deve mencionar o Grupo Primo');
  });

  test('F25-2: Presença e consistência da barra de 4 estatísticas institucionais', () => {
    assert.match(linktreeHtml, /20[\s\S]*?Bi/i, 'Métrica de +R$20Bi deve estar presente');
    assert.match(linktreeHtml, /25[\s\S]*?k/i, 'Métrica de +25k clientes deve estar presente');
    assert.match(linktreeHtml, /700/i, 'Métrica de +700 consultores deve estar presente');
    assert.match(linktreeHtml, /97/i, 'Métrica de 97 NPS deve estar presente');
  });

  test('F25-3: Links fundamentais de agendamento e canais oficiais', () => {
    const links = extractLinks(linktreeHtml);
    const hrefs = links.map(l => l.href);

    // Link para o formulário oficial
    assert.ok(
      hrefs.some(h => h.includes('forms.office.com')),
      'Deve conter link para o formulário oficial de agendamento'
    );

    // Link para redes (Instagram ou LinkedIn)
    assert.ok(
      hrefs.some(h => h.includes('instagram.com') || h.includes('linkedin.com')),
      'Deve conter link para canal social oficial'
    );
  });

  test('F25-4: Conexão com as novas rotas do ecossistema 2026 (Marco M5)', (t) => {
    const links = extractLinks(linktreeHtml);
    const hrefs = links.map(l => l.href);

    const hasNewRoutes = hrefs.some(h => /simulador\.html|raiox\.html|blog\.html/i.test(h));
    if (!hasNewRoutes) {
      if (getMode() === 'progressive') {
        t.skip('Marco M5 pendente: linktree.html ainda não atualizado com novas rotas 2026');
        return;
      }
      assert.fail('linktree.html deve conter links para as novas páginas do ecossistema');
    }

    assert.ok(hasNewRoutes, 'linktree.html atualizado com rotas 2026');
  });

  test('F25-5: Conformidade com a regra de quebra segura mobile (espaço antes de <br>)', () => {
    const audit = auditSpaceBeforeBr(linktreeHtml);
    assert.ok(
      audit.isValid,
      `linktree.html contém ${audit.violationCount} quebras <br> sem espaço precedente`
    );
  });
});
