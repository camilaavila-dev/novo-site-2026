/**
 * TIER 1 - FEATURE F05: CORREÇÃO DE LINKS & DÉBITOS DE RODAPÉ (MARCO M1)
 * 
 * Valida a resolução dos débitos identificados nas páginas jurídicas e no rodapé:
 * - Links de termos.html e privacidade.html apontando para seus respectivos arquivos
 * - Presença do CNPJ oficial e texto regulatório da CVM
 * - Links institucionais de autoridade (Portfel, Grupo Primo)
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { readFile, getMode, isMilestoneReady } = require('../helpers/env');
const { extractLinks } = require('../helpers/dom-parser');

describe('Tier 1: F05 - Correção de Links & Débitos de Rodapé', () => {
  const indexHtml = readFile('index.html');
  const termosHtml = readFile('termos.html');
  const privacidadeHtml = readFile('privacidade.html');
  const m1Ready = isMilestoneReady('m1');

  test('F05-1: Conformidade do link de Política de Privacidade em privacidade.html (Marco M1)', (t) => {
    const links = extractLinks(privacidadeHtml);
    const privLink = links.find(l => /Política de Privacidade/i.test(l.text));
    assert.ok(privLink, 'Deve existir link de Política de Privacidade no documento');

    if (!m1Ready && privLink.href === 'termos.html') {
      if (getMode() === 'progressive') {
        t.skip('Marco M1 pendente: Correção do link de privacidade.html ainda pendente pelo Worker M1');
        return;
      }
    }

    assert.notStrictEqual(
      privLink.href,
      'termos.html',
      'Link com texto "Política de Privacidade" não deve apontar para termos.html em privacidade.html'
    );
  });

  test('F05-2: Conformidade dos links jurídicos de rodapé em index.html (Marco M1)', (t) => {
    const links = extractLinks(indexHtml);
    const privLink = links.find(l => /Privacidade/i.test(l.text));
    const termLink = links.find(l => /Termos/i.test(l.text));

    assert.ok(privLink, 'Link de Privacidade deve existir no rodapé da Home');
    assert.ok(termLink, 'Link de Termos deve existir no rodapé da Home');

    if (!m1Ready && privLink.href === termLink.href) {
      if (getMode() === 'progressive') {
        t.skip('Marco M1 pendente: Separação dos links de Privacidade e Termos em index.html pendente pelo Worker M1');
        return;
      }
    }

    assert.strictEqual(
      privLink.href,
      'privacidade.html',
      'Link de Política de Privacidade na Home deve apontar para privacidade.html'
    );
    assert.strictEqual(
      termLink.href,
      'termos.html',
      'Link de Termos de Uso na Home deve apontar para termos.html'
    );
  });

  test('F05-3: Presença e consistência do CNPJ oficial em todas as páginas', () => {
    const pages = [
      { name: 'index.html', content: indexHtml },
      { name: 'termos.html', content: termosHtml },
      { name: 'privacidade.html', content: privacidadeHtml }
    ];

    for (const p of pages) {
      assert.match(
        p.content,
        /54\.475\.818\/0001-90/,
        `CNPJ oficial (54.475.818/0001-90) deve constar no rodapé de ${p.name}`
      );
    }
  });

  test('F05-4: Presença do disclaimer regulatório da Resolução CVM nº 19/2021', () => {
    const pages = [
      { name: 'index.html', content: indexHtml },
      { name: 'termos.html', content: termosHtml },
      { name: 'privacidade.html', content: privacidadeHtml }
    ];

    for (const p of pages) {
      assert.match(
        p.content,
        /Resolução CVM nº\s*19\/2021/i,
        `Disclaimer CVM 19/2021 deve constar no rodapé de ${p.name}`
      );
      assert.match(
        p.content,
        /não realiza intermediação,\s*custódia ou administração/i,
        `Disclaimer de não-custódia deve constar no rodapé de ${p.name}`
      );
    }
  });

  test('F05-5: Links externos para o ecossistema institucional (Portfel e Grupo Primo)', () => {
    const links = extractLinks(indexHtml);
    const portfelLink = links.find(l => /portfel\.com\.br/i.test(l.href));
    const primoLink = links.find(l => /grupo-primo\.com/i.test(l.href));

    assert.ok(portfelLink, 'Deve haver link externo para portfel.com.br');
    assert.ok(primoLink, 'Deve haver link externo para grupo-primo.com');
  });
});
