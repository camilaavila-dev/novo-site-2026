/**
 * TIER 1 - FEATURE F01: PRESERVAÇÃO BASELINE HOME & GIT CHECKPOINT
 * 
 * Verifica a preservação integral das 15 seções aprovadas da index.html
 * e a integridade do checkpoint Git v1-checkpoint-aprovado.
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { execSync } = require('node:child_process');
const { readFile, ROOT_DIR } = require('../helpers/env');
const { hasElementWithId, extractLinks } = require('../helpers/dom-parser');

describe('Tier 1: F01 - Preservação Baseline Home & Checkpoint Git', () => {
  const indexHtml = readFile('index.html');

  test('F01-1: Checkpoint Git v1-checkpoint-aprovado permanece intacto no histórico', () => {
    try {
      const gitTag = execSync('git tag -l v1-checkpoint-aprovado', { cwd: ROOT_DIR, encoding: 'utf-8' }).trim();
      assert.strictEqual(gitTag, 'v1-checkpoint-aprovado', 'Tag git v1-checkpoint-aprovado deve existir');

      const commitHash = execSync('git rev-parse v1-checkpoint-aprovado', { cwd: ROOT_DIR, encoding: 'utf-8' }).trim();
      assert.ok(commitHash.length >= 7, 'Tag deve apontar para um commit válido');
    } catch (err) {
      assert.fail(`Erro ao validar git checkpoint: ${err.message}`);
    }
  });

  test('F01-2: Preservação das seções estruturais de autoridade (Hero, Stats, Mídia, Filosofia, Sobre)', () => {
    // 1. Hero & Headline
    assert.match(indexHtml, /Você levou\s+<br>anos construindo/i, 'Headline do Hero deve estar presente');
    assert.match(indexHtml, /ANBIMA\s+CEA/i, 'Badge ANBIMA CEA deve constar no Hero');

    // 2. Marquee e 3. Stats Bar
    assert.match(indexHtml, /20Bi/i, 'Métrica de +R$20Bi sob consultoria deve existir');
    assert.match(indexHtml, /97/i, 'NPS 97 deve constar na barra de estatísticas');
    assert.match(indexHtml, /25k/i, 'Número de +25k clientes deve constar');

    // 4. Reconhecimento Mídia
    assert.match(indexHtml, /InfoMoney/i, 'Veículo InfoMoney deve constar na mídia');
    assert.match(indexHtml, /Estadão/i, 'Veículo Estadão deve constar na mídia');

    // 5. Filosofia
    assert.match(indexHtml, /O objetivo não é fazer mais barulho/i, 'Frase manifesto de filosofia deve existir');

    // 6. Sobre Leonardo
    assert.ok(hasElementWithId(indexHtml, 'sobre'), 'Seção #sobre deve estar preservada');
    assert.match(indexHtml, /Fee Based/i, 'Conceito Fee Based deve constar na seção Sobre');
  });

  test('F01-3: Preservação das seções de escopo, método e parceiros institucionais', () => {
    // 7. Para quem
    assert.match(indexHtml, /Investidor/i, 'Segmentação de investidor presente');
    assert.match(indexHtml, /Empresário/i, 'Segmentação de empresário presente');

    // 8. Escopo de Serviços
    assert.ok(hasElementWithId(indexHtml, 'servicos'), 'Seção #servicos deve estar preservada');
    assert.match(indexHtml, /Planejamento Financeiro/i, 'Pilar Planejamento Financeiro presente');
    assert.match(indexHtml, /Previdência e Seguros/i, 'Pilar Previdência presente');

    // 9. Método
    assert.ok(hasElementWithId(indexHtml, 'metodo'), 'Seção #metodo deve estar preservada');
    assert.match(indexHtml, /Diagnóstico/i, 'Etapa 01 Diagnóstico presente');
    assert.match(indexHtml, /Estratégia/i, 'Etapa 02 Estratégia presente');
    assert.match(indexHtml, /Acompanhamento/i, 'Etapa 03 Acompanhamento presente');

    // 10. Bancos e 11. Parceria Portfel
    assert.ok(hasElementWithId(indexHtml, 'parceria'), 'Seção #parceria deve estar preservada');
    assert.match(indexHtml, /Grupo Primo/i, 'Menção ao Grupo Primo deve estar presente');
  });

  test('F01-4: Preservação de presença global, FAQ interativo, CTA final e rodapé com CVM', () => {
    // 12. Atendimento Global
    assert.ok(hasElementWithId(indexHtml, 'presenca'), 'Seção #presenca deve estar preservada');

    // 13. FAQ
    assert.match(indexHtml, /data-faq-item/i, 'Mecanismo de acordeão FAQ preservado');
    assert.match(indexHtml, /Portfel/i, 'Pergunta sobre Portfel preservada no FAQ');

    // 14. CTA Final
    assert.ok(hasElementWithId(indexHtml, 'cta'), 'Seção #cta final deve estar preservada');

    // 15. Rodapé & CVM
    assert.match(indexHtml, /<footer/i, 'Tag <footer> deve estar presente');
    assert.match(indexHtml, /54\.475\.818\/0001-90/i, 'CNPJ oficial deve constar no rodapé');
    assert.match(indexHtml, /Resolução CVM nº\s*19\/2021/i, 'Conformidade CVM Resolução 19/2021 presente');
  });

  test('F01-5: Integridade do link oficial do formulário de agendamento', () => {
    assert.match(
      indexHtml,
      /forms\.office\.com\/Pages\/ResponsePage\.aspx\?id=6ez5YgM1m0G2Yyy_xOsD25muVoj4MslItAJalz086_lURDhJV1Y0QlVaUTZFV0RORUZMMUg2S1NKTi4u/i,
      'URL canônica do Microsoft Forms oficial deve estar presente nos botões de conversão'
    );
  });
});
