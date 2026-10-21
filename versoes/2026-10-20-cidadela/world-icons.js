/* ==========================================================================
   LEONARDO ARRUDA · FOLHA DE ÍCONES VETORIAIS AUTORAIS
   --------------------------------------------------------------------------
   Injeta um <svg> de símbolos no topo do body. Todos os ícones compartilham
   a mesma grade de 24x24 e o mesmo peso de traço, então a navegação inteira
   lê como um conjunto — coisa que emoji nunca entrega.

   Uso no HTML:  <svg class="ic"><use href="#ic-map"></use></svg>
   ========================================================================== */

(function () {
  'use strict';

  // Cada entrada é o conteúdo interno do símbolo, em grade 24x24.
  const ICONS = {
    // --- Navegação principal ---
    'map':        '<path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z"/><path d="M9 4v13M15 6.5v13"/>',
    'user':       '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20a7.4 7.4 0 0 1 14.4 0"/>',
    'calculator': '<rect x="4.5" y="3" width="15" height="18" rx="2.4"/><path d="M8 7.5h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    'scan':       '<circle cx="11" cy="11" r="6.2"/><path d="M15.6 15.6 20.5 20.5M7.6 11h6.8"/>',
    'layers':     '<path d="M12 3 3 7.8l9 4.8 9-4.8L12 3Z"/><path d="m3 12.4 9 4.8 9-4.8M3 16.8l9 4.8 9-4.8"/>',
    'news':       '<path d="M4 5.5h12.5v13H5.6A1.6 1.6 0 0 1 4 16.9V5.5Z"/><path d="M16.5 8.5H20v8.4a1.6 1.6 0 0 1-3.5 1.6"/><path d="M7 9h6.5M7 12.5h6.5M7 16h4"/>',
    'landmark':   '<path d="M12 3 3.5 8h17L12 3Z"/><path d="M6 11v7M10 11v7M14 11v7M18 11v7M3.5 21h17"/>',

    // --- Ações e estados ---
    'sun-moon':   '<path d="M12 3.5v2M12 18.5v2M4.6 12h2M17.4 12h2M6.8 6.8l1.4 1.4M15.8 15.8l1.4 1.4M17.2 6.8l-1.4 1.4M8.2 15.8l-1.4 1.4"/><circle cx="12" cy="12" r="3.6"/>',
    'sound-on':   '<path d="M5 9.5h3.2L12.5 6v12L8.2 14.5H5v-5Z"/><path d="M15.8 9.4a3.6 3.6 0 0 1 0 5.2M18.3 7a7 7 0 0 1 0 10"/>',
    'sound-off':  '<path d="M5 9.5h3.2L12.5 6v12L8.2 14.5H5v-5Z"/><path d="m16.2 10 4 4M20.2 10l-4 4"/>',
    'arrow-up-r': '<path d="M8 16 16 8M9.6 8H16v6.4"/>',
    'arrow-r':    '<path d="M4.5 12h14M13 6.5 18.5 12 13 17.5"/>',
    'close':      '<path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"/>',
    'plus':       '<path d="M12 5.5v13M5.5 12h13"/>',
    'target':     '<circle cx="12" cy="12" r="7.8"/><circle cx="12" cy="12" r="3.6"/><path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3"/>',
    'sparkle':    '<path d="M12 3.5 13.8 9 19.3 10.8 13.8 12.6 12 18.1 10.2 12.6 4.7 10.8 10.2 9 12 3.5Z"/>',
    'lock':       '<rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7"/>',

    // --- Conquistas / badges das 6 ilhas ---
    'trophy':     '<path d="M7.5 4h9v5.2a4.5 4.5 0 0 1-9 0V4Z"/><path d="M7.5 5.6H5a2.4 2.4 0 0 0 2.5 4M16.5 5.6H19a2.4 2.4 0 0 1-2.5 4"/><path d="M12 13.7V17M8.8 20h6.4"/>',
    'shield':     '<path d="M12 3.2 5 6v5.6c0 4.3 2.9 7.6 7 9.2 4.1-1.6 7-4.9 7-9.2V6l-7-2.8Z"/>',
    'shield-chk': '<path d="M12 3.2 5 6v5.6c0 4.3 2.9 7.6 7 9.2 4.1-1.6 7-4.9 7-9.2V6l-7-2.8Z"/><path d="m9.2 11.8 2 2 3.6-3.9"/>',
    'crown':      '<path d="M4 8.2 7.4 12 12 5.6 16.6 12 20 8.2v8.4a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 16.6V8.2Z"/>',
    'island':     '<path d="M12 4.2c3 1.4 4.6 3.8 4.6 3.8s-2-.7-4.6-.7-4.6.7-4.6.7S9 5.6 12 4.2Z"/><path d="M12 7.3V15"/><path d="M3.5 18.4c1.8-1.5 3.5 0 5.3 0s3.4-1.5 5.2 0 3.4 0 5.2 0"/><path d="M7.6 15h8.8"/>',
    'compass':    '<circle cx="12" cy="12" r="8.4"/><path d="m15.2 8.8-1.9 4.5-4.5 1.9 1.9-4.5 4.5-1.9Z"/>',

    // --- Calculadoras ---
    'palm':       '<path d="M12 20V9.5"/><path d="M12 9.5C9.6 6.8 6.4 6.3 4.4 7.8c2-3 6-2.6 7.6 1.7"/><path d="M12 9.5c2.4-2.7 5.6-3.2 7.6-1.7-2-3-6-2.6-7.6 1.7"/><path d="M8.6 20h6.8"/>',
    'home':       '<path d="M4 10.6 12 4l8 6.6V19a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 19v-8.4Z"/><path d="M9.6 20.4v-6h4.8v6"/>',
    'bank':       '<path d="M12 3.5 3.8 7.8h16.4L12 3.5Z"/><path d="M6 11v6M10 11v6M14 11v6M18 11v6M3.5 20.4h17"/>',
    'globe':      '<circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8"/><path d="M12 3.6a13 13 0 0 1 0 16.8 13 13 0 0 1 0-16.8Z"/>',
    'scroll':     '<path d="M6.5 4h11v14.2a2.3 2.3 0 0 1-2.3 2.3H6.5"/><path d="M6.5 4a2.3 2.3 0 0 0 0 4.6h2.8"/><path d="M11 9.5h3.4M11 13h3.4"/>',

    // --- Telemetria / HUD ---
    'chart':      '<path d="M4 19.5h16"/><path d="m5.5 15.4 4-4.6 3.4 2.8 5.6-6.6"/>',
    'pulse':      '<path d="M3.5 12.5h3.8l2.1-5.6 3.4 10.2 2.2-4.6h5.5"/>',
    'pin':        '<path d="M12 21s6.4-6 6.4-10.4a6.4 6.4 0 0 0-12.8 0C5.6 15 12 21 12 21Z"/><circle cx="12" cy="10.4" r="2.4"/>',
    'note':       '<path d="M5 4.6h14v10.6L14.2 20H5V4.6Z"/><path d="M19 15.2h-4.8V20"/><path d="M8 9h8M8 12.4h5.5"/>'
  };

  function injectSprite() {
    if (document.getElementById('ws-icon-sprite')) return;

    const parts = [];
    for (const name in ICONS) {
      parts.push(
        `<symbol id="ic-${name}" viewBox="0 0 24 24">${ICONS[name]}</symbol>`
      );
    }

    const host = document.createElement('div');
    host.id = 'ws-icon-sprite';
    host.className = 'ws-symbols';
    host.setAttribute('aria-hidden', 'true');
    host.innerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;

    document.body.insertBefore(host, document.body.firstChild);
  }

  // Helper para montar um ícone em JS (usado pelos modais e cards dinâmicos).
  function icon(name, cls) {
    return `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#ic-${name}"></use></svg>`;
  }

  window.WorldIcons = { icon, names: Object.keys(ICONS) };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSprite);
  } else {
    injectSprite();
  }
})();
