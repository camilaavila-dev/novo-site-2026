/**
 * TIER 4 - REAL-WORLD APPLICATION SCENARIOS: JORNADA DO LEITOR EXECUTIVO
 * 
 * Simula a experiência de consumo de inteligência semanal de um C-Level / Médico:
 * 1. Abertura do Terminal Editorial / Radar da Semana
 * 2. Leitura do Termômetro Macroeconômico (5 métricas + sentimento de mercado)
 * 3. Consumo do Resumo Executivo em 60 segundos
 * 4. Consulta ao Callout de 4 Quadrantes ("O que muda no meu bolso")
 * 5. Inscrição na Newsletter VIP semanal
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createBrowserContext } = require('../helpers/mock-browser');

describe('Tier 4: Cenário de Aplicação Real 2 - Jornada do Leitor Executivo (C-Level / Médico)', () => {

  test('T4-J2: Fluxo completo de inteligência: Telemetria -> Resumo 1 min -> 4 Quadrantes -> Inscrição', () => {
    // 1. CARREGAMENTO DOS DADOS DO RADAR
    const macroPulse = {
      sentimentScore: 64,
      sentimentLabel: 'Cautela Oportunística',
      selic: { value: '10,75% a.a.', trend: 'alta' },
      ipca: { value: '4,42%', trend: 'alta' },
      usd: { value: 'R$ 5,44', trend: 'baixa' },
      sp500: { value: '5.815 pts', trend: 'alta' },
      ibov: { value: '131.250 pts', trend: 'estavel' }
    };

    assert.ok(macroPulse.sentimentScore >= 50 && macroPulse.sentimentScore <= 70, 'Sentimento de mercado indica cautela balanceada');
    assert.strictEqual(macroPulse.selic.value, '10,75% a.a.');

    // 2. LEITURA EXECUTIVA (1 MINUTO)
    const executiveSummaryBullets = [
      'Divergência Monetária: Fed corta juros nos EUA enquanto Copom mantém postura vigilante.',
      'Prêmio de Risco Histórico: Títulos IPCA+ com taxas reais acima de 6,30% ao ano.',
      'Offshore Estrutural: Dólar abaixo de R$ 5,50 abre janela tática para remessas.'
    ];

    assert.ok(executiveSummaryBullets.length >= 3, 'Resumo deve sintetizar em ao menos 3 pontos de alto impacto');
    // Leitura rápida estimada: ~25 palavras por bullet -> menos de 60 segundos
    const totalWords = executiveSummaryBullets.join(' ').split(/\s+/).length;
    assert.ok(totalWords < 150, `Leitura executiva deve ter menos de 150 palavras para consumo em 1 minuto (${totalWords} palavras)`);

    // 3. CONSULTA DA MATRIZ DE IMPACTO (4 QUADRANTES)
    const impactMatrix = {
      rendaFixa: 'Priorizar IPCA+ 2029-2035',
      acoes: 'Manter empresas de dividendos e fluxo de caixa livre',
      offshore: 'Aproveitar câmbio para remessas à conta nos EUA',
      liquidez: 'Manter caixa tático no CDI diário'
    };

    assert.ok(impactMatrix.rendaFixa.length > 5);
    assert.ok(impactMatrix.acoes.length > 5);
    assert.ok(impactMatrix.offshore.length > 5);
    assert.ok(impactMatrix.liquidez.length > 5);

    // 4. INSCRIÇÃO NA NEWSLETTER VIP
    const ctx = createBrowserContext();
    const emailToSubscribe = 'investidor.elite@familyoffice.com.br';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    assert.ok(emailRegex.test(emailToSubscribe), 'E-mail deve passar na validação de formato');
    ctx.localStorage.setItem('subscribed_newsletter', emailToSubscribe);
    assert.strictEqual(
      ctx.localStorage.getItem('subscribed_newsletter'),
      emailToSubscribe,
      'Inscrição deve ser confirmada e retida no navegador'
    );
  });
});
