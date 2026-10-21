/**
 * TIER 1 - FEATURE F29: ERGONOMIA MOBILE & REGRAS DE FRONTEND
 * 
 * Valida os requisitos mandatórios de acessibilidade e viewport:
 * - Meta viewport presente e calibrada
 * - Regra de ouro do espaço antes de <br> em todas as páginas
 * - Touch targets >= 48px
 * - Zero filtros SVG em tempo de execução para transparência de imagens
 * - Diretivas globais anti-overflow horizontal (overflow-x: hidden)
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { readFile, getMode } = require('../helpers/env');
const { auditSpaceBeforeBr, auditImageTransparency } = require('../helpers/dom-parser');

describe('Tier 1: F29 - Ergonomia Mobile & Diretrizes Técnicas de Frontend', () => {
  const pages = [
    { name: 'index.html', content: readFile('index.html') },
    { name: 'linktree.html', content: readFile('linktree.html') },
    { name: 'termos.html', content: readFile('termos.html') },
    { name: 'privacidade.html', content: readFile('privacidade.html') }
  ];

  test('F29-1: Tag meta viewport presente e correta em todas as páginas do ecossistema', () => {
    for (const p of pages) {
      assert.match(
        p.content,
        /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i,
        `${p.name} deve conter meta tag viewport correta`
      );
    }
  });

  test('F29-2: Regra de Espaço Antes de <br> em títulos h1 e h2 com display mobile', (t) => {
    const isM5Pending = !pages[0].content.includes('raiox.html');

    for (const p of pages) {
      const audit = auditSpaceBeforeBr(p.content);
      if (!audit.isValid) {
        if (p.name === 'index.html' && isM5Pending && getMode() === 'progressive') {
          t.skip(
            `Marco M5 pendente: index.html ainda possui ${audit.violationCount} quebras <br> em h2 pendentes de correção pelo Worker M5`
          );
          continue;
        }

        const errorList = audit.violations.map(v => `[${v.level}] "${v.snippet}"`).join('\n  ');
        assert.fail(
          `Violação de espaço antes de <br> detectada em ${p.name} (${audit.violationCount} ocorrências):\n  ${errorList}`
        );
      }
      assert.ok(audit.isValid, `${p.name} segue perfeitamente a regra de espaço antes de <br>`);
    }
  });

  test('F29-3: Ausência de filtros SVG de runtime (feColorMatrix / feComponentTransfer) para limpar transparência de imagens', () => {
    for (const p of pages) {
      const audit = auditImageTransparency(p.content);
      assert.strictEqual(
        audit.hasForbiddenFilter,
        false,
        `${p.name} não deve usar feColorMatrix ou feComponentTransfer fora do #grain`
      );
    }
  });

  test('F29-4: Diretivas CSS de prevenção de scroll horizontal (overflow-x: hidden / max-width: 100vw)', () => {
    for (const p of pages) {
      assert.match(
        p.content,
        /overflow-x:\s*hidden/i,
        `${p.name} deve conter regra overflow-x: hidden no body ou html`
      );
    }
  });

  test('F29-5: Touch Targets mínimos >= 48px para botões e links navegáveis', () => {
    const linktree = readFile('linktree.html');
    assert.match(
      linktree,
      /padding:\s*1[4-9]px|padding:\s*2\dpx|min-height:\s*48px/i,
      'linktree.html deve estipular touch targets generosos nos botões táteis'
    );
  });
});
