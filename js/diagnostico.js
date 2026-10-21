/* ==========================================================================
   DIAGNÓSTICO PATRIMONIAL · interface do questionário
   --------------------------------------------------------------------------
   Perguntas em data/diagnostico.js, pontuação em js/calculos.js.
   Uma pergunta por vez, com voltar; as respostas ficam só na memória da
   página (nada é enviado nem gravado).
   ========================================================================== */

(function () {
  'use strict';

  var D = window.DIAGNOSTICO;
  var C = window.Calculos;
  var root = document.getElementById('jx-diag');
  if (!D || !C || !root) return;

  var FORM = 'https://forms.office.com/Pages/ResponsePage.aspx?id=6ez5YgM1m0G2Yyy_xOsD25muVoj4MslItAJalz086_lURDhJV1Y0QlVaUTZFV0RORUZMMUg2S1NKTi4u';

  // Lista plana de perguntas, cada uma sabendo a sua dimensão.
  var perguntas = [];
  D.dimensoes.forEach(function (d) {
    d.perguntas.forEach(function (q, i) {
      perguntas.push({ dim: d, idx: i, texto: q.texto, opcoes: q.opcoes });
    });
  });

  var respostas = new Array(perguntas.length).fill(null);
  var atual = 0;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function focarTitulo() {
    var h = root.querySelector('[data-foco]');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    var top = root.getBoundingClientRect().top + window.scrollY - 96;
    if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top: top, behavior: 'smooth' });
  }

  /* ------------------------------------------------------------------------
     Pergunta
     ------------------------------------------------------------------------ */
  function renderPergunta() {
    var q = perguntas[atual];
    var total = perguntas.length;
    var nome = 'q' + atual;

    root.innerHTML =
      '<div class="jx-diag-card">' +
        '<div class="jx-diag-progress">' +
          '<span>Pergunta ' + (atual + 1) + ' de ' + total + ' · ' + esc(q.dim.nome) + '</span>' +
          '<div class="jx-diag-bar" role="progressbar" aria-label="Progresso do diagnóstico" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + atual + '">' +
            '<span style="width:' + (atual / total * 100) + '%"></span>' +
          '</div>' +
        '</div>' +
        '<fieldset class="jx-diag-q">' +
          '<legend data-foco>' + esc(q.texto) + '</legend>' +
          q.opcoes.map(function (o, i) {
            var id = nome + '-' + i;
            var marcado = respostas[atual] === o[1] ? ' checked' : '';
            return '<label class="jx-diag-opt" for="' + id + '">' +
              '<input type="radio" name="' + nome + '" id="' + id + '" value="' + o[1] + '"' + marcado + '>' +
              '<span class="jx-diag-letter">' + String.fromCharCode(65 + i) + '</span>' +
              '<span class="jx-diag-opt-text">' + esc(o[0]) + '</span>' +
            '</label>';
          }).join('') +
        '</fieldset>' +
        '<div class="jx-diag-nav">' +
          (atual > 0
            ? '<button type="button" class="jx-btn jx-btn-ghost" data-acao="voltar"><svg class="jx-i" aria-hidden="true"><use href="#i-arrow-l"/></svg>Voltar</button>'
            : '<span></span>') +
          '<button type="button" class="jx-btn jx-btn-primary" data-acao="avancar"' + (respostas[atual] === null ? ' disabled' : '') + '>' +
            (atual === total - 1 ? 'Ver o resultado' : 'Próxima') +
            '<svg class="jx-i" aria-hidden="true"><use href="#i-arrow-r"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';

    var avancar = root.querySelector('[data-acao="avancar"]');
    var voltar = root.querySelector('[data-acao="voltar"]');

    Array.prototype.forEach.call(root.querySelectorAll('input[type="radio"]'), function (r) {
      r.addEventListener('change', function () {
        respostas[atual] = parseFloat(r.value);
        avancar.disabled = false;
      });
      // Clique ou Enter numa opção já escolhida avança, para quem quer ir rápido.
      r.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); if (respostas[atual] !== null) proxima(); }
      });
    });

    avancar.addEventListener('click', proxima);
    if (voltar) voltar.addEventListener('click', function () { atual -= 1; renderPergunta(); focarTitulo(); });
  }

  function proxima() {
    if (respostas[atual] === null) return;
    if (atual < perguntas.length - 1) { atual += 1; renderPergunta(); }
    else renderResultado();
    focarTitulo();
  }

  /* ------------------------------------------------------------------------
     Resultado
     ------------------------------------------------------------------------ */
  function calcular() {
    var porDim = {};
    perguntas.forEach(function (q, i) {
      (porDim[q.dim.id] = porDim[q.dim.id] || []).push(respostas[i]);
    });
    return C.pontuarDiagnostico(porDim, D);
  }

  function resumoTexto(r) {
    var linhas = [
      'Diagnóstico patrimonial · nota ' + r.nota + ' de 100 · ' + r.faixa.nome,
      ''
    ];
    r.dimensoes.forEach(function (d) { linhas.push('- ' + d.nome + ': ' + d.nota); });
    if (r.lacunas.length) {
      linhas.push('');
      linhas.push('Pontos que mais pedem atenção: ' + r.lacunas.map(function (l) { return l.nome; }).join(' e ') + '.');
    }
    return linhas.join('\n');
  }

  function renderResultado() {
    var r = calcular();

    var barras = r.dimensoes.map(function (d) {
      return '<li>' +
        '<div class="jx-dim-head"><span>' + esc(d.nome) + '</span><strong>' + d.nota + '</strong></div>' +
        '<meter min="0" max="100" low="40" high="65" optimum="100" value="' + d.nota + '" aria-label="' + esc(d.nome) + ': ' + d.nota + ' de 100"></meter>' +
      '</li>';
    }).join('');

    var lacunas = r.lacunas.length
      ? r.lacunas.map(function (l) {
          var def = l.def;
          return '<article class="jx-gap">' +
            '<p class="jx-label">' + esc(def.nome) + ' · ' + l.nota + ' de 100</p>' +
            '<p>' + esc(def.orientacao) + '</p>' +
            '<p class="jx-gap-links">' +
              '<a href="' + esc(def.capitulo.href) + '">' + esc(def.capitulo.nome) + '</a>' +
              '<a href="' + esc(def.instrumento.href) + '">Calculadora: ' + esc(def.instrumento.nome) + '</a>' +
            '</p>' +
          '</article>';
        }).join('')
      : '<p class="jx-text">Nenhuma dimensão abaixo de 85. O trabalho aqui é de acompanhamento e revisão periódica.</p>';

    root.innerHTML =
      '<div class="jx-diag-card jx-diag-result">' +
        '<div class="jx-diag-score">' +
          '<p class="jx-label">Sua nota</p>' +
          '<p class="jx-diag-num" data-foco><strong>' + r.nota + '</strong><span>de 100</span></p>' +
          '<p class="jx-diag-band">' + esc(r.faixa.nome) + '</p>' +
          '<p class="jx-text">' + esc(r.faixa.texto) + '</p>' +
        '</div>' +
        '<ul class="jx-dims">' + barras + '</ul>' +
      '</div>' +

      '<div class="jx-diag-next">' +
        '<p class="jx-label">' + (r.lacunas.length ? 'Por onde começar' : 'Resultado') + '</p>' +
        lacunas +
      '</div>' +

      '<div class="jx-callout jx-diag-cta">' +
        '<p class="jx-label">Levar o diagnóstico para a conversa</p>' +
        '<p>Copie o resumo e cole no formulário de agendamento. A conversa começa de onde o diagnóstico parou.</p>' +
        '<div class="jx-actions">' +
          '<button type="button" class="jx-btn jx-btn-ghost" data-acao="copiar"><svg class="jx-i" aria-hidden="true"><use href="#i-copy"/></svg><span>Copiar o resumo</span></button>' +
          '<a class="jx-btn jx-btn-cta" href="' + FORM + '" target="_blank" rel="noopener">Agendar a conversa<svg class="jx-i" aria-hidden="true"><use href="#i-out"/></svg></a>' +
          '<button type="button" class="jx-btn jx-btn-link" data-acao="refazer">Refazer o diagnóstico</button>' +
        '</div>' +
        '<textarea class="jx-diag-copy" readonly aria-label="Resumo do diagnóstico">' + esc(resumoTexto(r)) + '</textarea>' +
      '</div>';

    var copiar = root.querySelector('[data-acao="copiar"]');
    var area = root.querySelector('.jx-diag-copy');
    copiar.addEventListener('click', function () {
      var label = copiar.querySelector('span');
      function feito() { label.textContent = 'Resumo copiado'; setTimeout(function () { label.textContent = 'Copiar o resumo'; }, 2400); }
      function manual() { area.classList.add('is-visible'); area.focus(); area.select(); label.textContent = 'Selecionado: use Ctrl+C'; }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(area.value).then(feito, manual);
      } else {
        try { area.classList.add('is-visible'); area.select(); if (document.execCommand('copy')) feito(); else manual(); }
        catch (e) { manual(); }
      }
    });

    root.querySelector('[data-acao="refazer"]').addEventListener('click', function () {
      respostas = new Array(perguntas.length).fill(null);
      atual = 0;
      renderIntro();
      focarTitulo();
    });

    // Exposto para os testes.
    window.__diagnostico = r;
  }

  /* ------------------------------------------------------------------------
     Abertura
     ------------------------------------------------------------------------ */
  function renderIntro() {
    root.innerHTML =
      '<div class="jx-diag-card jx-diag-intro">' +
        '<p class="jx-label" data-foco>Cinco dimensões</p>' +
        '<ol class="jx-diag-dims">' +
          D.dimensoes.map(function (d) { return '<li>' + esc(d.nome) + '</li>'; }).join('') +
        '</ol>' +
        '<button type="button" class="jx-btn jx-btn-primary jx-btn-lg" data-acao="comecar">Começar o diagnóstico<svg class="jx-i" aria-hidden="true"><use href="#i-arrow-r"/></svg></button>' +
      '</div>';
    root.querySelector('[data-acao="comecar"]').addEventListener('click', function () {
      renderPergunta();
      focarTitulo();
    });
  }

  renderIntro();
})();
