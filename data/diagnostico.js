/* ==========================================================================
   DIAGNÓSTICO PATRIMONIAL · perguntas, faixas e orientações
   --------------------------------------------------------------------------
   Cinco dimensões, duas perguntas cada. Cada resposta vale de 0 a 100; a
   nota da dimensão é a média das duas, e a nota final é a média das cinco.

   Para editar: troque os textos entre aspas. Mantenha 4 opções por pergunta,
   em ordem crescente de maturidade (0, 35, 70, 100).

   Referência de formato: Índice de Saúde Financeira do Brasileiro
   (Febraban / Banco Central), que mede o dia a dia financeiro. Este
   diagnóstico mede outra coisa: a estrutura do patrimônio.
   ========================================================================== */

(function (root) {
  'use strict';

  var DIAGNOSTICO = {

    dimensoes: [
      {
        id: 'custos',
        nome: 'Custos e conflito de interesse',
        capitulo: { nome: 'O custo invisível', href: 'index.html#custo' },
        instrumento: { nome: 'O custo das taxas', href: 'instrumentos.html#taxas' },
        orientacao: 'Some todas as taxas que você paga e compare com uma carteira de custo de referência. Pergunte, por escrito, como é remunerado quem recomenda os seus investimentos.',
        perguntas: [
          {
            texto: 'Você sabe quanto paga, somando todas as taxas, para manter os seus investimentos?',
            opcoes: [
              ['Não faço ideia', 0],
              ['Sei de algumas taxas, não do total', 35],
              ['Sei o total aproximado', 70],
              ['Sei o total e comparo com alternativas', 100]
            ]
          },
          {
            texto: 'Como é remunerado quem recomenda os seus investimentos?',
            opcoes: [
              ['Não sei', 0],
              ['Por comissão sobre os produtos ou metas da instituição', 35],
              ['Uma parte fixa e uma parte por produto', 70],
              ['Diretamente por mim, sem comissão por produto', 100]
            ]
          }
        ]
      },
      {
        id: 'diversificacao',
        nome: 'Diversificação e moeda',
        capitulo: { nome: 'O que a consultoria cobre', href: 'index.html#servicos' },
        instrumento: { nome: 'Comparador de renda fixa', href: 'instrumentos.html#renda-fixa' },
        orientacao: 'Defina que parcela do patrimônio deve ficar em outras moedas e reduza a dependência de um único ativo, seja um imóvel, uma empresa ou uma ação.',
        perguntas: [
          {
            texto: 'Que parte do seu patrimônio está fora do Brasil ou em outras moedas?',
            opcoes: [
              ['Nenhuma', 0],
              ['Só de forma indireta, por fundos ou BDRs no Brasil', 35],
              ['Alguma exposição direta, sem estratégia definida', 70],
              ['Uma parcela definida por estratégia e revisada', 100]
            ]
          },
          {
            texto: 'Quanto do seu patrimônio está em um único ativo (um imóvel, uma empresa, uma ação)?',
            opcoes: [
              ['Mais de 70%', 0],
              ['Entre 40% e 70%', 35],
              ['Entre 20% e 40%', 70],
              ['Menos de 20%', 100]
            ]
          }
        ]
      },
      {
        id: 'liquidez',
        nome: 'Liquidez e reserva',
        capitulo: { nome: 'O que a consultoria cobre', href: 'index.html#servicos' },
        instrumento: { nome: 'O custo da sucessão', href: 'instrumentos.html#sucessao' },
        orientacao: 'Separe uma reserva com valor e regra definidos, em aplicações de resgate rápido, antes de pensar em rentabilidade.',
        perguntas: [
          {
            texto: 'Por quantos meses você manteria o seu padrão de vida sem renda, usando só aplicações de resgate rápido?',
            opcoes: [
              ['Menos de 3 meses', 0],
              ['De 3 a 6 meses', 35],
              ['De 6 a 12 meses', 70],
              ['Mais de 12 meses', 100]
            ]
          },
          {
            texto: 'A sua reserva de emergência fica separada dos investimentos de longo prazo?',
            opcoes: [
              ['Não tenho reserva', 0],
              ['Tenho, mas misturada com o resto', 35],
              ['Separada, mas sem regra de uso', 70],
              ['Separada, com valor e regra definidos', 100]
            ]
          }
        ]
      },
      {
        id: 'tributacao',
        nome: 'Eficiência tributária',
        capitulo: { nome: 'O que a consultoria cobre', href: 'index.html#servicos' },
        instrumento: { nome: 'Comparador de renda fixa', href: 'instrumentos.html#renda-fixa' },
        orientacao: 'Inclua o imposto em cada decisão: prazo, tipo de produto e modelo de previdência mudam o que sobra no fim.',
        perguntas: [
          {
            texto: 'Os seus investimentos são escolhidos considerando o imposto?',
            opcoes: [
              ['Nunca pensei nisso', 0],
              ['Às vezes', 35],
              ['Na maioria das decisões', 70],
              ['Sempre, com planejamento anual', 100]
            ]
          },
          {
            texto: 'Você sabe qual modelo de previdência (PGBL ou VGBL) faz sentido para a sua declaração de imposto?',
            opcoes: [
              ['Não sei', 0],
              ['Tenho previdência, mas não sei se é o modelo certo', 35],
              ['Sei, mas não revisei recentemente', 70],
              ['Sei e reviso com um profissional', 100]
            ]
          }
        ]
      },
      {
        id: 'sucessao',
        nome: 'Sucessão e proteção',
        capitulo: { nome: 'O que a consultoria cobre', href: 'index.html#servicos' },
        instrumento: { nome: 'O custo da sucessão', href: 'instrumentos.html#sucessao' },
        orientacao: 'Organize um inventário do que existe e planeje a sucessão em vida, com os profissionais jurídicos da família, enquanto há tempo para decidir com calma.',
        perguntas: [
          {
            texto: 'Se algo acontecesse com você amanhã, a sua família saberia o que existe e onde está?',
            opcoes: [
              ['Não', 0],
              ['Em parte', 35],
              ['Sim, mas sem documentos organizados', 70],
              ['Sim, com tudo documentado', 100]
            ]
          },
          {
            texto: 'Existe planejamento sucessório (testamento, holding, seguro de vida, previdência com beneficiários)?',
            opcoes: [
              ['Nenhum', 0],
              ['Já pensei, mas não fiz', 35],
              ['Algum instrumento isolado', 70],
              ['Um plano completo e revisado', 100]
            ]
          }
        ]
      }
    ],

    // Faixas da nota final, da menor para a maior.
    faixas: [
      { ate: 39, nome: 'Estrutura frágil', texto: 'Há pontos que podem custar caro em um imprevisto. A boa notícia: são os mais rápidos de corrigir.' },
      { ate: 64, nome: 'Estrutura em construção', texto: 'A base existe, mas ainda depende de decisões isoladas. Falta coordenar as frentes.' },
      { ate: 84, nome: 'Estrutura sólida', texto: 'O patrimônio está bem organizado. Os ajustes que restam costumam ser os de maior valor.' },
      { ate: 100, nome: 'Estrutura madura', texto: 'Um patrimônio bem coordenado. O trabalho aqui é de acompanhamento e revisão.' }
    ]
  };

  root.DIAGNOSTICO = DIAGNOSTICO;
  if (typeof module !== 'undefined' && module.exports) module.exports = DIAGNOSTICO;
})(typeof window !== 'undefined' ? window : globalThis);
