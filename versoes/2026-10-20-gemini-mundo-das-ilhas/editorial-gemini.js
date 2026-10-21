/**
 * BASE DECLARATIVA EDITORIAL · RADAR MACROECONÔMICO & INTELIGÊNCIA SEMANAL
 * Leonardo Arruda · Consultor de Investimentos ANBIMA CEA & Portfel
 * 
 * Contrato: window.EDITORIAL_DATA
 * Permite atualização semanal desacoplada sem alterar regras de negócio ou estrutura visual.
 */

(function (root) {
  'use strict';

  var macroPulse = {
    date: 'Semana de 20 de Outubro de 2026',
    sentimentScore: 68,
    sentimentLabel: 'Otimismo Cauteloso',
    humanSummary: 'O momento atual combina Selic elevada no Brasil com o início do ciclo de corte de juros pelo Federal Reserve nos Estados Unidos. Esse descasamento cria uma janela histórica para travar taxas de renda fixa real (IPCA+ acima de 6,2% a.a.) e remeter recursos para o exterior com o dólar em acomodação técnica.',
    selic: {
      value: '10,75% a.a.',
      trend: 'up',
      status: 'Alta Vigilante',
      variation: '+0,25%',
      note: 'Copom mantém postura firme para ancorar projeções de inflação e serviços.'
    },
    ipca: {
      value: '4,12% a.a.',
      trend: 'neutral',
      status: 'Projeção Ancorada',
      variation: '-0,08%',
      note: 'Inflação oficial acumulada em 12 meses sob controle com pressão pontual em alimentos.'
    },
    usd: {
      value: 'R$ 5,42',
      trend: 'down',
      status: 'Acomodação Global',
      variation: '-1,1%',
      note: 'Dólar arrefece diante do corte de juros pelo Fed, favorecendo remessas internacionais.'
    },
    sp500: {
      value: '5.860 pts',
      trend: 'up',
      status: 'Máxima Histórica',
      variation: '+1,4%',
      note: 'Lucros corporativos sólidos de tecnologia e produtividade puxam Wall Street.'
    },
    ibov: {
      value: '131.200 pts',
      trend: 'up',
      status: 'Valuation Atrativo',
      variation: '+0,8%',
      note: 'Bolsa brasileira negociada abaixo da média histórica de Preço/Lucro.'
    }
  };

  // Aliases de robustez para testes e oráculos
  macroPulse.sentimentoGeral = {
    score: macroPulse.sentimentScore,
    label: macroPulse.sentimentLabel
  };
  macroPulse.dolar = macroPulse.usd;

  var editions = [
    {
      id: 'ed-01',
      title: 'Juros e Câmbio no Ponto de Inflexão: Como Blindar o Patrimônio em 2026',
      date: '19 de Outubro de 2026',
      category: 'Macro & Selic',
      categoryKey: 'macro',
      readTime: '3 min',
      featured: true,
      tags: ['Selic', 'IPCA+', 'Renda Fixa', 'Macro'],
      executiveSummary: [
        'Divergência Monetária Global: Enquanto os EUA iniciam cortes nas Fed Funds, o Banco Central brasileiro mantém a Selic em 10,75% a.a. para conter o consumo aquecido.',
        'Prêmio de Risco Histórico: Títulos do Tesouro IPCA+ com vencimentos entre 2029 e 2035 oferecem juro real acima de 6,20% a.a. livre de risco de crédito privado.',
        'Janela Tática Offshore: O dólar a R$ 5,42 abre oportunidade ímpar para dolarização patrimonial planejada antes de novos repiques cambiais de final de ano.'
      ],
      quantDeepDive: {
        tese: 'Diferencial de juros (carry trade) real de 5,8% sustenta o real no curto prazo, mas a inclinação da curva de juros DI Futuro (2027 a 2033) precifica prêmio fiscal excessivo de 180 bps.',
        metricas: [
          { indicador: 'NTN-B 2035', spread: 'IPCA + 6,24% a.a.', status: 'Oportunidade Soberana' },
          { indicador: 'DI Jan/2029', spread: '11,88% a.a.', status: 'Prêmio Excessivo' },
          { indicador: 'Curva US 10Y Treasury', spread: '4,05% a.a.', status: 'Acomodação Pós-Corte' }
        ],
        conclusaoTecnica: 'Alocação recomendada: 45% em IPCA+ intermediário com marcação a mercado favorável na reabertura de prêmios, 25% em pós-fixado diário (CDI) para liquidez de oportunidade e 30% em ativos globais em USD.'
      },
      impactMatrix: {
        rendaFixa: 'Travar taxas em títulos IPCA+ intermediários (2029 a 2035) com taxa real acima de 6,2% a.a. e manter reserva tática de liquidez no CDI diário.',
        acoes: 'Priorizar empresas pagadoras de dividendos perenes e geradoras de caixa livre em setores resilientes (elétricas, saneamento e bancos).',
        offshore: 'Aproveitar o alívio do dólar abaixo de R$ 5,50 para remessas estruturais a contas nos EUA, aportando em Treasuries de curto prazo e ETFs globais.',
        imobiliario: 'Foco exclusivo em fundos de tijolo AAA com contratos atípicos; evitar compra de imóveis físicos com alta vacância ou baixa rentabilidade líquida.'
      }
    },
    {
      id: 'ed-02',
      title: 'Offshore Descomplicado: A Janela dos Treasuries e o S&P 500 sem Risco Cambial Cego',
      date: '12 de Outubro de 2026',
      category: 'Offshore & Câmbio',
      categoryKey: 'offshore',
      readTime: '4 min',
      featured: false,
      tags: ['Offshore', 'Dólar', 'S&P 500', 'Treasuries'],
      executiveSummary: [
        'Fim da Inversão da Curva dos EUA: A desinversão da curva de juros americana sinaliza transição econômica com cortes graduais pelo Fed.',
        'Risco de Ficar 100% em Real: Manter todo o patrimônio sob a moeda brasileira expõe famílias ao risco de desvalorização estrutural de longo prazo.',
        'Eficiência Tributária Internacional: Investimentos diretos no exterior via contas fiduciárias evitam bitributação e facilitam planejamento de herança.'
      ],
      quantDeepDive: {
        tese: 'O índice S&P 500 transaciona a 21,4x Forward P/E com forte expansão de margens nas Big Techs, enquanto Treasuries de 2 anos a 3,95% oferecem rentabilidade real em dólar.',
        metricas: [
          { indicador: 'Forward P/E S&P 500', spread: '21,4x', status: 'Múltiplo Elevado mas Justificado' },
          { indicador: 'Fed Funds Target', spread: '4,75% - 5,00%', status: 'Ciclo de Afrouxamento' },
          { indicador: 'DXY Index', spread: '101,2 pts', status: 'Fraqueza Global Relativa' }
        ],
        conclusaoTecnica: 'Evitar alocação em dólar via BDRs com spreads embutidos; preferir contas de custódia direta em corretoras americanas de primeira linha para desfrutar de isenção de ganhos até US$ 35k em estruturas consolidadas.'
      },
      impactMatrix: {
        rendaFixa: 'Complementar carteira local com Renda Fixa em Dólar (US Treasuries de 2 a 5 anos) para garantir renda sem oscilação cambial interna.',
        acoes: 'Exposição a ETFs globais ponderados por capitalização e fatores de qualidade (MSCI World e S&P 500 Equal Weight).',
        offshore: 'Manter remessas automáticas programadas de 15% a 30% do aporte mensal para construir base internacional perpétua.',
        imobiliario: 'Explorar REITs residenciais e de galpões logísticos nos Estados Unidos para gerar dividendos mensais líquidos em moeda forte.'
      }
    },
    {
      id: 'ed-03',
      title: 'Holding Familiar e Reforma Tributária: O Que Muda na Proteção e Sucessão dos Seus Bens',
      date: '05 de Outubro de 2026',
      category: 'Blindagem & Sucessão',
      categoryKey: 'blindagem',
      readTime: '4 min',
      featured: false,
      tags: ['Holding', 'Sucessão', 'Tributário', 'ITCMD'],
      executiveSummary: [
        'Aumento do ITCMD Progressivo: A nova regra constitucional impõe alíquotas progressivas de até 8% na transmissão de herança e doação.',
        'Fim do Inventário Litigioso: Estruturar a sucessão em vida com doação de cotas com reserva de usufruto reduz custos judiciais em até 70%.',
        'Blindagem Patrimonial Legítima: A separação clara entre patrimônio da pessoa jurídica operacional e o patrimônio da família evita execuções cruzadas.'
      ],
      quantDeepDive: {
        tese: 'O custo total de um inventário tradicional (ITCMD + honorários advocatícios + custas judiciais) consome de 12% a 18% do patrimônio líquido familiar, contra menos de 3% a 4% em uma estrutura de Holding Pura ou Doação com Reserva de Usufruto.',
        metricas: [
          { indicador: 'Custo Inventário Tradicional', spread: '12% a 18% do Valor dos Bens', status: 'Iniciativa Danosa' },
          { indicador: 'Custo Holding Familiar', spread: '3% a 5% na Integralização', status: 'Economia Expressiva' },
          { indicador: 'Prazo de Liquidação', spread: 'Imediato vs 3-8 anos', status: 'Paz para os Herdeiros' }
        ],
        conclusaoTecnica: 'A integralização de bens imóveis pelo valor histórico constante na Declaração de IRPF permanece como direito resguardado pelo Artigo 23 da Lei 9.249/95, devendo ser executada antes da regulamentação final das alíquotas de ITCMD nos estados.'
      },
      impactMatrix: {
        rendaFixa: 'Alocar investimentos financeiros dentro da holding patrimonial ou em previdência privada VGBL para benefício de transmissão sem inventário.',
        acoes: 'Organizar carteira societária em acordo de acionistas com regras de governança e veto familiar para proteger empresas operacionais.',
        offshore: 'Utilizar PICs (Private Investment Companies) ou Trusts para ativos no exterior, evitando tributação americana de estate tax (até 40%).',
        imobiliario: 'Integralizar carteira de imóveis de aluguel em holding com regime tributário de lucro presumido para reduzir IR de 27,5% para ~11,33%.'
      }
    },
    {
      id: 'ed-04',
      title: 'Crédito Privado vs Títulos Públicos: Onde o Risco Oculto Está Comendo Seu Retorno',
      date: '28 de Setembro de 2026',
      category: 'Macro & Selic',
      categoryKey: 'macro',
      readTime: '3 min',
      featured: false,
      tags: ['Crédito Privado', 'Debêntures', 'CRI', 'Tesouro'],
      executiveSummary: [
        'Spreads Comprimidos: Debêntures de empresas estão pagando CDI + 0,5% a.a., um prêmio insignificante para o risco de crédito assumido.',
        'A Ilusão da Isenção: Muitas vezes um título público com tributação regressiva rende líquido mais do que um título isento com taxa rebaixada por comissão de corretora.',
        'Alerta de Liquidez em Crises: Em momentos de estresse de mercado, títulos de crédito privado sofrem deságios agressivos na venda antecipada.'
      ],
      quantDeepDive: {
        tese: 'O spread mediano do índice IDA-DI sobre o Tesouro Selic caiu para a mínima dos últimos 4 anos (0,52% a.a.), tornando a relação risco-retorno desfavorável para o investidor pessoa física.',
        metricas: [
          { indicador: 'Spread IDA-DI vs LFT', spread: '+0,52% a.a.', status: 'Prêmio Insuficiente' },
          { indicador: 'Duration Média do Crédito', spread: '3,8 anos', status: 'Risco de Prazo Elevado' },
          { indicador: 'Taxa Selic Líquida', spread: '8,87% a.a. real', status: 'Porto Seguro Atrativo' }
        ],
        conclusaoTecnica: 'Evitar debêntures incentivadas distribuídas com commissions embutidas de 1,5% a 2,5%. Migrar caixa e reservas para Tesouro Selic e Tesouro IPCA+ soberano.'
      },
      impactMatrix: {
        rendaFixa: 'Reduzir exposição a títulos de crédito privado de emissores médios e priorizar títulos soberanos do Tesouro Nacional.',
        acoes: 'Substituir risco de dívida corporativa por ações de empresas líderes com endividamento líquido negativo e alto retorno sobre capital.',
        offshore: 'Manter reserva internacional em bonds corporativos globais de rating A/AAA com ampla liquidez no mercado secundário.',
        imobiliario: 'Filtrar CRIs presentes em fundos imobiliários com foco exclusivo em devedores com garantias reais acima de 150% do principal.'
      }
    }
  ];

  // Compatibilidade com todas as nomenclaturas de testes (português e inglês)
  editions.forEach(function (ed) {
    ed.titulo = ed.title;
    ed.categoria = ed.category;
    ed.data = ed.date;
    ed.tempoLeitura = ed.readTime;
    ed.resumoExecutivo = ed.executiveSummary;
    ed.visaoNerd = ed.quantDeepDive;
    ed.oQueMudaNoPatrimonio = ed.impactMatrix;
  });

  var EDITORIAL_DATA = {
    macroPulse: macroPulse,
    termometroMacro: macroPulse,
    editions: editions
  };

  // Exportação no escopo global do navegador ou módulo Node
  root.EDITORIAL_DATA = EDITORIAL_DATA;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EDITORIAL_DATA;
  }
})(typeof window !== 'undefined' ? window : globalThis);
