/* ==========================================================================
   LEONARDO ARRUDA · A CIDADELA DO PATRIMÔNIO — CAMADA DE MAPA INTERATIVO
   --------------------------------------------------------------------------
   Arte renderizada como base (referência omshiva.ai) + camada interativa:
   parallax de profundidade, marcadores ancorados à imagem, spotlight no
   território em foco e zoom cinematográfico ao entrar numa seção.

   Toda a calibragem do mapa vive em TERRITORIES: rx/ry são frações da
   imagem (0..1), então trocar a arte é só reajustar esses números.

   Contrato: window.WorldMap
     mount(opts)        monta o mapa num container
     focus(id)          move a câmera e acende o território
     reset()            volta à visão panorâmica
     markVisited(id)    marca o território como percorrido
     pointAt(id)        posição do território na tela, em px
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     CALIBRAGEM DO MAPA
     rx/ry: onde cada território fica sobre a arte, em fração da imagem.
     Ajuste estes seis pares depois de trocar a imagem de fundo.
     ------------------------------------------------------------------------ */
  const TERRITORIES = [
    { id: 1, num: '01', rx: 0.285, ry: 0.620, depth: 0.5 },
    { id: 2, num: '02', rx: 0.455, ry: 0.430, depth: 0.8 },
    { id: 3, num: '03', rx: 0.600, ry: 0.300, depth: 1.0 },
    { id: 4, num: '04', rx: 0.395, ry: 0.790, depth: 0.3 },
    { id: 5, num: '05', rx: 0.690, ry: 0.580, depth: 0.6 },
    { id: 6, num: '06', rx: 0.835, ry: 0.395, depth: 0.9 }
  ];

  const CFG = {
    // Quanto a câmera aproxima ao focar um território.
    focusZoom: 1.55,
    baseZoom: 1.08,
    // Amplitude do parallax conforme o cursor, em px.
    parallaxRange: 26,
    ease: 'cubic-bezier(0.22, 0.61, 0.36, 1)'
  };

  let host = null;
  let camera = null;
  let artLayer = null;
  let markerLayer = null;
  let opts = {};

  const state = {
    focusId: null,
    pointerX: 0,
    pointerY: 0,
    rafId: null,
    visited: new Set()
  };

  /* ------------------------------------------------------------------------
     MONTAGEM
     ------------------------------------------------------------------------ */
  function mount(options) {
    opts = options || {};
    host = typeof opts.container === 'string'
      ? document.getElementById(opts.container)
      : opts.container;
    if (!host) return null;

    host.classList.add('wm-stage');
    host.innerHTML = '';

    // --- Câmera: tudo que se move no zoom e no parallax vive aqui dentro ---
    camera = document.createElement('div');
    camera.className = 'wm-camera';
    host.appendChild(camera);

    // --- A arte ---
    artLayer = document.createElement('div');
    artLayer.className = 'wm-art';
    const img = document.createElement('img');
    img.src = opts.art || 'midias/cidadela-patrimonio.jpg';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.draggable = false;
    // Se a arte definitiva ainda não existe, cai no que o projeto já tem.
    img.onerror = () => {
      if (img.dataset.fellBack) return;
      img.dataset.fellBack = '1';
      img.src = 'midias/mundo-jornada-ilhas.jpg';
      host.classList.add('is-placeholder');
    };
    artLayer.appendChild(img);
    camera.appendChild(artLayer);

    // --- Spotlight: escurece o mapa e abre um círculo de luz no foco ---
    const spot = document.createElement('div');
    spot.className = 'wm-spotlight';
    camera.appendChild(spot);

    // --- Partículas de atmosfera sobre a arte ---
    camera.appendChild(buildAtmosphere());

    // --- Marcadores ---
    markerLayer = document.createElement('div');
    markerLayer.className = 'wm-markers';
    camera.appendChild(markerLayer);

    (opts.territories || []).forEach(t => {
      const geo = TERRITORIES.find(g => g.id === t.id);
      if (geo) markerLayer.appendChild(buildMarker(t, geo));
    });

    bindPointer();
    applyCamera();

    return host;
  }

  /* ------------------------------------------------------------------------
     ATMOSFERA: poeira de luz subindo, dá vida à imagem estática
     ------------------------------------------------------------------------ */
  function buildAtmosphere() {
    const layer = document.createElement('div');
    layer.className = 'wm-atmosphere';
    layer.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 18; i++) {
      const mote = document.createElement('span');
      mote.className = 'wm-mote';
      mote.style.left = `${(i * 137) % 100}%`;
      mote.style.setProperty('--mote-delay', `${(i % 9) * 1.7}s`);
      mote.style.setProperty('--mote-dur', `${14 + (i % 5) * 4}s`);
      mote.style.setProperty('--mote-drift', `${((i % 5) - 2) * 18}px`);
      layer.appendChild(mote);
    }
    return layer;
  }

  /* ------------------------------------------------------------------------
     MARCADOR DE TERRITÓRIO
     Haste ancorada no solo + cartão de vidro (a gramática do HUD da Ananya,
     mas em vidro escuro, não em etiqueta branca).
     ------------------------------------------------------------------------ */
  function buildMarker(t, geo) {
    const wrap = document.createElement('button');
    wrap.type = 'button';
    wrap.className = 'wm-marker';
    wrap.id = `territory-${t.id}`;
    wrap.dataset.territory = t.id;
    wrap.style.left = `${geo.rx * 100}%`;
    wrap.style.top = `${geo.ry * 100}%`;
    wrap.style.setProperty('--depth', geo.depth);
    wrap.setAttribute('aria-label', `${t.title}. ${t.sub}`);

    wrap.innerHTML = `
      <span class="wm-marker-card">
        <span class="wm-marker-num">${geo.num}</span>
        <span class="wm-marker-body">
          <span class="wm-marker-title">${t.title}</span>
          <span class="wm-marker-sub">${t.sub}</span>
        </span>
        <span class="wm-marker-go" aria-hidden="true">
          <svg class="ic"><use href="#ic-arrow-r"></use></svg>
        </span>
      </span>
      <span class="wm-marker-stem" aria-hidden="true"></span>
      <span class="wm-marker-anchor" aria-hidden="true">
        <span class="wm-marker-ping"></span>
      </span>
    `;

    wrap.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof opts.onSelect === 'function') opts.onSelect(t.id);
    });

    wrap.addEventListener('mouseenter', () => {
      if (state.focusId === null) softHighlight(t.id, true);
    });
    wrap.addEventListener('mouseleave', () => {
      if (state.focusId === null) softHighlight(t.id, false);
    });

    return wrap;
  }

  function softHighlight(id, on) {
    const m = markerLayer && markerLayer.querySelector(`[data-territory="${id}"]`);
    if (m) m.classList.toggle('is-hover', on);
  }

  /* ------------------------------------------------------------------------
     CÂMERA: zoom + parallax
     ------------------------------------------------------------------------ */
  function applyCamera() {
    if (!camera) return;

    const focus = state.focusId
      ? TERRITORIES.find(t => t.id === state.focusId)
      : null;

    const zoom = focus ? CFG.focusZoom : CFG.baseZoom;

    // Ao focar, desloca a cena para trazer o território ao centro-esquerda,
    // deixando o painel de conteúdo respirar à direita.
    let tx = 0;
    let ty = 0;
    if (focus) {
      tx = (0.42 - focus.rx) * 100 * zoom;
      ty = (0.48 - focus.ry) * 100 * zoom;
    }

    // Parallax do cursor: sutil, só o suficiente para a imagem ganhar volume.
    const px = state.pointerX * CFG.parallaxRange;
    const py = state.pointerY * CFG.parallaxRange * 0.6;

    camera.style.transform =
      `scale(${zoom}) translate(calc(${tx.toFixed(2)}% + ${px.toFixed(1)}px), calc(${ty.toFixed(2)}% + ${py.toFixed(1)}px))`;

    host.style.setProperty('--spot-x', `${focus ? focus.rx * 100 : 50}%`);
    host.style.setProperty('--spot-y', `${focus ? focus.ry * 100 : 50}%`);
  }

  function bindPointer() {
    // Parallax só faz sentido com ponteiro fino; em toque, atrapalha.
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('mousemove', (e) => {
      state.pointerX = (e.clientX / window.innerWidth - 0.5) * -1;
      state.pointerY = (e.clientY / window.innerHeight - 0.5) * -1;
      if (state.rafId) return;
      state.rafId = requestAnimationFrame(() => {
        state.rafId = null;
        applyCamera();
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     API
     ------------------------------------------------------------------------ */
  function focus(id) {
    state.focusId = id;
    if (host) host.classList.add('is-focused');

    if (markerLayer) {
      markerLayer.querySelectorAll('.wm-marker').forEach(m => {
        m.classList.toggle('is-focus', Number(m.dataset.territory) === id);
        m.classList.remove('is-hover');
      });
    }
    applyCamera();
  }

  function reset() {
    state.focusId = null;
    if (host) host.classList.remove('is-focused');
    if (markerLayer) {
      markerLayer.querySelectorAll('.wm-marker').forEach(m => {
        m.classList.remove('is-focus', 'is-hover');
      });
    }
    applyCamera();
  }

  function markVisited(id) {
    state.visited.add(id);
    const m = markerLayer && markerLayer.querySelector(`[data-territory="${id}"]`);
    if (m) m.classList.add('is-visited');
  }

  function pointAt(id) {
    const m = markerLayer && markerLayer.querySelector(`[data-territory="${id}"]`);
    if (!m) return null;
    const r = m.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  window.WorldMap = {
    mount, focus, reset, markVisited, pointAt,
    TERRITORIES,
    get focusId() { return state.focusId; }
  };
})();
