/**
 * MUNDO INTERATIVO DA JORNADA DE INVESTIMENTOS — LEONARDO ARRUDA (PORTFEL)
 * Controla:
 * 1. Personagem / Viajante andando pelas ilhas via WASD, Setas, Scroll, Toque e Cliques
 * 2. Canvas 2.5D com pontes iluminadas, partículas de água e pegadas do viajante
 * 3. Sistema de XP, Níveis (Lv. 1 a Lv. 6), Missão Atual e 6 Badges desbloqueáveis
 * 4. Mini-Mapa (WORLD MAP) com pino GPS em tempo real e controle de Zoom (+/-)
 * 5. Sintetizador Web Audio API (Modo Foco / Lofi & Mar)
 * 6. Modais Interativos das 6 Ilhas + As 5 Calculadoras Práticas da Vida (digitáveis no teclado)
 */
(function () {
  'use strict';

  const FORM_URL = 'https://forms.office.com/Pages/ResponsePage.aspx?id=6ez5YgM1m0G2Yyy_xOsD25muVoj4MslItAJalz086_lURDhJV1Y0QlVaUTZFV0RORUZMMUg2S1NKTi4u';

  // ==========================================================================
  // 1. DADOS DAS 6 ILHAS DA JORNADA PATRIMONIAL
  // ==========================================================================
  const ISLANDS = [
    {
      id: 0,
      code: '00',
      x: 41.0,
      y: 76.0,
      title: 'Mirante da Partida',
      sub: 'Início da Jornada',
      badgeIcon: '🧭',
      badgeName: 'Ponto de Partida',
      speech: 'Use WASD, Scroll ou clique numa ilha! ✨',
      questText: 'Comece sua caminhada! Clique na Ilha 01 ou use W A S D para explorar o mapa.'
    },
    {
      id: 1,
      code: '01',
      x: 44.0,
      y: 29.0,
      title: 'SOBRE O LEO & A PORTFEL',
      sub: 'Quem guia você · Consultoria sem conflito 👤',
      badgeIcon: '⭐',
      badgeName: 'Alinhamento Puro',
      speech: 'Ilha 01: Consultoria 100% do seu lado!',
      questText: 'Excelente! Agora caminhe até a Ilha 02 para fazer o Raio-X da sua carteira.'
    },
    {
      id: 2,
      code: '02',
      x: 58.0,
      y: 39.0,
      title: 'RAIO-X DA CARTEIRA',
      sub: 'Onde seu dinheiro está desprotegido 🛡️',
      badgeIcon: '🛡️',
      badgeName: 'Olhos de Raio-X',
      speech: 'Ilha 02: Hora de escanear sua carteira!',
      questText: 'Ótimo diagnóstico! Siga para a Ilha 03 e teste as 5 Calculadoras da Vida.'
    },
    {
      id: 3,
      code: '03',
      x: 73.0,
      y: 35.0,
      title: 'CALCULADORAS DA VIDA',
      sub: 'Viver de Renda · Imóvel · Taxas · Sucessão 🧮',
      badgeIcon: '🧮',
      badgeName: 'Estrategista da Vida',
      speech: 'Ilha 03: Simule seu futuro em números reais!',
      questText: 'Números claros! Atravesse para a Ilha 04 e conheça os 4 Territórios de Proteção.'
    },
    {
      id: 4,
      code: '04',
      x: 22.0,
      y: 44.0,
      title: 'OS 4 TERRITÓRIOS DE PROTEÇÃO',
      sub: 'Renda, Seguros, Dólar/Offshore e M&A 🏰',
      badgeIcon: '🏰',
      badgeName: 'Guardião da Fortaleza',
      speech: 'Ilha 04: A Fortaleza dos 4 Territórios!',
      questText: 'Patrimônio blindado! Visite a Ilha 05 para ver o Diário & Notícias da Semana.'
    },
    {
      id: 5,
      code: '05',
      x: 69.0,
      y: 53.0,
      title: 'DIÁRIO & NOTÍCIAS DA SEMANA',
      sub: 'O pulso do mercado em 1 min + Newsletter 📰',
      badgeIcon: '📰',
      badgeName: 'Visão de Mercado',
      speech: 'Ilha 05: O pulso do mercado sem ruído!',
      questText: 'Você está quase no topo! Caminhe até a Ilha 06 para Conversar com o Leo.'
    },
    {
      id: 6,
      code: '06',
      x: 58.5,
      y: 64.0,
      title: 'CONVERSAR COM O LEO',
      sub: 'Agendar seu diagnóstico pessoal ✈️',
      badgeIcon: '👑',
      badgeName: 'Soberania Patrimonial',
      speech: 'Ilha 06: Vamos desenhar seu plano juntos!',
      questText: 'Parabéns! Você explorou a jornada e está pronto para sua conversa individual com o Leo.'
    }
  ];

  // Pontes conectando as ilhas para renderização luminosa no Canvas
  const BRIDGE_SEGMENTS = [
    [0, 6],
    [6, 5],
    [6, 2],
    [5, 2],
    [5, 3],
    [2, 3],
    [2, 1],
    [1, 4],
    [0, 4]
  ];

  // ==========================================================================
  // 2. AS 5 CALCULADORAS PRÁTICAS DA VIDA (LINGUAGEM SIMPLES & DIGITÁVEIS)
  // ==========================================================================
  const CALC5_TABS = [
    { num: 1, id: 'renda', icon: '🏝️', title: '1. Viver de Renda', sub: 'Quando parar de trabalhar?' },
    { num: 2, id: 'imovel', icon: '🏠', title: '2. Imóvel vs. Investir', sub: 'Comprar ou deixar rendendo?' },
    { num: 3, id: 'banco', icon: '💸', title: '3. Ralo das Taxas', sub: 'Quanto o banco tira de você?' },
    { num: 4, id: 'dolar', icon: '🌎', title: '4. Proteção em Dólar', sub: 'Blindagem internacional' },
    { num: 5, id: 'heranca', icon: '🛡️', title: '5. Inventário & Sucessão', sub: 'Proteger herdeiros e família' }
  ];

  function formatBRL(val) {
    const n = Number(val) || 0;
    return 'R$ ' + Math.round(n).toLocaleString('pt-BR');
  }

  function parseNumericInput(raw, fallback, min, max, clampMin = true) {
    if (typeof raw !== 'string') raw = String(raw ?? '');
    const cleaned = raw.replace(/[^\d.,-]/g, '').replace(/\.(?=.*\.)/g, '').replace(',', '.');
    if (cleaned.trim() === '' || cleaned.trim() === '-') {
      return clampMin ? (typeof min === 'number' ? min : fallback) : 0;
    }
    let num = parseFloat(cleaned);
    if (!Number.isFinite(num)) num = fallback;
    if (clampMin && typeof min === 'number' && num < min) num = min;
    if (!clampMin && num < 0) num = 0;
    if (typeof max === 'number' && num > max) num = max;
    return num;
  }

  const CALC5_STATE = {
    activeTab: 1,
    activeSlug: 'renda',
    // Calc 1: Quando posso viver de renda?
    c1_hoje: 500000,
    c1_mensal: 10000,
    c1_rendaDesejada: 25000,
    c1_anos: 15,
    // Calc 2: Imóvel vs. Investimento
    c2_valorImovel: 1500000,
    c2_aluguel: 6500,
    c2_rendimentoAnual: 10.8,
    c2_anos: 10,
    // Calc 3: O Ralo das Taxas do Banco
    c3_patrimonio: 1000000,
    c3_mensal: 10000,
    c3_taxaBanco: 2.2,
    c3_anos: 15,
    // Calc 4: Proteção em Dólar
    c4_patrimonio: 2000000,
    c4_atualDolarPct: 5,
    c4_metaDolarPct: 25,
    c4_cambio: 5.42,
    // Calc 5: Inventário & Sucessão
    c5_patrimonioFamilia: 3000000,
    c5_impostoCartorioPct: 8,
    c5_advogadoCustosPct: 6,
    c5_liquidezImediataPct: 3.5
  };

  function computeCalc5Results(s) {
    // 1. Viver de Renda (juro real líquido ~6.2% a.a. já descontando inflação)
    const rRealAnual = 0.062;
    const rRealMensal = Math.pow(1 + rRealAnual, 1 / 12) - 1;
    const meses1 = Math.max(1, Math.round(s.c1_anos * 12));
    const fator1 = Math.pow(1 + rRealMensal, meses1);
    const totalAcumulado1 = s.c1_hoje * fator1 + s.c1_mensal * ((fator1 - 1) / rRealMensal);
    const rendaVitaliciaGerada1 = (totalAcumulado1 * 0.04) / 12; // 4% a.a. retirada segura
    const metaNecessaria1 = (s.c1_rendaDesejada * 12) / 0.04;
    // Calcula em quantos anos atinge a meta
    let mesesAteMeta = 0;
    let saldoTemp = s.c1_hoje;
    while (saldoTemp < metaNecessaria1 && mesesAteMeta < 600) {
      saldoTemp = saldoTemp * (1 + rRealMensal) + s.c1_mensal;
      mesesAteMeta++;
    }
    const jaAtingida = s.c1_hoje >= metaNecessaria1 && metaNecessaria1 > 0;
    const inalcancavel = !jaAtingida && mesesAteMeta >= 600 && saldoTemp < metaNecessaria1;
    const anosAteLiberdade = jaAtingida ? 0 : Math.max(1, Math.ceil(mesesAteMeta / 12));
    const anoLiberdade = 2026 + anosAteLiberdade;
    const anoLabel = jaAtingida
      ? '2026 (Já atingida!)'
      : (inalcancavel ? '> 50 anos' : `${anoLiberdade} (${anosAteLiberdade}a)`);

    // 2. Imóvel vs. Investir
    const rCarteiraMensal = Math.pow(1 + (s.c2_rendimentoAnual / 100), 1 / 12) - 1;
    const rendaMensalCarteira = s.c2_valorImovel * rCarteiraMensal;
    const sobraMensal = rendaMensalCarteira - s.c2_aluguel;
    const pctAluguelCoberto = s.c2_aluguel > 0 ? Math.min(999, Math.round((rendaMensalCarteira / s.c2_aluguel) * 100)) : 100;
    const sobraLabel = sobraMensal >= 0
      ? `+${formatBRL(sobraMensal)}/mês`
      : `-${formatBRL(Math.abs(sobraMensal))}/mês`;
    const meses2 = Math.max(1, Math.round(s.c2_anos * 12));
    // Se deixar investido e pagar o aluguel com o rendimento (reinvestindo a sobra):
    let saldoInvestindo = s.c2_valorImovel;
    for (let m = 0; m < meses2; m++) {
      saldoInvestindo = Math.max(0, saldoInvestindo * (1 + rCarteiraMensal) - s.c2_aluguel);
    }
    // Imóvel valorizando ~5% a.a. (IPCA) menos 6% de custos de compra/ITBI/escritura
    const valorImovelFuturo = (s.c2_valorImovel * 0.94) * Math.pow(1 + 0.05, s.c2_anos);
    const vantagemInvestir = Math.max(0, saldoInvestindo - valorImovelFuturo);
    const c2Texto = sobraMensal >= 0
      ? `🏠 Os <strong>${formatBRL(s.c2_valorImovel)}</strong> investidos geram <strong>${formatBRL(rendaMensalCarteira)}/mês</strong>: pagam 100% do aluguel de ${formatBRL(s.c2_aluguel)} e ainda sobram <strong>${formatBRL(sobraMensal)}/mês</strong> para reinvestir com liquidez total!`
      : `🏠 Os <strong>${formatBRL(s.c2_valorImovel)}</strong> investidos geram <strong>${formatBRL(rendaMensalCarteira)}/mês</strong> (cobrindo <strong>${pctAluguelCoberto}%</strong> do aluguel de ${formatBRL(s.c2_aluguel)}, faltando ${formatBRL(Math.abs(sobraMensal))}/mês) e mantendo liquidez em vez de travar o capital no imóvel.`;

    // 3. O Ralo das Taxas do Banco
    const meses3 = Math.max(1, Math.round(s.c3_anos * 12));
    const rBruto = 0.075; // 7.5% real bruto antes de custos
    const rFeeBasedAnual = rBruto - 0.006; // 0.6% transparente
    const rBancoAnual = Math.max(0.01, rBruto - (s.c3_taxaBanco / 100));
    const rmFee = Math.pow(1 + rFeeBasedAnual, 1 / 12) - 1;
    const rmBanco = Math.pow(1 + rBancoAnual, 1 / 12) - 1;
    const totalFeeBased = s.c3_patrimonio * Math.pow(1 + rmFee, meses3) + s.c3_mensal * ((Math.pow(1 + rmFee, meses3) - 1) / rmFee);
    const totalBanco = s.c3_patrimonio * Math.pow(1 + rmBanco, meses3) + s.c3_mensal * ((Math.pow(1 + rmBanco, meses3) - 1) / rmBanco);
    const dinheiroSalvoTaxas = Math.max(0, totalFeeBased - totalBanco);
    const anosPoupados = (dinheiroSalvoTaxas / Math.max(12000, s.c3_mensal * 12)).toFixed(1).replace('.', ',');

    // 4. Proteção em Dólar
    const valorAtualBRL = s.c4_patrimonio * (s.c4_atualDolarPct / 100);
    const valorMetaBRL = s.c4_patrimonio * (s.c4_metaDolarPct / 100);
    const faltaAlocarBRL = Math.max(0, valorMetaBRL - valorAtualBRL);
    const valorMetaUSD = valorMetaBRL / Math.max(1, s.c4_cambio);
    const projecao10AnosUSD = valorMetaUSD * Math.pow(1 + 0.065, 10); // ~6.5% a.a. em USD

    // 5. Inventário & Sucessão Familiar
    const pctTotalInventario = (s.c5_impostoCartorioPct + s.c5_advogadoCustosPct) / 100;
    const custoInventarioTradicional = s.c5_patrimonioFamilia * pctTotalInventario;
    const custoComPlanejamento = s.c5_patrimonioFamilia * (s.c5_liquidezImediataPct / 100);
    const economiaSucessao = Math.max(0, custoInventarioTradicional - custoComPlanejamento);

    return {
      c1: { totalAcumulado1, rendaVitaliciaGerada1, metaNecessaria1, anosAteLiberdade, anoLiberdade, anoLabel, jaAtingida, inalcancavel },
      c2: { rendaMensalCarteira, sobraMensal, sobraLabel, pctAluguelCoberto, saldoInvestindo, valorImovelFuturo, vantagemInvestir, c2Texto },
      c3: { totalFeeBased, totalBanco, dinheiroSalvoTaxas, anosPoupados },
      c4: { valorAtualBRL, valorMetaBRL, faltaAlocarBRL, valorMetaUSD, projecao10AnosUSD },
      c5: { custoInventarioTradicional, custoComPlanejamento, economiaSucessao }
    };
  }

  function renderCalc5HTML() {
    const s = CALC5_STATE;
    const res = computeCalc5Results(s);
    const tab = s.activeTab;

    const tabsHeader = `
      <div class="calc5-tabs-bar" role="tablist" aria-label="Escolha uma das 5 Calculadoras da Vida">
        ${CALC5_TABS.map(t => `
          <button type="button" class="calc5-tab-btn ${tab === t.num ? 'is-active' : ''}" data-calc5-tab="${t.num}" data-calc5-slug="${t.id}" role="tab" aria-selected="${tab === t.num ? 'true' : 'false'}">
            <span>${t.icon} ${t.title}</span>
            <small style="font-size:10px;opacity:.75;font-weight:400">${t.sub}</small>
          </button>
        `).join('')}
      </div>
    `;

    let bodyHTML = '';

    if (tab === 1) {
      bodyHTML = `
        <div class="calc5-workspace">
          <div class="calc5-inputs-card">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <strong style="font-size:15px;color:#fff">1. Quando posso viver de renda?</strong>
                <span style="font-family:var(--m);font-size:10px;color:#1CD98A">DIGITE OU ARRASTE</span>
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Quanto você já tem guardado hoje (R$)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c1_hoje" data-min="0" data-max="50000000" value="${formatBRL(s.c1_hoje)}" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c1_hoje" min="0" max="10000000" step="50000" value="${Math.min(10000000, s.c1_hoje)}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Quanto consegue investir por mês (R$)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c1_mensal" data-min="0" data-max="500000" value="${formatBRL(s.c1_mensal)}" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c1_mensal" min="0" max="100000" step="500" value="${Math.min(100000, s.c1_mensal)}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Renda mensal desejada no futuro (R$)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c1_rendaDesejada" data-min="2000" data-max="500000" value="${formatBRL(s.c1_rendaDesejada)}" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c1_rendaDesejada" min="5000" max="150000" step="1000" value="${Math.min(150000, s.c1_rendaDesejada)}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Por quantos anos vai acumular</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c1_anos" data-min="1" data-max="50" value="${s.c1_anos} anos" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c1_anos" min="1" max="40" step="1" value="${s.c1_anos}">
              </div>
            </div>
          </div>
          <div class="calc5-results-card">
            <div>
              <div style="font-family:var(--m);font-size:10px;color:#1CD98A;text-transform:uppercase;letter-spacing:.12em">Resultado em Dinheiro de Hoje (Descontando a Inflação)</div>
              <div class="calc5-kpi-grid">
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label" data-calc5-out="c1_label_anos">Patrimônio em ${s.c1_anos} anos</div>
                  <div class="calc5-kpi-val is-green" data-calc5-out="c1_total">${formatBRL(res.c1.totalAcumulado1)}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Renda Mensal Vitalícia</div>
                  <div class="calc5-kpi-val" data-calc5-out="c1_renda">${formatBRL(res.c1.rendaVitaliciaGerada1)}/mês</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Ano da sua Liberdade</div>
                  <div class="calc5-kpi-val is-green" data-calc5-out="c1_ano">${res.c1.anoLabel}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label" data-calc5-out="c1_label_meta">Meta p/ ${formatBRL(s.c1_rendaDesejada)}/mês</div>
                  <div class="calc5-kpi-val" data-calc5-out="c1_meta">${formatBRL(res.c1.metaNecessaria1)}</div>
                </div>
              </div>
              <p style="font-size:12.5px;color:#EDE8D5;line-height:1.5;background:rgba(0,0,0,0.28);padding:10px 12px;border-radius:10px" data-calc5-out="c1_texto">
                💡 Guardando <strong>${formatBRL(s.c1_mensal)}/mês</strong>, você acumula <strong>${formatBRL(res.c1.totalAcumulado1)}</strong> líquidos de inflação em ${s.c1_anos} anos — gerando uma renda segura de <strong>${formatBRL(res.c1.rendaVitaliciaGerada1)} por mês</strong> sem nunca gastar o valor principal!
              </p>
            </div>
            <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
              <a href="${FORM_URL}" target="_blank" style="flex:1;text-align:center;padding:10px 14px;background:#1CD98A;color:#04120A;border-radius:10px;font-weight:700;font-size:12.5px;text-decoration:none">Montar Meu Plano com o Leo ↗</a>
              <a href="simulador.html" style="padding:10px 14px;background:rgba(255,255,255,0.08);color:#fff;border-radius:10px;font-size:12px;text-decoration:none;border:1px solid rgba(255,255,255,0.16)">Abrir Tela Cheia</a>
            </div>
          </div>
        </div>
      `;
    } else if (tab === 2) {
      bodyHTML = `
        <div class="calc5-workspace">
          <div class="calc5-inputs-card">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <strong style="font-size:15px;color:#fff">2. Imóvel vs. Investimento</strong>
                <span style="font-family:var(--m);font-size:10px;color:#1CD98A">DIGITE OU ARRASTE</span>
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Valor do Imóvel que pensa em comprar (R$)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c2_valorImovel" data-min="100000" data-max="50000000" value="${formatBRL(s.c2_valorImovel)}" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c2_valorImovel" min="200000" max="10000000" step="50000" value="${Math.min(10000000, s.c2_valorImovel)}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Aluguel mensal de um imóvel igual (R$)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c2_aluguel" data-min="500" data-max="200000" value="${formatBRL(s.c2_aluguel)}" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c2_aluguel" min="1500" max="50000" step="500" value="${Math.min(50000, s.c2_aluguel)}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Rendimento líquido da carteira (% ao ano)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c2_rendimentoAnual" data-min="4" data-max="20" value="${s.c2_rendimentoAnual.toFixed(1).replace('.', ',')}% a.a." inputmode="decimal">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c2_rendimentoAnual" min="6" max="16" step="0.2" value="${s.c2_rendimentoAnual}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Prazo de comparação (anos)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c2_anos" data-min="1" data-max="30" value="${s.c2_anos} anos" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c2_anos" min="1" max="30" step="1" value="${s.c2_anos}">
              </div>
            </div>
          </div>
          <div class="calc5-results-card">
            <div>
              <div style="font-family:var(--m);font-size:10px;color:#1CD98A;text-transform:uppercase;letter-spacing:.12em">Comparativo Direto: Imobilizar vs. Manter Investido</div>
              <div class="calc5-kpi-grid">
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Renda mensal da carteira</div>
                  <div class="calc5-kpi-val is-green" data-calc5-out="c2_renda">${formatBRL(res.c2.rendaMensalCarteira)}/mês</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Saldo mensal c/ aluguel</div>
                  <div class="calc5-kpi-val ${res.c2.sobraMensal >= 0 ? 'is-green' : ''}" data-calc5-out="c2_sobra">${res.c2.sobraLabel}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label" data-calc5-out="c2_label_carteira">Carteira em ${s.c2_anos} anos</div>
                  <div class="calc5-kpi-val is-green" data-calc5-out="c2_carteira">${formatBRL(res.c2.saldoInvestindo)}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label" data-calc5-out="c2_label_imovel">Imóvel Físico em ${s.c2_anos} anos</div>
                  <div class="calc5-kpi-val" data-calc5-out="c2_imovel">${formatBRL(res.c2.valorImovelFuturo)}</div>
                </div>
              </div>
              <p style="font-size:12.5px;color:#EDE8D5;line-height:1.5;background:rgba(0,0,0,0.28);padding:10px 12px;border-radius:10px" data-calc5-out="c2_texto">
                ${res.c2.c2Texto}
              </p>
            </div>
            <div style="display:flex;gap:10px;margin-top:12px">
              <a href="${FORM_URL}" target="_blank" style="flex:1;text-align:center;padding:10px 14px;background:#1CD98A;color:#04120A;border-radius:10px;font-weight:700;font-size:12.5px;text-decoration:none">Avaliar Decisão Imobiliária com o Leo ↗</a>
            </div>
          </div>
        </div>
      `;
    } else if (tab === 3) {
      bodyHTML = `
        <div class="calc5-workspace">
          <div class="calc5-inputs-card">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <strong style="font-size:15px;color:#fff">3. O Ralo das Taxas do Banco</strong>
                <span style="font-family:var(--m);font-size:10px;color:#1CD98A">DIGITE OU ARRASTE</span>
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Seu patrimônio investido hoje (R$)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c3_patrimonio" data-min="50000" data-max="50000000" value="${formatBRL(s.c3_patrimonio)}" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c3_patrimonio" min="100000" max="10000000" step="50000" value="${Math.min(10000000, s.c3_patrimonio)}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Quanto você guarda por mês (R$)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c3_mensal" data-min="0" data-max="500000" value="${formatBRL(s.c3_mensal)}" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c3_mensal" min="0" max="100000" step="500" value="${Math.min(100000, s.c3_mensal)}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Taxas ocultas/embutidas no banco (% a.a.)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c3_taxaBanco" data-min="1.0" data-max="4.5" value="${s.c3_taxaBanco.toFixed(1).replace('.', ',')}% a.a." inputmode="decimal">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c3_taxaBanco" min="1.2" max="4.0" step="0.1" value="${s.c3_taxaBanco}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Prazo de investimento (anos)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c3_anos" data-min="1" data-max="40" value="${s.c3_anos} anos" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c3_anos" min="1" max="35" step="1" value="${s.c3_anos}">
              </div>
            </div>
          </div>
          <div class="calc5-results-card">
            <div>
              <div style="font-family:var(--m);font-size:10px;color:#1CD98A;text-transform:uppercase;letter-spacing:.12em">Dinheiro que Fica na Sua Família vs. Comissão Bancária</div>
              <div class="calc5-kpi-grid">
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Com Consultoria Fee-Based</div>
                  <div class="calc5-kpi-val is-green" data-calc5-out="c3_fee">${formatBRL(res.c3.totalFeeBased)}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">No Banco Comum</div>
                  <div class="calc5-kpi-val" data-calc5-out="c3_banco">${formatBRL(res.c3.totalBanco)}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Dinheiro Salvo p/ Você</div>
                  <div class="calc5-kpi-val is-green" data-calc5-out="c3_salvo">+${formatBRL(res.c3.dinheiroSalvoTaxas)}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Tempo de Vida Poupado</div>
                  <div class="calc5-kpi-val" data-calc5-out="c3_anosPoupados">${res.c3.anosPoupados} anos</div>
                </div>
              </div>
              <p style="font-size:12.5px;color:#EDE8D5;line-height:1.5;background:rgba(0,0,0,0.28);padding:10px 12px;border-radius:10px" data-calc5-out="c3_texto">
                💸 No modelo <strong>Fee-Based</strong> (onde toda comissão bancária é devolvida a você), sua família preserva <strong>+${formatBRL(res.c3.dinheiroSalvoTaxas)}</strong> que iriam para metas de gerentes e fundos caros!
              </p>
            </div>
            <div style="display:flex;gap:10px;margin-top:12px">
              <a href="${FORM_URL}" target="_blank" style="flex:1;text-align:center;padding:10px 14px;background:#1CD98A;color:#04120A;border-radius:10px;font-weight:700;font-size:12.5px;text-decoration:none">Auditar Taxas da Minha Carteira ↗</a>
            </div>
          </div>
        </div>
      `;
    } else if (tab === 4) {
      bodyHTML = `
        <div class="calc5-workspace">
          <div class="calc5-inputs-card">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <strong style="font-size:15px;color:#fff">4. Proteção em Dólar &amp; Offshore</strong>
                <span style="font-family:var(--m);font-size:10px;color:#1CD98A">DIGITE OU ARRASTE</span>
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Seu patrimônio total atual (R$)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c4_patrimonio" data-min="100000" data-max="100000000" value="${formatBRL(s.c4_patrimonio)}" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c4_patrimonio" min="100000" max="20000000" step="100000" value="${Math.min(20000000, s.c4_patrimonio)}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Quanto já está em Dólar hoje (%)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c4_atualDolarPct" data-min="0" data-max="100" value="${s.c4_atualDolarPct}%" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c4_atualDolarPct" min="0" max="60" step="1" value="${s.c4_atualDolarPct}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Meta recomendada em moeda forte (%)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c4_metaDolarPct" data-min="5" data-max="80" value="${s.c4_metaDolarPct}%" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c4_metaDolarPct" min="10" max="60" step="5" value="${s.c4_metaDolarPct}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Cotação de referência do Dólar (R$)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c4_cambio" data-min="3.5" data-max="10.0" value="R$ ${s.c4_cambio.toFixed(2).replace('.', ',')}" inputmode="decimal">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c4_cambio" min="4.5" max="7.5" step="0.05" value="${s.c4_cambio}">
              </div>
            </div>
          </div>
          <div class="calc5-results-card">
            <div>
              <div style="font-family:var(--m);font-size:10px;color:#1CD98A;text-transform:uppercase;letter-spacing:.12em">Blindagem Internacional Contra o Risco Brasil</div>
              <div class="calc5-kpi-grid">
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label" data-calc5-out="c4_label_meta">Meta Global (${s.c4_metaDolarPct}%)</div>
                  <div class="calc5-kpi-val is-green" data-calc5-out="c4_metaBRL">${formatBRL(res.c4.valorMetaBRL)}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Equivalente em Dólar</div>
                  <div class="calc5-kpi-val" data-calc5-out="c4_metaUSD">US$ ${Math.round(res.c4.valorMetaUSD).toLocaleString('pt-BR')}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Falta Dolarizar</div>
                  <div class="calc5-kpi-val" data-calc5-out="c4_falta">${formatBRL(res.c4.faltaAlocarBRL)}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Projeção 10a em USD</div>
                  <div class="calc5-kpi-val is-green" data-calc5-out="c4_projUSD">US$ ${Math.round(res.c4.projecao10AnosUSD).toLocaleString('pt-BR')}</div>
                </div>
              </div>
              <p style="font-size:12.5px;color:#EDE8D5;line-height:1.5;background:rgba(0,0,0,0.28);padding:10px 12px;border-radius:10px" data-calc5-out="c4_texto">
                🌎 Alocar <strong>${s.c4_metaDolarPct}% (${formatBRL(res.c4.valorMetaBRL)})</strong> em ativos globais protege o poder de compra da sua família contra a inflação e desvalorização do Real, chegando a <strong>US$ ${Math.round(res.c4.projecao10AnosUSD).toLocaleString('pt-BR')}</strong> em 10 anos!
              </p>
            </div>
            <div style="display:flex;gap:10px;margin-top:12px">
              <a href="${FORM_URL}" target="_blank" style="flex:1;text-align:center;padding:10px 14px;background:#1CD98A;color:#04120A;border-radius:10px;font-weight:700;font-size:12.5px;text-decoration:none">Estruturar Carteira em Dólar com o Leo ↗</a>
            </div>
          </div>
        </div>
      `;
    } else {
      bodyHTML = `
        <div class="calc5-workspace">
          <div class="calc5-inputs-card">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <strong style="font-size:15px;color:#fff">5. Inventário &amp; Sucessão Familiar</strong>
                <span style="font-family:var(--m);font-size:10px;color:#1CD98A">DIGITE OU ARRASTE</span>
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Patrimônio total da família — imóveis + carteira (R$)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c5_patrimonioFamilia" data-min="200000" data-max="100000000" value="${formatBRL(s.c5_patrimonioFamilia)}" inputmode="numeric">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c5_patrimonioFamilia" min="300000" max="25000000" step="100000" value="${Math.min(25000000, s.c5_patrimonioFamilia)}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Imposto ITCMD + Custas de Cartório (%)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c5_impostoCartorioPct" data-min="4" data-max="20" value="${s.c5_impostoCartorioPct}%" inputmode="decimal">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c5_impostoCartorioPct" min="4" max="16" step="0.5" value="${s.c5_impostoCartorioPct}">
              </div>
              <div class="calc5-field-row">
                <div class="calc5-field-top">
                  <label class="calc5-field-label">Honorários Advocatícios + Custos Judiciais (%)</label>
                  <input type="text" class="calc5-text-input calc5-num-input" data-calc5-key="c5_advogadoCustosPct" data-min="2" data-max="15" value="${s.c5_advogadoCustosPct}%" inputmode="decimal">
                </div>
                <input type="range" class="calc5-range-input" data-calc5-range="c5_advogadoCustosPct" min="3" max="12" step="0.5" value="${s.c5_advogadoCustosPct}">
              </div>
            </div>
          </div>
          <div class="calc5-results-card">
            <div>
              <div style="font-family:var(--m);font-size:10px;color:#1CD98A;text-transform:uppercase;letter-spacing:.12em">O Custo de Não Planejar vs. Sucessão Inteligente</div>
              <div class="calc5-kpi-grid">
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Perda no Inventário Comum</div>
                  <div class="calc5-kpi-val" style="color:#F05288" data-calc5-out="c5_custoTrad">-${formatBRL(res.c5.custoInventarioTradicional)}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Com Planejamento Sucessório</div>
                  <div class="calc5-kpi-val" data-calc5-out="c5_custoPlan">${formatBRL(res.c5.custoComPlanejamento)}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Economia p/ os Filhos</div>
                  <div class="calc5-kpi-val is-green" data-calc5-out="c5_economia">+${formatBRL(res.c5.economiaSucessao)}</div>
                </div>
                <div class="calc5-kpi-box">
                  <div class="calc5-kpi-label">Tempo de Liberação</div>
                  <div class="calc5-kpi-val is-green">Até 5 dias úteis</div>
                </div>
              </div>
              <p style="font-size:12.5px;color:#EDE8D5;line-height:1.5;background:rgba(0,0,0,0.28);padding:10px 12px;border-radius:10px" data-calc5-out="c5_texto">
                🛡️ Sem planejamento, um inventário de <strong>${formatBRL(s.c5_patrimonioFamilia)}</strong> consome <strong>${formatBRL(res.c5.custoInventarioTradicional)}</strong> à vista e trava os bens. Usando Previdência, Seguro Sucessório e Holding, você economiza <strong>+${formatBRL(res.c5.economiaSucessao)}</strong> para sua família!
              </p>
            </div>
            <div style="display:flex;gap:10px;margin-top:12px">
              <a href="${FORM_URL}" target="_blank" style="flex:1;text-align:center;padding:10px 14px;background:#1CD98A;color:#04120A;border-radius:10px;font-weight:700;font-size:12.5px;text-decoration:none">Planejar Sucessão e Blindagem Familiar ↗</a>
            </div>
          </div>
        </div>
      `;
    }

    return tabsHeader + bodyHTML;
  }

  function bindCalc5Events(container, onAwardXp) {
    if (!container) return;

    function refreshAll() {
      container.innerHTML = renderCalc5HTML();
      attachListeners();
    }

    function updateOutputsOnly() {
      const s = CALC5_STATE;
      const res = computeCalc5Results(s);
      const setTxt = (key, val) => {
        const el = container.querySelector(`[data-calc5-out="${key}"]`);
        if (el) el.innerHTML = val;
      };
      setTxt('c1_label_anos', `Patrimônio em ${s.c1_anos} anos`);
      setTxt('c1_label_meta', `Meta p/ ${formatBRL(s.c1_rendaDesejada)}/mês`);
      setTxt('c1_total', formatBRL(res.c1.totalAcumulado1));
      setTxt('c1_renda', formatBRL(res.c1.rendaVitaliciaGerada1) + '/mês');
      setTxt('c1_ano', res.c1.anoLabel);
      setTxt('c1_meta', formatBRL(res.c1.metaNecessaria1));
      setTxt('c1_texto', `💡 Guardando <strong>${formatBRL(s.c1_mensal)}/mês</strong>, você acumula <strong>${formatBRL(res.c1.totalAcumulado1)}</strong> líquidos de inflação em ${s.c1_anos} anos — gerando uma renda segura de <strong>${formatBRL(res.c1.rendaVitaliciaGerada1)} por mês</strong> sem nunca gastar o valor principal!`);

      setTxt('c2_label_carteira', `Carteira em ${s.c2_anos} anos`);
      setTxt('c2_label_imovel', `Imóvel Físico em ${s.c2_anos} anos`);
      setTxt('c2_renda', formatBRL(res.c2.rendaMensalCarteira) + '/mês');
      setTxt('c2_sobra', res.c2.sobraLabel);
      const sobraEl = container.querySelector('[data-calc5-out="c2_sobra"]');
      if (sobraEl) sobraEl.classList.toggle('is-green', res.c2.sobraMensal >= 0);
      setTxt('c2_carteira', formatBRL(res.c2.saldoInvestindo));
      setTxt('c2_imovel', formatBRL(res.c2.valorImovelFuturo));
      setTxt('c2_texto', res.c2.c2Texto);

      setTxt('c3_fee', formatBRL(res.c3.totalFeeBased));
      setTxt('c3_banco', formatBRL(res.c3.totalBanco));
      setTxt('c3_salvo', '+' + formatBRL(res.c3.dinheiroSalvoTaxas));
      setTxt('c3_anosPoupados', `${res.c3.anosPoupados} anos`);
      setTxt('c3_texto', `💸 No modelo <strong>Fee-Based</strong> (onde toda comissão bancária é devolvida a você), sua família preserva <strong>+${formatBRL(res.c3.dinheiroSalvoTaxas)}</strong> que iriam para metas de gerentes e fundos caros!`);

      setTxt('c4_label_meta', `Meta Global (${s.c4_metaDolarPct}%)`);
      setTxt('c4_metaBRL', formatBRL(res.c4.valorMetaBRL));
      setTxt('c4_metaUSD', 'US$ ' + Math.round(res.c4.valorMetaUSD).toLocaleString('pt-BR'));
      setTxt('c4_falta', formatBRL(res.c4.faltaAlocarBRL));
      setTxt('c4_projUSD', 'US$ ' + Math.round(res.c4.projecao10AnosUSD).toLocaleString('pt-BR'));
      setTxt('c4_texto', `🌎 Alocar <strong>${s.c4_metaDolarPct}% (${formatBRL(res.c4.valorMetaBRL)})</strong> em ativos globais protege o poder de compra da sua família contra a inflação e desvalorização do Real, chegando a <strong>US$ ${Math.round(res.c4.projecao10AnosUSD).toLocaleString('pt-BR')}</strong> em 10 anos!`);

      setTxt('c5_custoTrad', '-' + formatBRL(res.c5.custoInventarioTradicional));
      setTxt('c5_custoPlan', formatBRL(res.c5.custoComPlanejamento));
      setTxt('c5_economia', '+' + formatBRL(res.c5.economiaSucessao));
      setTxt('c5_texto', `🛡️ Sem planejamento, um inventário de <strong>${formatBRL(s.c5_patrimonioFamilia)}</strong> consome <strong>${formatBRL(res.c5.custoInventarioTradicional)}</strong> à vista e trava os bens. Usando Previdência, Seguro Sucessório e Holding, você economiza <strong>+${formatBRL(res.c5.economiaSucessao)}</strong> para sua família!`);
    }

    function formatFieldDisplay(key, val) {
      if (key.includes('anos')) return `${Math.round(val)} anos`;
      if (key.includes('Pct')) return `${val}%`;
      if (key.includes('Anual') || key.includes('taxaBanco')) return `${Number(val).toFixed(1).replace('.', ',')}% a.a.`;
      if (key === 'c4_cambio') return `R$ ${Number(val).toFixed(2).replace('.', ',')}`;
      return formatBRL(val);
    }

    function attachListeners() {
      container.querySelectorAll('[data-calc5-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
          const num = Number(btn.getAttribute('data-calc5-tab')) || 1;
          const tabMeta = CALC5_TABS.find(t => t.num === num) || CALC5_TABS[0];
          CALC5_STATE.activeTab = tabMeta.num;
          CALC5_STATE.activeSlug = tabMeta.id;
          if (typeof onAwardXp === 'function') onAwardXp(15);
          refreshAll();
        });
      });

      container.querySelectorAll('[data-calc5-range]').forEach(range => {
        range.addEventListener('input', () => {
          const key = range.getAttribute('data-calc5-range');
          const val = parseFloat(range.value);
          CALC5_STATE[key] = val;
          const textInput = container.querySelector(`[data-calc5-key="${key}"]`);
          if (textInput) textInput.value = formatFieldDisplay(key, val);
          updateOutputsOnly();
        });
      });

      container.querySelectorAll('[data-calc5-key]').forEach(inp => {
        inp.addEventListener('focus', () => inp.select());
        inp.addEventListener('input', () => {
          const key = inp.getAttribute('data-calc5-key');
          const min = parseFloat(inp.getAttribute('data-min')) || 0;
          const max = parseFloat(inp.getAttribute('data-max')) || 100000000;
          // Durante a digitação (input), não força min para permitir digitar dígito a dígito
          const val = parseNumericInput(inp.value, CALC5_STATE[key], min, max, false);
          CALC5_STATE[key] = val;
          const rangeInput = container.querySelector(`[data-calc5-range="${key}"]`);
          if (rangeInput) rangeInput.value = Math.min(parseFloat(rangeInput.max), Math.max(parseFloat(rangeInput.min), val));
          updateOutputsOnly();
        });
        inp.addEventListener('blur', () => {
          const key = inp.getAttribute('data-calc5-key');
          const min = parseFloat(inp.getAttribute('data-min')) || 0;
          const max = parseFloat(inp.getAttribute('data-max')) || 100000000;
          const clamped = parseNumericInput(inp.value, CALC5_STATE[key], min, max, true);
          CALC5_STATE[key] = clamped;
          const rangeInput = container.querySelector(`[data-calc5-range="${key}"]`);
          if (rangeInput) rangeInput.value = Math.min(parseFloat(rangeInput.max), Math.max(parseFloat(rangeInput.min), clamped));
          inp.value = formatFieldDisplay(key, clamped);
          updateOutputsOnly();
        });
      });
    }

    refreshAll();
  }

  // Expõe motor das 5 calculadoras para simulador.html e index.html
  window.OutlierCalc5 = {
    tabs: CALC5_TABS,
    state: CALC5_STATE,
    compute: computeCalc5Results,
    mount: bindCalc5Events
  };

  // ==========================================================================
  // 3. CONTEÚDO DOS MODAIS INTERATIVOS DAS 6 ILHAS
  // ==========================================================================
  function getIslandModalHTML(islandId) {
    if (islandId === 1) {
      return `
        <div style="display:grid;grid-template-columns:0.85fr 1.15fr;gap:24px;align-items:center" class="calc5-workspace">
          <div style="position:relative;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.14);min-height:320px;background:#080517">
            <img src="midias/hero-leo.webp" alt="Leonardo Arruda" style="width:100%;height:340px;object-fit:cover;object-position:center 20%;display:block">
            <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(8,5,23,0.95) 0%, transparent 55%)"></div>
            <div style="position:absolute;bottom:16px;left:16px;right:16px;display:flex;align-items:center;justify-content:space-between;gap:10px">
              <div>
                <div style="font-family:var(--m);font-size:10px;color:#1CD98A;text-transform:uppercase">Consultor Certificado</div>
                <strong style="font-family:var(--d);font-size:24px;color:#fff">Leonardo Arruda · CEA</strong>
              </div>
              <span style="padding:6px 12px;border-radius:20px;background:rgba(28,217,138,0.18);border:1px solid #1CD98A;color:#1CD98A;font-family:var(--m);font-size:10px;font-weight:700">100% Fee-Based</span>
            </div>
          </div>
          <div>
            <div style="font-family:var(--m);font-size:10.5px;color:#E84A80;letter-spacing:.16em;text-transform:uppercase;margin-bottom:8px">Estação 01 · Quem Guia Você na Jornada</div>
            <h2 style="font-family:var(--d);font-size:clamp(26px,2.5vw,36px);color:#fff;line-height:1.08;margin-bottom:12px">Uma consultoria construída sobre <em style="color:#1CD98A">clareza</em> — e zero conflito de interesse.</h2>
            <p style="font-size:14px;color:#A9A3C4;line-height:1.62;margin-bottom:16px">
              Diferente do gerente de banco ou assessor tradicional que ganha comissões ocultas para empurrar produtos, <strong style="color:#fff">Leonardo Arruda</strong> atua no modelo <strong style="color:#1CD98A">Fee-Based pela Portfel (Grupo Primo)</strong>: qualquer comissão das instituições é 100% devolvida para a sua conta.
            </p>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:10px;text-align:center">
                <strong style="font-family:var(--d);font-size:22px;color:#1CD98A">+R$20Bi</strong>
                <div style="font-family:var(--m);font-size:9px;color:#A9A3C4;text-transform:uppercase">Sob Consultoria</div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:10px;text-align:center">
                <strong style="font-family:var(--d);font-size:22px;color:#fff">+25k</strong>
                <div style="font-family:var(--m);font-size:9px;color:#A9A3C4;text-transform:uppercase">Clientes</div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:10px;text-align:center">
                <strong style="font-family:var(--d);font-size:22px;color:#1CD98A">97</strong>
                <div style="font-family:var(--m);font-size:9px;color:#A9A3C4;text-transform:uppercase">NPS Excelência</div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:10px;text-align:center">
                <strong style="font-family:var(--d);font-size:22px;color:#fff">CEA</strong>
                <div style="font-family:var(--m);font-size:9px;color:#A9A3C4;text-transform:uppercase">ANBIMA</div>
              </div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button type="button" class="world-btn-explore" data-goto-island="2" style="padding:11px 20px">Caminhar para Ilha 02 (Raio-X) →</button>
              <a href="#sobre" data-close-modal-scroll="#sobre" style="padding:11px 18px;border-radius:30px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:12.5px;text-decoration:none">Ver Biografia Completa ↓</a>
            </div>
          </div>
        </div>
      `;
    }

    if (islandId === 2) {
      return `
        <div class="calc5-workspace">
          <div class="calc5-inputs-card">
            <div>
              <div style="font-family:var(--m);font-size:10px;color:#1CD98A;text-transform:uppercase;letter-spacing:.14em;margin-bottom:6px">Estação 02 · Scanner Rápido de Vulnerabilidades</div>
              <h3 style="font-family:var(--d);font-size:26px;color:#fff;margin-bottom:6px">Descubra onde seu dinheiro está desprotegido</h3>
              <p style="font-size:12.5px;color:#A9A3C4;margin-bottom:12px">Marque abaixo os pontos que você <strong style="color:#fff">já tem resolvidos hoje</strong> para calcular seu Score de Blindagem instantâneo:</p>
              <div style="display:flex;flex-direction:column;gap:7px" id="quick-raiox-checks">
                <label style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;cursor:pointer;font-size:12.5px">
                  <input type="checkbox" class="rx-quick-chk" value="20" checked style="accent-color:#1CD98A;width:16px;height:16px">
                  <span><strong>1. Liquidez &amp; Reserva:</strong> Tenho caixa calibrado sem travas bancárias</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;cursor:pointer;font-size:12.5px">
                  <input type="checkbox" class="rx-quick-chk" value="20" style="accent-color:#1CD98A;width:16px;height:16px">
                  <span><strong>2. Zero Comissões Ocultas:</strong> Invisto no modelo Fee-Based com cashback</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;cursor:pointer;font-size:12.5px">
                  <input type="checkbox" class="rx-quick-chk" value="20" style="accent-color:#1CD98A;width:16px;height:16px">
                  <span><strong>3. Proteção em Dólar:</strong> Tenho ao menos 15% a 25% fora do risco Brasil</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;cursor:pointer;font-size:12.5px">
                  <input type="checkbox" class="rx-quick-chk" value="20" style="accent-color:#1CD98A;width:16px;height:16px">
                  <span><strong>4. Eficiência Fiscal:</strong> Uso Previdência/Fundos para pagar menos IR</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;cursor:pointer;font-size:12.5px">
                  <input type="checkbox" class="rx-quick-chk" value="20" style="accent-color:#1CD98A;width:16px;height:16px">
                  <span><strong>5. Sucessão Familiar:</strong> Meus herdeiros não dependerão de inventário lento</span>
                </label>
              </div>
              <!-- REVELADOR INTERATIVO: POR TRÁS DO EXTRATO BANCÁRIO -->
              <div style="margin-top:12px;padding:12px;border-radius:12px;background:rgba(232,74,128,0.08);border:1px solid rgba(232,74,128,0.32)">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px">
                  <strong style="font-size:12.5px;color:#fff">🔍 Por Trás do Extrato Bancário</strong>
                  <button type="button" id="rx-extrato-reveal-btn" style="all:unset;cursor:pointer;padding:4px 10px;border-radius:14px;background:#E84A80;color:#fff;font-family:var(--m);font-size:10px;font-weight:700">Revelar Custos Ocultos (+30 XP)</button>
                </div>
                <p id="rx-extrato-reveal-text" style="font-size:11.5px;color:#EDE8D5;line-height:1.45">
                  O extrato do banco mostra apenas o saldo nominal. Clique em <em>Revelar</em> para enxergar o que fica escondido nas entrelinhas.
                </p>
              </div>
            </div>
          </div>
          <div class="calc5-results-card" style="text-align:center;justify-content:center;align-items:center">
            <div style="width:124px;height:124px;border-radius:50%;border:3px solid #1CD98A;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 12px;box-shadow:0 0 30px rgba(28,217,138,0.28)">
              <span style="font-family:var(--m);font-size:10px;color:#A9A3C4">SEU SCORE</span>
              <strong id="rx-quick-score-val" style="font-family:var(--d);font-size:42px;color:#1CD98A;line-height:1">20/100</strong>
            </div>
            <h4 id="rx-quick-status-title" style="font-family:var(--d);font-size:22px;color:#fff;margin-bottom:8px">Atenção: 4 Pilares Desprotegidos</h4>
            <p id="rx-quick-status-desc" style="font-size:13px;color:#EDE8D5;line-height:1.55;margin-bottom:18px;max-width:38ch">
              Sua carteira está perdendo rentabilidade para taxas bancárias ocultas e exposta ao risco fiscal e sucessório no Brasil.
            </p>
            <div style="display:flex;gap:10px;width:100%;flex-wrap:wrap">
              <a href="raiox.html" style="flex:1;text-align:center;padding:12px 16px;background:#1CD98A;color:#04120A;border-radius:12px;font-weight:700;font-size:13px;text-decoration:none">Abrir Raio-X Completo (5 Perguntas) ↗</a>
              <button type="button" class="world-btn-explore" data-goto-island="3" style="padding:12px 16px">Ir para Ilha 03 (Calculadoras) →</button>
            </div>
          </div>
        </div>
      `;
    }

    if (islandId === 3) {
      return `<div id="modal-calc5-mount"></div>`;
    }

    if (islandId === 4) {
      return `
        <div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:14px;flex-wrap:wrap;gap:10px">
            <div>
              <div style="font-family:var(--m);font-size:10px;color:#1CD98A;text-transform:uppercase;letter-spacing:.14em">Estação 04 · A Fortaleza Patrimonial</div>
              <h3 style="font-family:var(--d);font-size:28px;color:#fff">Os 4 Territórios de Proteção &amp; Multiplicação</h3>
            </div>
            <button type="button" class="world-btn-explore" data-goto-island="5" style="padding:9px 16px">Ir para Ilha 05 (Notícias) →</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px" class="fortaleza-territorios-grid">
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(28,217,138,0.35);border-radius:16px;padding:16px">
              <div style="font-family:var(--m);font-size:10px;color:#1CD98A;margin-bottom:4px">TERRITÓRIO 01</div>
              <strong style="font-family:var(--d);font-size:20px;color:#fff;display:block;margin-bottom:8px">Renda &amp; Planejamento</strong>
              <ul style="list-style:none;font-size:12.5px;color:#EDE8D5;display:flex;flex-direction:column;gap:6px">
                <li>✦ Carteira de Renda Passiva</li>
                <li>✦ Fundo Exclusivo &amp; Liquidez</li>
                <li>✦ Aposentadoria Vitalícia</li>
                <li>✦ Financiamento Otimizado</li>
              </ul>
            </div>
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(232,74,128,0.35);border-radius:16px;padding:16px">
              <div style="font-family:var(--m);font-size:10px;color:#E84A80;margin-bottom:4px">TERRITÓRIO 02</div>
              <strong style="font-family:var(--d);font-size:20px;color:#fff;display:block;margin-bottom:8px">Previdência &amp; Seguros</strong>
              <ul style="list-style:none;font-size:12.5px;color:#EDE8D5;display:flex;flex-direction:column;gap:6px">
                <li>✦ Previdência Privada Taxa Zero</li>
                <li>✦ Seguro de Vida Resgatável</li>
                <li>✦ Pan American Internacional</li>
                <li>✦ Sucessão em até 5 dias</li>
              </ul>
            </div>
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(124,119,244,0.35);border-radius:16px;padding:16px">
              <div style="font-family:var(--m);font-size:10px;color:#7C77F4;margin-bottom:4px">TERRITÓRIO 03</div>
              <strong style="font-family:var(--d);font-size:20px;color:#fff;display:block;margin-bottom:8px">Dólar &amp; Blindagem</strong>
              <ul style="list-style:none;font-size:12.5px;color:#EDE8D5;display:flex;flex-direction:column;gap:6px">
                <li>✦ Carteira Offshore em USD</li>
                <li>✦ Holding Familiar &amp; Imóveis</li>
                <li>✦ Trusts &amp; Unit Linked</li>
                <li>✦ Hedge Cambial Corporativo</li>
              </ul>
            </div>
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(244,162,97,0.35);border-radius:16px;padding:16px">
              <div style="font-family:var(--m);font-size:10px;color:#F4A261;margin-bottom:4px">TERRITÓRIO 04</div>
              <strong style="font-family:var(--d);font-size:20px;color:#fff;display:block;margin-bottom:8px">Empresa &amp; M&amp;A</strong>
              <ul style="list-style:none;font-size:12.5px;color:#EDE8D5;display:flex;flex-direction:column;gap:6px">
                <li>✦ M&amp;A — Fusões e Aquisições</li>
                <li>✦ Valuation Empresarial</li>
                <li>✦ Estruturação de Recebíveis</li>
                <li>✦ Private Banking &amp; Concierge</li>
              </ul>
            </div>
          </div>
          <div style="margin-top:16px;padding:14px 18px;border-radius:14px;background:rgba(28,217,138,0.08);border:1px solid rgba(28,217,138,0.28);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
            <span style="font-size:13px;color:#EDE8D5">Atendemos sua carteira em qualquer instituição: <strong>BTG Pactual, XP, Safra, Morgan Stanley, Avenue, Nomad e Inter.</strong></span>
            <a href="${FORM_URL}" target="_blank" style="padding:9px 18px;background:#1CD98A;color:#04120A;border-radius:20px;font-weight:700;font-size:12px;text-decoration:none">Diagnosticar Meus 4 Territórios ↗</a>
          </div>
        </div>
      `;
    }

    if (islandId === 5) {
      return `
        <div class="calc5-workspace">
          <div class="calc5-inputs-card">
            <div>
              <div style="font-family:var(--m);font-size:10px;color:#1CD98A;text-transform:uppercase;letter-spacing:.14em;margin-bottom:6px">Estação 05 · O Pulso do Mercado em 1 Minuto</div>
              <h3 style="font-family:var(--d);font-size:25px;color:#fff;margin-bottom:10px">Juros, Câmbio e Como Proteger seu Poder de Compra</h3>
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
                <div style="background:rgba(255,255,255,0.04);padding:8px;border-radius:10px;text-align:center">
                  <div style="font-family:var(--m);font-size:9px;color:#A9A3C4">SELIC</div>
                  <strong style="font-family:var(--m);font-size:14px;color:#1CD98A">10,75%</strong>
                </div>
                <div style="background:rgba(255,255,255,0.04);padding:8px;border-radius:10px;text-align:center">
                  <div style="font-family:var(--m);font-size:9px;color:#A9A3C4">IPCA 12M</div>
                  <strong style="font-family:var(--m);font-size:14px;color:#fff">4,50%</strong>
                </div>
                <div style="background:rgba(255,255,255,0.04);padding:8px;border-radius:10px;text-align:center">
                  <div style="font-family:var(--m);font-size:9px;color:#A9A3C4">DÓLAR</div>
                  <strong style="font-family:var(--m);font-size:14px;color:#F4A261">R$ 5,42</strong>
                </div>
                <div style="background:rgba(255,255,255,0.04);padding:8px;border-radius:10px;text-align:center">
                  <div style="font-family:var(--m);font-size:9px;color:#A9A3C4">S&amp;P 500</div>
                  <strong style="font-family:var(--m);font-size:14px;color:#1CD98A">5.864</strong>
                </div>
              </div>
              <p style="font-size:13px;color:#EDE8D5;line-height:1.58;margin-bottom:12px">
                <strong>Resumo de 1 minuto:</strong> Com o juro real brasileiro acima de 6% a.a. acima da inflação, é o momento ideal para travar taxas longas em títulos IPCA+ isentos e manter de 20% a 30% do patrimônio dolarizado contra volatilidades fiscais.
              </p>
              <a href="blog.html" style="display:inline-flex;align-items:center;gap:6px;color:#1CD98A;font-size:13px;font-weight:600;text-decoration:none">Abrir Terminal Editorial Completo (blog.html) ↗</a>
            </div>
          </div>
          <div class="calc5-results-card">
            <div>
              <div style="font-family:var(--m);font-size:10px;color:#E84A80;text-transform:uppercase;letter-spacing:.14em;margin-bottom:6px">Newsletter Semanal do Leo</div>
              <h4 style="font-family:var(--d);font-size:24px;color:#fff;margin-bottom:8px">Receba a leitura da semana sem economês</h4>
              <p style="font-size:13px;color:#EDE8D5;line-height:1.5;margin-bottom:14px">
                Mais de 1.200 empresários, médicos e famílias recebem toda semana o resumo direto do que realmente impacta o seu bolso.
              </p>
              <form id="modal-newsletter-form" style="display:flex;gap:8px;margin-bottom:12px">
                <input type="email" id="modal-newsletter-email" required placeholder="Digite seu melhor e-mail..." style="flex:1;padding:10px 14px;border-radius:10px;background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.2);color:#fff;font-size:13px;outline:none">
                <button type="submit" style="padding:10px 16px;border-radius:10px;background:#1CD98A;color:#04120A;border:none;font-weight:700;font-size:12.5px;cursor:pointer">Assinar Grátis</button>
              </form>
              <div id="modal-newsletter-msg" style="font-size:12px;color:#1CD98A;min-height:18px"></div>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:8px">
              <button type="button" class="world-btn-explore" data-goto-island="6" style="padding:10px 18px">Chegar à Ilha 06 (Conversar com o Leo) →</button>
            </div>
          </div>
        </div>
      `;
    }

    // Island 6: Conversar com o Leo
    return `
      <div class="calc5-workspace">
        <div class="calc5-inputs-card">
          <div>
            <div style="font-family:var(--m);font-size:10px;color:#1CD98A;text-transform:uppercase;letter-spacing:.14em;margin-bottom:6px">Estação 06 · Seu Passaporte Patrimonial</div>
            <h3 style="font-family:var(--d);font-size:28px;color:#fff;margin-bottom:8px">Pronto para organizar e blindar o que você levou anos construindo?</h3>
            <p style="font-size:13.5px;color:#A9A3C4;line-height:1.6;margin-bottom:16px">
              A primeira conversa é <strong style="color:#fff">100% gratuita e sem compromisso</strong>. Vamos olhar para o seu momento atual, identificar gargalos ocultos e traçar um plano sob medida para sua família.
            </p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px">
              <div style="padding:12px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1)">
                <strong style="color:#1CD98A;font-size:13px;display:block">1. Diagnóstico</strong>
                <span style="font-size:11.5px;color:#A9A3C4">Análise da sua carteira e objetivos reais</span>
              </div>
              <div style="padding:12px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1)">
                <strong style="color:#E84A80;font-size:13px;display:block">2. Estratégia</strong>
                <span style="font-size:11.5px;color:#A9A3C4">Plano Fee-Based nacional e em Dólar</span>
              </div>
              <div style="padding:12px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1)">
                <strong style="color:#7C77F4;font-size:13px;display:block">3. Acompanhamento</strong>
                <span style="font-size:11.5px;color:#A9A3C4">Presença contínua ao longo dos anos</span>
              </div>
            </div>
          </div>
        </div>
        <div class="calc5-results-card" style="justify-content:center;text-align:center">
          <div style="font-size:32px;margin-bottom:6px">👑</div>
          <h4 style="font-family:var(--d);font-size:24px;color:#fff;margin-bottom:6px">Agende Seu Diagnóstico Individual</h4>
          <p style="font-size:12.5px;color:#EDE8D5;margin-bottom:18px">
            Resposta pessoal em até 24h · Confidencial · Certificação ANBIMA CEA · Portfel (Grupo Primo)
          </p>
          <a href="${FORM_URL}" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px 20px;border-radius:14px;background:linear-gradient(135deg,#1CD98A,#0EA565);color:#04120A;font-weight:700;font-size:14.5px;text-decoration:none;box-shadow:0 10px 28px rgba(28,217,138,0.35);margin-bottom:10px">
            Agendar Minha Conversa com o Leo ↗
          </a>
          <div style="display:flex;gap:10px;justify-content:center">
            <a href="https://www.linkedin.com/in/leonardo-arruda-b49ab8104/" target="_blank" rel="noopener" style="flex:1;padding:9px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);color:#fff;font-size:12px;text-decoration:none">LinkedIn ↗</a>
            <a href="https://www.instagram.com/leoarruda.s/" target="_blank" rel="noopener" style="flex:1;padding:9px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);color:#fff;font-size:12px;text-decoration:none">Instagram ↗</a>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 4. INICIALIZAÇÃO DO MUNDO INTERATIVO NA HOME (INDEX.HTML)
  // ==========================================================================
  const STORAGE_KEY = 'outlier_world_journey_v1';

  function initWorldJourney() {
    const simCalc5Mount = document.getElementById('simulador-calc5-mount');
    if (simCalc5Mount) {
      bindCalc5Events(simCalc5Mount);
    }

    const app = document.getElementById('jornada-world-app');
    if (!app) return;

    const stage = document.getElementById('world-stage');
    const canvas = document.getElementById('world-canvas');
    const travelerEl = document.getElementById('world-traveler');
    const speechEl = document.getElementById('traveler-speech-text');
    const xpPopEl = document.getElementById('traveler-xp-pop');
    const minimapPin = document.getElementById('minimap-player-pin');
    const modalOverlay = document.getElementById('island-modal-overlay');
    const modalBody = document.getElementById('island-modal-body');
    const modalTitleNum = document.getElementById('island-modal-num');
    const modalTitleText = document.getElementById('island-modal-title');

    // Estado do Jogador / Viajante
    const state = {
      x: 41.0,
      y: 76.0,
      targetX: null,
      targetY: null,
      targetIslandId: null,
      openModalOnArrival: false,
      currentIslandId: 0,
      visited: new Set([0]),
      xp: 100,
      maxXp: 600,
      level: 1,
      zoom: 1.0,
      themeIndex: 0, // 0: day, 1: sunset, 2: night
      avatarStyle: 0, // 0: Exploradora (Ananya style), 1: Executivo, 2: Casal
      keys: { w: false, a: false, s: false, d: false },
      lastCooldownIsland: -1,
      cooldownUntil: 0,
      footprints: [],
      audioPlaying: false,
      trackIndex: 0,
      extratoRevealed: false
    };

    const THEMES = ['day', 'sunset', 'night'];
    const TRACKS = [
      { title: 'Focus Mode', sub: 'lofi wealth & mar' },
      { title: 'Horizonte Sereno', sub: 'ambient piano & brisa' },
      { title: 'Modo Estrategista', sub: 'deep focus beats' }
    ];

    function saveProgress() {
      try {
        const payload = {
          visited: Array.from(state.visited),
          xp: state.xp,
          level: state.level,
          themeIndex: state.themeIndex,
          avatarStyle: state.avatarStyle
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (_) {}
    }

    function loadProgress() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.visited)) {
          parsed.visited.forEach(id => {
            const n = Number(id);
            if (Number.isInteger(n) && n >= 0 && n <= 6) state.visited.add(n);
          });
        }
        if (typeof parsed.xp === 'number' && Number.isFinite(parsed.xp)) {
          state.xp = Math.max(100, Math.min(state.maxXp, parsed.xp));
          state.level = Math.min(6, 1 + Math.floor(state.xp / 100));
        }
        if (typeof parsed.themeIndex === 'number' && parsed.themeIndex >= 0 && parsed.themeIndex < THEMES.length) {
          state.themeIndex = parsed.themeIndex;
        }
        if (typeof parsed.avatarStyle === 'number' && parsed.avatarStyle >= 0 && parsed.avatarStyle <= 2) {
          state.avatarStyle = parsed.avatarStyle;
        }
      } catch (_) {}
    }

    // ------------------------------------------------------------------------
    // A. SINTETIZADOR WEB AUDIO API (LOFI / AMBIENT RELAXANTE + EFEITOS XP)
    // ------------------------------------------------------------------------
    let audioCtx = null;
    let ambientTimer = null;

    function ensureAudioCtx() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    }

    function playChimeXP() {
      try {
        const ctx = ensureAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.001, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.06, now + idx * 0.07 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.38);
        });
      } catch (_) {}
    }

    function toggleFocusAudio(forceState) {
      const next = typeof forceState === 'boolean' ? forceState : !state.audioPlaying;
      state.audioPlaying = next;

      const playBtn = document.getElementById('vibe-play-btn');
      const topSoundBtn = document.getElementById('world-sound-toggle');
      if (playBtn) playBtn.textContent = state.audioPlaying ? '⏸' : '▶';
      if (topSoundBtn) {
        topSoundBtn.classList.toggle('is-playing', state.audioPlaying);
        topSoundBtn.textContent = state.audioPlaying ? '🔊' : '🎵';
      }

      if (!state.audioPlaying) {
        if (ambientTimer) {
          clearInterval(ambientTimer);
          ambientTimer = null;
        }
        return;
      }

      const ctx = ensureAudioCtx();
      if (!ctx) return;

      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 349.23], // Fmaj7
        [196.00, 246.94, 293.66, 392.00]  // G6
      ];
      let chordIdx = 0;

      function playWarmChord() {
        if (!state.audioPlaying || !audioCtx) return;
        const now = audioCtx.currentTime;
        const chord = chords[chordIdx % chords.length];
        chordIdx++;
        chord.forEach((freq) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.022, now + 0.6);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 3.5);
        });
      }

      playWarmChord();
      if (ambientTimer) clearInterval(ambientTimer);
      ambientTimer = setInterval(playWarmChord, 3400);
    }

    // ------------------------------------------------------------------------
    // B. ATUALIZAÇÃO DE XP, NÍVEL, BADGES E HUD
    // ------------------------------------------------------------------------
    function syncHUDProgress() {
      const pct = Math.min(100, Math.round((state.xp / state.maxXp) * 100));
      const lvlEl = document.getElementById('hud-quest-lvl');
      const pctEl = document.getElementById('hud-quest-pct');
      const barEl = document.getElementById('hud-quest-bar');
      const expEl = document.getElementById('hud-quest-exp');
      const dailyXpVal = document.getElementById('hud-daily-xp-val');
      const dailyXpBar = document.getElementById('hud-daily-xp-bar');
      const travelerLvlPill = document.getElementById('traveler-lvl-pill');

      if (lvlEl) lvlEl.textContent = `Lv. ${state.level}`;
      if (travelerLvlPill) travelerLvlPill.textContent = `Lv.${state.level}`;
      if (pctEl) pctEl.textContent = `${pct}%`;
      if (barEl) barEl.style.width = `${pct}%`;
      if (expEl) expEl.textContent = `EXP · ${state.xp} / ${state.maxXp}`;
      if (dailyXpVal) dailyXpVal.textContent = `${state.xp} / ${state.maxXp}`;
      if (dailyXpBar) dailyXpBar.style.width = `${pct}%`;

      state.visited.forEach(islandId => {
        if (islandId < 1) return;
        const pin = document.querySelector(`.world-island-pin[data-island-pin="${islandId}"]`);
        if (pin) pin.classList.add('is-visited');
        const badgeSlot = document.querySelector(`.world-badge-slot[data-badge-slot="${islandId}"]`);
        if (badgeSlot) badgeSlot.classList.add('is-unlocked');
        const miniNode = document.querySelector(`.minimap-node[data-minimap-island="${islandId}"]`);
        if (miniNode) miniNode.classList.add('is-visited');
      });
    }

    function awardXP(amount, labelText) {
      state.xp = Math.min(state.maxXp, state.xp + amount);
      state.level = Math.min(6, 1 + Math.floor(state.xp / 100));
      syncHUDProgress();
      saveProgress();

      if (xpPopEl) {
        xpPopEl.textContent = labelText || `+${amount} XP ✨`;
        xpPopEl.classList.add('is-popping');
        setTimeout(() => xpPopEl.classList.remove('is-popping'), 1100);
      }
      playChimeXP();
    }

    function unlockIslandVisit(islandId) {
      const island = ISLANDS[islandId];
      if (!island) return;

      state.currentIslandId = islandId;
      if (speechEl) speechEl.textContent = island.speech;

      const questDesc = document.getElementById('hud-quest-desc');
      if (questDesc && island.questText) questDesc.textContent = island.questText;

      // Destaca pino atual e botão de navegação superior
      document.querySelectorAll('.world-island-pin').forEach(pin => {
        const pid = Number(pin.getAttribute('data-island-pin'));
        pin.classList.toggle('is-current', pid === islandId);
      });
      document.querySelectorAll('.world-nav-btn[data-island-trigger]').forEach(btn => {
        const tid = Number(btn.getAttribute('data-island-trigger'));
        btn.classList.toggle('is-active', tid === islandId);
      });
      document.querySelectorAll('.wooden-plank-btn[data-island-trigger]').forEach(btn => {
        const tid = Number(btn.getAttribute('data-island-trigger'));
        btn.classList.toggle('is-active', tid === islandId);
      });

      if (islandId >= 1 && !state.visited.has(islandId)) {
        state.visited.add(islandId);
        awardXP(100, `+100 XP · ${island.badgeIcon} ${island.badgeName}!`);
      } else {
        saveProgress();
      }
    }

    // ------------------------------------------------------------------------
    // C. ABERTURA E FECHAMENTO DO MODAL DA ILHA
    // ------------------------------------------------------------------------
    function openIslandModal(islandId) {
      const island = ISLANDS[islandId];
      if (!island || islandId === 0 || !modalOverlay || !modalBody) return;

      unlockIslandVisit(islandId);

      if (modalTitleNum) modalTitleNum.textContent = `ESTAÇÃO ${island.code}`;
      if (modalTitleText) modalTitleText.textContent = island.title;
      modalBody.innerHTML = getIslandModalHTML(islandId);
      modalOverlay.classList.add('is-open');
      modalOverlay.setAttribute('aria-hidden', 'false');

      // Se for a Ilha 03, monta as 5 Calculadoras Práticas
      if (islandId === 3) {
        const calcMount = document.getElementById('modal-calc5-mount');
        bindCalc5Events(calcMount, (xp) => awardXP(xp, `+${xp} XP · Simulação!`));
      }

      // Se for a Ilha 02, ativa o cálculo em tempo real dos checkboxes + Revelador de Extrato
      if (islandId === 2) {
        const chks = modalBody.querySelectorAll('.rx-quick-chk');
        const scoreVal = document.getElementById('rx-quick-score-val');
        const statusTitle = document.getElementById('rx-quick-status-title');
        const statusDesc = document.getElementById('rx-quick-status-desc');
        const updateQuickRx = () => {
          let total = 0;
          chks.forEach(c => { if (c.checked) total += Number(c.value); });
          if (scoreVal) scoreVal.textContent = `${total}/100`;
          const missing = Math.round((100 - total) / 20);
          if (statusTitle) {
            statusTitle.textContent = missing === 0
              ? 'Parabéns! Estrutura de Alta Blindagem'
              : `Atenção: ${missing} ${missing === 1 ? 'Pilar Desprotegido' : 'Pilares Desprotegidos'}`;
          }
          if (statusDesc) {
            statusDesc.textContent = total >= 80
              ? 'Sua estrutura já está avançada! Agende uma revisão fina com o Leonardo para otimizar taxas e sucessão.'
              : 'Sua carteira possui brechas que custam rentabilidade e segurança. Faça o diagnóstico completo ou converse com o Leo!';
          }
        };
        chks.forEach(c => c.addEventListener('change', updateQuickRx));
        updateQuickRx();

        const revealBtn = document.getElementById('rx-extrato-reveal-btn');
        const revealTxt = document.getElementById('rx-extrato-reveal-text');
        if (revealBtn && revealTxt) {
          revealBtn.addEventListener('click', () => {
            revealTxt.innerHTML = '⚠️ <strong>Revelado:</strong> Fundos bancários cobram até <strong>2,5% a.a.</strong> em taxas e rebates ocultos + come-cotas semestral + 100% de exposição ao Real. No modelo <strong>Fee-Based Portfel</strong>, 100% das comissões voltam como cashback direto para você!';
            revealBtn.textContent = '✓ Custos Revelados';
            revealBtn.style.background = '#1CD98A';
            revealBtn.style.color = '#04120A';
            if (!state.extratoRevealed) {
              state.extratoRevealed = true;
              awardXP(30, '+30 XP · Extrato Auditado!');
            }
          });
        }
      }

      // Se for a Ilha 05, ativa o form da Newsletter
      if (islandId === 5) {
        const form = document.getElementById('modal-newsletter-form');
        const msg = document.getElementById('modal-newsletter-msg');
        if (form && msg) {
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            msg.textContent = '✔ Inscrição confirmada! Você receberá a próxima edição semanal (+25 XP).';
            awardXP(25, '+25 XP · Newsletter!');
            form.reset();
          });
        }
      }

      // Botões internos para ir para próxima ilha
      modalBody.querySelectorAll('[data-goto-island]').forEach(btn => {
        btn.addEventListener('click', () => {
          const nextId = Number(btn.getAttribute('data-goto-island')) || 1;
          closeIslandModal();
          walkToIsland(nextId, true);
        });
      });

      // Links internos que fecham o modal e rolam para o modo clássico
      modalBody.querySelectorAll('[data-close-modal-scroll]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const sel = link.getAttribute('data-close-modal-scroll');
          closeIslandModal();
          const target = document.querySelector(sel);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }

    function closeIslandModal() {
      if (!modalOverlay) return;
      modalOverlay.classList.remove('is-open');
      modalOverlay.setAttribute('aria-hidden', 'true');
      state.lastCooldownIsland = state.currentIslandId;
      state.cooldownUntil = Date.now() + 2200;
    }

    // ------------------------------------------------------------------------
    // D. MOVIMENTAÇÃO DO PERSONAGEM PELO MAPA (CAMINHADA REAL)
    // ------------------------------------------------------------------------
    function updateTravelerDOM() {
      if (!travelerEl) return;
      travelerEl.style.left = `${state.x.toFixed(2)}%`;
      travelerEl.style.top = `${state.y.toFixed(2)}%`;

      // Escala de perspectiva baseada na profundidade Y (maior na frente, menor ao fundo)
      const depthScale = 0.72 + ((state.y - 20) / 65) * 0.46;
      const clampedScale = Math.max(0.72, Math.min(1.22, depthScale));
      travelerEl.style.transform = `translate(-50%, -88%) scale(${clampedScale.toFixed(3)})`;

      if (minimapPin) {
        minimapPin.style.left = `${state.x.toFixed(1)}%`;
        minimapPin.style.top = `${state.y.toFixed(1)}%`;
      }
    }

    function walkToIsland(islandId, openModal = true) {
      const target = ISLANDS[islandId];
      if (!target) return;
      state.targetX = target.x;
      state.targetY = target.y;
      state.targetIslandId = islandId;
      state.currentIslandId = islandId;
      state.openModalOnArrival = openModal;

      if (speechEl) {
        speechEl.textContent = islandId === 0
          ? 'Voltando ao Mirante...'
          : `Caminhando para Ilha ${target.code}... 🚶`;
      }
    }

    // Clique / Toque direto no palco do mapa para caminhar até o ponto clicado
    if (stage) {
      stage.addEventListener('click', (e) => {
        if (e.target.closest('button, a, #world-traveler, .world-wooden-signpost, .world-island-pin')) return;
        const rect = stage.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const clickX = ((e.clientX - rect.left) / rect.width) * 100;
        const clickY = ((e.clientY - rect.top) / rect.height) * 100;
        // Verifica se clicou bem próximo de alguma ilha
        for (let i = 1; i < ISLANDS.length; i++) {
          const isl = ISLANDS[i];
          if (Math.hypot(clickX - isl.x, clickY - isl.y) < 7.5) {
            walkToIsland(isl.id, true);
            return;
          }
        }
        state.targetX = Math.max(14, Math.min(86, clickX));
        state.targetY = Math.max(20, Math.min(84, clickY));
        state.targetIslandId = null;
        state.openModalOnArrival = false;
      });
    }

    // Loop físico de caminhada (WASD + Click-to-Walk) e renderização do Canvas
    let lastFrameTime = performance.now();
    function tickWorld(now) {
      const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
      lastFrameTime = now;

      let vx = 0;
      let vy = 0;
      const isModalOpen = modalOverlay && modalOverlay.classList.contains('is-open');

      if (!isModalOpen) {
        if (state.keys.w) vy -= 1;
        if (state.keys.s) vy += 1;
        if (state.keys.a) vx -= 1;
        if (state.keys.d) vx += 1;
      }

      let isMoving = false;

      if (vx !== 0 || vy !== 0) {
        // Movimento manual via WASD / Setas cancela rota automática
        state.targetX = null;
        state.targetY = null;
        state.targetIslandId = null;
        const len = Math.hypot(vx, vy) || 1;
        const speed = 22.0; // % da tela por segundo
        state.x = Math.max(14, Math.min(86, state.x + (vx / len) * speed * dt));
        state.y = Math.max(20, Math.min(84, state.y + (vy / len) * speed * dt));
        isMoving = true;

        if (vx < -0.1) travelerEl.classList.add('is-facing-left');
        if (vx > 0.1) travelerEl.classList.remove('is-facing-left');

        // Checa proximidade com qualquer ilha durante caminhada livre
        if (Date.now() > state.cooldownUntil) {
          for (let i = 1; i < ISLANDS.length; i++) {
            const isl = ISLANDS[i];
            const dist = Math.hypot(state.x - isl.x, state.y - isl.y);
            if (dist < 4.6 && state.lastCooldownIsland !== isl.id) {
              state.lastCooldownIsland = isl.id;
              state.keys.w = state.keys.a = state.keys.s = state.keys.d = false;
              openIslandModal(isl.id);
              break;
            } else if (dist > 7.0 && state.lastCooldownIsland === isl.id) {
              state.lastCooldownIsland = -1;
            }
          }
        }
      } else if (state.targetX !== null && state.targetY !== null) {
        const dx = state.targetX - state.x;
        const dy = state.targetY - state.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.8) {
          state.x = state.targetX;
          state.y = state.targetY;
          state.targetX = null;
          state.targetY = null;
          const arrivedId = state.targetIslandId;
          const shouldOpen = state.openModalOnArrival;
          state.targetIslandId = null;
          state.openModalOnArrival = false;
          if (arrivedId !== null) {
            unlockIslandVisit(arrivedId);
            if (shouldOpen && arrivedId >= 1) {
              openIslandModal(arrivedId);
            }
          } else {
            // Se chegou a um ponto clicado livremente próximo de uma ilha, desbloqueia
            for (let i = 1; i < ISLANDS.length; i++) {
              const isl = ISLANDS[i];
              if (Math.hypot(state.x - isl.x, state.y - isl.y) < 4.8) {
                openIslandModal(isl.id);
                break;
              }
            }
          }
        } else {
          const speed = Math.max(28.0, dist * 3.2);
          state.x += (dx / dist) * speed * dt;
          state.y += (dy / dist) * speed * dt;
          isMoving = true;
          if (dx < -0.2) travelerEl.classList.add('is-facing-left');
          if (dx > 0.2) travelerEl.classList.remove('is-facing-left');
        }
      }

      if (travelerEl) {
        travelerEl.classList.toggle('is-walking', isMoving);
      }

      if (isMoving && Math.random() < 0.38) {
        state.footprints.push({
          x: state.x,
          y: state.y + 1.2,
          alpha: 0.85,
          r: 3 + Math.random() * 2
        });
        if (state.footprints.length > 28) state.footprints.shift();
      }

      updateTravelerDOM();
      drawWorldCanvas(now);
      requestAnimationFrame(tickWorld);
    }

    // ------------------------------------------------------------------------
    // E. RENDERIZAÇÃO DO CANVAS 2.5D (PONTES DE LUZ, ONDAS E PEGADAS)
    // ------------------------------------------------------------------------
    function drawWorldCanvas(now) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== Math.round(rect.width) || canvas.height !== Math.round(rect.height)) {
        canvas.width = Math.round(rect.width);
        canvas.height = Math.round(rect.height);
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // 1. Desenha as trilhas / pontes iluminadas conectando as ilhas
      BRIDGE_SEGMENTS.forEach(([aIdx, bIdx], segIdx) => {
        const a = ISLANDS[aIdx];
        const b = ISLANDS[bIdx];
        if (!a || !b) return;
        const ax = (a.x / 100) * W;
        const ay = (a.y / 100) * H;
        const bx = (b.x / 100) * W;
        const by = (b.y / 100) * H;
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2 + 14;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(mx, my, bx, by);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
        ctx.lineWidth = 2.2;
        ctx.setLineDash([5, 7]);
        ctx.lineDashOffset = -((now * 0.025) % 24);
        ctx.stroke();

        // Luz pulsante viajando pela ponte
        const t = ((now * 0.00035 + segIdx * 0.17) % 1);
        const px = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx;
        const py = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#1CD98A';
        ctx.shadowColor = '#1CD98A';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      // 2. Desenha as pegadas luminosas do personagem
      for (let i = state.footprints.length - 1; i >= 0; i--) {
        const fp = state.footprints[i];
        fp.alpha -= 0.016;
        if (fp.alpha <= 0) {
          state.footprints.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc((fp.x / 100) * W, (fp.y / 100) * H, fp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${fp.alpha.toFixed(2)})`;
        ctx.shadowColor = '#E84A80';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }

    // ------------------------------------------------------------------------
    // F. CONTROLES DE TECLADO (WASD / SETAS / ESC), BOTÕES NA TELA E SCROLL
    // ------------------------------------------------------------------------
    function setKeyState(k, isDown) {
      if (!(k in state.keys)) return;
      state.keys[k] = isDown;
      const btn = document.querySelector(`.wasd-key-btn[data-wasd="${k}"]`);
      if (btn) btn.classList.toggle('is-pressed', isDown);
    }

    window.addEventListener('keydown', (e) => {
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable)) return;

      if (e.key === 'Escape') {
        closeIslandModal();
        return;
      }

      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') { setKeyState('w', true); if (window.scrollY < 120) e.preventDefault(); }
      if (k === 's' || e.key === 'ArrowDown') { setKeyState('s', true); if (window.scrollY < 120) e.preventDefault(); }
      if (k === 'a' || e.key === 'ArrowLeft') { setKeyState('a', true); if (window.scrollY < 120) e.preventDefault(); }
      if (k === 'd' || e.key === 'ArrowRight') { setKeyState('d', true); if (window.scrollY < 120) e.preventDefault(); }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') setKeyState('w', false);
      if (k === 's' || e.key === 'ArrowDown') setKeyState('s', false);
      if (k === 'a' || e.key === 'ArrowLeft') setKeyState('a', false);
      if (k === 'd' || e.key === 'ArrowRight') setKeyState('d', false);
    });

    // Teclas [W] [A] [S] [D] clicáveis / touch na tela
    document.querySelectorAll('.wasd-key-btn').forEach(btn => {
      const k = btn.getAttribute('data-wasd');
      const start = (e) => { e.preventDefault(); setKeyState(k, true); };
      const stop = () => setKeyState(k, false);
      btn.addEventListener('mousedown', start);
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('mouseup', stop);
      btn.addEventListener('mouseleave', stop);
      btn.addEventListener('touchend', stop);
    });

    // Scroll do mouse dentro do Mundo avança o personagem de ilha em ilha e abre o painel ao chegar
    let lastWheelStep = 0;
    app.addEventListener('wheel', (e) => {
      if (window.innerWidth <= 900) return; // Em mobile permite scroll natural
      if (modalOverlay && modalOverlay.classList.contains('is-open')) return;

      const now = Date.now();
      const baseId = state.targetIslandId !== null ? state.targetIslandId : state.currentIslandId;
      if (e.deltaY > 0 && baseId < 6) {
        e.preventDefault();
        if (now - lastWheelStep > 550) {
          lastWheelStep = now;
          const nextId = Math.min(6, baseId + 1);
          walkToIsland(nextId, true);
        }
      } else if (e.deltaY < 0 && window.scrollY <= 10 && baseId > 0) {
        e.preventDefault();
        if (now - lastWheelStep > 550) {
          lastWheelStep = now;
          const prevId = Math.max(0, baseId - 1);
          walkToIsland(prevId, prevId >= 1);
        }
      }
    }, { passive: false });

    // Cliques nos Pinos das Ilhas (01..06), Placas de Madeira, Mini-Mapa e Menu Topo
    document.querySelectorAll('[data-island-trigger]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const id = Number(el.getAttribute('data-island-trigger')) || 0;
        const openModal = el.getAttribute('data-no-modal') !== 'true';
        walkToIsland(id, openModal);
      });
    });

    // Botão "Explorar Minha Jornada +" -> caminha para a próxima ilha não visitada
    const exploreBtn = document.getElementById('world-explore-next-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        let nextIsland = 1;
        for (let i = 1; i <= 6; i++) {
          if (!state.visited.has(i)) {
            nextIsland = i;
            break;
          }
        }
        walkToIsland(nextIsland, true);
      });
    }

    // Botão "Ver Modo Clássico ↓"
    document.querySelectorAll('[data-scroll-classic]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById('classic-site-start') || document.getElementById('sobre');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Botões do Modal (Fechar, Anterior, Próxima)
    const closeBtn = document.getElementById('island-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeIslandModal);
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeIslandModal();
      });
    }

    const prevModalBtn = document.getElementById('island-modal-prev');
    const nextModalBtn = document.getElementById('island-modal-next');
    if (prevModalBtn) {
      prevModalBtn.addEventListener('click', () => {
        const prev = state.currentIslandId > 1 ? state.currentIslandId - 1 : 6;
        closeIslandModal();
        walkToIsland(prev, true);
      });
    }
    if (nextModalBtn) {
      nextModalBtn.addEventListener('click', () => {
        const next = state.currentIslandId < 6 ? state.currentIslandId + 1 : 1;
        closeIslandModal();
        walkToIsland(next, true);
      });
    }

    // Troca de Tema / Atmosfera (Manhã Serena -> Pôr do Sol -> Noite Outlier)
    const themeBtn = document.getElementById('world-theme-toggle');
    function applyThemeByIndex(idx) {
      state.themeIndex = ((idx % THEMES.length) + THEMES.length) % THEMES.length;
      const t = THEMES[state.themeIndex];
      app.setAttribute('data-world-theme', t);
      if (themeBtn) {
        themeBtn.textContent = t === 'day' ? '🌙' : (t === 'sunset' ? '🌅' : '☀️');
      }
      document.querySelectorAll('[data-world-theme-set]').forEach(sw => {
        sw.classList.toggle('is-active', sw.getAttribute('data-world-theme-set') === t);
      });
      saveProgress();
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        applyThemeByIndex(state.themeIndex + 1);
      });
    }
    document.querySelectorAll('[data-world-theme-set]').forEach(sw => {
      sw.addEventListener('click', () => {
        const targetTheme = sw.getAttribute('data-world-theme-set');
        const idx = THEMES.indexOf(targetTheme);
        if (idx !== -1) applyThemeByIndex(idx);
      });
    });

    // Troca de Avatar do Viajante (Exploradora / Executivo / Família)
    function applyAvatarStyle(styleIdx) {
      state.avatarStyle = ((styleIdx % 3) + 3) % 3;
      const avatarEmoji = document.getElementById('quest-avatar-emoji');
      const coatEl = document.getElementById('traveler-coat-path');
      const bowEl = document.getElementById('traveler-bow-group');
      if (state.avatarStyle === 0) {
        if (avatarEmoji) avatarEmoji.textContent = '👩‍💼';
        if (coatEl) coatEl.setAttribute('fill', '#F48FB1');
        if (bowEl) bowEl.style.display = 'block';
      } else if (state.avatarStyle === 1) {
        if (avatarEmoji) avatarEmoji.textContent = '🧑‍💼';
        if (coatEl) coatEl.setAttribute('fill', '#3B36CC');
        if (bowEl) bowEl.style.display = 'none';
      } else {
        if (avatarEmoji) avatarEmoji.textContent = '👩‍❤️‍👨';
        if (coatEl) coatEl.setAttribute('fill', '#0FA968');
        if (bowEl) bowEl.style.display = 'block';
      }
    }

    const avatarSwapBtn = document.getElementById('quest-avatar-swap');
    if (avatarSwapBtn) {
      avatarSwapBtn.addEventListener('click', () => {
        applyAvatarStyle(state.avatarStyle + 1);
        awardXP(10, '+10 XP · Visual Atualizado!');
      });
    }

    // Controles do Player de Música (CURRENT VIBE)
    const playBtn = document.getElementById('vibe-play-btn');
    const topSoundBtn = document.getElementById('world-sound-toggle');
    const prevTrackBtn = document.getElementById('vibe-prev-btn');
    const nextTrackBtn = document.getElementById('vibe-next-btn');
    const trackTitleEl = document.getElementById('vibe-track-title');
    const trackSubEl = document.getElementById('vibe-track-sub');

    function updateTrackInfo() {
      const tr = TRACKS[state.trackIndex % TRACKS.length];
      if (trackTitleEl) trackTitleEl.textContent = tr.title;
      if (trackSubEl) trackSubEl.textContent = tr.sub;
    }

    if (playBtn) playBtn.addEventListener('click', () => toggleFocusAudio());
    if (topSoundBtn) topSoundBtn.addEventListener('click', () => toggleFocusAudio());
    if (prevTrackBtn) {
      prevTrackBtn.addEventListener('click', () => {
        state.trackIndex = (state.trackIndex + TRACKS.length - 1) % TRACKS.length;
        updateTrackInfo();
      });
    }
    if (nextTrackBtn) {
      nextTrackBtn.addEventListener('click', () => {
        state.trackIndex = (state.trackIndex + 1) % TRACKS.length;
        updateTrackInfo();
      });
    }

    // Controles de Zoom (+/-) no Mini-Mapa (WORLD MAP)
    const zoomInBtn = document.getElementById('minimap-zoom-in');
    const zoomOutBtn = document.getElementById('minimap-zoom-out');
    function applyCameraZoom() {
      if (!stage) return;
      stage.style.transform = `scale(${state.zoom.toFixed(2)})`;
    }
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        state.zoom = Math.min(1.28, state.zoom + 0.08);
        applyCameraZoom();
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        state.zoom = Math.max(0.94, state.zoom - 0.08);
        applyCameraZoom();
      });
    }

    // Clique no próprio personagem abre a ilha atual ou avança para a próxima
    if (travelerEl) {
      travelerEl.addEventListener('click', () => {
        if (state.currentIslandId >= 1) {
          openIslandModal(state.currentIslandId);
        } else {
          walkToIsland(1, true);
        }
      });
    }

    // Monta também as 5 Calculadoras Práticas na seção #vitrine-simulador da Home se existir o container
    const homeCalc5Mount = document.getElementById('home-calc5-studio-mount');
    if (homeCalc5Mount) {
      bindCalc5Events(homeCalc5Mount, (xp) => awardXP(xp, `+${xp} XP · Calculadora!`));
    }

    // Restaura progresso salvo (localStorage) e sincroniza HUD
    loadProgress();
    applyThemeByIndex(state.themeIndex);
    applyAvatarStyle(state.avatarStyle);
    syncHUDProgress();

    // Expõe API pública window.OutlierWorldJourney
    window.OutlierWorldJourney = {
      islands: ISLANDS,
      getState: () => Object.assign({}, state, { visited: Array.from(state.visited) }),
      walkToIsland,
      openIslandModal,
      closeIslandModal,
      awardXP,
      setTheme: (themeName) => {
        const idx = THEMES.indexOf(themeName);
        if (idx !== -1) applyThemeByIndex(idx);
      },
      resetProgress: () => {
        state.visited = new Set([0]);
        state.xp = 100;
        state.level = 1;
        saveProgress();
        syncHUDProgress();
      }
    };

    requestAnimationFrame(tickWorld);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorldJourney);
  } else {
    initWorldJourney();
  }
})();

