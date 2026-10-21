/* ==========================================================================
   MOTOR DE CÁLCULO · Jornada do Investimento
   --------------------------------------------------------------------------
   Funções puras: recebem números, devolvem números. Nenhuma toca na página.
   As mesmas funções servem à página inicial, aos Instrumentos e aos testes
   (tests/calculos.test.mjs), para que nenhuma tela calcule diferente da outra.

   Convenções:
   - Taxas entram em % ao ano (13.65 significa 13,65% a.a.).
   - Capitalização mensal com taxa equivalente: (1 + a)^(1/12) - 1.
   - Aportes no fim de cada mês.
   ========================================================================== */

(function (root) {
  'use strict';

  function mensal(taxaAnualPct) {
    return Math.pow(1 + taxaAnualPct / 100, 1 / 12) - 1;
  }

  /** Valor futuro de um saldo inicial com aportes mensais constantes. */
  function valorFuturo(inicial, aporteMensal, taxaAnualPct, meses) {
    var m = mensal(taxaAnualPct);
    var f = Math.pow(1 + m, meses);
    if (Math.abs(m) < 1e-12) return inicial + aporteMensal * meses;
    return inicial * f + aporteMensal * (f - 1) / m;
  }

  /**
   * Rentabilidade líquida de uma taxa de administração cobrada sobre o
   * patrimônio: (1 + bruta) / (1 + custo) - 1. É a forma correta de
   * descontar um custo percentual sobre saldo (e não bruta - custo).
   */
  function liquidaDeCusto(brutaPct, custoPct) {
    return ((1 + brutaPct / 100) / (1 + custoPct / 100) - 1) * 100;
  }

  /* ------------------------------------------------------------------------
     1. O CUSTO DA NÉVOA · impacto do custo total ao longo do tempo
     Referências de mercado: ValorFinal (calculadora de ETF e taxa) e
     Calculadora de Taxas (comparador de produtos).
     ------------------------------------------------------------------------ */
  function custoDasTaxas(p) {
    var meses = Math.round(p.anos * 12);
    var atual = valorFuturo(p.inicial, p.aporte, liquidaDeCusto(p.bruta, p.custoAtual), meses);
    var ref = valorFuturo(p.inicial, p.aporte, liquidaDeCusto(p.bruta, p.custoReferencia), meses);
    var semCusto = valorFuturo(p.inicial, p.aporte, p.bruta, meses);
    var investido = p.inicial + p.aporte * meses;
    return {
      atual: atual,
      referencia: ref,
      semCusto: semCusto,
      investido: investido,
      diferenca: ref - atual,
      // Quanto do ganho potencial ficou com os custos, no cenário atual.
      parcelaDoGanhoPerdida: semCusto > investido ? (semCusto - atual) / (semCusto - investido) : 0
    };
  }

  /* ------------------------------------------------------------------------
     2. COMPARADOR DE RENDA FIXA · valor líquido de CDB, LCI/LCA e Tesouro Selic
     Referências de mercado: ValorFinal (comparador de renda fixa) e
     Calculadora de Taxas / Numerando (comparadores com IR regressivo).
     ------------------------------------------------------------------------ */
  function aliquotaIR(dias, tabela) {
    for (var i = 0; i < tabela.length; i++) {
      if (dias <= tabela[i].ateDias) return tabela[i].aliquota;
    }
    return tabela[tabela.length - 1].aliquota;
  }

  function diasDeMeses(meses) { return Math.round(meses * 30.4375); }

  function rendaFixa(p, prem) {
    var dias = diasDeMeses(p.meses);
    var aliq = aliquotaIR(dias, prem.irRegressivo);
    var anos = p.meses / 12;

    function bruto(pctCdi) { return p.valor * Math.pow(1 + (p.cdi * pctCdi / 100) / 100, anos); }

    // CDB: imposto regressivo sobre o ganho.
    var cdbBruto = bruto(p.cdbPctCdi);
    var cdbLiquido = cdbBruto - (cdbBruto - p.valor) * aliq / 100;

    // LCI / LCA: isentas de IR para pessoa física.
    var lciLiquido = bruto(p.lciPctCdi);

    // Tesouro Selic: rende a Selic (aproximada pelo CDI), paga IR regressivo
    // e custódia da B3 apenas sobre o saldo que excede a isenção.
    var m = mensal(p.cdi);
    var custM = prem.custos.custodiaB3Tesouro / 100 / 12;
    var isento = prem.custos.isencaoCustodiaTesouroSelic;
    var saldo = p.valor;
    var custodia = 0;
    for (var i = 0; i < p.meses; i++) {
      saldo *= (1 + m);
      var c = Math.max(0, saldo - isento) * custM;
      custodia += c;
    }
    var tesouroBruto = saldo - custodia;
    var ganhoTesouro = Math.max(0, tesouroBruto - p.valor);
    var tesouroLiquido = tesouroBruto - ganhoTesouro * aliq / 100;

    return {
      dias: dias,
      aliquotaIR: aliq,
      cdb: cdbLiquido,
      lci: lciLiquido,
      tesouro: tesouroLiquido,
      custodiaTesouro: custodia,
      // Quanto o CDB precisa pagar, em % do CDI, para empatar com a LCI.
      // Fórmula usada pelos comparadores de referência: %LCI / (1 - IR).
      cdbEquivalenteLci: p.lciPctCdi / (1 - aliq / 100)
    };
  }

  /* ------------------------------------------------------------------------
     3. O CUSTO DA SUCESSÃO SEM PLANEJAMENTO
     Referências de mercado: Cálculo Jurídico (simulador de ITCMD) e
     itcmd.com.br (tabela por estado). Nenhum dos dois mostra a questão da
     liquidez, que é o que este cálculo acrescenta.
     ------------------------------------------------------------------------ */
  function sucessao(p) {
    var itcmd = p.patrimonio * p.itcmd / 100;
    var custos = p.patrimonio * p.custosInventario / 100;
    var total = itcmd + custos;
    var liquidez = p.patrimonio * p.pctLiquido / 100;
    return {
      itcmd: itcmd,
      custosInventario: custos,
      total: total,
      pctDoPatrimonio: p.patrimonio > 0 ? total / p.patrimonio * 100 : 0,
      liquidezDisponivel: liquidez,
      // Valor que a família precisaria levantar (vender bens, tomar crédito)
      // porque os ativos líquidos não cobrem os custos.
      faltaDeLiquidez: Math.max(0, total - liquidez)
    };
  }

  /* ------------------------------------------------------------------------
     4. O ANO DA INDEPENDÊNCIA FINANCEIRA
     Referências de mercado: ValorFinal (calculadora FIRE) e Adriano Freire
     (independência financeira). Ambas usam a regra dos 4%; aqui a retirada
     é escolhida pelo visitante, com 3,5% como padrão conservador.
     ------------------------------------------------------------------------ */
  function patrimonioAlvo(rendaMensal, retiradaPct) {
    return rendaMensal * 12 / (retiradaPct / 100);
  }

  /** Meses até atingir o alvo; null se não atingir em 60 anos. */
  function mesesAteAlvo(inicial, aporte, alvo, taxaAnualPct) {
    if (inicial >= alvo) return 0;
    var m = mensal(taxaAnualPct);
    var saldo = inicial;
    for (var mes = 1; mes <= 720; mes++) {
      saldo = saldo * (1 + m) + aporte;
      if (saldo >= alvo) return mes;
    }
    return null;
  }

  /** Aporte mensal necessário para atingir o alvo em N meses. */
  function aporteNecessario(inicial, alvo, taxaAnualPct, meses) {
    var m = mensal(taxaAnualPct);
    var f = Math.pow(1 + m, meses);
    var falta = alvo - inicial * f;
    if (falta <= 0) return 0;
    if (Math.abs(m) < 1e-12) return falta / meses;
    return falta * m / (f - 1);
  }

  function independencia(p) {
    var alvo = patrimonioAlvo(p.renda, p.retirada);
    var taxaRef = liquidaDeCusto(p.realBruta, p.custoReferencia);
    var taxaBanco = liquidaDeCusto(p.realBruta, p.custoBanco);
    var mRef = mesesAteAlvo(p.inicial, p.aporte, alvo, taxaRef);
    var mBanco = mesesAteAlvo(p.inicial, p.aporte, alvo, taxaBanco);
    return {
      alvo: alvo,
      mesesReferencia: mRef,
      mesesBanco: mBanco,
      aporteParaMeta: aporteNecessario(p.inicial, alvo, taxaRef, Math.round(p.anosMeta * 12))
    };
  }

  /* ------------------------------------------------------------------------
     5. ALUGAR OU COMPRAR (FINANCIADO)
     Referências de mercado: Investimentos.com.br (Grupo Primo) e Numerando.
     Ambas comparam o patrimônio final dos dois caminhos com custo de
     oportunidade. Aqui: financiamento SAC, aluguel e imóvel corrigidos pela
     inflação, diferença mensal investida no cenário de aluguel.
     ------------------------------------------------------------------------ */
  function alugarOuComprar(p) {
    var meses = Math.round(p.horizonteAnos * 12);
    var prazoMeses = Math.round(p.prazoAnos * 12);
    var entrada = p.valorImovel * p.entradaPct / 100;
    var custosCompra = p.valorImovel * p.custosCompraPct / 100;
    var financiado = p.valorImovel - entrada;
    var jm = mensal(p.jurosFinanciamento);
    var im = mensal(p.inflacao);
    var vm = mensal(p.valorizacaoReal + p.inflacao);
    var rm = mensal(p.rendimentoInvestimento);
    var amort = prazoMeses > 0 ? financiado / prazoMeses : 0;

    var saldoDevedor = financiado;
    var aluguel = p.aluguelMensal;
    // Quem aluga investe o que quem compra gastou na entrada e nos custos.
    var carteiraAluguel = entrada + custosCompra;
    // Quem compra investe o que sobra quando a parcela fica menor que o aluguel.
    var carteiraCompra = 0;
    var pagoComprador = entrada + custosCompra;
    var pagoInquilino = 0;
    var primeiraParcela = 0;

    for (var mes = 1; mes <= meses; mes++) {
      var parcela = 0;
      if (saldoDevedor > 0.005) {
        var juros = saldoDevedor * jm;
        var a = Math.min(amort, saldoDevedor);
        parcela = a + juros;
        saldoDevedor -= a;
      }
      if (mes === 1) primeiraParcela = parcela;

      carteiraAluguel *= (1 + rm);
      carteiraCompra *= (1 + rm);

      var dif = parcela - aluguel;
      if (dif > 0) carteiraAluguel += dif;
      else carteiraCompra += -dif;

      pagoComprador += parcela;
      pagoInquilino += aluguel;
      aluguel *= (1 + im);
    }

    var valorImovelFinal = p.valorImovel * Math.pow(1 + vm, meses);
    var patrimonioComprar = valorImovelFinal - Math.max(0, saldoDevedor) + carteiraCompra;
    var patrimonioAlugar = carteiraAluguel;

    return {
      entrada: entrada,
      custosCompra: custosCompra,
      financiado: financiado,
      primeiraParcela: primeiraParcela,
      valorImovelFinal: valorImovelFinal,
      saldoDevedorFinal: Math.max(0, saldoDevedor),
      patrimonioComprar: patrimonioComprar,
      patrimonioAlugar: patrimonioAlugar,
      vantagem: patrimonioComprar - patrimonioAlugar
    };
  }

  /* ------------------------------------------------------------------------
     6. HOLDING PATRIMONIAL
     Referências de mercado: Somas (simulador de holding patrimonial) e
     Sum.money (IR sobre aluguel, PF ou PJ). Aqui entram as regras de 2026
     que os simuladores antigos não consideram: a redução do IRPF até
     R$ 7.350, o acréscimo de presunção da LC 224/2025 e a tributação de
     dividendos da Lei 15.270/2025. h = premissas.holding.
     ------------------------------------------------------------------------ */
  function irpfMensal(renda, h) {
    var faixa = h.tabelaIRPF.filter(function (f) { return renda <= f.ate; })[0];
    var imposto = Math.max(0, renda * faixa.aliquota / 100 - faixa.deduzir);
    var r = h.reducao, reducao = 0;
    if (renda <= r.zeraAte) reducao = imposto;
    else if (renda <= r.ate) reducao = Math.max(0, r.a - r.b * renda);
    return Math.max(0, imposto - reducao);
  }

  /** Base presumida, com o acréscimo da LC 224/2025 sobre a receita do ano acima do limite. */
  function basePresumida(receita, pct, receitaAnoAntes, h) {
    var livre = Math.max(0, h.limiteAcrescimoAnual - receitaAnoAntes);
    var normal = Math.min(receita, livre);
    var excedente = receita - normal;
    return normal * pct / 100 + excedente * pct * (1 + h.acrescimoPresuncao / 100) / 100;
  }

  /** Imposto mínimo anual (IRPFM), em %: 0 em R$ 600 mil, subindo até 10 em R$ 1,2 milhão. */
  function aliquotaIRPFM(rendaAnual, h) {
    if (rendaAnual <= h.irpfmInicio) return 0;
    if (rendaAnual >= h.irpfmTeto) return h.retencaoDividendos;
    return (rendaAnual - h.irpfmInicio) / (h.irpfmTeto - h.irpfmInicio) * h.retencaoDividendos;
  }

  /**
   * Aluguéis: pessoa física (carnê-leão) contra holding no lucro presumido.
   * p: aluguelMensal, valorImoveis, anos, socios, itbi, custoMensal, inflacao.
   * Os dividendos entram pelo imposto mínimo anual (a retenção mensal de 10%
   * é antecipação dele e se acerta no ajuste).
   */
  function holdingAluguel(p, h) {
    var socios = Math.max(1, Math.round(p.socios || 1));
    var aluguel = p.aluguelMensal;
    var itbi = p.valorImoveis * p.itbi / 100;
    var entrada = itbi + h.custoAbertura;
    var anos = [], acumPF = 0, acumPJ = entrada, retorno = null;

    for (var a = 1; a <= p.anos; a++) {
      var pf = 0, tributosAno = 0, lucroAno = 0, receitaAno = 0;
      for (var m = 0; m < 12; m++) {
        // Na pessoa física, cada sócio declara a sua parte do aluguel.
        pf += irpfMensal(aluguel / socios, h) * socios;
        var base = basePresumida(aluguel, h.presuncaoAluguel, receitaAno, h);
        receitaAno += aluguel;
        var tributos = aluguel * h.pisCofins / 100 +
          base * h.irpj / 100 + Math.max(0, base - h.limiteAdicionalMensal) * h.adicionalIRPJ / 100 +
          base * h.csll / 100;
        tributosAno += tributos + p.custoMensal;
        lucroAno += Math.max(0, aluguel - tributos - p.custoMensal);
      }
      var porSocio = lucroAno / socios;
      var dividendos = porSocio * aliquotaIRPFM(porSocio, h) / 100 * socios;
      var pj = tributosAno + dividendos;
      acumPF += pf;
      acumPJ += pj;
      if (retorno === null && acumPJ <= acumPF) retorno = a;
      anos.push({ ano: a, pf: pf, pj: pj, dividendos: dividendos, acumPF: acumPF, acumPJ: acumPJ });
      aluguel *= 1 + p.inflacao / 100;
    }
    var ultimo = anos[anos.length - 1];
    return {
      itbi: itbi,
      entrada: entrada,
      impostoMensalPF: anos[0].pf / 12,
      custoMensalPJ: anos[0].pj / 12,
      anos: anos,
      totalPF: ultimo.acumPF,
      totalPJ: ultimo.acumPJ,
      economia: ultimo.acumPF - ultimo.acumPJ,
      anoDeRetorno: retorno
    };
  }

  /**
   * Venda de imóvel: ganho de capital na pessoa física contra venda pela
   * holding (imóvel integralizado pelo custo, no estoque, lucro presumido).
   * p: valorVenda, custoAquisicao, itbi, socios.
   */
  function holdingVenda(p, h) {
    var socios = Math.max(1, Math.round(p.socios || 1));
    var ganho = Math.max(0, p.valorVenda - p.custoAquisicao);
    // Pessoa física: alíquota por faixa, aplicada ao ganho de cada sócio.
    var porSocio = ganho / socios, irPF = 0, piso = 0;
    h.ganhoCapital.forEach(function (f) {
      irPF += Math.max(0, Math.min(porSocio, f.ate) - piso) * f.aliquota / 100;
      piso = f.ate;
    });
    irPF *= socios;

    var v = p.valorVenda;
    var pisCofins = v * h.pisCofins / 100;
    var baseIR = basePresumida(v, h.presuncaoVendaIRPJ, 0, h);
    var baseCS = basePresumida(v, h.presuncaoVendaCSLL, 0, h);
    // Venda num único trimestre: adicional sobre a base acima de 3 x R$ 20 mil.
    var irpj = baseIR * h.irpj / 100 + Math.max(0, baseIR - h.limiteAdicionalMensal * 3) * h.adicionalIRPJ / 100;
    var csll = baseCS * h.csll / 100;
    var itbi = p.custoAquisicao * p.itbi / 100;
    var tributosPJ = pisCofins + irpj + csll;
    // O custo volta ao sócio como capital; o restante sai como dividendo.
    var lucroPorSocio = Math.max(0, v - p.custoAquisicao - tributosPJ) / socios;
    var irDividendos = lucroPorSocio * aliquotaIRPFM(lucroPorSocio, h) / 100 * socios;
    var totalPJ = tributosPJ + itbi + h.custoAbertura + irDividendos;
    return {
      ganho: ganho,
      impostoPF: irPF,
      pisCofins: pisCofins,
      irpjCsll: irpj + csll,
      itbi: itbi,
      abertura: h.custoAbertura,
      irDividendos: irDividendos,
      totalPJ: totalPJ,
      economia: irPF - totalPJ
    };
  }

  /* ------------------------------------------------------------------------
     7. DIAGNÓSTICO PATRIMONIAL
     Referências: Índice de Saúde Financeira do Brasileiro (Febraban/BCB),
     nota de 0 a 100 a partir de questionário. Aqui a nota mede a estrutura do
     patrimônio em cinco dimensões, com peso igual.
     respostas: { idDimensao: [nota, nota], ... } com notas de 0 a 100.
     ------------------------------------------------------------------------ */
  function pontuarDiagnostico(respostas, def) {
    var dims = def.dimensoes.map(function (d, ordem) {
      var notas = (respostas[d.id] || []).filter(function (v) { return typeof v === 'number'; });
      var media = notas.length ? notas.reduce(function (a, b) { return a + b; }, 0) / notas.length : 0;
      return { id: d.id, nome: d.nome, nota: Math.round(media), ordem: ordem, def: d };
    });
    var nota = Math.round(dims.reduce(function (a, d) { return a + d.nota; }, 0) / dims.length);
    var faixa = def.faixas[def.faixas.length - 1];
    for (var i = 0; i < def.faixas.length; i++) {
      if (nota <= def.faixas[i].ate) { faixa = def.faixas[i]; break; }
    }
    // As duas dimensões mais frágeis; só entram as que ainda não estão maduras.
    var lacunas = dims
      .filter(function (d) { return d.nota < 85; })
      .sort(function (a, b) { return a.nota - b.nota || a.ordem - b.ordem; })
      .slice(0, 2);
    return { nota: nota, faixa: faixa, dimensoes: dims, lacunas: lacunas };
  }

  var Calculos = {
    pontuarDiagnostico: pontuarDiagnostico,
    mensal: mensal,
    valorFuturo: valorFuturo,
    liquidaDeCusto: liquidaDeCusto,
    custoDasTaxas: custoDasTaxas,
    aliquotaIR: aliquotaIR,
    diasDeMeses: diasDeMeses,
    rendaFixa: rendaFixa,
    sucessao: sucessao,
    patrimonioAlvo: patrimonioAlvo,
    mesesAteAlvo: mesesAteAlvo,
    aporteNecessario: aporteNecessario,
    independencia: independencia,
    alugarOuComprar: alugarOuComprar,
    irpfMensal: irpfMensal,
    holdingAluguel: holdingAluguel,
    holdingVenda: holdingVenda
  };

  root.Calculos = Calculos;
  if (typeof module !== 'undefined' && module.exports) module.exports = Calculos;
})(typeof window !== 'undefined' ? window : globalThis);
