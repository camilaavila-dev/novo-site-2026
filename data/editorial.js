/* ==========================================================================
   LEITURA DA SEMANA · dados editoriais
   --------------------------------------------------------------------------
   Atualize toda semana:
   1. semana.data e os valores de semana.indicadores (com a fonte);
   2. semana.resumo, uma ou duas frases;
   3. acrescente a edição nova NO TOPO da lista "edicoes" (modelo no fim).

   Regra editorial: a leitura explica o cenário e o que observar. Não traz
   recomendação de compra, venda ou alocação: recomendação é individual e
   acontece na consultoria.
   ========================================================================== */

(function (root) {
  'use strict';

  var semana = {
    data: '19 de outubro de 2026',
    resumo: 'O Banco Central segue cortando a Selic devagar, a inflação de 12 meses subiu em setembro e o mercado entra na última semana antes da eleição presidencial.',
    indicadores: [
      { nome: 'Selic', valor: '13,75% a.a.', nota: 'Corte de 0,25 p.p. em 16/09', fonte: 'Banco Central' },
      { nome: 'IPCA 12 meses', valor: '4,58%', nota: 'Até setembro; era 4,22% em agosto', fonte: 'IBGE' },
      { nome: 'Dólar', valor: 'R$ 5,05', nota: 'Fechamento de 19/10', fonte: 'B3' },
      { nome: 'Ibovespa', valor: '205.079 pts', nota: 'Fechamento de 19/10', fonte: 'B3' },
      { nome: 'S&P 500', valor: '7.690 pts', nota: 'Fechamento de 19/10', fonte: 'S&P Dow Jones Indices' }
    ]
  };

  var edicoes = [
    {
      id: '2026-10-19',
      titulo: 'Juros em queda, eleição à vista: o que observar nesta semana',
      data: '19 de outubro de 2026',
      categoria: 'Juros e inflação',
      leitura: '3 min',
      // Autoria exibida na página. Quando o Leo escrever a edição, troque por
      // 'Leonardo Arruda'. Até lá, a edição se apresenta pelo que é.
      autoria: 'Compilado dos indicadores da semana, com base nas fontes citadas',

      // Número da semana: um dado em destaque no topo da edição (opcional).
      destaque: {
        valor: '8,8%',
        rotulo: 'de juro real ao ano',
        texto: 'Selic de 13,75% descontada a inflação de 4,58%: o quanto a renda fixa rende acima da perda de poder de compra.'
      },

      // Resumo em 1 minuto: três frases, só fatos.
      resumo: [
        'O Copom cortou a Selic para 13,75% ao ano em 16 de setembro, o quinto corte seguido de 0,25 ponto percentual.',
        'A inflação acumulada em 12 meses subiu para 4,58% em setembro, contra 4,22% em agosto, segundo o IBGE.',
        'Na segunda-feira, 19, o dólar fechou a R$ 5,05 e o Ibovespa a 205 mil pontos, com o mercado atento à eleição presidencial.'
      ],

      // Leitura completa: explica o mecanismo, não recomenda.
      analise: [
        'Com a Selic em 13,75% e a inflação em 4,58%, o juro real, a diferença entre os dois, fica perto de 8,8% ao ano. É isso que importa para o patrimônio: o quanto a aplicação rende acima da perda de poder de compra, e não o número bruto do extrato.',
        'Num ciclo de cortes, o rendimento das aplicações pós-fixadas, atreladas ao CDI, cai aos poucos a cada reunião do Copom. Já os títulos prefixados e os atrelados à inflação têm o preço ajustado todos os dias conforme as expectativas de juros. Quem precisa resgatar antes do vencimento pode ganhar ou perder com essa marcação a mercado.',
        'Semanas de eleição costumam concentrar oscilações de câmbio e de bolsa. Elas dizem muito sobre o humor do mercado e pouco sobre o valor de longo prazo dos ativos. Decisões estruturais de patrimônio não deveriam depender do resultado de uma semana.'
      ],

      // O que observar no seu patrimônio: perguntas, não ordens.
      observar: {
        rendaFixa: 'Quanto do que você tem em pós-fixado vence ou será resgatado nos próximos anos, e a que taxa será reinvestido.',
        acoes: 'Se a parcela em bolsa ainda corresponde ao seu horizonte, independentemente da oscilação da semana.',
        exterior: 'Se a exposição a outras moedas é definida como percentual do patrimônio, e não pela cotação do dia.',
        imoveis: 'Os juros do financiamento acompanham a Selic com atraso. Quem pensa em comprar pode testar cenários no instrumento Alugar ou comprar.'
      },

      fontes: [
        { nome: 'Banco Central · Copom de 16/09/2026', url: 'https://www.bcb.gov.br/controleinflacao/historicotaxasjuros' },
        { nome: 'IBGE · IPCA de setembro de 2026', url: 'https://www.ibge.gov.br/explica/inflacao.php' },
        { nome: 'InfoMoney · fechamento de 19/10/2026', url: 'https://www.infomoney.com.br/mercados/ibovespa-hoje-bolsa-de-valores-ao-vivo-19102026/' }
      ]
    }

    /* MODELO PARA A PRÓXIMA EDIÇÃO: copie o bloco abaixo para o topo da lista,
       acima da edição atual, e coloque uma vírgula entre os blocos.

    {
      id: 'AAAA-MM-DD',
      titulo: '',
      data: '',
      categoria: 'Juros e inflação',   // ou: Câmbio e exterior · Bolsa · Imóveis · Sucessão · Impostos
      leitura: '3 min',
      autoria: 'Leonardo Arruda',
      destaque: { valor: '', rotulo: '', texto: '' },
      resumo: ['', '', ''],
      analise: ['', ''],
      observar: { rendaFixa: '', acoes: '', exterior: '', imoveis: '' },
      fontes: [{ nome: '', url: '' }]
    }
    */
  ];

  var EDITORIAL_DATA = { semana: semana, edicoes: edicoes };

  root.EDITORIAL_DATA = EDITORIAL_DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = EDITORIAL_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
