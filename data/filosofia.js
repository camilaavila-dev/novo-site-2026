/* ==========================================================================
   A FILOSOFIA DO LEONARDO · texto editável, sem código
   --------------------------------------------------------------------------
   Este arquivo é só texto. Para mudar o que aparece no site:
   - troque o que está entre aspas simples '...';
   - para esconder um item, deixe as aspas vazias: '';
   - não apague vírgulas nem chaves.

   Todo o conteúdo abaixo foi tirado do site institucional já aprovado.
   Revise com calma: é a voz do Leo.
   ========================================================================== */

(function (root) {
  'use strict';

  var FILOSOFIA = {

    /* ----------------------------------------------------------------------
       PRINCÍPIOS · aparecem na versão ilustrada (jornada.html), em "Como eu trabalho".
       Pode ter de 2 a 6. Para tirar um, apague o bloco { ... } inteiro.
       ---------------------------------------------------------------------- */
    principios: [
      {
        titulo: 'Clareza, não promessas',
        texto: 'Uma carreira construída sobre clareza, e não sobre promessas de rentabilidade.'
      },
      {
        titulo: 'Entender antes de agir',
        texto: 'A maioria das carteiras erradas começa no diagnóstico que nunca aconteceu.'
      },
      {
        titulo: 'Do seu lado da mesa',
        texto: 'Remunerado por você, não pelo produto. A recomendação não depende de comissão.'
      },
      {
        titulo: 'Uma parceria de décadas',
        texto: 'Não uma venda pontual com meta de trimestre, mas presença em cada decisão relevante.'
      }
    ],

    /* ----------------------------------------------------------------------
       NOTAS DO CONSULTOR · uma frase curta, assinada, em cada tela da
       página inicial. Deixe '' (vazio) onde não quiser nota.
       ---------------------------------------------------------------------- */
    notas: {
      'inicio': '',
      'custo': '',
      'modelo': '',
      'servicos': '',
      'midia': '',
      'quem': 'O objetivo não é fazer mais barulho. É tomar decisões melhores com o patrimônio que você construiu.',
      'comecar': ''
    }
  };

  root.FILOSOFIA = FILOSOFIA;
  if (typeof module !== 'undefined' && module.exports) module.exports = FILOSOFIA;
})(typeof window !== 'undefined' ? window : globalThis);
