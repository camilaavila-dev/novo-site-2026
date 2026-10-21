/**
 * ==============================================================================
 * LEONARDO ARRUDA — SHARED NAVIGATION & MOBILE FLOATING DOCK (2026+)
 * Módulo de Navegação Unificada, Sincronização de Rotas e Dock Tátil Inferior
 * ==============================================================================
 * Compatibilidade: Vanilla JS Puro, Zero Dependências, 60 FPS
 * Touch Target: >= 48px para WCAG 2.2 AAA
 * ==============================================================================
 */

(function (window, document) {
  'use strict';

  var FORM_URL_DEFAULT = 'https://forms.office.com/Pages/ResponsePage.aspx?id=6ez5YgM1m0G2Yyy_xOsD25muVoj4MslItAJalz086_lURDhJV1Y0QlVaUTZFV0RORUZMMUg2S1NKTi4u';

  // SVGs otimizados para a Bottom Dock
  var ICONS = {
    home: '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
    simulador: '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
    raiox: '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    blog: '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>',
    agendar: '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
  };

  /**
   * Determina a chave da página atual
   */
  function getCurrentPageKey() {
    var path = window.location.pathname.toLowerCase();
    var hash = window.location.hash.toLowerCase();

    if (path.indexOf('simulador.html') !== -1) return 'simulador';
    if (path.indexOf('raiox.html') !== -1 || path.indexOf('raio-x.html') !== -1) return 'raiox';
    if (path.indexOf('blog.html') !== -1) return 'blog';
    if (path.indexOf('termos.html') !== -1) return 'termos';
    if (path.indexOf('privacidade.html') !== -1) return 'privacidade';
    if (path.indexOf('linktree.html') !== -1) return 'linktree';

    // Se estiver na Home
    if (path === '' || path === '/' || path.indexOf('index.html') !== -1) {
      return 'home';
    }

    return 'home';
  }

  /**
   * Constrói e injeta ou sincroniza a Mobile Bottom Floating Dock
   */
  function ensureBottomDock(options) {
    var ctaUrl = (options && options.ctaUrl) || 'index.html#primeiro-passo';
    var isHomePage = getCurrentPageKey() === 'home';

    var existingDock = document.querySelector('.mobile-bottom-dock, .bottom-dock');
    if (!existingDock) {
      var dockNav = document.createElement('nav');
      dockNav.className = 'mobile-bottom-dock';
      dockNav.setAttribute('aria-label', 'Navegação Rápida Mobile');
      dockNav.innerHTML = [
        '<a href="index.html" class="dock-item" data-page="home" title="Início">',
        '  <span class="dock-icon">' + ICONS.home + '</span>',
        '  <span class="dock-label">Home</span>',
        '</a>',
        '<a href="simulador.html" class="dock-item" data-page="simulador" title="Simulador de Liberdade">',
        '  <span class="dock-icon">' + ICONS.simulador + '</span>',
        '  <span class="dock-label">Simulador</span>',
        '</a>',
        '<a href="raiox.html" class="dock-item" data-page="raiox" title="Diagnóstico Raio-X">',
        '  <span class="dock-icon">' + ICONS.raiox + '</span>',
        '  <span class="dock-label">Raio-X</span>',
        '</a>',
        '<a href="blog.html" class="dock-item" data-page="blog" title="Radar da Semana">',
        '  <span class="dock-icon">' + ICONS.blog + '</span>',
        '  <span class="dock-label">Radar</span>',
        '</a>',
        '<a href="' + (isHomePage ? '#cta' : 'index.html#primeiro-passo') + '" class="dock-item dock-cta" data-page="cta" title="Agendar Reunião">',
        '  <span class="dock-icon">' + ICONS.agendar + '</span>',
        '  <span class="dock-label">Agendar</span>',
        '</a>'
      ].join('\n');

      document.body.appendChild(dockNav);
      existingDock = dockNav;
    }

    // Adiciona classe de padding ao body
    document.body.classList.add('has-bottom-dock');

    // Sincroniza estado ativo
    var currentPage = getCurrentPageKey();
    var dockItems = existingDock.querySelectorAll('.dock-item');
    dockItems.forEach(function (item) {
      var page = item.getAttribute('data-page');
      if (page && page === currentPage && page !== 'cta') {
        item.classList.add('is-active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('is-active');
        item.removeAttribute('aria-current');
      }
    });

    return existingDock;
  }

  /**
   * Gerencia navegação por âncoras cruzadas e scroll suave
   */
  var anchorListenerAttached = false;

  function setupAnchorNavigation() {
    var isHomePage = getCurrentPageKey() === 'home';

    if (anchorListenerAttached) {
      return;
    }
    anchorListenerAttached = true;

    // Intercepta cliques em links com hash (#)
    document.addEventListener('click', function (e) {
      var targetLink = e.target.closest('a');
      if (!targetLink) return;

      var href = targetLink.getAttribute('href');
      if (!href) return;

      // Link para o topo simples
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Se for um link de âncora local ou cross-page para index.html
      var hashIndex = href.indexOf('#');
      if (hashIndex !== -1) {
        var basePart = href.substring(0, hashIndex);
        var hashPart = href.substring(hashIndex); // ex: #servicos, #cta

        // Normalização de #contato para #cta se #contato não existir
        var targetId = hashPart.substring(1);
        if (targetId === 'contato' && !document.getElementById('contato') && document.getElementById('cta')) {
          targetId = 'cta';
          hashPart = '#cta';
        }

        // Se o link for puramente local (#id) ou se apontar para index.html#id enquanto estamos na Home
        var isLocal = basePart === '' || basePart === 'index.html' || basePart === '/' || basePart === window.location.pathname;
        var homeSections = ['sobre', 'servicos', 'metodo', 'presenca', 'parceria', 'cta', 'contato'];
        var isHomeSection = homeSections.indexOf(targetId) !== -1;

        if (isHomePage && isLocal) {
          var targetElem = document.getElementById(targetId);
          if (targetElem) {
            e.preventDefault();
            targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (history.pushState) {
              history.pushState(null, null, '#' + targetId);
            }
          }
        } else if (!isHomePage && isHomeSection) {
          // Se o usuário estiver em página secundária (!isHomePage) e clicar em link com âncora de seção da Home
          e.preventDefault();
          window.location.href = 'index.html' + hashPart;
        }
      }
    });

    // Se a página atual foi aberta com hash e o elemento existe, rola suavemente
    if (window.location.hash) {
      var initialId = window.location.hash.substring(1);
      if (initialId === 'contato' && !document.getElementById('contato') && document.getElementById('cta')) {
        initialId = 'cta';
      }
      var targetElem = document.getElementById(initialId);
      if (targetElem) {
        setTimeout(function () {
          targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    }
  }

  /**
   * Sincroniza links do menu superior (#site-nav) com páginas secundárias
   */
  function syncHeaderLinks() {
    var isHomePage = getCurrentPageKey() === 'home';
    if (isHomePage) return;

    var navLinks = document.querySelectorAll('#site-nav a.nav-link');
    if (navLinks.length > 0) {
      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.setAttribute('href', 'index.html' + href);
        }
      });

      var logoLink = document.querySelector('#site-nav a[href="#"]');
      if (logoLink) {
        logoLink.setAttribute('href', 'index.html');
      }
    }

    // No carregamento da página em páginas não-Home, além do #site-nav,
    // varrer qualquer a[href^="#"] que aponte para seções da home e prefixar com index.html#
    var homeSections = ['sobre', 'servicos', 'metodo', 'presenca', 'parceria', 'cta', 'contato'];
    var pageAnchorLinks = document.querySelectorAll('a[href^="#"]');
    pageAnchorLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href === '#' || href === '#top') return;
      var targetId = href.substring(1);
      if (homeSections.indexOf(targetId) !== -1) {
        link.setAttribute('href', 'index.html' + href);
      }
    });
  }

  /**
   * Inicializador global
   */
  function initOutlierNavigation(options) {
    if (window.__outlierNavInitialized) {
      return;
    }
    window.__outlierNavInitialized = true;

    options = options || {};
    ensureBottomDock(options);
    setupAnchorNavigation();
    syncHeaderLinks();
  }

  // Exportação global
  window.initOutlierNavigation = initOutlierNavigation;

  // Auto-inicialização quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initOutlierNavigation();
    });
  } else {
    initOutlierNavigation();
  }

})(window, document);
