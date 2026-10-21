/**
 * TIER 1 - FEATURES F22 a F24: BLOCOS GAMIFICADOS NA HOME (MARCO M5)
 * 
 * Valida os 3 novos blocos inseridos na Home preservando a integridade das 15 seções originais:
 * - F22: Bloco Home A: Preview do Raio-X Patrimonial (entre Seção 7 e 8)
 * - F23: Bloco Home B: Vitrine do Simulador de Liberdade (entre Seção 9 e 10)
 * - F24: Bloco Home C: Radar da Semana & Newsletter (entre Seção 12 e 13)
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { readFile, getMode } = require('../helpers/env');
const { hasElementWithId, extractLinks } = require('../helpers/dom-parser');

describe('Tier 1: F22 a F24 - Blocos Gamificados na Home (index.html)', () => {
  const indexHtml = readFile('index.html');
  const hasBlockA = /raiox\.html|raio-x|preview-raiox/i.test(indexHtml);
  const hasBlockB = /simulador\.html|vitrine-simulador/i.test(indexHtml);
  const hasBlockC = /blog\.html|radar-semana/i.test(indexHtml);

  test('F22-1: Bloco Home A - Preview Raio-X Patrimonial com link para raiox.html (Marco M5)', (t) => {
    if (!hasBlockA) {
      if (getMode() === 'progressive') {
        t.skip('Marco M5 pendente: Bloco A (Preview Raio-X) ainda não inserido na Home');
        return;
      }
      assert.fail('Bloco A de Preview do Raio-X deve estar presente em index.html');
    }

    assert.match(indexHtml, /raiox\.html/i, 'Bloco A na Home deve direcionar para raiox.html');
  });

  test('F23-1: Bloco Home B - Vitrine do Simulador de Liberdade com link para simulador.html (Marco M5)', (t) => {
    if (!hasBlockB) {
      if (getMode() === 'progressive') {
        t.skip('Marco M5 pendente: Bloco B (Vitrine Simulador) ainda não inserido na Home');
        return;
      }
      assert.fail('Bloco B da Vitrine do Simulador deve estar presente em index.html');
    }

    assert.match(indexHtml, /simulador\.html/i, 'Bloco B na Home deve direcionar para simulador.html');
  });

  test('F24-1: Bloco Home C - Radar da Semana & Newsletter com link para blog.html (Marco M5)', (t) => {
    if (!hasBlockC) {
      if (getMode() === 'progressive') {
        t.skip('Marco M5 pendente: Bloco C (Radar da Semana) ainda não inserido na Home');
        return;
      }
      assert.fail('Bloco C do Radar da Semana deve estar presente em index.html');
    }

    assert.match(indexHtml, /blog\.html/i, 'Bloco C na Home deve direcionar para blog.html');
  });

  test('F22_F24-2: Preservação das seções adjacentes 7, 8, 9, 10, 12 e 13', () => {
    // As seções existentes não podem ser deletadas pela inserção dos blocos
    assert.ok(hasElementWithId(indexHtml, 'sobre'), 'Seção #sobre preservada');
    assert.ok(hasElementWithId(indexHtml, 'servicos'), 'Seção #servicos preservada');
    assert.ok(hasElementWithId(indexHtml, 'metodo'), 'Seção #metodo preservada');
    assert.ok(hasElementWithId(indexHtml, 'parceria'), 'Seção #parceria preservada');
    assert.ok(hasElementWithId(indexHtml, 'presenca'), 'Seção #presenca preservada');
  });

  test('F22_F24-3: Ausência de duplicação de IDs após inserção de novos blocos', () => {
    const idRegex = /\bid=["']([^"']+)["']/gi;
    const ids = [];
    let match;
    while ((match = idRegex.exec(indexHtml)) !== null) {
      ids.push(match[1]);
    }

    const uniqueIds = new Set();
    const duplicates = [];
    for (const id of ids) {
      if (uniqueIds.has(id)) {
        duplicates.push(id);
      } else {
        uniqueIds.add(id);
      }
    }

    assert.strictEqual(
      duplicates.length,
      0,
      `Não deve haver IDs duplicados no documento HTML: ${duplicates.join(', ')}`
    );
  });
});
