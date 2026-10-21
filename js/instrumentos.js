/* ==========================================================================
   INSTRUMENTOS · renderizador das calculadoras
   --------------------------------------------------------------------------
   Cada instrumento é descrito uma vez (campos, padrões, resultados) e
   montado em qualquer elemento com data-instrumento="nome". O cálculo vem
   de js/calculos.js e os padrões de data/premissas.js.

   Uso no HTML:   <div data-instrumento="taxas"></div>
   Disponíveis:   taxas · rendaFixa · sucessao · independencia · imovel
   ========================================================================== */

(function () {
  'use strict';

  var C = window.Calculos;
  var P = window.PREMISSAS;
  if (!C || !P) return;

  /* ------------------------------------------------------------------------
     Formatação
     ------------------------------------------------------------------------ */
  var brl0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var n1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var n2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var n0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

  function brl(v) { return brl0.format(Math.round(v)); }
  function big(v) {
    var a = Math.abs(v);
    if (a >= 1e9) return 'R$ ' + n1.format(v / 1e9) + ' bilhões';
    if (a >= 1e6) return 'R$ ' + n2.format(v / 1e6) + ' milhões';
    return brl(v);
  }
  function anos(v) { return n0.format(v) + (v === 1 ? ' ano' : ' anos'); }
  function meses(v) {
    if (v % 12 === 0) return anos(v / 12);
    return n0.format(v) + (v === 1 ? ' mês' : ' meses');
  }
  function pct(v) { return n1.format(v) + '% a.a.'; }
  // Duas casas para taxas de mercado (CDI 13,65%): uma casa daria precisão falsa.
  function pct2(v) { return n2.format(v) + '% a.a.'; }
  function pctN(v) { return n1.format(v) + '%'; }
  function pctCdi(v) { return n0.format(v) + '% do CDI'; }

  function socios(v) { return n0.format(v) + (v === 1 ? ' sócio' : ' sócios'); }

  var FMT = { brl: brl, anos: anos, meses: meses, pct: pct, pct2: pct2, pctN: pctN, pctCdi: pctCdi, socios: socios };

  // Lê "R$ 1.234.567", "1234567", "12,5" e devolve número.
  function parseInput(str, fmt) {
    var s = String(str).replace(/[^\d,.-]/g, '');
    if (fmt === 'brl' || fmt === 'anos' || fmt === 'meses') s = s.replace(/[.,]/g, '');
    else s = s.replace(/\./g, '').replace(',', '.');
    var v = parseFloat(s);
    return isFinite(v) ? v : null;
  }

  var hoje = new Date().getFullYear();

  /* ------------------------------------------------------------------------
     Definições
     ------------------------------------------------------------------------ */
  var DEFS = {

    taxas: {
      titulo: 'O custo das taxas',
      subtitulo: 'Quanto o custo total da carteira leva do seu patrimônio ao longo dos anos.',
      campos: [
        { id: 'inicial', rotulo: 'Patrimônio investido hoje', fmt: 'brl', min: 0, max: 30000000, passo: 50000, valor: 1000000 },
        { id: 'aporte', rotulo: 'Aporte mensal', fmt: 'brl', min: 0, max: 300000, passo: 1000, valor: 0 },
        { id: 'anos', rotulo: 'Prazo', fmt: 'anos', min: 1, max: 40, passo: 1, valor: 20 },
        { id: 'bruta', rotulo: 'Rentabilidade bruta, antes de custos', fmt: 'pct', min: 4, max: 16, passo: 0.25, valor: 10 },
        { id: 'custoAtual', rotulo: 'Custo total que você paga hoje', fmt: 'pct', min: 0.1, max: 4, passo: 0.1, valor: P.custos.bancoTipico,
          ajuda: 'Some taxa de administração, performance e custos dos produtos. Carteiras de banco costumam ficar entre 1,5% e 3% ao ano.' }
      ],
      calcular: function (v) {
        var r = C.custoDasTaxas({ inicial: v.inicial, aporte: v.aporte, anos: v.anos, bruta: v.bruta,
          custoAtual: v.custoAtual, custoReferencia: P.custos.referencia });
        var positivo = r.diferenca > 0.5;
        return {
          principalRotulo: 'Diferença ao fim do prazo',
          principal: positivo ? big(r.diferenca) : 'R$ 0',
          frase: !positivo
            ? 'O seu custo atual já está no nível de referência ou abaixo dele.'
            : 'Os custos levam ' + n0.format(r.parcelaDoGanhoPerdida * 100) + '% de todo o ganho que o seu dinheiro poderia gerar no período.',
          grade: [
            ['Com o custo atual', big(r.atual)],
            ['Com custo de referência de ' + pctN(P.custos.referencia) + ' a.a.', big(r.referencia)],
            ['Total investido', big(r.investido)]
          ]
        };
      },
      nota: 'Juros compostos mensais. O custo é descontado sobre o patrimônio, como na cobrança diária real das taxas de administração. Sem impostos e sem inflação.'
    },

    rendaFixa: {
      titulo: 'Comparador de renda fixa',
      subtitulo: 'O que sobra de fato no seu bolso em cada alternativa, depois do imposto e da custódia.',
      campos: [
        { id: 'valor', rotulo: 'Valor aplicado', fmt: 'brl', min: 1000, max: 10000000, passo: 1000, valor: 100000 },
        { id: 'meses', rotulo: 'Prazo', fmt: 'meses', min: 1, max: 60, passo: 1, valor: 24 },
        { id: 'cdbPctCdi', rotulo: 'CDB paga', fmt: 'pctCdi', min: 80, max: 140, passo: 1, valor: 110 },
        { id: 'lciPctCdi', rotulo: 'LCI ou LCA paga', fmt: 'pctCdi', min: 70, max: 110, passo: 1, valor: 92 },
        { id: 'cdi', rotulo: 'CDI', fmt: 'pct2', min: 5, max: 16, passo: 0.05, valor: P.mercado.cdi,
          ajuda: 'Valor atual conferido em ' + P.conferidoEm + '. Ajuste se quiser testar outro cenário de juros.' }
      ],
      calcular: function (v) {
        var r = C.rendaFixa(v, P);
        var opcoes = [
          ['CDB', r.cdb],
          ['LCI ou LCA', r.lci],
          ['Tesouro Selic', r.tesouro]
        ].sort(function (a, b) { return b[1] - a[1]; });
        var melhor = opcoes[0];
        var lucro = melhor[1] - v.valor;
        return {
          principalRotulo: 'Melhor resultado líquido',
          principal: melhor[0],
          frase: big(melhor[1]) + ' ao fim de ' + meses(v.meses) + ', ' + big(lucro) + ' de ganho líquido. ' +
            'Para empatar com a LCI, o CDB precisaria pagar ' + n1.format(r.cdbEquivalenteLci) + '% do CDI.',
          grade: opcoes.map(function (o) { return [o[0], big(o[1])]; }).concat([
            ['Imposto de renda no prazo', pctN(r.aliquotaIR) + ' sobre o ganho']
          ])
        };
      },
      nota: 'IR regressivo de 22,5% a 15% conforme o prazo; LCI e LCA isentas para pessoa física. Tesouro Selic aproximado pelo CDI, com custódia da B3 de ' +
        pctN(P.custos.custodiaB3Tesouro) + ' a.a. acima de R$ 10 mil. Não considera IOF (resgates em menos de 30 dias) nem risco de crédito; CDB, LCI e LCA têm garantia do FGC até R$ 250 mil por CPF e instituição.'
    },

    sucessao: {
      titulo: 'O custo da sucessão sem planejamento',
      subtitulo: 'Quanto a família precisaria pagar para receber o patrimônio, e se haveria dinheiro disponível para isso.',
      campos: [
        { id: 'patrimonio', rotulo: 'Patrimônio a ser transmitido', fmt: 'brl', min: 100000, max: 100000000, passo: 100000, valor: 5000000 },
        { id: 'itcmd', rotulo: 'Alíquota do ITCMD no seu estado', fmt: 'pctN', min: 1, max: P.sucessao.itcmdMaximo, passo: 0.5, valor: P.sucessao.itcmdPadrao,
          ajuda: 'São Paulo cobra 4%. O teto nacional é 8%, e a reforma tributária tornou as alíquotas progressivas obrigatórias nos estados.' },
        { id: 'custosInventario', rotulo: 'Custos do inventário', fmt: 'pctN', min: 1, max: 14, passo: 0.5, valor: P.sucessao.custosInventarioPadrao,
          ajuda: 'A tabela de honorários 2026 da OAB-SP prevê 6% no inventário em cartório, 8% no judicial sem disputa e 10% com disputa, além de custas e emolumentos.' },
        { id: 'pctLiquido', rotulo: 'Parte do patrimônio em ativos de resgate rápido', fmt: 'pctN', min: 0, max: 100, passo: 5, valor: 5,
          ajuda: 'Aplicações que viram dinheiro em dias. Imóveis e participações em empresas não contam.' }
      ],
      calcular: function (v) {
        var r = C.sucessao(v);
        return {
          principalRotulo: 'Custo estimado para a família',
          principal: big(r.total),
          frase: r.faltaDeLiquidez > 0
            ? 'Os ativos de resgate rápido não cobrem esse custo. Faltariam ' + big(r.faltaDeLiquidez) + ', que precisariam vir da venda de bens, muitas vezes às pressas e abaixo do valor.'
            : 'Os ativos de resgate rápido cobrem esse custo, sem obrigar a família a vender bens.',
          grade: [
            ['ITCMD', big(r.itcmd)],
            ['Custos do inventário', big(r.custosInventario)],
            ['Peso no patrimônio', pctN(r.pctDoPatrimonio)]
          ]
        };
      },
      nota: 'Estimativa educativa. O ITCMD e os custos variam por estado e por bem; um caso real exige análise jurídica e contábil.'
    },

    independencia: {
      titulo: 'O ano da independência',
      subtitulo: 'Quando o patrimônio passa a sustentar o seu custo de vida sem ser consumido.',
      campos: [
        { id: 'inicial', rotulo: 'Patrimônio investido hoje', fmt: 'brl', min: 0, max: 30000000, passo: 50000, valor: 500000 },
        { id: 'aporte', rotulo: 'Aporte mensal', fmt: 'brl', min: 0, max: 300000, passo: 1000, valor: 10000 },
        { id: 'renda', rotulo: 'Renda mensal desejada, em valores de hoje', fmt: 'brl', min: 3000, max: 500000, passo: 1000, valor: 25000 },
        { id: 'realBruta', rotulo: 'Rentabilidade acima da inflação, antes de custos', fmt: 'pct', min: 2, max: 9, passo: 0.25,
          valor: P.independencia.rentabilidadeRealPadrao },
        { id: 'retirada', rotulo: 'Retirada anual do patrimônio', fmt: 'pctN', tipo: 'escolha',
          opcoes: P.independencia.retiradasDisponiveis, valor: P.independencia.retiradaPadrao,
          ajuda: 'Quanto menor a retirada, mais tempo o patrimônio dura. 3,5% é conservador para décadas; 4% é a regra clássica.' },
        { id: 'anosMeta', rotulo: 'Em quantos anos você gostaria de chegar', fmt: 'anos', min: 3, max: 40, passo: 1, valor: 15 }
      ],
      calcular: function (v) {
        var r = C.independencia({ inicial: v.inicial, aporte: v.aporte, renda: v.renda, retirada: v.retirada,
          realBruta: v.realBruta, custoReferencia: P.custos.referencia, custoBanco: P.custos.bancoTipico, anosMeta: v.anosMeta });
        var principal, frase;
        if (r.mesesReferencia === 0) {
          principal = String(hoje);
          frase = 'Com estas premissas, o seu patrimônio já sustenta a renda desejada.';
        } else if (r.mesesReferencia === null) {
          principal = 'Acima de 60 anos';
          frase = 'Com estas premissas o alvo não é alcançado. Para chegar em ' + anos(v.anosMeta) + ', o aporte precisaria ser de ' + brl(r.aporteParaMeta) + ' por mês.';
        } else {
          var a = Math.ceil(r.mesesReferencia / 12);
          principal = String(hoje + a);
          frase = 'Em cerca de ' + anos(a) + '.';
          if (r.mesesBanco === null) frase += ' Com custo de banco de ' + pctN(P.custos.bancoTipico) + ' a.a., o alvo não seria alcançado em 60 anos.';
          else {
            var ganho = Math.ceil(r.mesesBanco / 12) - a;
            if (ganho > 0) frase += ' São ' + anos(ganho) + ' antes do que com custo de banco de ' + pctN(P.custos.bancoTipico) + ' a.a.';
          }
        }
        return {
          principalRotulo: 'Ano estimado da independência',
          principal: principal,
          frase: frase,
          grade: [
            ['Patrimônio necessário', big(r.alvo)],
            ['Aporte para chegar em ' + anos(v.anosMeta), r.aporteParaMeta > 0 ? brl(r.aporteParaMeta) + '/mês' : 'Já alcançado'],
            ['Com custo de banco', r.mesesBanco === null ? 'Acima de 60 anos' : String(hoje + Math.ceil(r.mesesBanco / 12))]
          ]
        };
      },
      nota: 'Valores em termos reais (descontada a inflação), aportes mensais constantes e custo de referência de ' + pctN(P.custos.referencia) +
        ' a.a. Não considera INSS nem imposto sobre os resgates. A regra de retirada é uma referência histórica, não uma garantia.'
    },

    imovel: {
      titulo: 'Alugar ou comprar financiado',
      subtitulo: 'Qual caminho deixa mais patrimônio ao fim do horizonte, considerando o que o dinheiro renderia investido.',
      campos: [
        { id: 'valorImovel', rotulo: 'Valor do imóvel', fmt: 'brl', min: 200000, max: 20000000, passo: 50000, valor: 1200000 },
        { id: 'entradaPct', rotulo: 'Entrada', fmt: 'pctN', min: 10, max: 100, passo: 5, valor: 30 },
        { id: 'aluguelMensal', rotulo: 'Aluguel de um imóvel equivalente', fmt: 'brl', min: 500, max: 100000, passo: 100, valor: 5500 },
        { id: 'jurosFinanciamento', rotulo: 'Juros do financiamento', fmt: 'pct2', min: 6, max: 18, passo: 0.01, valor: P.imovel.jurosFinanciamento },
        { id: 'prazoAnos', rotulo: 'Prazo do financiamento', fmt: 'anos', min: 5, max: 35, passo: 1, valor: 30 },
        { id: 'rendimentoInvestimento', rotulo: 'Rendimento líquido do dinheiro investido', fmt: 'pct', min: 4, max: 16, passo: 0.25, valor: 11,
          ajuda: 'O que o dinheiro renderia, já descontado o imposto, se não fosse para a entrada e as parcelas.' },
        { id: 'valorizacaoReal', rotulo: 'Valorização do imóvel acima da inflação', fmt: 'pct', min: -3, max: 5, passo: 0.25, valor: 1 },
        { id: 'horizonteAnos', rotulo: 'Por quantos anos você pretende ficar', fmt: 'anos', min: 2, max: 35, passo: 1, valor: 15 }
      ],
      calcular: function (v) {
        var r = C.alugarOuComprar(Object.assign({}, v, { custosCompraPct: P.imovel.custosCompra, inflacao: P.mercado.ipca12m }));
        var comprar = r.vantagem > 0;
        var empate = Math.abs(r.vantagem) < Math.max(r.patrimonioAlugar, r.patrimonioComprar) * 0.02;
        return {
          principalRotulo: 'Caminho que deixa mais patrimônio',
          principal: empate ? 'Empate técnico' : (comprar ? 'Comprar' : 'Alugar e investir'),
          frase: empate
            ? 'A diferença fica abaixo de 2%. Aqui a decisão é de estilo de vida, não financeira.'
            : 'Vantagem de ' + big(Math.abs(r.vantagem)) + ' em ' + anos(v.horizonteAnos) + '.',
          grade: [
            ['Patrimônio comprando', big(r.patrimonioComprar)],
            ['Patrimônio alugando e investindo', big(r.patrimonioAlugar)],
            ['Primeira parcela (SAC)', brl(r.primeiraParcela)],
            ['Custos de compra (ITBI e cartório)', brl(r.custosCompra)]
          ]
        };
      },
      nota: 'Financiamento pelo sistema SAC, sem seguros obrigatórios. Aluguel e imóvel corrigidos pela inflação de ' + pctN(P.mercado.ipca12m) +
        ' ao ano; quem aluga investe a entrada, os custos de compra e a diferença entre parcela e aluguel. Juros padrão da linha SBPE da Caixa (agosto de 2026), sem a TR, que acrescenta custo. Não inclui IPTU, condomínio e manutenção, que pesam nos dois caminhos.'
    },

    holding: {
      titulo: 'Holding patrimonial',
      subtitulo: 'Quanto de imposto uma holding economiza, ou não, em aluguéis e na venda de imóveis.',
      campos: [
        { id: 'operacao', rotulo: 'O que você quer comparar', fmt: 'operacao', tipo: 'escolha', opcoes: [1, 2], valor: 1 },
        { id: 'aluguelMensal', so: 1, rotulo: 'Aluguel recebido por mês', fmt: 'brl', min: 2000, max: 500000, passo: 500, valor: 30000 },
        { id: 'valorImoveis', so: 1, rotulo: 'Valor dos imóveis alugados', fmt: 'brl', min: 200000, max: 100000000, passo: 100000, valor: 6000000,
          ajuda: 'Valor venal ou de referência da prefeitura: é a base do ITBI quando os imóveis passam para a holding.' },
        { id: 'anos', so: 1, rotulo: 'Horizonte da comparação', fmt: 'anos', min: 1, max: 30, passo: 1, valor: 10 },
        { id: 'custoMensal', so: 1, rotulo: 'Contabilidade da holding, por mês', fmt: 'brl', min: 0, max: 10000, passo: 100, valor: P.holding.custoMensalPadrao },
        { id: 'valorVenda', so: 2, rotulo: 'Valor de venda do imóvel', fmt: 'brl', min: 200000, max: 100000000, passo: 50000, valor: 3000000,
          ajuda: 'Valor líquido, já descontada a corretagem.' },
        { id: 'custoAquisicao', so: 2, rotulo: 'Custo de aquisição declarado', fmt: 'brl', min: 0, max: 100000000, passo: 50000, valor: 1000000,
          ajuda: 'O valor que está na sua declaração de Imposto de Renda, com as reformas comprovadas.' },
        { id: 'socios', rotulo: 'Quantas pessoas dividem os imóveis', fmt: 'socios', min: 1, max: 6, passo: 1, valor: 1,
          ajuda: 'Um casal em comunhão de bens, por exemplo, são 2: cada um declara a sua metade.' },
        { id: 'itbi', rotulo: 'ITBI na passagem para a holding', fmt: 'pctN', min: 0, max: 5, passo: 0.5, valor: P.holding.itbiPadrao,
          ajuda: 'São Paulo cobra 3%. Holdings cuja atividade principal é imobiliária não têm a imunidade do ITBI (STF, Tema 796).' }
      ],
      calcular: function (v) {
        var H = P.holding;
        if (v.operacao === 2) {
          var r = C.holdingVenda(v, H);
          var ganha = r.economia > 0;
          return {
            principalRotulo: ganha ? 'Economia vendendo pela holding' : 'Vender pela holding custa mais',
            principal: big(Math.abs(r.economia)),
            frase: ganha
              ? 'A holding paga ' + big(r.totalPJ) + ' contra ' + big(r.impostoPF) + ' de ganho de capital na pessoa física.'
              : 'Na pessoa física, o ganho de capital é de ' + big(r.impostoPF) + '. Pela holding, somando tributos, ITBI e o imposto sobre os dividendos, seriam ' + big(r.totalPJ) + '.',
            grade: [
              ['Imposto na pessoa física', big(r.impostoPF)],
              ['Total pela holding', big(r.totalPJ)],
              ['Dos quais, imposto sobre dividendos', big(r.irDividendos)]
            ]
          };
        }
        var a = C.holdingAluguel(Object.assign({}, v, { inflacao: P.mercado.ipca12m }), H);
        var compensa = a.economia > 0;
        return {
          principalRotulo: compensa ? 'Economia com a holding em ' + anos(v.anos) : 'A holding não compensa em ' + anos(v.anos),
          principal: big(Math.abs(a.economia)),
          frase: 'Por mês, ' + brl(a.impostoMensalPF) + ' de imposto na pessoa física contra ' + brl(a.custoMensalPJ) + ' na holding, já com a contabilidade. ' +
            (a.anoDeRetorno ? 'O custo de abertura se paga no ' + a.anoDeRetorno + 'º ano.' : 'O custo de abertura não se paga no período.'),
          grade: [
            ['Imposto por mês, pessoa física', brl(a.impostoMensalPF)],
            ['Custo por mês, holding', brl(a.custoMensalPJ)],
            ['ITBI e abertura', big(a.entrada)]
          ]
        };
      },
      nota: 'Regras de 2026: tabela do IRPF com a redução até R$ 7.350, lucro presumido com PIS e COFINS cumulativos, presunção de 32% no aluguel e de 8% e 12% na venda de imóvel do estoque, ' +
        'acréscimo da LC 224/2025 acima de R$ 5 milhões e imposto mínimo sobre dividendos da Lei 15.270/2025. Não considera deduções do aluguel na pessoa física, fator de redução do ganho de capital, nem a troca de PIS e COFINS pela CBS a partir de 2027. ' +
        'Estimativa educativa: a decisão exige análise tributária e jurídica do caso.'
    }
  };

  /* ------------------------------------------------------------------------
     Montagem
     ------------------------------------------------------------------------ */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function campoHTML(nome, c) {
    var id = nome + '-' + c.id;
    var ajuda = c.ajuda ? '<span class="jx-help" id="' + id + '-ajuda">' + esc(c.ajuda) + '</span>' : '';
    var describedby = c.ajuda ? ' aria-describedby="' + id + '-ajuda"' : '';

    if (c.tipo === 'escolha') {
      var botoes = c.opcoes.map(function (o) {
        return '<button type="button" class="jx-seg" data-valor="' + o + '" aria-pressed="' + (o === c.valor) + '">' + esc(FMT[c.fmt](o)) + '</button>';
      }).join('');
      return '<div class="jx-field jx-field-choice" role="group" aria-label="' + esc(c.rotulo) + '"' + describedby + '>' +
        '<span>' + esc(c.rotulo) + '</span>' +
        '<div class="jx-segs" data-campo="' + c.id + '">' + botoes + '</div>' + ajuda + '</div>';
    }

    return '<div class="jx-field">' +
      '<label for="' + id + '">' + esc(c.rotulo) + '</label>' +
      '<input class="jx-num-in" type="text" inputmode="decimal" id="' + id + '-txt" aria-label="' + esc(c.rotulo) + ', valor digitado"' +
        ' value="' + esc(FMT[c.fmt](c.valor)) + '">' +
      '<input type="range" id="' + id + '" data-campo="' + c.id + '" min="' + c.min + '" max="' + c.max + '" step="' + c.passo + '" value="' + c.valor + '"' + describedby + '>' +
      ajuda + '</div>';
  }

  function montar(el) {
    var nome = el.getAttribute('data-instrumento');
    var d = DEFS[nome];
    if (!d || el.getAttribute('data-montado')) return;
    el.setAttribute('data-montado', '1');

    var semTitulo = el.hasAttribute('data-sem-titulo');
    el.classList.add('jx-calc');
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', d.titulo);

    el.innerHTML =
      (semTitulo ? '' : '<p class="jx-label">' + esc(d.titulo) + '</p><p class="jx-calc-sub">' + esc(d.subtitulo) + '</p>') +
      '<div class="jx-fields">' + d.campos.map(function (c) { return campoHTML(nome, c); }).join('') + '</div>' +
      '<div class="jx-result" aria-live="polite">' +
        '<div class="jx-result-main">' +
          '<span class="jx-label" data-out="principalRotulo"></span>' +
          '<strong data-out="principal" id="' + nome + '-out"></strong>' +
          '<span class="jx-result-sub" data-out="frase"></span>' +
        '</div>' +
        '<dl class="jx-result-grid" data-out="grade"></dl>' +
      '</div>' +
      '<p class="jx-fine">' + esc(d.nota) + ' Premissas de mercado conferidas em ' + esc(P.conferidoEm) + '. Simulação ilustrativa, não é recomendação nem promessa de rentabilidade.</p>';

    var valores = {};
    d.campos.forEach(function (c) { valores[c.id] = c.valor; });

    function recalcular() {
      var r = d.calcular(valores);
      el.querySelector('[data-out="principalRotulo"]').textContent = r.principalRotulo;
      el.querySelector('[data-out="principal"]').textContent = r.principal;
      el.querySelector('[data-out="frase"]').textContent = r.frase;
      var dl = el.querySelector('[data-out="grade"]');
      dl.innerHTML = r.grade.map(function (g) {
        return '<div><dt>' + esc(g[0]) + '</dt><dd>' + esc(g[1]) + '</dd></div>';
      }).join('');
    }

    d.campos.forEach(function (c) {
      var id = nome + '-' + c.id;

      if (c.tipo === 'escolha') {
        var segs = el.querySelectorAll('.jx-segs[data-campo="' + c.id + '"] .jx-seg');
        Array.prototype.forEach.call(segs, function (b) {
          b.addEventListener('click', function () {
            valores[c.id] = parseFloat(b.getAttribute('data-valor'));
            Array.prototype.forEach.call(segs, function (o) { o.setAttribute('aria-pressed', String(o === b)); });
            recalcular();
          });
        });
        return;
      }

      var range = document.getElementById(id);
      var txt = document.getElementById(id + '-txt');

      function pintar() {
        var p = (valores[c.id] - c.min) / (c.max - c.min) * 100;
        range.style.setProperty('--fill', Math.max(0, Math.min(100, p)) + '%');
        txt.style.width = (Math.max(6, txt.value.length) + 1.5) + 'ch';
      }

      range.addEventListener('input', function () {
        valores[c.id] = parseFloat(range.value);
        txt.value = FMT[c.fmt](valores[c.id]);
        pintar();
        recalcular();
      });

      // Digitar um valor: aceita qualquer número dentro dos limites.
      function aplicarTexto() {
        var v = parseInput(txt.value, c.fmt);
        if (v === null) { txt.value = FMT[c.fmt](valores[c.id]); return; }
        v = Math.max(c.min, Math.min(c.max, v));
        valores[c.id] = v;
        range.value = String(v);
        txt.value = FMT[c.fmt](v);
        pintar();
        recalcular();
      }
      txt.addEventListener('change', aplicarTexto);
      txt.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); aplicarTexto(); txt.blur(); } });
      txt.addEventListener('focus', function () { txt.select(); });

      pintar();
    });

    recalcular();
  }

  function montarTodos() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-instrumento]'), function (el) {
      try { montar(el); } catch (err) { if (window.console) console.error('[instrumentos] ' + el.getAttribute('data-instrumento'), err); }
    });

    // Montar as calculadoras aumenta a altura da página. Se o visitante chegou
    // por um link com âncora (#sucessao), o navegador já rolou antes disso e o
    // alvo saiu do lugar: reposiciona uma vez, sem animação.
    if (location.hash.length > 1) {
      var alvo = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (alvo) alvo.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }

  window.Instrumentos = { definicoes: DEFS, montar: montarTodos };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montarTodos);
  else montarTodos();
})();
