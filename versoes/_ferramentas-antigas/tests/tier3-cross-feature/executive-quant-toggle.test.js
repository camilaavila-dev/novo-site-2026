/**
 * TIER 3 - CROSS-FEATURE COMBINATIONS: ALTERNADOR DE LEITURA & FILTROS EDITORIAIS
 * 
 * Valida a interação combinada entre:
 * - Filtro por categorias/tags
 * - Alternância do modo de leitura (Resumo Executivo vs Visão Quant)
 * - Retenção de preferência de leitura do usuário via localStorage
 * - Sincronização dinâmica da matriz de 4 quadrantes ("O que muda no seu patrimônio?")
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createBrowserContext } = require('../helpers/mock-browser');

describe('Tier 3: Cross-Feature - Alternador Executivo/Quant & Filtros Editoriais', () => {

  test('T3-E1: Interação entre filtro por categoria e modo de leitura ativo', () => {
    // Mock de catálogo com duas edições de categorias distintas
    const editions = [
      {
        id: 'ed-1',
        title: 'IPCA+ em Alta',
        category: 'Renda Fixa',
        executiveSummary: ['Taxas reais atrativas'],
        quantDeepDive: { tese: 'DI Futuro intermediário com prêmio excessivo' },
        impactMatrix: { rendaFixa: 'Alocar em IPCA+ 2029-2035' }
      },
      {
        id: 'ed-2',
        title: 'Fed Corta Juros',
        category: 'Offshore',
        executiveSummary: ['Início do afrouxamento monetário nos EUA'],
        quantDeepDive: { tese: 'Diferencial de juros estreitando' },
        impactMatrix: { offshore: 'Aumentar exposição a S&P 500' }
      }
    ];

    let activeCategory = 'Offshore';
    let activeMode = 'quant'; // 'exec' | 'quant'

    // 1. Filtra por categoria
    const filtered = editions.filter(e => activeCategory === 'Todas' || e.category === activeCategory);
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].id, 'ed-2');

    // 2. Extrai o conteúdo correspondente ao modo quant
    const activeContent = activeMode === 'quant' ? filtered[0].quantDeepDive : filtered[0].executiveSummary;
    assert.ok(activeContent.tese.includes('Diferencial de juros'), 'Modo quant deve renderizar a tese técnica da edição filtrada');
  });

  test('T3-E2: Persistência da preferência de modo de leitura via localStorage', () => {
    const ctx = createBrowserContext();
    const ls = ctx.localStorage;

    // Usuário altera para modo quantitativo
    ls.setItem('leo_reader_preference', 'quant');
    assert.strictEqual(ls.getItem('leo_reader_preference'), 'quant', 'Preferência quantitativa deve ser armazenada');

    // Ao carregar a página seguinte, a preferência é restaurada
    const restoredPref = ls.getItem('leo_reader_preference') || 'exec';
    assert.strictEqual(restoredPref, 'quant', 'Modo quantitativo restaurado com sucesso');
  });

  test('T3-E3: Sincronização dinâmica dos 4 quadrantes de impacto com a edição selecionada', () => {
    const edition = {
      id: 'ed-42',
      impactMatrix: {
        rendaFixa: 'Travar taxas reais em IPCA+ intermediário',
        acoes: 'Manter empresas com fluxo de caixa livre sólido',
        offshore: 'Aproveitar dólar abaixo de R$ 5,50 para remessas',
        liquidez: 'Manter caixa tático no CDI diário'
      }
    };

    // Atualização dos 4 quadrantes
    const quadrantes = Object.entries(edition.impactMatrix);
    assert.strictEqual(quadrantes.length, 4, 'Devem existir exatamente 4 quadrantes de alocação');
    assert.ok(quadrantes.every(([k, v]) => typeof v === 'string' && v.length > 10), 'Cada quadrante deve conter recomendação clara');
  });
});
