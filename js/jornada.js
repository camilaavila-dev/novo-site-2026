/* ==========================================================================
   LEONARDO ARRUDA · A JORNADA DO INVESTIMENTO
   --------------------------------------------------------------------------
   Página inicial em modo "uma tela": um capítulo por vez, avançando pela
   barra de baixo, pelo teclado, pela roda do mouse ou deslizando o dedo. O
   conteúdo longo abre num painel por cima da cena.

   Também cuida, em todas as páginas, da barra superior, do perfil do
   visitante, das abas, da leitura da semana e das notas do consultor.
   As calculadoras vivem em js/instrumentos.js.
   Cada parte é independente: se uma falhar, as outras seguem.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function safely(name, fn) {
    try { fn(); } catch (err) {
      if (window.console) console.error('[jornada] ' + name + ':', err);
    }
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }

  /* ------------------------------------------------------------------------
     1. BARRA SUPERIOR E PROGRESSO (páginas que rolam)
     ------------------------------------------------------------------------ */
  function initTopbar() {
    if ($('.jx-stage')) return; // a página inicial não rola
    var top = $('.jx-top');
    var fill = $('#jx-progress-fill');
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (top) top.classList.toggle('is-scrolled', y > 24);
      if (fill) fill.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------------
     2. A JORNADA EM UMA TELA (página inicial)
     ------------------------------------------------------------------------ */
  var Stage = null;

  function initStage() {
    var stage = $('#jx-stage');
    if (!stage) return;

    var chapters = $$('.jx-ch', stage);
    var ids = chapters.map(function (c) { return c.id; });
    var trail = $$('.jx-trail a');
    var indexLinks = $$('.jx-index a');
    var prevBtn = $('.jx-hud [data-go="prev"]');
    var nextBtn = $('.jx-hud [data-go="next"]');
    var nextLabel = $('#jx-next-label');
    var current = -1;
    var lastMove = 0;

    function shortTitle(i) {
      var t = chapters[i].getAttribute('data-title') || '';
      return t.split(' · ').pop();
    }

    function go(i, opts) {
      opts = opts || {};
      i = Math.max(0, Math.min(chapters.length - 1, i));
      if (i === current) return;
      current = i;
      lastMove = Date.now();

      chapters.forEach(function (c, j) {
        var on = j === i;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-hidden', String(!on));
        // Capítulos fora da tela não recebem foco nem cliques.
        if (on) c.removeAttribute('inert'); else c.setAttribute('inert', '');
      });

      trail.forEach(function (a) {
        var j = ids.indexOf(a.getAttribute('data-target'));
        a.classList.toggle('is-active', j === i);
        a.classList.toggle('is-past', j < i);
        if (j === i) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
      });
      indexLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + ids[i]);
      });

      var title = chapters[i].getAttribute('data-title') || '';
      setText('jx-now-title', title);
      setText('jx-hud-title', title);
      setText('jx-hud-count', (i + 1) + ' de ' + chapters.length);
      document.title = shortTitle(i) + ' · A Jornada do Investimento · Leonardo Arruda';

      if (prevBtn) prevBtn.disabled = i === 0;
      if (nextBtn) {
        var last = i === chapters.length - 1;
        nextBtn.disabled = last;
        if (nextLabel) nextLabel.textContent = i === 0 ? 'Começar' : (last ? 'Fim da jornada' : shortTitle(i + 1));
        nextBtn.setAttribute('aria-label', last ? 'Fim da jornada' : 'Próximo capítulo: ' + shortTitle(i + 1));
      }

      // O endereço acompanha o capítulo, para o link poder ser compartilhado.
      if (!opts.fromHash) {
        try { history.replaceState(null, '', '#' + ids[i]); } catch (e) { /* file:// antigo */ }
      }

      // Foco no título para leitores de tela, sem rolar nada.
      if (opts.focus) {
        var h = chapters[i].querySelector('h1, h2');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      }
    }

    function next() { go(current + 1, { focus: true }); }
    function prev() { go(current - 1, { focus: true }); }

    function fromHash() {
      var id = decodeURIComponent((location.hash || '').slice(1));
      var i = ids.indexOf(id);
      return i < 0 ? 0 : i;
    }

    Stage = { go: go, next: next, prev: prev, get index() { return current; }, ids: ids };

    // Primeira tela: a do endereço, se houver.
    go(fromHash(), { fromHash: true });

    window.addEventListener('hashchange', function () { go(fromHash(), { fromHash: true, focus: true }); });

    // Links internos (#capitulo) mudam de tela sem rolar a página.
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.target) return;
      var id = a.getAttribute('href').slice(1);
      var i = ids.indexOf(id);
      if (i < 0) return;
      e.preventDefault();
      var index = $('#jx-index');
      if (index && index.matches && index.matches(':popover-open')) { try { index.hidePopover(); } catch (er) { /* fechado */ } }
      go(i, { focus: true });
    });

    $$('[data-go]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        if (b.getAttribute('data-go') === 'next') next(); else prev();
      });
    });

    function sheetOpen() { var s = $('#jx-sheet'); return !!(s && s.open); }

    function typing(el) {
      if (!el) return false;
      var t = el.tagName;
      return t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || el.isContentEditable;
    }

    // Teclado
    document.addEventListener('keydown', function (e) {
      if (sheetOpen() || typing(document.activeElement) || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target.closest && e.target.closest('[role="tablist"]')) return;
      var k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.target.closest('button, a'))) { e.preventDefault(); next(); }
      else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); prev(); }
      else if (k === 'Home') { e.preventDefault(); go(0, { focus: true }); }
      else if (k === 'End') { e.preventDefault(); go(chapters.length - 1, { focus: true }); }
    });

    // Um elemento que ainda pode rolar na direção do gesto fica com o gesto.
    function scrollable(el, dir) {
      while (el && el !== stage && el !== document.body) {
        if (el.scrollHeight > el.clientHeight + 2) {
          var oy = getComputedStyle(el).overflowY;
          if (oy === 'auto' || oy === 'scroll') {
            if (dir > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 2) return true;
            if (dir < 0 && el.scrollTop > 2) return true;
          }
        }
        el = el.parentElement;
      }
      return false;
    }

    // Roda do mouse e trackpad: um capítulo por gesto.
    var acc = 0;
    var accTimer = null;
    window.addEventListener('wheel', function (e) {
      if (sheetOpen()) return;
      var dy = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (scrollable(e.target, dy > 0 ? 1 : -1)) return;
      e.preventDefault();
      if (Date.now() - lastMove < 900) { acc = 0; return; }
      acc += dy;
      clearTimeout(accTimer);
      accTimer = setTimeout(function () { acc = 0; }, 220);
      if (acc > 60) { acc = 0; next(); }
      else if (acc < -60) { acc = 0; prev(); }
    }, { passive: false });

    // Toque: deslizar para o lado ou para cima e para baixo.
    var t0 = null;
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { t0 = null; return; }
      t0 = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now(), target: e.target };
    }, { passive: true });

    stage.addEventListener('touchend', function (e) {
      if (!t0) return;
      var p = e.changedTouches[0];
      var dx = p.clientX - t0.x;
      var dy = p.clientY - t0.y;
      var start = t0;
      t0 = null;
      if (Date.now() - start.t > 800) return;
      if (start.target.closest && start.target.closest('input[type="range"]')) return;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0) next(); else prev();
      } else if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.2) {
        var dir = dy < 0 ? 1 : -1;
        if (scrollable(start.target, dir)) return;
        if (dir > 0) next(); else prev();
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     3. PAINEL DE APROFUNDAMENTO
     Botões com data-sheet="id" abrem o bloco correspondente; data-tab
     escolhe a aba inicial (os quatro pilares).
     ------------------------------------------------------------------------ */
  function initSheet() {
    var sheet = $('#jx-sheet');
    if (!sheet || typeof sheet.showModal !== 'function') return;
    var parts = $$('.jx-sheet-part', sheet);
    var body = $('.jx-sheet-body', sheet);
    var opener = null;

    function open(id, tab, from) {
      var part = document.getElementById(id);
      if (!part) return;
      parts.forEach(function (p) { p.hidden = p !== part; });
      setText('jx-sheet-kicker', part.getAttribute('data-kicker') || '');
      setText('jx-sheet-title', part.getAttribute('data-heading') || '');
      if (tab !== null && tab !== undefined) {
        var t = $$('[role="tab"]', part)[Number(tab)];
        if (t) t.click();
      }
      opener = from || null;
      if (!sheet.open) sheet.showModal();
      body.scrollTop = 0;
      var close = $('[data-sheet-close]', sheet);
      if (close) close.focus({ preventScroll: true });
    }

    function close() { if (sheet.open) sheet.close(); }

    $$('[data-sheet]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        open(b.getAttribute('data-sheet'), b.getAttribute('data-tab'), b);
      });
    });

    $$('[data-sheet-close]', sheet).forEach(function (b) { b.addEventListener('click', close); });

    // Clique fora do painel (no fundo escurecido) fecha.
    sheet.addEventListener('click', function (e) {
      var r = sheet.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
    });

    sheet.addEventListener('close', function () {
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
      opener = null;
    });

    window.JornadaPainel = { open: open, close: close };
  }

  /* ------------------------------------------------------------------------
     4. PARTÍCULAS DE LUZ NAS CENAS
     ------------------------------------------------------------------------ */
  function initScenes() {
    if (reduceMotion) return;
    $$('.jx-scene').forEach(function (scene, s) {
      var layer = document.createElement('div');
      layer.className = 'jx-motes';
      layer.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < 9; i++) {
        var m = document.createElement('span');
        m.className = 'jx-mote';
        var seed = (s * 9 + i) * 137.508;
        m.style.left = (40 + (seed % 56)) + '%';
        m.style.top = (45 + ((seed * 1.7) % 50)) + '%';
        m.style.setProperty('--d', (11 + (i % 5) * 3) + 's');
        m.style.setProperty('--delay', ((i * 1.9) % 12) + 's');
        m.style.setProperty('--dx', (((i % 5) - 2) * 18) + 'px');
        layer.appendChild(m);
      }
      scene.appendChild(layer);
    });
  }

  /* ------------------------------------------------------------------------
     5. PERFIL DO VISITANTE (capítulo I)
     ------------------------------------------------------------------------ */
  var PROFILES = {
    investidor: {
      note: 'Para quem já investe, o ganho costuma estar menos em novos produtos e mais em organizar o que existe. Os capítulos III e IV são os seus.',
      epilogue: 'Com uma conversa. Traga a sua carteira atual: em uma hora dá para ver o que está sobrando, o que está faltando e quanto custa a névoa.'
    },
    empresario: {
      note: 'Para quem divide atenção entre empresa e patrimônio, o ponto crítico é separar os dois e ganhar tempo. Os capítulos IV e V são os seus.',
      epilogue: 'Com uma conversa. Em uma hora, o mapa do seu patrimônio pessoal e empresarial, e o que precisa de atenção primeiro.'
    },
    familia: {
      note: 'Para quem pensa em gerações, a pergunta central é sucessão e continuidade. Os capítulos V e VI são os seus.',
      epilogue: 'Com uma conversa. De preferência com quem também vai decidir: sucessão bem feita é uma decisão de família.'
    }
  };

  function readStore(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function writeStore(key, val) {
    try { window.localStorage.setItem(key, val); } catch (e) { /* armazenamento indisponível */ }
  }

  function initProfiles() {
    var buttons = $$('.jx-profile');
    var note = $('#jx-profile-note');
    var epilogue = $('#jx-epilogue-line');
    if (!buttons.length) return;
    var defaultEpilogue = epilogue ? epilogue.textContent.trim() : '';

    function choose(key, persist) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-profile') === key));
      });
      var p = PROFILES[key];
      if (note) {
        if (p) { note.textContent = p.note; note.hidden = false; }
        else { note.hidden = true; }
      }
      if (epilogue) epilogue.textContent = p ? p.epilogue : defaultEpilogue;
      if (persist) writeStore('jx-perfil', key || '');
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-profile');
        var already = b.getAttribute('aria-pressed') === 'true';
        choose(already ? null : key, true);
      });
    });

    var saved = readStore('jx-perfil');
    if (saved && PROFILES[saved]) choose(saved, false);
  }

  /* ------------------------------------------------------------------------
     6. ABAS (os quatro pilares)
     ------------------------------------------------------------------------ */
  function initTabs() {
    $$('[data-tabs]').forEach(function (box) {
      if (box.getAttribute('data-tabs-ativas')) return;
      box.setAttribute('data-tabs-ativas', '1');
      var tabs = $$('[role="tab"]', box);
      var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

      function select(i, focus) {
        tabs.forEach(function (t, j) {
          var on = i === j;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          if (panels[j]) panels[j].hidden = !on;
        });
        if (focus) tabs[i].focus();
      }

      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false); });
        t.addEventListener('keydown', function (e) {
          var n = tabs.length;
          if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % n, true); }
          else if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + n) % n, true); }
          else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
          else if (e.key === 'End') { e.preventDefault(); select(n - 1, true); }
        });
      });

      select(0, false);
    });
  }

  /* ------------------------------------------------------------------------
     7. LEITURA DA SEMANA, a partir de data/editorial.js
     Preenche toda lista com data-radar ("all" ou o número de indicadores).
     ------------------------------------------------------------------------ */
  function initRadar() {
    var data = window.EDITORIAL_DATA && window.EDITORIAL_DATA.semana;
    if (!data) return;

    $$('[data-radar]').forEach(function (grid) {
      var lim = grid.getAttribute('data-radar');
      var itens = (data.indicadores || []).filter(function (it) { return it && it.valor; });
      if (lim !== 'all') itens = itens.slice(0, Number(lim) || itens.length);
      itens.forEach(function (it) {
        var row = document.createElement('div');
        var dt = document.createElement('dt');
        var dd = document.createElement('dd');
        dt.textContent = it.nome;
        dd.textContent = it.valor;
        if (it.nota && lim === 'all') {
          var small = document.createElement('small');
          small.textContent = it.nota;
          dd.appendChild(small);
        }
        row.appendChild(dt);
        row.appendChild(dd);
        grid.appendChild(row);
      });
    });

    if (data.data) setText('jx-radar-date', 'Semana de ' + data.data);
    if (data.resumo) setText('jx-radar-summary', data.resumo);
  }

  /* ------------------------------------------------------------------------
     8. A FILOSOFIA DO CONSULTOR, a partir de data/filosofia.js
     Princípios no painel do capítulo II e uma nota opcional por capítulo:
     no painel de aprofundamento do capítulo, ou na própria tela se ele não
     tiver painel. Texto vazio não aparece.
     ------------------------------------------------------------------------ */
  function initFilosofia() {
    var F = window.FILOSOFIA;
    if (!F) return;

    var box = document.getElementById('jx-principios');
    var lista = (F.principios || []).filter(function (p) { return p && p.titulo && p.texto; });
    if (box && lista.length) {
      var label = document.createElement('p');
      label.className = 'jx-label';
      label.textContent = 'Como eu trabalho';
      var ol = document.createElement('ol');
      ol.className = 'jx-principles-list';
      lista.forEach(function (p) {
        var li = document.createElement('li');
        var strong = document.createElement('strong');
        var span = document.createElement('span');
        strong.textContent = p.titulo;
        span.textContent = p.texto;
        li.appendChild(strong);
        li.appendChild(span);
        ol.appendChild(li);
      });
      box.appendChild(label);
      box.appendChild(ol);
      box.hidden = false;
    }

    // As notas são escritas por tela da página inicial; aqui cada uma vai
    // para o capítulo equivalente da versão ilustrada.
    var notas = F.notas || {};
    var CAPITULO = { inicio: 'mirante', custo: 'nevoa', servicos: 'mapa', quem: 'guia', comecar: 'primeiro-passo' };
    Object.keys(notas).forEach(function (chave) {
      var texto = (notas[chave] || '').trim();
      var id = CAPITULO[chave] || chave;
      var section = document.getElementById(id);
      if (!texto || !section) return;

      var q = document.createElement('figure');
      q.className = 'jx-quote';
      var bq = document.createElement('blockquote');
      bq.textContent = texto;
      var cap = document.createElement('figcaption');
      cap.textContent = 'Leonardo Arruda';
      q.appendChild(bq);
      q.appendChild(cap);

      var trigger = section.querySelector('[data-sheet]');
      var part = trigger && document.getElementById(trigger.getAttribute('data-sheet'));
      if (part) { part.insertBefore(q, part.firstChild); return; }

      var panel = section.querySelector('.jx-panel');
      if (panel) panel.insertBefore(q, panel.querySelector('.jx-actions'));
    });
  }

  /* ------------------------------------------------------------------------
     Arranque
     ------------------------------------------------------------------------ */
  function start() {
    safely('barra superior', initTopbar);
    safely('perfil', initProfiles);
    safely('abas', initTabs);
    safely('leitura da semana', initRadar);
    safely('filosofia', initFilosofia);
    safely('cenas', initScenes);
    safely('painel', initSheet);
    safely('jornada', initStage);
  }

  window.Jornada = { get stage() { return Stage; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
