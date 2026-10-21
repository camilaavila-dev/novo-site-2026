/* ==========================================================================
   PREMISSAS DE MERCADO · fonte única para todas as calculadoras do site
   --------------------------------------------------------------------------
   Quando um número de mercado mudar, troque AQUI e só aqui. Todas as
   calculadoras (página inicial e Instrumentos) leem deste arquivo.

   Cada valor traz a fonte e a data em que foi conferido. Ao atualizar,
   atualize também a data, para o visitante saber de quando é o número.
   ========================================================================== */

(function (root) {
  'use strict';

  var PREMISSAS = {
    // Data da última conferência de todos os valores abaixo.
    conferidoEm: '20 de outubro de 2026',

    mercado: {
      // Copom de 16/09/2026: corte de 0,25 p.p. (Banco Central do Brasil).
      selic: 13.75,
      // Taxa DI anualizada em 15/10/2026 (B3 / Banco Central).
      cdi: 13.65,
      // IPCA acumulado em 12 meses até setembro de 2026 (IBGE, divulgado em 09/10/2026).
      ipca12m: 4.58
    },

    custos: {
      // Custo total de referência de uma carteira bem estruturada, % a.a.
      referencia: 0.7,
      // Custo total típico de carteira bancária de varejo, % a.a.
      bancoTipico: 2.0,
      // Taxa de custódia da B3 sobre títulos do Tesouro Direto, % a.a.
      custodiaB3Tesouro: 0.2,
      // Tesouro Selic: custódia isenta até este valor por CPF (B3, desde 2023).
      isencaoCustodiaTesouroSelic: 10000
    },

    // Imposto de renda regressivo da renda fixa (CDB, LC, Tesouro), por dias corridos.
    // LCI e LCA são isentas para pessoa física.
    irRegressivo: [
      { ateDias: 180, aliquota: 22.5 },
      { ateDias: 360, aliquota: 20.0 },
      { ateDias: 720, aliquota: 17.5 },
      { ateDias: Infinity, aliquota: 15.0 }
    ],

    sucessao: {
      // Honorários de inventário pela tabela 2026 da OAB-SP: 6% extrajudicial,
      // 8% judicial sem litígio, 10% com litígio (sobre o monte-mor).
      custosInventarioPadrao: 6,
      // ITCMD de São Paulo: alíquota única de 4% (Lei 10.705/2000).
      itcmdPadrao: 4,
      // Teto nacional do ITCMD (Resolução do Senado 9/1992). A EC 132/2023
      // tornou a progressividade obrigatória para os estados.
      itcmdMaximo: 8
    },

    independencia: {
      // Retirada anual segura. 3,5% é mais conservadora que a regra
      // clássica de 4%, coerente com décadas de horizonte.
      retiradaPadrao: 3.5,
      retiradasDisponiveis: [3.0, 3.5, 4.0],
      // Rentabilidade real (acima da inflação) antes de custos, % a.a.
      rentabilidadeRealPadrao: 5.5
    },

    imovel: {
      // Custos de compra (ITBI + escritura + registro), % do valor do imóvel.
      custosCompra: 4,
      // SBPE de balcão da Caixa: 11,19% a.a. + TR (condições de agosto/2026).
      // A TR não entra no cálculo; o instrumento avisa isso na nota.
      jurosFinanciamento: 11.19
    },

    holding: {
      // Tabela progressiva mensal do IRPF em 2026 (Receita Federal), usada no
      // carnê-leão de quem recebe aluguel como pessoa física.
      tabelaIRPF: [
        { ate: 2428.80, aliquota: 0, deduzir: 0 },
        { ate: 2826.65, aliquota: 7.5, deduzir: 182.16 },
        { ate: 3751.05, aliquota: 15, deduzir: 394.16 },
        { ate: 4664.68, aliquota: 22.5, deduzir: 675.49 },
        { ate: Infinity, aliquota: 27.5, deduzir: 908.73 }
      ],
      // Redução mensal da Lei 15.270/2025: zera o imposto até R$ 5.000 e
      // diminui até R$ 7.350 (redução = 978,62 - 0,133145 x renda).
      reducao: { zeraAte: 5000, ate: 7350, a: 978.62, b: 0.133145 },
      // Lucro presumido: PIS 0,65% + COFINS 3% (cumulativos) sobre a receita.
      pisCofins: 3.65,
      // Presunção de lucro: 32% para aluguel; 8% (IRPJ) e 12% (CSLL) na venda
      // de imóvel do estoque. LC 224/2025: +10% nesses percentuais sobre a
      // receita anual que passar de R$ 5 milhões.
      presuncaoAluguel: 32,
      presuncaoVendaIRPJ: 8,
      presuncaoVendaCSLL: 12,
      acrescimoPresuncao: 10,
      limiteAcrescimoAnual: 5000000,
      irpj: 15,
      // Adicional de 10% do IRPJ sobre a base que passar de R$ 20 mil por mês.
      adicionalIRPJ: 10,
      limiteAdicionalMensal: 20000,
      csll: 9,
      // Lei 15.270/2025: dividendos acima de R$ 50 mil por mês, da mesma empresa
      // para o mesmo sócio, retêm 10%. Rendas acima de R$ 600 mil por ano
      // pagam o imposto mínimo (IRPFM), que chega a 10% em R$ 1,2 milhão.
      retencaoDividendos: 10,
      limiteDividendosMensal: 50000,
      irpfmInicio: 600000,
      irpfmTeto: 1200000,
      // Ganho de capital da pessoa física, por faixa do ganho (Lei 13.259/2016).
      ganhoCapital: [
        { ate: 5000000, aliquota: 15 },
        { ate: 10000000, aliquota: 17.5 },
        { ate: 30000000, aliquota: 20 },
        { ate: Infinity, aliquota: 22.5 }
      ],
      // ITBI na integralização dos imóveis (São Paulo: 3%). Holdings de
      // atividade imobiliária não têm a imunidade do art. 156 da Constituição.
      itbiPadrao: 3,
      // Abertura (contrato, registro, escrituras) e contabilidade mensal.
      custoAbertura: 10000,
      custoMensalPadrao: 1500
    }
  };

  root.PREMISSAS = PREMISSAS;
  if (typeof module !== 'undefined' && module.exports) module.exports = PREMISSAS;
})(typeof window !== 'undefined' ? window : globalThis);
