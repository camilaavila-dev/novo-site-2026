/* ==========================================================================
   CALCULADORAS · cada uma abre numa janela, como um aplicativo
   --------------------------------------------------------------------------
   Os campos e o texto do resultado vêm de js/instrumentos.js (definições);
   o cálculo, de js/calculos.js; as premissas, de data/premissas.js.
   Aqui ficam a janela, os controles e um gráfico diferente para cada conta.
   ========================================================================== */
(function () {
  'use strict';

  var C = window.Calculos, P = window.PREMISSAS, I = window.Instrumentos;
  if (!C || !P || !I) return;
  var DEFS = I.definicoes;
  var hoje = new Date().getFullYear();

  var n0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  var n1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var n2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var brl0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  function brl(v) { return brl0.format(Math.round(v)); }
  function curto(v) {
    var a = Math.abs(v), s = v < 0 ? '−' : '';
    if (a >= 1e9) return s + 'R$ ' + n1.format(a / 1e9) + ' bi';
    if (a >= 1e6) return s + 'R$ ' + n1.format(a / 1e6) + ' mi';
    if (a >= 1e3) return s + 'R$ ' + n0.format(a / 1e3) + ' mil';
    return s + brl(a);
  }
  function anos(v) { return n0.format(v) + (v === 1 ? ' ano' : ' anos'); }
  var FMT = {
    brl: brl, anos: anos,
    meses: function (v) { return v % 12 === 0 ? anos(v / 12) : n0.format(v) + (v === 1 ? ' mês' : ' meses'); },
    pct: function (v) { return n1.format(v) + '% a.a.'; },
    pct2: function (v) { return n2.format(v) + '% a.a.'; },
    pctN: function (v) { return n1.format(v) + '%'; },
    pctCdi: function (v) { return n0.format(v) + '% do CDI'; },
    socios: function (v) { return n0.format(v) + (v === 1 ? ' sócio' : ' sócios'); },
    operacao: function (v) { return v === 2 ? 'Venda de imóvel' : 'Aluguéis'; }
  };
  function lerNumero(str, fmt) {
    var s = String(str).replace(/[^\d,.-]/g, '');
    if (fmt === 'brl' || fmt === 'anos' || fmt === 'meses') s = s.replace(/[.,]/g, '');
    else s = s.replace(/\./g, '').replace(',', '.');
    var v = parseFloat(s);
    return isFinite(v) ? v : null;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  /* ------------------------------------------------------------------------
     Gráfico de linhas em SVG. Rótulos ficam em HTML por cima, para não
     deformarem quando o gráfico estica.
     ------------------------------------------------------------------------ */
  function grafico(o) {
    var W = 600, H = 240, pad = 6;
    var todos = [];
    o.series.forEach(function (s) { todos = todos.concat(s.v); });
    if (o.linha) todos.push(o.linha.v);
    var min = o.min != null ? o.min : Math.min.apply(null, todos);
    var max = Math.max.apply(null, todos);
    if (max - min < 1e-9) max = min + 1;
    var n = o.series[0].v.length - 1 || 1;
    function x(i) { return i / n * W; }
    function y(v) { return H - pad - (v - min) / (max - min) * (H - pad * 2); }
    function d(v) { return v.map(function (p, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p).toFixed(1); }).join(' '); }

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">';
    for (var g = 1; g < 4; g++) svg += '<path class="ap-grid-line" d="M0 ' + (H / 4 * g) + ' H' + W + '"/>';
    if (o.entre) {
      var a = o.series[o.entre[0]].v, b = o.series[o.entre[1]].v;
      var volta = b.map(function (p, i) { return [x(i), y(p)]; }).reverse()
        .map(function (q) { return 'L' + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ');
      svg += '<path class="ap-area ' + (o.entreCls || '') + '" d="' + d(a) + ' ' + volta + ' Z"/>';
    }
    if (o.linha) svg += '<path class="ap-target" d="M0 ' + y(o.linha.v).toFixed(1) + ' H' + W + '"/>';
    o.series.forEach(function (s) { svg += '<path class="ap-line ' + s.cls + '" d="' + d(s.v) + '" pathLength="1"/>'; });
    svg += '</svg>';

    var html = '<div class="ap-chart">' + svg;
    if (o.linha) html += '<span class="ap-tag ap-tag-line" style="top:' + (y(o.linha.v) / H * 100) + '%">' + esc(o.linha.rotulo) + '</span>';
    if (o.marca) {
      html += '<span class="ap-dot" style="left:' + (x(o.marca.i) / W * 100) + '%;top:' + (y(o.marca.v) / H * 100) + '%"></span>' +
        '<span class="ap-tag ap-tag-dot" style="left:' + (x(o.marca.i) / W * 100) + '%;top:' + (y(o.marca.v) / H * 100) + '%">' + esc(o.marca.rotulo) + '</span>';
    }
    html += '</div><div class="ap-axis"><span>' + esc(o.eixo[0]) + '</span><span>' + esc(o.eixo[1]) + '</span></div>';
    html += '<ul class="ap-legend">' + o.series.map(function (s) {
      return '<li class="' + s.cls + '"><i></i>' + esc(s.rotulo) + (s.fim ? ' <b>' + esc(s.fim) + '</b>' : '') + '</li>';
    }).join('') + '</ul>';
    return html;
  }

  function barra(rotulo, valor, total, cls, texto) {
    var w = total > 0 ? Math.max(0.5, valor / total * 100) : 0;
    return '<li class="' + cls + '"><span class="ap-bar-name">' + esc(rotulo) + '</span>' +
      '<span class="ap-bar-track"><span class="ap-bar-fill" style="width:' + w.toFixed(2) + '%"></span></span>' +
      '<b>' + esc(texto) + '</b></li>';
  }

  /* ------------------------------------------------------------------------
     As calculadoras
     ------------------------------------------------------------------------ */
  var APPS = {
    'taxas': {
      def: 'taxas', grade: [2], icone: 'a-taxas', cor: ['#F06F5E', '#8A2D4A'],
      titulo: 'O custo das taxas', pergunta: 'O que o meu extrato não mostra?',
      visual: function (v) {
        var ref = C.liquidaDeCusto(v.bruta, P.custos.referencia), atual = C.liquidaDeCusto(v.bruta, v.custoAtual);
        var a = [], b = [];
        for (var k = 0; k <= v.anos; k++) {
          a.push(C.valorFuturo(v.inicial, v.aporte, ref, k * 12));
          b.push(C.valorFuturo(v.inicial, v.aporte, atual, k * 12));
        }
        return grafico({
          series: [
            { v: a, cls: 'is-good', rotulo: 'Custo de ' + FMT.pctN(P.custos.referencia) + ' a.a.', fim: curto(a[a.length - 1]) },
            { v: b, cls: 'is-bad', rotulo: 'O seu custo, ' + FMT.pctN(v.custoAtual) + ' a.a.', fim: curto(b[b.length - 1]) }
          ],
          entre: [0, 1], entreCls: 'is-bad', eixo: ['Hoje', anos(v.anos)]
        });
      },
      metodo: {
        formula: 'líquida = (1 + bruta) ÷ (1 + custo) − 1',
        texto: 'O custo é descontado sobre o patrimônio, como na cobrança real das taxas de administração, feita todo dia útil. Subtrair a taxa da rentabilidade (bruta − custo), como fazem alguns simuladores, superestima o resultado.',
        refs: [['Investidor10 · Juros compostos', 'https://investidor10.com.br/calculadoras/juros-compostos/', 'nº 441 em audiência no Brasil; sem campo para taxas'],
               ['Mobills · Juros compostos', 'https://www.mobills.com.br/calculadoras/calculadora-juros-compostos/', 'nº 1.656 no Brasil; sem campo para taxas']],
        diferente: 'As calculadoras mais acessadas do tema não têm campo para custos. Esta isola o efeito das taxas, aceita aportes e mostra quanto do ganho fica com os custos.'
      }
    },

    'renda-fixa': {
      def: 'rendaFixa', grade: [], icone: 'a-renda', cor: ['#1CD98A', '#0E6B57'],
      titulo: 'Comparador de renda fixa', pergunta: 'Qual rende mais, de fato, no meu prazo?',
      visual: function (v) {
        var r = C.rendaFixa(v, P);
        var ops = [['CDB', r.cdb], ['LCI ou LCA', r.lci], ['Tesouro Selic', r.tesouro]]
          .map(function (o) { return [o[0], o[1] - v.valor]; })
          .sort(function (a, b) { return b[1] - a[1]; });
        var max = ops[0][1];
        return '<p class="ap-vis-title">Ganho líquido em ' + esc(FMT.meses(v.meses)) + '</p>' +
          '<ol class="ap-bars">' + ops.map(function (o, i) {
            return barra(o[0], o[1], max, i === 0 ? 'is-good' : 'is-mute', curto(o[1]));
          }).join('') + '</ol>' +
          '<p class="ap-vis-note">Imposto de renda de ' + esc(FMT.pctN(r.aliquotaIR)) + ' no CDB e no Tesouro; LCI e LCA isentas.</p>';
      },
      metodo: {
        formula: 'CDB equivalente = % da LCI ÷ (1 − alíquota de IR)',
        texto: 'Imposto regressivo por dias corridos: 22,5% até 180 dias, 20% até 360, 17,5% até 720 e 15% acima disso. Tesouro Selic com custódia da B3 de 0,20% ao ano só sobre o que excede R$ 10 mil.',
        refs: [['Mobills · Simulador de renda fixa', 'https://www.mobills.com.br/calculadoras/simulador-de-investimento/', 'nº 1.656 no Brasil; IR regressivo'],
               ['Investidor10 · Calculadora de CDI', 'https://investidor10.com.br/calculadoras/cdi/', 'nº 441 no Brasil; rendimento por % do CDI']],
        diferente: 'Aplica a custódia da B3 com a isenção do Tesouro Selic até R$ 10 mil, mostra a data do CDI e diz quanto o CDB precisa pagar para empatar com a LCI.'
      }
    },

    'sucessao': {
      def: 'sucessao', grade: [2], icone: 'a-sucessao', cor: ['#F2C14E', '#8A5A12'],
      titulo: 'O custo da sucessão', pergunta: 'Quanto a família pagaria para receber o patrimônio?',
      visual: function (v) {
        var r = C.sucessao(v);
        var herd = v.patrimonio - r.total;
        var seg = function (val, cls, rot) {
          return '<span class="' + cls + '" style="flex-basis:' + (val / v.patrimonio * 100).toFixed(2) + '%" title="' + esc(rot) + '"></span>';
        };
        var max = Math.max(r.total, r.liquidezDisponivel);
        return '<p class="ap-vis-title">Para onde vai o patrimônio</p>' +
          '<div class="ap-stack">' + seg(herd, 'is-mute', 'Fica com a família') + seg(r.itcmd, 'is-gold', 'ITCMD') + seg(r.custosInventario, 'is-bad', 'Inventário') + '</div>' +
          '<ul class="ap-legend"><li class="is-mute"><i></i>Fica com a família <b>' + curto(herd) + '</b></li>' +
          '<li class="is-gold"><i></i>ITCMD <b>' + curto(r.itcmd) + '</b></li>' +
          '<li class="is-bad"><i></i>Inventário <b>' + curto(r.custosInventario) + '</b></li></ul>' +
          '<p class="ap-vis-title">A conta precisa ser paga em dinheiro</p>' +
          '<ol class="ap-bars">' +
            barra('Custo a pagar', r.total, max, 'is-bad', curto(r.total)) +
            barra('Disponível em dias', r.liquidezDisponivel, max, r.faltaDeLiquidez > 0 ? 'is-mute' : 'is-good', curto(r.liquidezDisponivel)) +
          '</ol>' +
          (r.faltaDeLiquidez > 0 ? '<p class="ap-alert">Faltam ' + curto(r.faltaDeLiquidez) + '</p>' : '<p class="ap-ok">A liquidez cobre o custo</p>');
      },
      metodo: {
        formula: 'custo = patrimônio × (ITCMD + custos do inventário)',
        texto: 'Compara o custo com a parte do patrimônio em ativos de resgate rápido. O ITCMD é estadual: São Paulo cobra 4%, o teto nacional é 8%, e a reforma tributária (EC 132/2023) tornou obrigatórias as alíquotas progressivas. Honorários pela tabela 2026 da OAB-SP: 6% em cartório, 8% no judicial sem disputa, 10% com disputa.',
        refs: [['Cálculo Jurídico · Simulador de ITCMD', 'https://calculojuridico.com.br/simulador-itcmd/', 'nº 6.684 no Brasil; imposto sobre herança e doação'],
               ['Quanto Custa um Inventário', 'https://quantocustainventario.com.br/', 'soma imposto, cartório e honorários']],
        diferente: 'Além do custo, mostra o que quase ninguém mostra: se a família teria dinheiro disponível para pagá-lo sem vender bens às pressas.'
      }
    },

    'independencia': {
      def: 'independencia', grade: [0, 1], icone: 'a-indep', cor: ['#8B86FF', '#2E2A9E'],
      titulo: 'O ano da independência', pergunta: 'Quando o patrimônio passa a me sustentar?',
      visual: function (v) {
        var r = C.independencia({ inicial: v.inicial, aporte: v.aporte, renda: v.renda, retirada: v.retirada,
          realBruta: v.realBruta, custoReferencia: P.custos.referencia, custoBanco: P.custos.bancoTipico, anosMeta: v.anosMeta });
        var chega = r.mesesReferencia === null ? null : Math.ceil(r.mesesReferencia / 12);
        var horiz = Math.min(40, Math.max(v.anosMeta, chega === null ? 40 : chega + 4, 8));
        var tRef = C.liquidaDeCusto(v.realBruta, P.custos.referencia), tBanco = C.liquidaDeCusto(v.realBruta, P.custos.bancoTipico);
        var a = [], b = [];
        for (var k = 0; k <= horiz; k++) {
          a.push(Math.min(C.valorFuturo(v.inicial, v.aporte, tRef, k * 12), r.alvo * 1.6));
          b.push(Math.min(C.valorFuturo(v.inicial, v.aporte, tBanco, k * 12), r.alvo * 1.6));
        }
        var o = {
          series: [
            { v: a, cls: 'is-vio', rotulo: 'Custo de ' + FMT.pctN(P.custos.referencia) + ' a.a.' },
            { v: b, cls: 'is-mute', rotulo: 'Custo de banco, ' + FMT.pctN(P.custos.bancoTipico) + ' a.a.' }
          ],
          min: 0, linha: { v: r.alvo, rotulo: 'Meta ' + curto(r.alvo) }, eixo: [String(hoje), String(hoje + horiz)]
        };
        if (chega !== null && chega <= horiz) o.marca = { i: chega, v: Math.min(a[chega], r.alvo), rotulo: String(hoje + chega) };
        return grafico(o);
      },
      metodo: {
        formula: 'patrimônio necessário = renda anual ÷ taxa de retirada',
        texto: 'Tudo em valores reais, já descontada a inflação. A retirada é escolhida por você: 3,5% é conservadora para décadas; 4% é a regra clássica, criada com dados dos Estados Unidos.',
        refs: [['Investidor10 · Independência financeira', 'https://investidor10.com.br/calculadoras/calculadora-independencia-financeira/', 'nº 441 no Brasil; tempo até a meta'],
               ['ValorFinal · Independência financeira', 'https://valorfinal.com.br/calculadora-independencia-financeira', 'patrimônio-alvo em termos reais']],
        diferente: 'Declara a taxa de retirada e se os valores descontam a inflação, responde quanto aportar para chegar no prazo e compara custo de referência com custo de banco.'
      }
    },

    'holding': {
      def: 'holding', grade: [], icone: 'a-holding', cor: ['#E58BD8', '#6B2A7A'],
      titulo: 'Holding patrimonial', pergunta: 'Vale a pena colocar os imóveis numa empresa?',
      visual: function (v) {
        var H = P.holding;
        if (v.operacao === 2) {
          var r = C.holdingVenda(v, H);
          var max = Math.max(r.impostoPF, r.totalPJ);
          var seg = function (val, cls, rot) {
            return '<span class="' + cls + '" style="flex-basis:' + (r.totalPJ > 0 ? val / r.totalPJ * 100 : 0).toFixed(2) + '%" title="' + esc(rot) + '"></span>';
          };
          return '<p class="ap-vis-title">Imposto total sobre a venda</p>' +
            '<ol class="ap-bars">' +
              barra('Pessoa física', r.impostoPF, max, r.impostoPF <= r.totalPJ ? 'is-good' : 'is-bad', curto(r.impostoPF)) +
              barra('Holding', r.totalPJ, max, r.totalPJ < r.impostoPF ? 'is-good' : 'is-bad', curto(r.totalPJ)) +
            '</ol>' +
            '<p class="ap-vis-title">De onde vem o custo da holding</p>' +
            '<div class="ap-stack">' + seg(r.pisCofins, 'is-blue', 'PIS e COFINS') + seg(r.irpjCsll, 'is-vio', 'IRPJ e CSLL') +
              seg(r.itbi + r.abertura, 'is-gold', 'ITBI e abertura') + seg(r.irDividendos, 'is-bad', 'Imposto sobre dividendos') + '</div>' +
            '<ul class="ap-legend">' +
              '<li class="is-blue"><i></i>PIS e COFINS <b>' + curto(r.pisCofins) + '</b></li>' +
              '<li class="is-vio"><i></i>IRPJ e CSLL <b>' + curto(r.irpjCsll) + '</b></li>' +
              '<li class="is-gold"><i></i>ITBI e abertura <b>' + curto(r.itbi + r.abertura) + '</b></li>' +
              '<li class="is-bad"><i></i>Dividendos <b>' + curto(r.irDividendos) + '</b></li>' +
            '</ul>';
        }
        var a = C.holdingAluguel(Object.assign({}, v, { inflacao: P.mercado.ipca12m }), H);
        var pf = [0].concat(a.anos.map(function (x) { return x.acumPF; }));
        var pj = [a.entrada].concat(a.anos.map(function (x) { return x.acumPJ; }));
        var o = {
          series: [
            { v: pf, cls: 'is-bad', rotulo: 'Imposto acumulado, pessoa física', fim: curto(pf[pf.length - 1]) },
            { v: pj, cls: 'is-good', rotulo: 'Custo acumulado, holding', fim: curto(pj[pj.length - 1]) }
          ],
          min: 0, eixo: ['Abertura', anos(v.anos)]
        };
        if (a.anoDeRetorno) o.marca = { i: a.anoDeRetorno, v: pj[a.anoDeRetorno], rotulo: 'Se paga no ' + a.anoDeRetorno + 'º ano' };
        return grafico(o);
      },
      metodo: {
        formula: 'holding = PIS/COFINS 3,65% + IRPJ e CSLL sobre 32% do aluguel + imposto mínimo dos dividendos',
        texto: 'Na pessoa física, o aluguel paga carnê-leão pela tabela progressiva de 2026, com a redução da Lei 15.270/2025. Na holding, o lucro presumido: 32% do aluguel é a base do IRPJ (15%, mais 10% acima de R$ 20 mil por mês) e da CSLL (9%). ' +
          'Na venda, o imóvel entra pelo custo declarado e é vendido como estoque: base de 8% (IRPJ) e 12% (CSLL), contra 15% a 22,5% de ganho de capital na pessoa física. Desde 2026, dividendos acima de R$ 600 mil por ano entram no imposto mínimo, de até 10%.',
        refs: [['Somas · Simulador de holding patrimonial', 'https://somas.io/investimentos/simulador-holding-patrimonial', 'aluguel e venda; premissas de antes de 2026'],
               ['Sum.money · IR sobre aluguel, PF ou PJ', 'https://sum.money/br/ir-aluguel/', 'já usa a tabela de 2026; só aluguel']],
        diferente: 'Já usa as regras de 2026: a redução do IRPF até R$ 7.350, o acréscimo de presunção da LC 224/2025 e o imposto sobre dividendos da Lei 15.270/2025, que pode inverter a conta numa venda grande. Também considera o custo mensal da contabilidade e quantas pessoas dividem os imóveis.'
      }
    },

    'imovel': {
      def: 'imovel', grade: [2, 3], icone: 'a-imovel', cor: ['#4FC3F7', '#145A86'],
      titulo: 'Alugar ou comprar', pergunta: 'Qual caminho deixa mais patrimônio?',
      visual: function (v) {
        var base = Object.assign({}, v, { custosCompraPct: P.imovel.custosCompra, inflacao: P.mercado.ipca12m });
        var comp = [], alug = [];
        for (var h = 1; h <= v.horizonteAnos; h++) {
          var r = C.alugarOuComprar(Object.assign({}, base, { horizonteAnos: h }));
          comp.push(r.patrimonioComprar);
          alug.push(r.patrimonioAlugar);
        }
        return grafico({
          series: [
            { v: comp, cls: 'is-blue', rotulo: 'Comprando', fim: curto(comp[comp.length - 1]) },
            { v: alug, cls: 'is-good', rotulo: 'Alugando e investindo', fim: curto(alug[alug.length - 1]) }
          ],
          eixo: ['1º ano', anos(v.horizonteAnos)]
        });
      },
      metodo: {
        formula: 'comprar = imóvel valorizado − saldo devedor + sobras investidas',
        texto: 'Alugar = entrada e custos de compra investidos, mais a diferença mensal entre parcela e aluguel. Financiamento SAC com juros da linha SBPE da Caixa (11,19% ao ano mais TR, agosto de 2026). Aluguel e imóvel corrigidos pela inflação; custos de compra de 4%.',
        refs: [['Serasa · Comprar ou alugar', 'https://www.serasa.com.br/calculadoras/comprar-alugar-imovel/', 'nº 87 no Brasil'],
               ['Investimentos.com.br · Alugar ou financiar', 'https://investimentos.com.br/simulador/calculadora-alugar-ou-financiar-imovel/', 'Grupo Primo; com custo de oportunidade']],
        diferente: 'Compara o patrimônio que sobra ao fim, e não só o custo de cada caminho, incluindo as sobras de quem compra quando a parcela fica menor que o aluguel.'
      }
    }
  };

  /* ------------------------------------------------------------------------
     Montagem de uma calculadora dentro da janela
     ------------------------------------------------------------------------ */
  function campoHTML(nome, c) {
    var id = nome + '-' + c.id;
    var dica = c.ajuda ? ' <button type="button" class="ap-hint" aria-label="Ajuda" aria-describedby="' + id + '-ajuda">?</button><span class="ap-hint-text" role="tooltip" id="' + id + '-ajuda">' + esc(c.ajuda) + '</span>' : '';
    if (c.tipo === 'escolha') {
      return '<div class="ap-field' + (c.so ? '" data-so="' + c.so : '') + '" role="group" aria-label="' + esc(c.rotulo) + '"><div class="ap-field-top"><span class="ap-label">' + esc(c.rotulo) + dica + '</span></div>' +
        '<div class="ap-segs" data-campo="' + c.id + '">' + c.opcoes.map(function (o) {
          return '<button type="button" data-valor="' + o + '" aria-pressed="' + (o === c.valor) + '">' + esc(FMT[c.fmt](o)) + '</button>';
        }).join('') + '</div></div>';
    }
    return '<div class="ap-field"' + (c.so ? ' data-so="' + c.so + '"' : '') + '><div class="ap-field-top"><label class="ap-label" for="' + id + '">' + esc(c.rotulo) + '</label>' + dica +
      '<input class="ap-num" type="text" inputmode="decimal" id="' + id + '-txt" aria-label="' + esc(c.rotulo) + ', valor digitado" value="' + esc(FMT[c.fmt](c.valor)) + '"></div>' +
      '<input type="range" id="' + id + '" data-campo="' + c.id + '" min="' + c.min + '" max="' + c.max + '" step="' + c.passo + '" value="' + c.valor + '"></div>';
  }

  function metodoHTML(m) {
    return '<p class="ap-label">A fórmula</p><code class="ap-formula">' + esc(m.formula) + '</code>' +
      '<p>' + esc(m.texto) + '</p>' +
      '<p class="ap-label">O que esta faz diferente</p><p>' + esc(m.diferente) + '</p>' +
      '<p class="ap-label">Referências de mercado</p><ul class="ap-refs">' + m.refs.map(function (r) {
        return '<li><a href="' + esc(r[1]) + '" target="_blank" rel="noopener">' + esc(r[0]) + '</a><span>' + esc(r[2]) + '</span></li>';
      }).join('') + '</ul>';
  }

  function montar(appId, alvo) {
    var app = APPS[appId], d = DEFS[app.def], nome = app.def;
    alvo.innerHTML =
      '<div class="ap-calc" data-instrumento="' + nome + '" data-montado="1">' +
        '<form class="ap-fields" onsubmit="return false">' + d.campos.map(function (c) { return campoHTML(nome, c); }).join('') + '</form>' +
        '<section class="ap-out jx-result" aria-live="polite">' +
          '<p class="ap-out-label" data-out="principalRotulo"></p>' +
          '<p class="ap-out-big" data-out="principal"></p>' +
          '<p class="ap-out-frase" data-out="frase"></p>' +
          '<div class="ap-vis" data-out="visual"></div>' +
          '<dl class="ap-out-grid jx-result-grid" data-out="grade"></dl>' +
          '<p class="ap-fine jx-fine">' + esc(d.nota) + ' Premissas de mercado conferidas em ' + esc(P.conferidoEm) + '. Simulação ilustrativa, não é recomendação nem promessa de rentabilidade.</p>' +
        '</section>' +
        '<section class="ap-method" hidden>' + metodoHTML(app.metodo) + '</section>' +
      '</div>';

    var valores = {};
    d.campos.forEach(function (c) { valores[c.id] = c.valor; });
    var out = function (k) { return alvo.querySelector('[data-out="' + k + '"]'); };

    function recalcular() {
      // Campos que só valem num modo (holding: aluguel ou venda).
      Array.prototype.forEach.call(alvo.querySelectorAll('[data-so]'), function (f) {
        f.hidden = Number(f.dataset.so) !== valores.operacao;
      });
      var r = d.calcular(valores);
      out('principalRotulo').textContent = r.principalRotulo;
      out('principal').textContent = r.principal;
      out('frase').textContent = r.frase;
      out('visual').innerHTML = app.visual(valores);
      // O gráfico já mostra a maior parte; a grade fica só com o que ele não mostra.
      out('grade').innerHTML = app.grade.map(function (i) { return r.grade[i]; }).map(function (g) {
        return '<div><dt>' + esc(g[0]) + '</dt><dd>' + esc(g[1]) + '</dd></div>';
      }).join('');
    }

    d.campos.forEach(function (c) {
      var id = nome + '-' + c.id;
      if (c.tipo === 'escolha') {
        var segs = alvo.querySelectorAll('.ap-segs[data-campo="' + c.id + '"] button');
        Array.prototype.forEach.call(segs, function (b) {
          b.addEventListener('click', function () {
            valores[c.id] = parseFloat(b.dataset.valor);
            Array.prototype.forEach.call(segs, function (o) { o.setAttribute('aria-pressed', String(o === b)); });
            recalcular();
          });
        });
        return;
      }
      var range = document.getElementById(id), txt = document.getElementById(id + '-txt');
      function pintar() {
        var p = (valores[c.id] - c.min) / (c.max - c.min) * 100;
        range.style.setProperty('--fill', Math.max(0, Math.min(100, p)) + '%');
      }
      range.addEventListener('input', function () {
        valores[c.id] = parseFloat(range.value);
        txt.value = FMT[c.fmt](valores[c.id]);
        pintar(); recalcular();
      });
      function aplicar() {
        var v = lerNumero(txt.value, c.fmt);
        if (v === null) { txt.value = FMT[c.fmt](valores[c.id]); return; }
        v = Math.max(c.min, Math.min(c.max, v));
        valores[c.id] = v; range.value = String(v); txt.value = FMT[c.fmt](v);
        pintar(); recalcular();
      }
      txt.addEventListener('change', aplicar);
      txt.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); aplicar(); txt.blur(); } });
      txt.addEventListener('focus', function () { txt.select(); });
      pintar();
    });
    recalcular();
  }

  /* ------------------------------------------------------------------------
     Janela
     ------------------------------------------------------------------------ */
  var win = document.getElementById('ap-win');
  var body = document.getElementById('ap-win-body');
  var btnMetodo = document.getElementById('ap-win-method');
  var origem = null, aberto = null;

  function abrir(appId, quem) {
    var app = APPS[appId];
    if (!app || !win) return;
    origem = quem || document.activeElement;
    aberto = appId;
    win.style.setProperty('--c1', app.cor[0]);
    win.style.setProperty('--c2', app.cor[1]);
    win.querySelector('#ap-win-icon use').setAttribute('href', '#' + app.icone);
    document.getElementById('ap-win-title').textContent = app.titulo;
    document.getElementById('ap-win-q').textContent = app.pergunta;
    btnMetodo.setAttribute('aria-pressed', 'false');
    win.classList.remove('is-method');
    montar(appId, body);
    if (!win.open) win.showModal();
    body.scrollTop = 0;
    history.replaceState(null, '', '#' + appId);
  }

  function fechar() {
    if (win.open) win.close();
  }

  if (win) {
    win.addEventListener('close', function () {
      aberto = null;
      history.replaceState(null, '', location.pathname + location.search);
      if (origem && origem.focus) origem.focus();
    });
    win.addEventListener('click', function (e) {
      if (e.target === win) fechar();
      if (e.target.closest('[data-close]')) fechar();
    });
    btnMetodo.addEventListener('click', function () {
      var on = btnMetodo.getAttribute('aria-pressed') !== 'true';
      btnMetodo.setAttribute('aria-pressed', String(on));
      win.classList.toggle('is-method', on);
      body.querySelector('.ap-method').hidden = !on;
      body.querySelector('.ap-out').hidden = on;
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.ap-tile[data-app]'), function (b) {
    b.addEventListener('click', function () { abrir(b.dataset.app, b); });
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-premissas-data]'), function (el) { el.textContent = P.conferidoEm; });

  function pelaAncora() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (APPS[id] && aberto !== id) abrir(id);
  }
  window.addEventListener('hashchange', pelaAncora);
  pelaAncora();

  window.Apps = { abrir: abrir, fechar: fechar, lista: Object.keys(APPS) };
})();
