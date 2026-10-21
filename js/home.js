/* ==========================================================================
   LEONARDO ARRUDA · PÁGINA INICIAL
   Palco de telas (uma por vez) e o gráfico do custo invisível.
   ========================================================================== */
(function () {
  'use strict';

  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- O custo invisível ---------- */

  function initCusto() {
    var C = window.Calculos, P = window.PREMISSAS;
    var alvo = document.getElementById('hm-custo-valor');
    if (!C || !P || !alvo) return;

    var ANOS = 20, BRUTA = 10;
    var custoBanco = P.custos.bancoTipico, custoRef = P.custos.referencia;
    var base = document.getElementById('hm-custo-base');
    var gap = document.getElementById('hm-gap');
    var ref = document.getElementById('hm-ref');
    var bank = document.getElementById('hm-bank');
    var refFim = document.getElementById('hm-ref-fim');
    var bankFim = document.getElementById('hm-bank-fim');
    var atual = 0;

    function curto(v) {
      if (v >= 1e6) {
        var mi = v / 1e6;
        var txt = mi.toLocaleString('pt-BR', { maximumFractionDigits: mi >= 10 ? 0 : 1 });
        return 'R$ ' + txt + (mi < 2 ? ' milhão' : ' milhões');
      }
      return 'R$ ' + Math.round(v / 1000).toLocaleString('pt-BR') + ' mil';
    }

    function serie(inicial, custo) {
      var taxa = C.liquidaDeCusto(BRUTA, custo), pts = [];
      for (var a = 0; a <= ANOS; a++) pts.push(C.valorFuturo(inicial, 0, taxa, a * 12));
      return pts;
    }

    function desenhar(inicial) {
      var r = serie(inicial, custoRef), b = serie(inicial, custoBanco);
      var max = r[ANOS], min = inicial, W = 600, H = 360, pad = 8;
      function x(i) { return (i / ANOS) * W; }
      function y(v) { return H - pad - ((v - min) / (max - min)) * (H - pad * 2); }
      function linha(s) { return s.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' '); }
      ref.setAttribute('d', linha(r));
      bank.setAttribute('d', linha(b));
      var volta = b.slice().reverse().map(function (v, i) { return 'L' + x(ANOS - i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' ');
      gap.setAttribute('d', linha(r) + ' ' + volta + ' Z');
      refFim.textContent = curto(r[ANOS]);
      bankFim.textContent = curto(b[ANOS]);
    }

    function contar(de, para) {
      if (reduz) { alvo.textContent = curto(para); return; }
      var t0 = performance.now(), dur = 700;
      (function passo(t) {
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        alvo.textContent = curto(de + (para - de) * e);
        if (k < 1) requestAnimationFrame(passo);
      })(t0);
    }

    function escolher(inicial) {
      var d = C.custoDasTaxas({ inicial: inicial, aporte: 0, anos: ANOS, bruta: BRUTA,
        custoAtual: custoBanco, custoReferencia: custoRef }).diferenca;
      base.textContent = curto(inicial);
      desenhar(inicial);
      contar(atual, d);
      atual = d;
    }

    var chips = document.querySelectorAll('.hm-chips button');
    chips.forEach(function (bt) {
      bt.addEventListener('click', function () {
        chips.forEach(function (o) { o.setAttribute('aria-pressed', String(o === bt)); });
        escolher(Number(bt.dataset.valor));
      });
    });
    escolher(1e6);
  }

  /* ---------- Notas do consultor (data/filosofia.js) ---------- */

  function initNotas() {
    var notas = (window.FILOSOFIA && window.FILOSOFIA.notas) || {};
    Object.keys(notas).forEach(function (id) {
      var texto = (notas[id] || '').trim();
      var tela = document.getElementById(id);
      var alvo = tela && tela.querySelector('.hm-copy, .hm-next-copy, .hm-end');
      if (!texto || !alvo) return;
      var fig = document.createElement('figure');
      fig.className = 'hm-quote';
      var bq = document.createElement('blockquote');
      bq.textContent = texto;
      var cap = document.createElement('figcaption');
      cap.textContent = 'Leonardo Arruda';
      fig.appendChild(bq);
      fig.appendChild(cap);
      alvo.appendChild(fig);
    });
  }

  /* ---------- Palco ---------- */

  function initStage() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hm-slide'));
    if (!slides.length) return;
    var dots = Array.prototype.slice.call(document.querySelectorAll('#hm-dots a'));
    var count = document.getElementById('hm-count');
    var label = document.getElementById('hm-label');
    var prevBt = document.querySelector('.hm-arrows [data-go="prev"]');
    var nextBt = document.querySelector('.hm-arrows [data-go="next"]');
    var ids = slides.map(function (s) { return s.id; });
    var atual = -1, trava = 0;

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function go(i, opt) {
      opt = opt || {};
      i = Math.max(0, Math.min(slides.length - 1, i));
      if (i === atual) return;
      atual = i;
      slides.forEach(function (s, k) {
        var ativo = k === i;
        s.classList.toggle('is-active', ativo);
        s.classList.toggle('is-before', k < i);
        s.inert = !ativo;
        s.setAttribute('aria-hidden', String(!ativo));
        if (ativo) s.scrollTop = 0;
      });
      dots.forEach(function (d, k) {
        if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
        d.classList.toggle('is-done', k < i);
      });
      count.textContent = pad(i + 1) + ' / ' + pad(slides.length);
      label.textContent = slides[i].dataset.label || '';
      prevBt.disabled = i === 0;
      nextBt.disabled = i === slides.length - 1;
      var hash = i === 0 ? location.pathname + location.search : '#' + ids[i];
      if (!opt.fromHash) history.replaceState(null, '', hash);
      if (opt.focus) {
        var h = slides[i].querySelector('h1, h2');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      }
    }

    function next() { go(atual + 1); }
    function prev() { go(atual - 1); }

    document.addEventListener('click', function (e) {
      var g = e.target.closest('[data-go]');
      if (g) { e.preventDefault(); g.dataset.go === 'next' ? next() : prev(); return; }
      var a = e.target.closest('a[href^="#"]');
      if (a) {
        var k = ids.indexOf(a.getAttribute('href').slice(1));
        if (k > -1) { e.preventDefault(); go(k, { focus: a.classList.contains('hm-skip') }); }
      }
    });

    window.addEventListener('hashchange', function () {
      var k = ids.indexOf(location.hash.slice(1));
      if (k > -1) go(k, { fromHash: true });
    });

    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      var k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && t.tagName !== 'BUTTON' && t.tagName !== 'A')) { e.preventDefault(); next(); }
      else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev(); }
      else if (k === 'Home') { e.preventDefault(); go(0); }
      else if (k === 'End') { e.preventDefault(); go(slides.length - 1); }
    });

    // A tela atual pode rolar por dentro em telas pequenas: só troca de
    // tela quando a rolagem interna chegou ao fim naquela direção.
    function podeRolar(dir) {
      var s = slides[atual];
      if (s.scrollHeight <= s.clientHeight + 2) return false;
      return dir > 0 ? s.scrollTop + s.clientHeight < s.scrollHeight - 2 : s.scrollTop > 2;
    }

    var acum = 0;
    window.addEventListener('wheel', function (e) {
      var dir = e.deltaY > 0 ? 1 : -1;
      if (podeRolar(dir)) return;
      e.preventDefault();
      if (Date.now() < trava) return;
      acum += e.deltaY;
      if (Math.abs(acum) > 40) {
        acum = 0; trava = Date.now() + 900;
        dir > 0 ? next() : prev();
      }
    }, { passive: false });

    var y0 = null, x0 = null, rolavel = false;
    window.addEventListener('touchstart', function (e) {
      y0 = e.touches[0].clientY; x0 = e.touches[0].clientX;
      var s = slides[atual]; rolavel = s.scrollHeight > s.clientHeight + 2;
    }, { passive: true });
    window.addEventListener('touchend', function (e) {
      if (y0 === null) return;
      var dy = y0 - e.changedTouches[0].clientY, dx = x0 - e.changedTouches[0].clientX;
      y0 = null;
      if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) {
        var dir = dy > 0 ? 1 : -1;
        if (rolavel && podeRolar(dir)) return;
        dir > 0 ? next() : prev();
      } else if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        dx > 0 ? next() : prev();
      }
    }, { passive: true });

    var inicio = ids.indexOf(location.hash.slice(1));
    go(inicio > -1 ? inicio : 0, { fromHash: true });
    window.Home = { go: go, atual: function () { return ids[atual]; } };
  }

  initNotas();
  initCusto();
  initStage();
})();
