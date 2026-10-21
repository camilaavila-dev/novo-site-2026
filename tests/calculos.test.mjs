/**
 * Testes de unidade do motor de cálculo (js/calculos.js).
 *
 * Cada caso é conferido contra uma conta feita à mão ou contra um exemplo
 * publicado por uma das calculadoras de referência de mercado.
 *
 * Uso: node tests/calculos.test.mjs
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const C = require('../js/calculos.js');
const P = require('../data/premissas.js');

let pass = 0, fail = 0;
function t(name, ok, detail = '') {
  if (ok) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (detail ? '  -> ' + detail : '')); }
}
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const section = s => console.log('\n== ' + s + ' ==');

section('Juros compostos');
// Exemplo publicado: R$ 10 mil a 6% a.a. por 20 anos rendem R$ 22.071 de juros.
t('R$ 10 mil a 6% por 20 anos = R$ 32.071', near(C.valorFuturo(10000, 0, 6, 240), 32071.35, 1),
  C.valorFuturo(10000, 0, 6, 240).toFixed(2));
// Aporte sem juros soma linearmente.
t('taxa zero soma aportes', C.valorFuturo(1000, 100, 0, 12) === 2200);
// Taxa mensal equivalente: 12,68% a.a. ≈ 1% a.m.
t('taxa mensal equivalente', near(C.mensal(12.6825), 0.01, 1e-5));

section('Custo da névoa');
t('10% bruto com 1% de custo ≈ 8,91% líquido', near(C.liquidaDeCusto(10, 1), 8.9109, 1e-3));
{
  // Exemplo publicado (Renova Invest): R$ 100 mil, 10 anos, 14,25% bruto.
  const r = C.custoDasTaxas({ inicial: 100000, aporte: 0, anos: 10, bruta: 14.25, custoAtual: 2.0, custoReferencia: 0.1 });
  t('exemplo de mercado: com 0,10% ≈ R$ 376 mil', near(r.referencia, 376000, 4000), r.referencia.toFixed(0));
  // O exemplo publicado dá R$ 318 mil porque SUBTRAI a taxa (14,25 - 2). Mas a
  // taxa de administração é cobrada por dia útil sobre o patrimônio; simulando
  // essa cobrança real, o resultado é ~R$ 310 mil. O motor deve bater com ela.
  const gd = Math.pow(1.1425, 1 / 252) - 1;
  let real = 100000;
  for (let d = 0; d < 2520; d++) { real *= 1 + gd; real -= real * 0.02 / 252; }
  t('com 2%: confere com a cobrança diária real (±0,5%)', near(r.atual, real, real * 0.005),
    r.atual.toFixed(0) + ' vs ' + real.toFixed(0));
  t('custo maior nunca rende mais', r.atual < r.referencia && r.referencia < r.semCusto);
  t('diferença é referência menos atual', near(r.diferenca, r.referencia - r.atual, 1e-6));
}
{
  const r = C.custoDasTaxas({ inicial: 0, aporte: 0, anos: 10, bruta: 10, custoAtual: 2, custoReferencia: 0.7 });
  t('patrimônio zero não gera números falsos', r.atual === 0 && r.diferenca === 0 && r.parcelaDoGanhoPerdida === 0);
}

section('Imposto de renda regressivo');
const ir = P.irRegressivo;
t('até 180 dias: 22,5%', C.aliquotaIR(180, ir) === 22.5);
t('181 dias: 20%', C.aliquotaIR(181, ir) === 20);
t('360 dias: 20%', C.aliquotaIR(360, ir) === 20);
t('361 dias: 17,5%', C.aliquotaIR(361, ir) === 17.5);
t('720 dias: 17,5%', C.aliquotaIR(720, ir) === 17.5);
t('721 dias: 15%', C.aliquotaIR(721, ir) === 15);
t('6 meses caem na faixa de 20%', C.aliquotaIR(C.diasDeMeses(6), ir) === 20);
t('24 meses caem na faixa de 15%', C.aliquotaIR(C.diasDeMeses(24), ir) === 15);

section('Comparador de renda fixa');
{
  // Fórmula de equivalência publicada pelos comparadores: LCI 90% do CDI
  // com IR de 17,5% equivale a CDB de 109,1% do CDI.
  const r = C.rendaFixa({ valor: 100000, meses: 12, cdi: 13.65, cdbPctCdi: 109.09, lciPctCdi: 90 }, P);
  t('LCI 90% ≡ CDB 109,1% em 1 ano', near(r.cdbEquivalenteLci, 109.09, 0.01), r.cdbEquivalenteLci.toFixed(2));
  t('nesse ponto os líquidos empatam', near(r.cdb, r.lci, 60), r.cdb.toFixed(0) + ' vs ' + r.lci.toFixed(0));
  // Conta à mão do CDB: 100 mil a 109,09% de 13,65% por 1 ano, IR 17,5%.
  const bruto = 100000 * (1 + 0.1365 * 1.0909);
  t('CDB líquido confere com a conta à mão', near(r.cdb, bruto - (bruto - 100000) * 0.175, 0.5));
}
{
  // Exemplo publicado (B3): R$ 60 mil no Tesouro Selic pagam ~R$ 100/ano de custódia.
  const r = C.rendaFixa({ valor: 60000, meses: 12, cdi: 0, cdbPctCdi: 100, lciPctCdi: 100 }, P);
  t('custódia do Tesouro Selic: R$ 60 mil ≈ R$ 100 por ano', near(r.custodiaTesouro, 100, 0.5), r.custodiaTesouro.toFixed(2));
  const r2 = C.rendaFixa({ valor: 9000, meses: 12, cdi: 0, cdbPctCdi: 100, lciPctCdi: 100 }, P);
  t('até R$ 10 mil não há custódia', r2.custodiaTesouro === 0);
}

section('Sucessão');
{
  // Exemplo publicado: R$ 5 milhões a 8% geram R$ 400 mil de ITCMD.
  const r = C.sucessao({ patrimonio: 5000000, itcmd: 8, custosInventario: 0, pctLiquido: 100 });
  t('ITCMD de 8% sobre R$ 5 milhões = R$ 400 mil', r.itcmd === 400000);
  t('liquidez suficiente: nada a levantar', r.faltaDeLiquidez === 0);
  const r2 = C.sucessao({ patrimonio: 5000000, itcmd: 4, custosInventario: 6, pctLiquido: 5 });
  t('custo total 10% = R$ 500 mil', r2.total === 500000);
  t('com 5% em ativos líquidos faltam R$ 250 mil', r2.faltaDeLiquidez === 250000);
}

section('Independência financeira');
t('R$ 25 mil/mês com retirada de 4% = R$ 7,5 milhões', C.patrimonioAlvo(25000, 4) === 7500000);
t('R$ 25 mil/mês com retirada de 3,5% ≈ R$ 8,57 milhões', near(C.patrimonioAlvo(25000, 3.5), 8571428.57, 0.01));
t('patrimônio já suficiente: zero meses', C.mesesAteAlvo(9e6, 0, 8e6, 5) === 0);
t('inalcançável em 60 anos: null', C.mesesAteAlvo(0, 0, 1e6, 5) === null);
{
  // O aporte necessário, aplicado, atinge o alvo no prazo pedido.
  const alvo = 3000000, taxa = 4.8, meses = 180;
  const ap = C.aporteNecessario(200000, alvo, taxa, meses);
  const fim = C.valorFuturo(200000, ap, taxa, meses);
  t('aporte necessário fecha a conta no prazo', near(fim, alvo, 1), fim.toFixed(2));
  t('com patrimônio que já basta, aporte é zero', C.aporteNecessario(5e6, 3e6, 4, 120) === 0);
}
{
  const r = C.independencia({ inicial: 500000, aporte: 10000, renda: 25000, retirada: 3.5, realBruta: 5.5, custoReferencia: 0.7, custoBanco: 2, anosMeta: 15 });
  t('custo de banco nunca antecipa a independência', r.mesesBanco === null || r.mesesBanco >= r.mesesReferencia);
}

section('Alugar ou comprar');
{
  // Compra à vista, tudo neutro: os dois caminhos empatam.
  const r = C.alugarOuComprar({ valorImovel: 1e6, entradaPct: 100, custosCompraPct: 0, jurosFinanciamento: 12, prazoAnos: 30,
    aluguelMensal: 0, valorizacaoReal: 0, inflacao: 0, rendimentoInvestimento: 0, horizonteAnos: 10 });
  t('cenário neutro empata', near(r.vantagem, 0, 1e-6), r.vantagem);
}
{
  // SAC: ao fim do prazo o saldo devedor zera.
  const r = C.alugarOuComprar({ valorImovel: 1e6, entradaPct: 20, custosCompraPct: 4, jurosFinanciamento: 12, prazoAnos: 10,
    aluguelMensal: 4000, valorizacaoReal: 0, inflacao: 4.58, rendimentoInvestimento: 11, horizonteAnos: 10 });
  t('SAC quita no prazo', r.saldoDevedorFinal < 0.01, r.saldoDevedorFinal);
  // Primeira parcela SAC: amortização + juros do primeiro mês.
  const esperado = 800000 / 120 + 800000 * C.mensal(12);
  t('primeira parcela SAC confere', near(r.primeiraParcela, esperado, 0.01), r.primeiraParcela.toFixed(2));
}
{
  // Se o aluguel é caro e o dinheiro rende pouco, comprar vence; o inverso, alugar vence.
  const base = { valorImovel: 1e6, entradaPct: 30, custosCompraPct: 4, jurosFinanciamento: 12, prazoAnos: 30,
    valorizacaoReal: 0, inflacao: 4.58, horizonteAnos: 15 };
  const caro = C.alugarOuComprar({ ...base, aluguelMensal: 9000, rendimentoInvestimento: 6 });
  const barato = C.alugarOuComprar({ ...base, aluguelMensal: 2500, rendimentoInvestimento: 13 });
  t('aluguel caro e rendimento baixo favorecem comprar', caro.vantagem > 0, caro.vantagem.toFixed(0));
  t('aluguel barato e rendimento alto favorecem alugar', barato.vantagem < 0, barato.vantagem.toFixed(0));
}

section('Diagnóstico patrimonial');
{
  const D = require('../data/diagnostico.js');
  t('cinco dimensões, duas perguntas cada', D.dimensoes.length === 5 && D.dimensoes.every(d => d.perguntas.length === 2));
  t('toda pergunta tem 4 opções em ordem crescente 0/35/70/100',
    D.dimensoes.every(d => d.perguntas.every(q => q.opcoes.map(o => o[1]).join() === '0,35,70,100')));
  t('todo link de orientação aponta para uma página existente',
    D.dimensoes.every(d => /^(index|instrumentos)\.html#/.test(d.capitulo.href) && /^instrumentos\.html#/.test(d.instrumento.href)));

  const tudo = v => Object.fromEntries(D.dimensoes.map(d => [d.id, [v, v]]));
  const zero = C.pontuarDiagnostico(tudo(0), D);
  t('tudo no mínimo: nota 0, estrutura frágil', zero.nota === 0 && zero.faixa.nome === 'Estrutura frágil');
  const max = C.pontuarDiagnostico(tudo(100), D);
  t('tudo no máximo: nota 100, estrutura madura', max.nota === 100 && max.faixa.nome === 'Estrutura madura');
  t('estrutura madura não aponta lacunas', max.lacunas.length === 0);

  const misto = C.pontuarDiagnostico({ custos: [100, 100], diversificacao: [35, 0], liquidez: [70, 70], tributacao: [100, 70], sucessao: [0, 35] }, D);
  // médias: 100, 17.5→18, 70, 85, 17.5→18 ; final = (100+18+70+85+18)/5 = 58.2 → 58
  t('nota final é a média das dimensões', misto.nota === 58, misto.nota);
  t('nota 58 cai em "em construção"', misto.faixa.nome === 'Estrutura em construção');
  t('lacunas são as duas mais frágeis, em ordem', misto.lacunas.map(l => l.id).join() === 'diversificacao,sucessao',
    misto.lacunas.map(l => l.id).join());
  t('respostas faltando contam como zero, sem quebrar', C.pontuarDiagnostico({}, D).nota === 0);
  t('faixas cobrem de 0 a 100 sem buracos', D.faixas[D.faixas.length - 1].ate === 100 &&
    [39, 40, 64, 65, 84, 85].every(n => D.faixas.some(f => n <= f.ate)));
}

section('Holding patrimonial');
{
  const H = P.holding;
  // Tabela de 2026 com a redução da Lei 15.270/2025 (Receita Federal).
  t('IRPF: R$ 5.000 por mês fica isento', C.irpfMensal(5000, H) === 0);
  t('IRPF: R$ 6.000 = 6.000 × 27,5% − 908,73 − (978,62 − 0,133145 × 6.000) = R$ 561,52',
    near(C.irpfMensal(6000, H), 561.52, 0.01), C.irpfMensal(6000, H).toFixed(2));
  t('IRPF: acima de R$ 7.350 não há redução (R$ 30 mil = R$ 7.341,27)', near(C.irpfMensal(30000, H), 7341.27, 0.01));

  // R$ 30 mil de aluguel: PIS/COFINS 1.095 + IRPJ 1.440 + CSLL 864 + contabilidade 1.500 = 4.899.
  const a = C.holdingAluguel({ aluguelMensal: 30000, valorImoveis: 6000000, anos: 10, socios: 1, itbi: 3, custoMensal: 1500, inflacao: 0 }, H);
  t('holding: custo mensal com R$ 30 mil de aluguel = R$ 4.899', near(a.custoMensalPJ, 4899, 0.5), a.custoMensalPJ.toFixed(2));
  t('holding: ITBI de 3% + abertura entram no início', a.entrada === 190000);
  t('holding: economia em 10 anos = (7.341,27 − 4.899) × 120 − 190.000',
    near(a.economia, (7341.27 - 4899) * 120 - 190000, 1), a.economia.toFixed(0));
  const b = C.holdingAluguel({ aluguelMensal: 30000, valorImoveis: 6000000, anos: 10, socios: 2, itbi: 3, custoMensal: 1500, inflacao: 0 }, H);
  t('holding: com dois sócios a pessoa física paga menos e a economia cai', b.economia < a.economia);
  const pequeno = C.holdingAluguel({ aluguelMensal: 5000, valorImoveis: 1000000, anos: 10, socios: 1, itbi: 3, custoMensal: 1500, inflacao: 0 }, H);
  t('holding: aluguel isento na pessoa física não compensa', pequeno.economia < 0 && pequeno.anoDeRetorno === null);

  // Adicional do IRPJ: base acima de R$ 20 mil por mês (aluguel acima de R$ 62.500).
  const grande = C.holdingAluguel({ aluguelMensal: 100000, valorImoveis: 0, anos: 1, socios: 1, itbi: 0, custoMensal: 0, inflacao: 0 }, H);
  // Por mês: 3.650 + 32.000 × 15% + 12.000 × 10% + 32.000 × 9% = 12.530; lucro 87.470 × 12 = 1.049.640
  // IRPFM: (1.049.640 − 600.000) ÷ 600.000 × 10% = 7,494% → 78.663
  const esperado = 12530 * 12 + 10000 + 1049640 * ((1049640 - 600000) / 600000 * 0.10);
  t('holding: adicional do IRPJ e imposto mínimo dos dividendos', near(grande.totalPJ, esperado, 1), grande.totalPJ.toFixed(0) + ' vs ' + esperado.toFixed(0));

  // Venda de R$ 3 milhões com custo de R$ 1 milhão.
  const v = C.holdingVenda({ valorVenda: 3000000, custoAquisicao: 1000000, itbi: 3, socios: 1 }, H);
  t('venda: ganho de capital na PF = 15% de R$ 2 milhões', v.impostoPF === 300000);
  t('venda: PIS/COFINS = 3,65% de R$ 3 milhões', near(v.pisCofins, 109500, 0.01));
  // IRPJ: 240.000 × 15% + (240.000 − 60.000) × 10% = 54.000; CSLL: 360.000 × 9% = 32.400
  t('venda: IRPJ e CSLL presumidos = R$ 86.400', near(v.irpjCsll, 86400, 0.01));
  t('venda: dividendo de R$ 1,8 milhão paga o imposto mínimo cheio (10%)', near(v.irDividendos, 180410, 0.01), v.irDividendos);
  const g = C.holdingVenda({ valorVenda: 12000000, custoAquisicao: 0, itbi: 0, socios: 1 }, H);
  t('venda: ganho de capital por faixas (15% até 5 mi, 17,5% até 10 mi, 20% acima)',
    near(g.impostoPF, 5e6 * 0.15 + 5e6 * 0.175 + 2e6 * 0.20, 0.01));
  // LC 224/2025: presunção 8% → 8,8% no que passar de R$ 5 milhões.
  t('venda: acréscimo de presunção da LC 224/2025 acima de R$ 5 milhões',
    near(g.irpjCsll, (5e6 * 0.08 + 7e6 * 0.088) * 0.15 + (5e6 * 0.08 + 7e6 * 0.088 - 60000) * 0.10 + (5e6 * 0.12 + 7e6 * 0.132) * 0.09, 0.01));
}

console.log('\n---------------------------------------');
console.log(`  ${pass} passaram, ${fail} falharam\n`);
process.exit(fail ? 1 : 0);
