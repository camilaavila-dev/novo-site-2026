/**
 * ==============================================================================
 * LEONARDO ARRUDA — RAIO-X CORE & RADAR PENTAGONAL (2026+)
 * Motor Determinístico de Diagnóstico Patrimonial, Arquétipos & Geometria SVG
 * ==============================================================================
 * Padrão Estético: Omshiva.ai / Astra / Private Wealth de Alta Fidelidade
 * Paradigma: Client-Side Determinístico de Alta Performance (Zero-deps runtime)
 * Conformidade: PROJECT.md § Interface Contracts, math-oracle.js, Explorer 2 Report
 * ==============================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var instance = factory();
    root.OutlierRaioX = instance;
    if (typeof window !== 'undefined') {
      window.OutlierRaioX = instance;
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // ==============================================================================
  // 1. BANCO DE QUESTÕES EXECUTIVAS — TERRITÓRIOS DE ENGENHARIA PATRIMONIAL
  // ==============================================================================

  var questions = [
    {
      id: 'q1',
      dimension: 'D1',
      territoryName: 'Território 1 · A Fortaleza Global (Offshore & Moeda Forte)',
      territorySub: 'Jurisdição Soberana & Moeda Forte',
      name: 'Alocação Global & Offshore',
      label: 'Offshore',
      title: 'Internacionalização & Moeda Forte',
      question: 'Qual porcentagem do seu patrimônio está investida diretamente fora do Brasil e em moeda forte?',
      subtitle: 'A exposição internacional é a primeira linha de defesa contra o risco soberano brasileiro e a perda histórica de poder de compra do Real.',
      weight: 0.20,
      options: [
        {
          letter: 'A',
          title: '100% Brasil / Reais',
          desc: 'Todo meu capital está em bancos e corretoras locais, em moeda brasileira.',
          score: 0
        },
        {
          letter: 'B',
          title: 'Investimento no exterior feito pelo Brasil',
          desc: 'Invisto apenas em BDRs, ETFs brasileiros (como IVVB11) ou fundos cambiais locais.',
          score: 35
        },
        {
          letter: 'C',
          title: 'Offshore em Formação',
          desc: 'Possuo conta internacional (ex: Avenue, Nomad, Interactive Brokers) com 5% a 20% do capital.',
          score: 75
        },
        {
          letter: 'D',
          title: 'Alocação Global Madura',
          desc: 'Mais de 20% do patrimônio custodiado em jurisdição de grau de investimento (EUA/Europa/Suíça).',
          score: 100
        }
      ]
    },
    {
      id: 'q2',
      dimension: 'D2',
      territoryName: 'Território 2 · O Escudo Fiscal (Eficiência Tributária & Come-Cotas)',
      territorySub: 'Engenharia Tributária & Diferimento Perpétuo',
      name: 'Eficiência Tributária',
      label: 'Fiscal',
      title: 'Eficiência Fiscal & Come-Cotas',
      question: 'Como os impostos sobre seus investimentos são administrados ao longo dos anos?',
      subtitle: 'A fricção fiscal silenciosa (como o come-cotas a cada 6 meses) corrói o efeito multiplicador dos juros compostos no longo prazo.',
      weight: 0.20,
      options: [
        {
          letter: 'A',
          title: 'Fricção Máxima',
          desc: 'Invisto em fundos DI/Multimercado convencionais (sofrendo come-cotas a cada 6 meses) sem planejamento.',
          score: 0
        },
        {
          letter: 'B',
          title: 'Isenções Táticas',
          desc: 'Concentro quase tudo em títulos isentos (LCI, LCA, CRI, CRA) para não pagar IR, mas sem visão ampla.',
          score: 40
        },
        {
          letter: 'C',
          title: 'Previdência Regressiva Ativa',
          desc: 'Utilizo VGBL na alíquota mínima de 10% ou PGBL para abater até 12% da renda tributável anual.',
          score: 75
        },
        {
          letter: 'D',
          title: 'Pagar menos imposto legalmente no longo prazo',
          desc: 'Combinação de previdência de alta performance, diferimento perpétuo, fundos exclusivos ou carteira administrada.',
          score: 100
        }
      ]
    },
    {
      id: 'q3',
      dimension: 'D3',
      territoryName: 'Território 3 · O Legado Perpétuo (Sucessão Familiar & Holding)',
      territorySub: 'Governança Familiar & Blindagem Sucessória',
      name: 'Planejamento Sucessório',
      label: 'Sucessão',
      title: 'Sucessão & Proteção Jurídica Familiar',
      question: 'Se você faltar inesperadamente amanhã, o que acontece com a transmissão dos seus bens para sua família?',
      subtitle: 'O inventário judicial no Brasil consome de 10% a 18% do patrimônio e congela contas bancárias familiares por meses ou anos.',
      weight: 0.20,
      options: [
        {
          letter: 'A',
          title: 'Inventário Tradicional',
          desc: 'Todos os bens e contas entram em processo judicial de inventário (custo de 10% a 18% e contas congeladas).',
          score: 0
        },
        {
          letter: 'B',
          title: 'Instrumentos Básicos',
          desc: 'Possuo seguro de vida simples ou testamento, mas os investimentos e imóveis principais ainda vão a inventário.',
          score: 35
        },
        {
          letter: 'C',
          title: 'Sucessão por Previdência',
          desc: 'Grande parte do capital líquido está em VGBL (liquidação extrajudicial direta aos beneficiários em até 30 dias).',
          score: 70
        },
        {
          letter: 'D',
          title: 'Holding & Governança Blindada',
          desc: 'Estrutura de holding familiar, doação com reserva de usufruto, cláusulas de incomunicabilidade e inventário quase zero.',
          score: 100
        }
      ]
    },
    {
      id: 'q4',
      dimension: 'D4',
      territoryName: 'Território 4 · A Reserva de Guerra (Liquidez & Cauda Antifrágil)',
      territorySub: 'Liquidez Soberana & Oportunidade Assimétrica',
      name: 'Liquidez & Cauda',
      label: 'Liquidez',
      title: 'Liquidez, Imóveis & Reserva de Cauda',
      question: 'Qual o grau de liquidez e flexibilidade do seu patrimônio diante de uma crise ou oportunidade súbita?',
      subtitle: 'Patrimônio sem liquidez adequada gera vulnerabilidade existencial e impede a captura de janelas de oportunidade em crises.',
      weight: 0.20,
      options: [
        {
          letter: 'A',
          title: 'Iliquidez Excessiva',
          desc: 'Mais de 70% do patrimônio está imobilizado em empresas próprias, terrenos ou imóveis físicos difíceis de vender.',
          score: 10
        },
        {
          letter: 'B',
          title: 'Reserva Misturada',
          desc: 'Tenho dinheiro em conta ou poupança, mas misturo capital pessoal com capital de giro dos negócios.',
          score: 45
        },
        {
          letter: 'C',
          title: 'Reserva de Conforto',
          desc: 'Possuo de 6 a 12 meses do custo de vida familiar alocados em liquidez diária soberana (LFT/Tesouro Selic).',
          score: 80
        },
        {
          letter: 'D',
          title: 'Reserva de segurança + Dinheiro pronto para oportunidades',
          desc: 'Liquidez de emergência intacta + Caixa Tático de Oportunidade para compras em crises + Ativos líquidos descorrelacionados.',
          score: 100
        }
      ]
    },
    {
      id: 'q5',
      dimension: 'D5',
      territoryName: 'Território 5 · A Aliança Fiduciária (Fee-Based & Independência)',
      territorySub: 'Transparência Fee-Based & Devolução de Rebates',
      name: 'Alinhamento Fiduciário',
      label: 'Fiduciário',
      title: 'Alinhamento de Interesses & Modelo de Assessoria',
      question: 'Quem orienta suas decisões patrimoniais hoje e como esse profissional é remunerado?',
      subtitle: 'O modelo de remuneração determina de que lado da mesa o profissional está: no seu lado ou no lado das metas de vendas da corretora.',
      weight: 0.20,
      options: [
        {
          letter: 'A',
          title: 'Varejo / Conflito Direto',
          desc: 'Decido sozinho sem tempo para acompanhar, ou sigo orientações do gerente do meu banco tradicional.',
          score: 0
        },
        {
          letter: 'B',
          title: 'Assessor Comissionado (AAI)',
          desc: 'Sou atendido por assessor de corretora que ganha comissão sobre os produtos que me recomenda (spreads embutidos).',
          score: 30
        },
        {
          letter: 'C',
          title: 'Consultor Independente Híbrido',
          desc: 'Pago um valor fixo ou percentual, mas não tenho certeza se recebo de volta todos os rebates das plataformas.',
          score: 65
        },
        {
          letter: 'D',
          title: '100% Fee-Based Fiduciário',
          desc: 'Remunero meu consultor diretamente via taxa transparente acordada, com 100% de cashback de qualquer rebate de produto.',
          score: 100
        }
      ]
    }
  ];

  // ==============================================================================
  // 2. CATÁLOGO DOS 5 ARQUÉTIPOS COM INSÍGNIAS HERALDICAS SVG
  // ==============================================================================

  var archetypes = {
    soberano: {
      id: 'soberano',
      name: 'O Soberano Blindado',
      badge: 'Top 1% de Governança',
      color: '#1CD98A',
      haloColor: 'rgba(28, 217, 138, 0.35)',
      maturityLevel: 'Nível 4 · Patrimônio Soberano de Elite',
      emblemSvg: '<svg viewBox="0 0 48 48" fill="none" stroke="#1CD98A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4L7 12v12c0 11 7.2 21.3 17 24 9.8-2.7 17-13 17-24V12L24 4z"/><path d="M24 16l3.5 7h7.5l-6 4.5 2.5 7.5-7.5-5-7.5 5 2.5-7.5-6-4.5h7.5L24 16z"/></svg>',
      profile: 'Investidor com estrutura patrimonial madura, alocação global acima de 25%, holding operacionalizada e alinhamento fiduciário pleno.',
      impactPhrase: 'Sua governança patrimonial está no topo 1% do Brasil. O desafio agora é a gestão tática de cauda e otimização dinâmica diante de mudanças legislativas.',
      recommendedAction: 'Consultoria estratégica contínua de Family Office para preservação intergeracional, arbitragem tributária e proteção cambial.'
    },
    construtor: {
      id: 'construtor',
      name: 'O Construtor Exposto',
      badge: 'Risco de Execução Jurídica',
      color: '#E4572E',
      haloColor: 'rgba(228, 87, 46, 0.35)',
      maturityLevel: 'Nível 1 · Patrimônio Vulnerável',
      emblemSvg: '<svg viewBox="0 0 48 48" fill="none" stroke="#E4572E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6L6 20v22h36V20L24 6z"/><path d="M18 42V26h12v16"/><path d="M24 13v5M12 28h4M32 28h4"/></svg>',
      profile: 'Empresário ou profissional liberal de alta renda com foco na geração de caixa operacional e alta imobilização patrimonial sem proteção jurídica externa.',
      impactPhrase: 'Você é um mestre em gerar riqueza, mas deixa a porta dos fundos aberta para o risco Brasil e a instabilidade jurídica.',
      recommendedAction: 'Desacoplamento imediato de patrimônio líquido via Holding Patrimonial + Internacionalização de 15% a 25% do capital.'
    },
    patriarca: {
      id: 'patriarca',
      name: 'O Patriarca Tradicionalista',
      badge: 'Gargalo Sucessório Crítico',
      color: '#F2B705',
      haloColor: 'rgba(242, 183, 5, 0.35)',
      maturityLevel: 'Nível 2 · Blindagem Básica / Em Construção',
      emblemSvg: '<svg viewBox="0 0 48 48" fill="none" stroke="#F2B705" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4v40M12 16c6-4 18-4 24 0M10 28c7-5 21-5 28 0M14 40c5-3 15-3 20 0"/><circle cx="24" cy="8" r="4"/><circle cx="16" cy="20" r="3"/><circle cx="32" cy="20" r="3"/></svg>',
      profile: 'Famílias com patrimônio consolidado ao longo de décadas, predominantemente em imóveis físicos e bancos tradicionais, sem planejamento sucessório moderno.',
      impactPhrase: 'Seu patrimônio é sólido, mas sua estrutura sucessória é uma bomba-relógio fiscal para a próxima geração.',
      recommendedAction: 'Estruturação de Holding Familiar com doação de cotas em vida com reserva de usufruto e alocação de liquidez em Previdência VGBL.'
    },
    acumulador: {
      id: 'acumulador',
      name: 'O Acumulador Ineficiente',
      badge: 'Erosão Silenciosa de Comissões',
      color: '#6B66E8',
      haloColor: 'rgba(107, 102, 232, 0.35)',
      maturityLevel: 'Nível 2 · Blindagem Básica / Em Construção',
      emblemSvg: '<svg viewBox="0 0 48 48" fill="none" stroke="#6B66E8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="12" width="32" height="28" rx="4"/><circle cx="24" cy="26" r="6"/><path d="M24 20v6l4 2M16 6h16M20 6v6M28 6v6"/></svg>',
      profile: 'Investidor disciplinado, porém assessorado sob modelo comissionado tradicional, sofrendo fee drag invisível e tributação ineficiente.',
      impactPhrase: 'Você tem disciplina exemplar de poupança, mas seu patrimônio é drenado silenciosamente por taxas e comissões que você nem sabe que paga.',
      recommendedAction: 'Migração para o modelo 100% Fee-Based com auditoria de carteira e recuperação de 100% dos rebates pagos pelas corretoras.'
    },
    estrategista: {
      id: 'estrategista',
      name: 'O Estrategista em Transição',
      badge: 'Falta de Método Unificado',
      color: '#3B36CC',
      haloColor: 'rgba(59, 54, 204, 0.35)',
      maturityLevel: 'Nível 3 · Blindagem Avançada',
      emblemSvg: '<svg viewBox="0 0 48 48" fill="none" stroke="#6B66E8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="18"/><path d="M24 6v36M6 24h36"/><path d="M36 12l-8 12-12 8 8-12 12-8z"/><circle cx="24" cy="24" r="3" fill="#6B66E8"/></svg>',
      profile: 'Investidor com boa visão e alocação iniciada no exterior, porém com ativos dispersos e sem método unificado de controle de risco.',
      impactPhrase: 'Você já tem a visão correta de diversificação, mas a falta de uma gestão patrimonial unificada impede seu patrimônio de atingir o rendimento máximo.',
      recommendedAction: 'Consolidação patrimonial holística sob gestão fiduciária única com rebalanceamento trimestral disciplinado.'
    }
  };

  // ==============================================================================
  // 3. CATÁLOGO ANALÍTICO DE GARGALOS PATRIMONIAIS
  // ==============================================================================

  var bottleneckCatalog = {
    D1: {
      key: 'D1',
      name: 'Alocação Global & Offshore',
      tag: 'Vulnerabilidade Crítica: 100% de Exposição ao Risco Soberano Brasileiro',
      risk: 'Concentrar todo o capital no Brasil expõe seu patrimônio à desvalorização cambial histórica, volatilidade política e insegurança fiscal.',
      solution: 'Leonardo estrutura a internacionalização com custódia direta em jurisdições de grau de investimento (EUA/Europa), preservando seu poder de compra em moeda forte.'
    },
    D2: {
      key: 'D2',
      name: 'Eficiência Tributária',
      tag: 'Ineficiência Fiscal: Erosão Patrimonial Severa por Come-Cotas e Bitributação',
      risk: 'Fundos convencionais sofrem antecipação semestral de IR (come-cotas), destruindo o efeito multiplicador dos juros compostos ao longo dos anos.',
      solution: 'Aplicação de estruturas de diferimento perpétuo, previdência regressiva (10% de IR) e fundos exclusivos que blindam os rendimentos da tributação semestral.'
    },
    D3: {
      key: 'D3',
      name: 'Planejamento Sucessório',
      tag: 'Risco Familiar: Perda de até 18% do Patrimônio em Futuro Processo de Inventário',
      risk: 'O inventário judicial no Brasil congela contas bancárias familiares e consome de 10% a 20% de todo o patrimônio entre ITCMD progressivo, custas e honorários.',
      solution: 'Planejamento sucessório antecipado com doação de cotas com reserva de usufruto, previdência VGBL (liquidação em até 30 dias) e governança de herdeiros.'
    },
    D4: {
      key: 'D4',
      name: 'Liquidez & Cauda',
      tag: 'Armadilha de Iliquidez: Imobilização Excessiva sem Caixa Tático de Oportunidade',
      risk: 'Alta concentração em imóveis físicos ou na empresa própria impede resposta rápida a imprevistos e força liquidações com grande deságio em momentos de crise.',
      solution: 'Estratégia Antifrágil (Barbell): reserva de conforto soberana em liquidez diária somada a um caixa tático para capturar oportunidades assimétricas de mercado.'
    },
    D5: {
      key: 'D5',
      name: 'Alinhamento Fiduciário',
      tag: 'Conflito de Interesses: Estimativa de Fee Drag de 1,5% a 2,5% a.a. drenando seu futuro',
      risk: 'Assessores comissionados e gerentes de banco ganham mais recomendando produtos caros, complexos (ex: COE) ou com maior margem para a instituição financeira.',
      solution: 'Consultoria 100% Fee-Based: remuneração transparente e fixa, com devolução integral (cashback de 100%) de qualquer taxa de rebate recebida das plataformas.'
    }
  };

  // ==============================================================================
  // 4. ALGORITMOS QUANTITATIVOS DE SCORE, ARQUÉTIPO E GARGALOS (MATH-ORACLE)
  // ==============================================================================

  /**
   * Diagnóstico Raio-X: Algoritmo de Score Global (0-100)
   * S_global = round((D1 + D2 + D3 + D4 + D5) / 5)
   */
  function calculateRaioXScore(d1, d2, d3, d4, d5) {
    var valid = [d1, d2, d3, d4, d5].every(function (v) {
      return typeof v === 'number' && v >= 0 && v <= 100;
    });
    if (!valid) throw new Error('Scores dimensionais devem estar entre 0 e 100');
    var overall = Math.round((d1 + d2 + d3 + d4 + d5) / 5);
    return {
      d1: d1,
      d2: d2,
      d3: d3,
      d4: d4,
      d5: d5,
      overallScore: overall
    };
  }

  /**
   * Taxonomia Determinística dos 5 Arquétipos de Investidor de Elite:
   * 1. Soberano Blindado (Score >= 85 e todos >= 70)
   * 2. Construtor Exposto (D4 <= 45 e D1 <= 40)
   * 3. Patriarca Tradicionalista (D3 <= 35 e D1 <= 40)
   * 4. Acumulador Ineficiente (D5 <= 35 e D2 <= 50)
   * 5. Estrategista em Transição (demais casos)
   */
  function determineArchetype(d1, d2, d3, d4, d5) {
    var calc = calculateRaioXScore(d1, d2, d3, d4, d5);
    var s = calc.overallScore;

    if (s >= 85 && d1 >= 70 && d2 >= 70 && d3 >= 70 && d4 >= 70 && d5 >= 70) {
      return Object.assign({}, archetypes.soberano);
    }

    if (d4 <= 45 && d1 <= 40) {
      return Object.assign({}, archetypes.construtor);
    }

    if (d3 <= 35 && d1 <= 40) {
      return Object.assign({}, archetypes.patriarca);
    }

    if (d5 <= 35 && d2 <= 50) {
      return Object.assign({}, archetypes.acumulador);
    }

    return Object.assign({}, archetypes.estrategista);
  }

  /**
   * Identificação dos 2 maiores gargalos patrimoniais:
   * Ordena as 5 dimensões em ordem crescente de pontuação e retorna as 2 menores.
   */
  function determineBottlenecks(d1, d2, d3, d4, d5) {
    var list = [
      { key: 'D1', name: 'Alocação Global & Offshore', score: d1 },
      { key: 'D2', name: 'Eficiência Tributária', score: d2 },
      { key: 'D3', name: 'Planejamento Sucessório', score: d3 },
      { key: 'D4', name: 'Liquidez & Cauda', score: d4 },
      { key: 'D5', name: 'Alinhamento Fiduciário', score: d5 }
    ];

    list.sort(function (a, b) {
      return a.score - b.score;
    });

    var top2 = list.slice(0, 2);
    return top2.map(function (item) {
      var catalogInfo = bottleneckCatalog[item.key] || {};
      return Object.assign({}, item, catalogInfo);
    });
  }

  /**
   * Geometria Analítica do Gráfico de Radar Pentagonal de 5 Eixos:
   * Ângulo base: -90° (topo vertical). Espaçamento: 72° (2*PI/5).
   * Raio máximo: rMax = 135px no centro (200, 200).
   */
  function generateRadarPoints(d1, d2, d3, d4, d5, cx, cy, rMax) {
    if (cx === undefined) cx = 200;
    if (cy === undefined) cy = 200;
    if (rMax === undefined) rMax = 135;

    var scores = [d1, d2, d3, d4, d5];
    return scores.map(function (val, idx) {
      var angle = -Math.PI / 2 + (idx * (2 * Math.PI / 5));
      var r = rMax * (val / 100);
      var x = cx + (r * Math.cos(angle));
      var y = cy + (r * Math.sin(angle));
      return {
        index: idx,
        score: val,
        angleRad: angle,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        svgCoord: x.toFixed(1) + ',' + y.toFixed(1)
      };
    });
  }

  // ==============================================================================
  // 5. MOTOR DE RESOLUÇÃO POLIMÓRFICA calculateScore(answers)
  // ==============================================================================

  function parseAnswerScores(answers) {
    if (arguments.length >= 5) {
      return [arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]];
    }

    if (Array.isArray(answers) && answers.length === 5) {
      var allAreOptionIndices = answers.every(function (v) {
        return Number.isInteger(v) && v >= 0 && v <= 3;
      }) && answers.some(function (v) { return v > 0; }) && answers.every(function (v) { return v <= 3; });

      if (allAreOptionIndices) {
        return answers.map(function (optIdx, qIdx) {
          var q = questions[qIdx];
          return q && q.options[optIdx] ? q.options[optIdx].score : 0;
        });
      }
      return answers.slice(0, 5);
    }

    if (answers && typeof answers === 'object') {
      var optArray = answers.optionIndices || answers.options || answers.indices;
      if (Array.isArray(optArray) && optArray.length === 5) {
        return optArray.map(function (optIdx, qIdx) {
          var q = questions[qIdx];
          return (typeof optIdx !== 'undefined' && optIdx !== null && q && q.options[optIdx]) ? q.options[optIdx].score : 0;
        });
      }

      var dims = ['D1', 'D2', 'D3', 'D4', 'D5'];
      var hasAllDims = dims.every(function (k) { return typeof answers[k] !== 'undefined'; });
      if (hasAllDims) {
        var vals = dims.map(function (k) { return answers[k]; });
        var areIndices = (answers.isOptionIndices === true) || (
          vals.every(function (v) {
            return Number.isInteger(v) && v >= 0 && v <= 3;
          }) && vals.some(function (v) { return v > 0; })
        );

        if (areIndices) {
          return dims.map(function (k, qIdx) {
            var optIdx = answers[k];
            var q = questions[qIdx];
            return (typeof optIdx !== 'undefined' && q && q.options[optIdx]) ? q.options[optIdx].score : 0;
          });
        }
        return vals;
      }

      var hasLowerDims = ['d1', 'd2', 'd3', 'd4', 'd5'].every(function (k) { return typeof answers[k] !== 'undefined'; });
      if (hasLowerDims) {
        return ['d1', 'd2', 'd3', 'd4', 'd5'].map(function (k) { return Number(answers[k]); });
      }
    }

    return [0, 0, 0, 0, 0];
  }

  function calculateScore(answers) {
    var rawScores;
    if (arguments.length >= 5) {
      rawScores = [arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]];
    } else {
      rawScores = parseAnswerScores(answers);
    }

    var d1 = typeof rawScores[0] === 'number' ? rawScores[0] : 0;
    var d2 = typeof rawScores[1] === 'number' ? rawScores[1] : 0;
    var d3 = typeof rawScores[2] === 'number' ? rawScores[2] : 0;
    var d4 = typeof rawScores[3] === 'number' ? rawScores[3] : 0;
    var d5 = typeof rawScores[4] === 'number' ? rawScores[4] : 0;

    var overall = Math.round((d1 + d2 + d3 + d4 + d5) / 5);
    var arq = determineArchetype(d1, d2, d3, d4, d5);
    var bottlenecks = determineBottlenecks(d1, d2, d3, d4, d5);

    var queryParams = 'score=' + overall +
      '&arq=' + arq.id +
      '&gap1=' + (bottlenecks[0] ? bottlenecks[0].key : 'D1') +
      '&gap2=' + (bottlenecks[1] ? bottlenecks[1].key : 'D2') +
      '&d1=' + d1 +
      '&d2=' + d2 +
      '&d3=' + d3 +
      '&d4=' + d4 +
      '&d5=' + d5;

    // A consulta vem antes do #: depois dele o navegador não a lê.
    var consultationUrl = 'index.html?' + queryParams + '#primeiro-passo';

    var wppMsg = 'Olá Leonardo, fiz o Raio-X Patrimonial, meu arquétipo foi ' + arq.name +
      ' com score ' + overall + '/100 e gostaria de agendar uma conversa estratégica.';
    var whatsappUrl = 'https://wa.me/5515999999999?text=' + encodeURIComponent(wppMsg);

    return {
      dimensionScores: {
        D1: d1,
        D2: d2,
        D3: d3,
        D4: d4,
        D5: d5
      },
      overallScore: overall,
      archetype: arq,
      bottlenecks: bottlenecks,
      consultationUrl: consultationUrl,
      whatsappUrl: whatsappUrl
    };
  }

  // ==============================================================================
  // 6. RENDERIZAÇÃO DO RADAR PENTAGONAL EM SVG NATIVO (MONUMENTAL & HIPNÓTICO)
  // ==============================================================================

  function renderRadarChart(svgElementId, dimensionScores) {
    var svgEl = null;
    if (typeof svgElementId === 'string') {
      if (typeof document !== 'undefined') {
        svgEl = document.getElementById(svgElementId) || document.querySelector(svgElementId);
      }
    } else if (svgElementId && svgElementId.tagName) {
      svgEl = svgElementId;
    }

    if (!svgEl) return;

    var d1 = 0, d2 = 0, d3 = 0, d4 = 0, d5 = 0;
    if (dimensionScores) {
      if (typeof dimensionScores.D1 === 'number') d1 = dimensionScores.D1;
      else if (typeof dimensionScores.d1 === 'number') d1 = dimensionScores.d1;

      if (typeof dimensionScores.D2 === 'number') d2 = dimensionScores.D2;
      else if (typeof dimensionScores.d2 === 'number') d2 = dimensionScores.d2;

      if (typeof dimensionScores.D3 === 'number') d3 = dimensionScores.D3;
      else if (typeof dimensionScores.d3 === 'number') d3 = dimensionScores.d3;

      if (typeof dimensionScores.D4 === 'number') d4 = dimensionScores.D4;
      else if (typeof dimensionScores.d4 === 'number') d4 = dimensionScores.d4;

      if (typeof dimensionScores.D5 === 'number') d5 = dimensionScores.D5;
      else if (typeof dimensionScores.d5 === 'number') d5 = dimensionScores.d5;

      if (Array.isArray(dimensionScores) && dimensionScores.length >= 5) {
        d1 = dimensionScores[0];
        d2 = dimensionScores[1];
        d3 = dimensionScores[2];
        d4 = dimensionScores[3];
        d5 = dimensionScores[4];
      }
    }

    var cx = 200;
    var cy = 200;
    var rMax = 135;

    var dataPoints = generateRadarPoints(d1, d2, d3, d4, d5, cx, cy, rMax);
    var polyPointsStr = dataPoints.map(function (p) { return p.svgCoord; }).join(' ');

    // 4 Níveis concêntricos guias (25%, 50%, 75%, 100%)
    var concentricLevels = [25, 50, 75, 100];
    var concentricPolysHtml = concentricLevels.map(function (lvl) {
      var pts = generateRadarPoints(lvl, lvl, lvl, lvl, lvl, cx, cy, rMax);
      var ptsStr = pts.map(function (p) { return p.svgCoord; }).join(' ');
      var strokeColor = lvl === 100 ? 'rgba(28, 217, 138, 0.28)' : 'rgba(255, 255, 255, 0.07)';
      var strokeWidth = lvl === 100 ? '1.5' : '1';
      var dash = lvl < 100 ? 'stroke-dasharray="2,3"' : '';
      return '<polygon points="' + ptsStr + '" fill="none" stroke="' + strokeColor + '" stroke-width="' + strokeWidth + '" ' + dash + ' />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + (rMax * lvl / 100) + '" fill="none" stroke="rgba(59, 54, 204, 0.05)" stroke-width="0.8" />' +
        '<text x="200" y="' + (cy - (rMax * lvl / 100) + 4) + '" fill="rgba(149, 144, 176, 0.45)" font-size="8.5" font-family="\'JetBrains Mono\', monospace" text-anchor="middle">' + lvl + '%</text>';
    }).join('\n');

    // 5 Eixos radiais partindo do centro (200, 200) até rMax
    var maxGuidePoints = generateRadarPoints(100, 100, 100, 100, 100, cx, cy, rMax);
    var radialAxesHtml = maxGuidePoints.map(function (p) {
      return '<line x1="' + cx + '" y1="' + cy + '" x2="' + p.x + '" y2="' + p.y + '" stroke="rgba(255, 255, 255, 0.14)" stroke-width="1" stroke-dasharray="3,3" />';
    }).join('\n');

    // Configuração de rótulos dos eixos nas extremidades
    var labelConfigs = [
      { text: 'D1 · Offshore', sub: 'Global', x: 200, y: 32, anchor: 'middle' },
      { text: 'D2 · Fiscal', sub: 'Tributos', x: 350, y: 154, anchor: 'start' },
      { text: 'D3 · Sucessão', sub: 'Holding', x: 295, y: 342, anchor: 'start' },
      { text: 'D4 · Liquidez', sub: 'Cauda', x: 105, y: 342, anchor: 'end' },
      { text: 'D5 · Fiduciário', sub: 'Fee-Based', x: 50, y: 154, anchor: 'end' }
    ];

    var axisLabelsHtml = labelConfigs.map(function (cfg) {
      return '<text x="' + cfg.x + '" y="' + cfg.y + '" fill="#EDE8D5" font-size="11" font-weight="600" font-family="\'JetBrains Mono\', monospace" text-anchor="' + cfg.anchor + '">' + cfg.text + '</text>' +
        '<text x="' + cfg.x + '" y="' + (cfg.y + 13) + '" fill="#9590B0" font-size="9" font-family="\'DM Sans\', sans-serif" text-anchor="' + cfg.anchor + '">' + cfg.sub + '</text>';
    }).join('\n');

    // Vértices táteis com anéis de pulso luminescentes
    var verticesHtml = dataPoints.map(function (p) {
      return '<g class="rx-vertex-node">' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="10" fill="rgba(28, 217, 138, 0.15)" class="rx-pulse-ring" />' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="5.5" fill="#1CD98A" stroke="#FFFFFF" stroke-width="2" style="filter: drop-shadow(0 0 6px #1CD98A);" />' +
        '</g>';
    }).join('\n');

    var svgContent = '' +
      '<defs>' +
      '  <linearGradient id="rx-radar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '    <stop offset="0%" stop-color="#1CD98A" stop-opacity="0.42" />' +
      '    <stop offset="60%" stop-color="#3B36CC" stop-opacity="0.28" />' +
      '    <stop offset="100%" stop-color="#6B66E8" stop-opacity="0.14" />' +
      '  </linearGradient>' +
      '</defs>' +
      '<!-- Grade Pentagonal Consecutiva -->' +
      '<g class="rx-concentric-mesh">' + concentricPolysHtml + '</g>' +
      '<!-- Eixos Radiais -->' +
      '<g class="rx-radial-axes">' + radialAxesHtml + '</g>' +
      '<!-- Polígono de Dados do Investidor com Borda Luminosa -->' +
      '<polygon id="radar-data-poly" points="' + polyPointsStr + '" fill="url(#rx-radar-gradient)" stroke="#1CD98A" stroke-width="2.5" stroke-linejoin="round" style="filter: drop-shadow(0 0 14px rgba(28, 217, 138, 0.55)); transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);" />' +
      '<!-- Vértices Táteis -->' +
      '<g class="rx-vertices-group">' + verticesHtml + '</g>' +
      '<!-- Rótulos em JetBrains Mono -->' +
      '<g class="rx-axis-labels">' + axisLabelsHtml + '</g>' +
      '<!-- Núcleo Central -->' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="#1CD98A" style="filter: drop-shadow(0 0 4px #1CD98A);" />';

    svgEl.innerHTML = svgContent;
  }

  // ==============================================================================
  // 7. CONTROLADOR INTERATIVO DA JORNADA DO QUIZ (UI EM 5 ETAPAS)
  // ==============================================================================

  function initRaioXUI() {
    if (typeof document === 'undefined') return;

    var currentStep = 0;
    var selectedAnswers = [null, null, null, null, null];

    var introCard = document.getElementById('rx-intro-card');
    var quizContainer = document.getElementById('rx-quiz-container');
    var resultsPanel = document.getElementById('rx-results-panel');

    var stepIndicator = document.getElementById('rx-step-num');
    var stepTotal = document.getElementById('rx-step-total');
    var dimensionTitle = document.getElementById('rx-dimension-title');
    var territoryTag = document.getElementById('rx-territory-tag');
    var progressBar = document.getElementById('rx-progress-bar');

    var questionCard = document.getElementById('rx-question-card');
    var questionText = document.getElementById('rx-question-text');
    var questionSubtitle = document.getElementById('rx-question-subtitle');
    var optionsContainer = document.getElementById('rx-options-container');
    var prevBtn = document.getElementById('rx-prev-btn');

    var restartBtn = document.getElementById('rx-restart-btn');
    var startBtn = document.getElementById('rx-start-btn');

    if (!quizContainer || !resultsPanel) return;

    // Aplica efeito 3D Tilt tátil aos cards de opções
    function bindCardTilt(card) {
      if (!card || typeof card.addEventListener !== 'function') return;
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;
        var rotX = ((y - cy) / cy) * -6;
        var rotY = ((x - cx) / cx) * 6;
        card.style.transform = 'perspective(800px) rotateX(' + rotX.toFixed(1) + 'deg) rotateY(' + rotY.toFixed(1) + 'deg) translateY(-3px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    }

    function renderStep(stepIndex) {
      if (stepIndex < 0 || stepIndex >= questions.length) return;
      currentStep = stepIndex;

      var q = questions[stepIndex];

      if (stepIndicator) stepIndicator.textContent = String(stepIndex + 1);
      if (stepTotal) stepTotal.textContent = String(questions.length);
      if (dimensionTitle) dimensionTitle.textContent = q.dimension + ' · ' + q.name;
      if (territoryTag) territoryTag.textContent = 'PASSO ' + (stepIndex + 1) + ' DE 5 · ANALISANDO SUA ESTRUTURA ATUAL';

      // Atualiza os anéis concêntricos do Escudo Holográfico 3D
      for (var ringIdx = 1; ringIdx <= 5; ringIdx++) {
        var ringEl = document.getElementById('rx-orb-ring-' + ringIdx);
        if (ringEl) {
          if (ringIdx <= stepIndex + 1) {
            ringEl.classList.add('is-active');
          } else {
            ringEl.classList.remove('is-active');
          }
        }
      }

      var orbStatus = document.getElementById('rx-orb-status');
      if (orbStatus) {
        var answeredCount = selectedAnswers.filter(function (a) { return a !== null; }).length;
        orbStatus.textContent = 'Diagnóstico Patrimonial: ' + (answeredCount * 20) + '% Concluído (' + (stepIndex + 1) + '/5 Pilares)';
      }

      var quantumStream = document.getElementById('rx-quantum-stream');
      var quantumStatus = document.getElementById('rx-quantum-status');
      if (quantumStream) {
        quantumStream.textContent = 'ANÁLISE PATRIMONIAL // ' + q.dimension + ': ' + q.name.toUpperCase();
      }
      if (quantumStatus) {
        quantumStatus.textContent = 'PASSO ' + (stepIndex + 1) + ' DE 5 · EM ANÁLISE';
      }

      if (progressBar) {
        var pct = ((stepIndex + 1) / questions.length) * 100;
        progressBar.style.width = pct + '%';
      }

      if (questionText) questionText.textContent = q.question;
      if (questionSubtitle) questionSubtitle.textContent = q.subtitle;

      if (prevBtn) {
        if (stepIndex === 0) {
          prevBtn.style.visibility = 'hidden';
          prevBtn.style.opacity = '0';
        } else {
          prevBtn.style.visibility = 'visible';
          prevBtn.style.opacity = '1';
        }
      }

      if (optionsContainer) {
        optionsContainer.innerHTML = '';
        q.options.forEach(function (opt, optIdx) {
          var isSelected = selectedAnswers[stepIndex] === optIdx;

          var optBtn = document.createElement('button');
          optBtn.type = 'button';
          optBtn.className = 'rx-option-card' + (isSelected ? ' is-selected' : '');
          optBtn.setAttribute('data-option-index', String(optIdx));
          optBtn.setAttribute('aria-label', opt.letter + ': ' + opt.title);

          optBtn.innerHTML = '' +
            '<div class="rx-opt-glow-sheen"></div>' +
            '<div class="rx-opt-header">' +
            '  <span class="rx-opt-badge">' + opt.letter + '</span>' +
            '  <h4 class="rx-opt-title">' + opt.title + '</h4>' +
            '</div>' +
            '<p class="rx-opt-desc">' + opt.desc + '</p>' +
            '<div class="rx-opt-footer">' +
            '  <span class="rx-opt-score-tag">+' + opt.score + ' pts</span>' +
            '  <span class="rx-opt-check">✓</span>' +
            '</div>';

          bindCardTilt(optBtn);

          optBtn.addEventListener('click', function () {
            selectOption(stepIndex, optIdx);
          });

          optionsContainer.appendChild(optBtn);
        });
      }

      if (typeof window !== 'undefined' && window.innerWidth <= 900) {
        if (quizContainer) {
          quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    function selectOption(stepIndex, optIndex) {
      selectedAnswers[stepIndex] = optIndex;
      var q = questions[stepIndex];
      var opt = q && q.options[optIndex];

      var quantumStatus = document.getElementById('rx-quantum-status');
      if (quantumStatus && opt) {
        quantumStatus.textContent = 'RESPOSTA REGISTRADA: +' + opt.score + ' PTS [' + opt.letter + ']';
      }

      if (optionsContainer) {
        var allCards = optionsContainer.querySelectorAll('.rx-option-card');
        allCards.forEach(function (c, idx) {
          if (idx === optIndex) {
            c.classList.add('is-selected');
          } else {
            c.classList.remove('is-selected');
          }
        });
      }

      if (typeof window !== 'undefined' && typeof window.setTimeout === 'function') {
        window.setTimeout(function () {
          if (stepIndex < questions.length - 1) {
            renderStep(stepIndex + 1);
          } else {
            completeQuiz();
          }
        }, 320);
      } else {
        if (stepIndex < questions.length - 1) {
          renderStep(stepIndex + 1);
        } else {
          completeQuiz();
        }
      }
    }

    function completeQuiz() {
      var scoresArray = selectedAnswers.map(function (optIdx, qIdx) {
        var q = questions[qIdx];
        return (optIdx !== null && q && q.options[optIdx]) ? q.options[optIdx].score : 0;
      });

      var result = calculateScore(scoresArray);

      if (quizContainer) quizContainer.style.display = 'none';
      if (introCard) introCard.style.display = 'none';

      if (resultsPanel) {
        resultsPanel.style.display = 'block';
        resultsPanel.classList.add('fade-in');
      }

      var scoreValEl = document.getElementById('rx-score-value');
      var maturityBadgeEl = document.getElementById('rx-maturity-badge');

      if (scoreValEl) scoreValEl.textContent = String(result.overallScore);
      if (maturityBadgeEl) maturityBadgeEl.textContent = result.archetype.maturityLevel || 'Diagnóstico Concluído';

      var arqBadgeEl = document.getElementById('rx-archetype-badge');
      var arqNameEl = document.getElementById('rx-archetype-name');
      var arqPhraseEl = document.getElementById('rx-impact-phrase');
      var arqProfileEl = document.getElementById('rx-archetype-profile');
      var arqActionEl = document.getElementById('rx-archetype-action');
      var arqHaloEl = document.getElementById('rx-archetype-halo');
      var arqEmblemEl = document.getElementById('rx-archetype-emblem');

      if (arqBadgeEl) {
        arqBadgeEl.textContent = result.archetype.badge;
        arqBadgeEl.style.borderColor = result.archetype.color;
        arqBadgeEl.style.color = result.archetype.color;
      }

      if (arqNameEl) {
        arqNameEl.textContent = result.archetype.name;
        arqNameEl.style.color = '#EDE8D5';
      }

      if (arqEmblemEl && result.archetype.emblemSvg) {
        arqEmblemEl.innerHTML = result.archetype.emblemSvg;
      }

      if (arqPhraseEl) arqPhraseEl.textContent = '“' + result.archetype.impactPhrase + '”';
      if (arqProfileEl) arqProfileEl.textContent = result.archetype.profile;
      if (arqActionEl) arqActionEl.textContent = result.archetype.recommendedAction;

      if (arqHaloEl) {
        arqHaloEl.style.background = 'radial-gradient(ellipse at center, ' + result.archetype.haloColor + ' 0%, transparent 70%)';
      }

      var bottlenecksListEl = document.getElementById('rx-bottlenecks-list');
      if (bottlenecksListEl) {
        bottlenecksListEl.innerHTML = '';
        result.bottlenecks.forEach(function (gap, idx) {
          var gapCard = document.createElement('div');
          gapCard.className = 'rx-bottleneck-card';
          gapCard.innerHTML = '' +
            '<div class="rx-gap-header">' +
            '  <span class="rx-gap-index">Gargalo #0' + (idx + 1) + ' · ' + gap.key + '</span>' +
            '  <span class="rx-gap-score mono-telemetry">' + gap.score + '/100 pts</span>' +
            '</div>' +
            '<h4 class="rx-gap-tag">' + gap.tag + '</h4>' +
            '<div class="rx-gap-body">' +
            '  <div class="rx-gap-risk">' +
            '    <strong>O Risco Oculto:</strong> ' + gap.risk +
            '  </div>' +
            '  <div class="rx-gap-sol">' +
            '    <strong>A Solução de Engenharia:</strong> ' + gap.solution +
            '  </div>' +
            '</div>';
          bottlenecksListEl.appendChild(gapCard);
        });
      }

      var dimListEl = document.getElementById('rx-dimensions-telemetry');
      if (dimListEl) {
        dimListEl.innerHTML = '';
        questions.forEach(function (q) {
          var dimScore = result.dimensionScores[q.dimension] || 0;
          var dimItem = document.createElement('div');
          dimItem.className = 'rx-dim-telemetry-row';
          dimItem.innerHTML = '' +
            '<div class="rx-dim-info">' +
            '  <span class="rx-dim-label mono-telemetry">' + q.dimension + ' · ' + q.name + '</span>' +
            '  <span class="rx-dim-val mono-telemetry">' + dimScore + '/100</span>' +
            '</div>' +
            '<div class="rx-dim-track">' +
            '  <div class="rx-dim-fill" style="width:' + dimScore + '%; background:' + (dimScore >= 70 ? 'var(--grn)' : (dimScore >= 40 ? 'var(--amb)' : 'var(--cor)')) + '"></div>' +
            '</div>';
          dimListEl.appendChild(dimItem);
        });
      }

      renderRadarChart('radar-svg', result.dimensionScores);

      var ctaBtn = document.getElementById('rx-cta-btn');
      var wppBtn = document.getElementById('rx-wpp-btn');

      if (ctaBtn) {
        ctaBtn.href = result.consultationUrl;
      }

      if (wppBtn) {
        wppBtn.href = result.whatsappUrl;
      }

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentStep > 0) {
          renderStep(currentStep - 1);
        }
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', function () {
        selectedAnswers = [null, null, null, null, null];
        if (resultsPanel) resultsPanel.style.display = 'none';
        if (quizContainer) quizContainer.style.display = 'block';
        if (introCard) introCard.style.display = 'block';
        renderStep(0);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    if (startBtn) {
      startBtn.addEventListener('click', function () {
        if (introCard) introCard.style.display = 'none';
        if (quizContainer) quizContainer.style.display = 'block';
        renderStep(0);
      });
    }

    renderStep(0);
  }

  // ==============================================================================
  // 8. EXPORTAÇÃO DA API PÚBLICA
  // ==============================================================================

  var OutlierRaioX = {
    questions: questions,
    archetypes: archetypes,
    bottleneckCatalog: bottleneckCatalog,
    calculateRaioXScore: calculateRaioXScore,
    determineArchetype: determineArchetype,
    determineBottlenecks: determineBottlenecks,
    generateRadarPoints: generateRadarPoints,
    calculateScore: calculateScore,
    renderRadarChart: renderRadarChart,
    initRaioXUI: initRaioXUI
  };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      if (typeof document.addEventListener === 'function') {
        document.addEventListener('DOMContentLoaded', function () {
          initRaioXUI();
        });
      }
    } else {
      if (typeof window !== 'undefined' && typeof window.setTimeout === 'function') {
        window.setTimeout(function () {
          initRaioXUI();
        }, 0);
      } else {
        initRaioXUI();
      }
    }
  }

  return OutlierRaioX;
});
