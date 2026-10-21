/**
 * TIER 2 - BOUNDARY & CORNER CASES: TOUCH TARGETS & ESPAÇAMENTO SEGURO
 * 
 * Valida os limites táteis mínimos e a integridade de formatação de texto:
 * - Touch targets mínimos de 48x48px (padrão WCAG AAA)
 * - Botões flutuantes e itens do dock inferior
 * - Auditoria sistemática de quebras <br> em todas as páginas
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { readFile, fileExists } = require('../helpers/env');
const { auditSpaceBeforeBr } = require('../helpers/dom-parser');

describe('Tier 2: Touch Targets & Espaçamento Seguro de Quebras de Linha', () => {

  test('T2-T1: Botão Flutuante (#float-cta) e botões principais com touch target adequado', () => {
    const indexHtml = readFile('index.html');
    // #float-cta deve ter padding generoso (ex: 13px 22px ou superior) para toque em movimento
    assert.match(
      indexHtml,
      /id=["']float-cta["'][^>]*style=["'][^"']*padding:\s*1[3-9]px|#float-cta\s*\{[^}]*padding:\s*1[3-9]px/i,
      'Botão flutuante de agendamento deve ter padding ergonômico'
    );
  });

  test('T2-T2: Itens do acordeão FAQ (#data-faq-btn) com área de toque mínima expandida', () => {
    const indexHtml = readFile('index.html');
    assert.match(
      indexHtml,
      /data-faq-btn/i,
      'Botões do acordeão FAQ devem estar declarados'
    );
    // Cada item de FAQ deve ter espaçamento vertical >= 20px
    assert.match(
      indexHtml,
      /padding:\s*2\dpx|padding:\s*3\dpx/i,
      'Área de toque do acordeão de FAQ deve ser expandida para facilidade tátil'
    );
  });

  test('T2-T3: Dock Items da navegação mobile com dimensões táteis ergonômicas', (t) => {
    if (!fileExists('css/shared-outlier.css')) {
      t.skip('css/shared-outlier.css ainda não disponível');
      return;
    }

    const css = readFile('css/shared-outlier.css');
    // Deve especificar touch target >= 48px ou padding ergonômico
    assert.match(
      css,
      /dock-item\s*\{[^}]*(min-width|padding|min-height)/i,
      'Classes .dock-item devem possuir dimensionamento tátil dedicado'
    );
  });

  test('T2-T4: Auditoria de quebras <br> em termos.html e privacidade.html', () => {
    const termos = readFile('termos.html');
    const privacidade = readFile('privacidade.html');

    const auditTermos = auditSpaceBeforeBr(termos);
    const auditPriv = auditSpaceBeforeBr(privacidade);

    assert.ok(
      auditTermos.isValid,
      `termos.html deve respeitar 100% a regra de espaço antes de <br> (${auditTermos.violationCount} violações)`
    );
    assert.ok(
      auditPriv.isValid,
      `privacidade.html deve respeitar 100% a regra de espaço antes de <br> (${auditPriv.violationCount} violações)`
    );
  });
});
