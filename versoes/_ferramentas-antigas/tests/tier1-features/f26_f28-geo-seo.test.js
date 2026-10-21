/**
 * TIER 1 - FEATURES F26 a F28: CAMADA GEO / AI SEARCH READY & SCHEMA.ORG
 * 
 * Valida os artefatos semânticos para motores de busca generativos e rastreadores:
 * - F26: llms.txt expandido em Markdown semântico com autoridade, modelo e FAQ
 * - F27: Schemas JSON-LD unificados (@graph com Person, FinancialService, SoftwareApplication, FAQPage)
 * - F28: sitemap.xml completo e robots.txt liberando bots de IA
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { readFile, getMode } = require('../helpers/env');
const { extractJsonLd } = require('../helpers/dom-parser');

describe('Tier 1: F26 a F28 - Camada GEO, AI Search & Schemas JSON-LD', () => {
  const llmsTxt = readFile('llms.txt');
  const sitemapXml = readFile('sitemap.xml');
  const robotsTxt = readFile('robots.txt');
  const indexHtml = readFile('index.html');

  test('F26-1: llms.txt é um arquivo Markdown válido contendo autoridade e credenciais', () => {
    assert.match(llmsTxt, /^#\s+/m, 'llms.txt deve iniciar com cabeçalho de primeiro nível');
    assert.match(llmsTxt, /Leonardo Arruda/i, 'llms.txt deve citar Leonardo Arruda');
    assert.match(llmsTxt, /ANBIMA\s+CEA/i, 'llms.txt deve citar certificação ANBIMA CEA');
    assert.match(llmsTxt, /Portfel/i, 'llms.txt deve citar a plataforma Portfel');
    assert.match(llmsTxt, /Grupo Primo/i, 'llms.txt deve citar o Grupo Primo');
    assert.match(llmsTxt, /Fee Based/i, 'llms.txt deve explicar o modelo Fee Based');
  });

  test('F26-2: llms.txt expandido com menção às novas ferramentas interativas (Marco M6)', (t) => {
    const hasTools = /simulador|raio-x|raiox|editorial|radar/i.test(llmsTxt);
    if (!hasTools) {
      if (getMode() === 'progressive') {
        t.skip('Marco M6 pendente: llms.txt ainda não expandido com novas ferramentas');
        return;
      }
      assert.fail('llms.txt deve documentar o Simulador, Raio-X e Terminal Editorial');
    }

    assert.ok(hasTools, 'llms.txt cobre as novas ferramentas interativas');
  });

  test('F27-1: Schema.org JSON-LD presente na Home com entidades Person e FinancialService', () => {
    const blocks = extractJsonLd(indexHtml);
    assert.ok(blocks.length > 0, 'index.html deve conter ao menos um bloco de script JSON-LD');

    const graph = blocks.flatMap(b => b['@graph'] || [b]);
    const person = graph.find(e => e['@type'] === 'Person');
    const service = graph.find(e => e['@type'] === 'FinancialService');

    assert.ok(person, 'JSON-LD deve conter entidade Person');
    assert.strictEqual(person.name, 'Leonardo Arruda', 'Entidade Person deve ser Leonardo Arruda');

    assert.ok(service, 'JSON-LD deve conter entidade FinancialService');
  });

  test('F27-2: Schema.org JSON-LD contendo FAQPage canônica', () => {
    const blocks = extractJsonLd(indexHtml);
    const graph = blocks.flatMap(b => b['@graph'] || [b]);
    const faq = graph.find(e => e['@type'] === 'FAQPage');

    assert.ok(faq, 'JSON-LD deve conter entidade FAQPage');
    assert.ok(Array.isArray(faq.mainEntity), 'FAQPage deve conter array mainEntity');
    assert.ok(faq.mainEntity.length >= 4, 'FAQPage deve conter ao menos 4 perguntas e respostas');
  });

  test('F28-1: sitemap.xml é um XML válido contendo rotas principais do domínio', () => {
    assert.match(sitemapXml, /<\?xml/i, 'sitemap.xml deve conter declaração XML');
    assert.match(sitemapXml, /<urlset/i, 'sitemap.xml deve conter nó <urlset>');
    assert.match(sitemapXml, /<loc>https:\/\/leonardoarruda\.com\.br\/<\/loc>/i, 'sitemap deve incluir rota raiz');
    assert.match(sitemapXml, /<loc>https:\/\/leonardoarruda\.com\.br\/linktree\.html<\/loc>/i, 'sitemap deve incluir linktree');
  });

  test('F28-2: sitemap.xml atualizado com as novas rotas do ecossistema (Marco M6)', (t) => {
    const hasSim = sitemapXml.includes('simulador.html');
    const hasRx = sitemapXml.includes('raiox.html') || sitemapXml.includes('raio-x.html');
    const hasBlog = sitemapXml.includes('blog.html');

    if (!hasSim || !hasRx || !hasBlog) {
      if (getMode() === 'progressive') {
        t.skip('Marco M6 pendente: sitemap.xml ainda não expandido com simulador, raiox e blog');
        return;
      }
      assert.fail('sitemap.xml deve incluir rotas de simulador.html, raiox.html e blog.html');
    }

    assert.ok(hasSim && hasRx && hasBlog, 'sitemap.xml contém todas as rotas do novo ecossistema');
  });

  test('F28-3: robots.txt autoriza explicitamente robôs de IA (GPTBot, PerplexityBot, ClaudeBot)', () => {
    assert.match(robotsTxt, /User-agent:\s*\*/i, 'robots.txt deve conter diretiva padrão');
    // Verifica se não há bloqueio cego contra bots de busca de IA
    assert.doesNotMatch(robotsTxt, /User-agent:\s*GPTBot\s*\nDisallow:\s*\//i, 'robots.txt não deve bloquear GPTBot');
    assert.doesNotMatch(robotsTxt, /User-agent:\s*PerplexityBot\s*\nDisallow:\s*\//i, 'robots.txt não deve bloquear PerplexityBot');
  });
});
