/* ==========================================================================
   LEITURA SEMANAL · monta a página a partir de data/editorial.js
   --------------------------------------------------------------------------
   Faixa de indicadores, a edição em formato de newsletter (número da
   semana, resumo em um minuto, leitura completa, o que observar e fontes)
   e o arquivo de edições anteriores, com filtro quando houver mais de um tema.
   ========================================================================== */

(function () {
  'use strict';

  var E = window.EDITORIAL_DATA;
  if (!E) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function byId(id) { return document.getElementById(id); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ------------------------------------------------------------------------
     Indicadores
     ------------------------------------------------------------------------ */
  var s = E.semana || {};
  if (s.data) byId('lw-data').textContent = 'Semana de ' + s.data;
  if (s.resumo) byId('lw-resumo').textContent = s.resumo;
  byId('lw-indicadores').innerHTML = (s.indicadores || []).map(function (it) {
    return '<div><dt>' + esc(it.nome) + '</dt><dd><strong>' + esc(it.valor) + '</strong>' +
      '<small>' + esc(it.nota) + (it.fonte ? ' · ' + esc(it.fonte) : '') + '</small></dd></div>';
  }).join('');

  /* ------------------------------------------------------------------------
     Edição
     ------------------------------------------------------------------------ */
  var edicoes = (E.edicoes || []).filter(function (e) { return e && e.titulo; });
  var total = edicoes.length;

  var OBSERVAR = [
    ['rendaFixa', 'Renda fixa'],
    ['acoes', 'Ações'],
    ['exterior', 'Exterior e câmbio'],
    ['imoveis', 'Imóveis']
  ];

  function numero(e) { return total - edicoes.indexOf(e); }

  function edicaoHTML(e) {
    var d = e.destaque && e.destaque.valor ? e.destaque : null;
    var resumo = (e.resumo || []).filter(Boolean);
    var analise = (e.analise || []).filter(Boolean);
    var observar = OBSERVAR.filter(function (o) { return e.observar && e.observar[o[0]]; });
    var fontes = (e.fontes || []).filter(function (f) { return f && f.nome; });

    return '<article class="lw-edition" id="ed-' + esc(e.id) + '" data-categoria="' + esc(e.categoria) + '" aria-labelledby="ed-' + esc(e.id) + '-t">' +
      '<header class="lw-ed-head">' +
        '<p class="lw-meta"><span class="lw-tag">' + esc(e.categoria) + '</span><span>' + esc(e.data) + '</span><span>' + esc(e.leitura) + ' de leitura</span></p>' +
        '<h1 class="lw-title" id="ed-' + esc(e.id) + '-t">' + esc(e.titulo) + '</h1>' +
        (e.autoria ? '<p class="lw-byline">' + esc(e.autoria) + '</p>' : '') +
      '</header>' +

      (d ? '<figure class="lw-stat"><p class="lw-stat-num">' + esc(d.valor) + '</p>' +
        '<figcaption><strong>' + esc(d.rotulo) + '</strong>' + (d.texto ? '<span>' + esc(d.texto) + '</span>' : '') + '</figcaption></figure>' : '') +

      (resumo.length ? '<section class="lw-brief" aria-label="Resumo em um minuto"><p class="lw-label">Em 1 minuto</p><ol>' +
        resumo.map(function (b, i) { return '<li><span>' + pad(i + 1) + '</span><p>' + esc(b) + '</p></li>'; }).join('') + '</ol></section>' : '') +

      (analise.length ? '<section class="lw-body" aria-label="Leitura completa"><p class="lw-label">A leitura completa</p>' +
        analise.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</section>' : '') +

      (observar.length ? '<section class="lw-observe" aria-label="O que observar no seu patrimônio"><p class="lw-label">O que observar no seu patrimônio</p><ul>' +
        observar.map(function (o) {
          return '<li><svg class="lw-observe-i" aria-hidden="true"><use href="#o-' + o[0] + '"/></svg><strong>' + esc(o[1]) + '</strong><p>' + esc(e.observar[o[0]]) + '</p></li>';
        }).join('') + '</ul></section>' : '') +

      (fontes.length ? '<footer class="lw-sources"><p class="lw-label">Fontes</p><ol>' + fontes.map(function (f) {
        return '<li>' + (f.url ? '<a href="' + esc(f.url) + '" target="_blank" rel="noopener">' + esc(f.nome) + '</a>' : esc(f.nome)) + '</li>';
      }).join('') + '</ol></footer>' : '') +
    '</article>';
  }

  /* ------------------------------------------------------------------------
     Arquivo e filtro
     ------------------------------------------------------------------------ */
  var lista = byId('lw-edicoes');
  var arquivo = byId('lw-arquivo');
  var arquivoBox = byId('lw-arquivo-box');
  var filtros = byId('lw-filtros');
  var tema = null;

  function mostrar(e) {
    lista.innerHTML = e ? edicaoHTML(e) : '<p>Nenhuma edição publicada ainda.</p>';
    byId('lw-num').textContent = e ? 'Nº ' + numero(e) : '';
    var outras = edicoes.filter(function (x) { return !tema || x.categoria === tema; });
    arquivo.innerHTML = outras.map(function (x) {
      return '<li><a href="#ed-' + esc(x.id) + '"' + (x === e ? ' aria-current="true"' : '') + '>' +
        '<span>Nº ' + numero(x) + ' · ' + esc(x.data) + '</span><strong>' + esc(x.titulo) + '</strong></a></li>';
    }).join('');
    arquivoBox.hidden = total < 2;
  }

  function pelaAncora(rolar) {
    var id = decodeURIComponent(location.hash.replace(/^#ed-/, ''));
    var e = edicoes.filter(function (x) { return x.id === id; })[0] || edicoes[0];
    mostrar(e);
    if (rolar && e) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  var temas = edicoes.map(function (e) { return e.categoria; }).filter(function (c, i, a) { return c && a.indexOf(c) === i; });
  if (temas.length > 1) {
    filtros.innerHTML = ['Todas'].concat(temas).map(function (t, i) {
      return '<button type="button" data-tema="' + (i ? esc(t) : '') + '" aria-pressed="' + (i === 0) + '">' + esc(t) + '</button>';
    }).join('');
    filtros.hidden = false;
    Array.prototype.forEach.call(filtros.querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(filtros.querySelectorAll('button'), function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        tema = b.getAttribute('data-tema') || null;
        pelaAncora(false);
      });
    });
  }

  window.addEventListener('hashchange', function () { pelaAncora(true); });
  pelaAncora(false);
})();
