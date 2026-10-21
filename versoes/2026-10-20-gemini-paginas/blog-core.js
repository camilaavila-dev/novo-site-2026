/**
 * ==============================================================================
 * LEONARDO ARRUDA — TERMINAL EDITORIAL & RADAR MACROECONÔMICO CORE JS (2026+)
 * Motor Interativo, Telemetria Macroeconômica, Alternador Executivo/Quant & Canvas 60fps
 * ==============================================================================
 */

(function () {
  'use strict';

  // Estado Local da Aplicação
  var activeCategory = 'all';
  var searchQuery = '';
  var activeMode = 'exec'; // 'exec' | 'quant'
  var activeFeaturedEditionId = 'ed-01';

  /**
   * Inicialização Principal
   */
  function initBlog() {
    var data = window.EDITORIAL_DATA;
    if (!data) {
      console.warn('EDITORIAL_DATA não encontrado.');
      return;
    }

    // Restaura preferência salva de modo de leitura
    try {
      var savedMode = localStorage.getItem('leo_reader_preference');
      if (savedMode === 'quant' || savedMode === 'exec') {
        activeMode = savedMode;
      }
    } catch (e) {
      // localStorage bloqueado ou indisponível
    }

    renderMacroHud(data.macroPulse || data.termometroMacro);
    setupFeaturedEdition(activeFeaturedEditionId);
    setupReaderToggle();
    setupFiltersAndSearch();
    setupNewsletterForm();
    initRadarCanvas();
  }

  /**
   * 1. Renderiza o Termômetro Macroeconômico HUD
   */
  function renderMacroHud(pulse) {
    if (!pulse) return;

    var dateEl = document.getElementById('hud-date');
    if (dateEl && pulse.date) {
      dateEl.textContent = pulse.date;
    }

    // 5 Indicadores
    var metricsMap = [
      { id: 'metric-selic', obj: pulse.selic },
      { id: 'metric-ipca', obj: pulse.ipca },
      { id: 'metric-usd', obj: pulse.usd || pulse.dolar },
      { id: 'metric-sp500', obj: pulse.sp500 },
      { id: 'metric-ibov', obj: pulse.ibov }
    ];

    metricsMap.forEach(function (item) {
      var card = document.getElementById(item.id);
      if (!card || !item.obj) return;

      var valEl = card.querySelector('.metric-value');
      var pillEl = card.querySelector('.metric-trend-pill');
      var statusEl = card.querySelector('.metric-status');

      if (valEl) valEl.textContent = item.obj.value || '—';
      if (pillEl) {
        pillEl.textContent = item.obj.variation || '0.0%';
        pillEl.className = 'metric-trend-pill ' + (item.obj.trend || 'neutral');
      }
      if (statusEl) statusEl.textContent = item.obj.status || item.obj.note || '';
    });

    // Sentimento do Mercado
    var sentimentScore = pulse.sentimentScore ?? pulse.sentimentoGeral?.score ?? 68;
    var sentimentLabel = pulse.sentimentLabel ?? pulse.sentimentoGeral?.label ?? 'Otimismo Cauteloso';

    var scoreEl = document.getElementById('hud-sentiment-score');
    var labelEl = document.getElementById('hud-sentiment-label');
    var barEl = document.getElementById('hud-sentiment-bar');

    if (scoreEl) scoreEl.textContent = sentimentScore + ' / 100';
    if (labelEl) labelEl.textContent = sentimentLabel;
    if (barEl) barEl.style.width = Math.min(Math.max(sentimentScore, 0), 100) + '%';

    // Resumo em Linguagem Humana
    var summaryEl = document.getElementById('hud-human-summary');
    if (summaryEl && pulse.humanSummary) {
      summaryEl.textContent = pulse.humanSummary;
    }
  }

  /**
   * 2. Configura a Edição em Destaque
   */
  function setupFeaturedEdition(editionId) {
    var data = window.EDITORIAL_DATA;
    if (!data || !data.editions) return;

    var ed = data.editions.find(function (item) {
      return item.id === editionId;
    }) || data.editions[0];

    if (!ed) return;

    activeFeaturedEditionId = ed.id;

    var catEl = document.getElementById('featured-category');
    var dateEl = document.getElementById('featured-date');
    var timeEl = document.getElementById('featured-time');
    var titleEl = document.getElementById('featured-title');

    if (catEl) catEl.textContent = ed.category || ed.categoria;
    if (dateEl) dateEl.textContent = ed.date || ed.data;
    if (timeEl) timeEl.textContent = '⏱ ' + (ed.readTime || ed.tempoLeitura || '3 min');
    if (titleEl) titleEl.textContent = ed.title || ed.titulo;

    // Renderiza Conteúdo de Acordo com o Modo Ativo
    renderModeContent(ed);

    // Renderiza Matriz de Impacto em 4 Quadrantes
    renderImpactMatrix(ed.impactMatrix || ed.oQueMudaNoPatrimonio);
  }

  /**
   * Alternador de Modo de Leitura
   */
  function setupReaderToggle() {
    var toggleWrap = document.getElementById('reader-toggle-wrap');
    if (!toggleWrap) return;

    var buttons = toggleWrap.querySelectorAll('.reader-toggle-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = this.getAttribute('data-mode');
        if (!mode) return;

        setReaderMode(mode);
      });
    });

    // Aplica o modo inicial
    setReaderMode(activeMode);
  }

  function setReaderMode(mode) {
    activeMode = mode;

    try {
      localStorage.setItem('leo_reader_preference', mode);
    } catch (e) {}

    var toggleWrap = document.getElementById('reader-toggle-wrap');
    if (toggleWrap) {
      var buttons = toggleWrap.querySelectorAll('.reader-toggle-btn');
      buttons.forEach(function (btn) {
        if (btn.getAttribute('data-mode') === mode) {
          btn.classList.add('is-active');
          btn.setAttribute('aria-selected', 'true');
        } else {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-selected', 'false');
        }
      });
    }

    var data = window.EDITORIAL_DATA;
    if (data && data.editions) {
      var ed = data.editions.find(function (item) {
        return item.id === activeFeaturedEditionId;
      }) || data.editions[0];

      if (ed) {
        renderModeContent(ed);
      }
    }
  }

  function renderModeContent(ed) {
    var container = document.getElementById('reader-content-panel');
    if (!container) return;

    if (activeMode === 'quant') {
      var q = ed.quantDeepDive || ed.visaoNerd;
      if (!q) {
        // Fallback gracioso se a visão quant estiver ausente (requisito de resiliência T2-F1)
        container.innerHTML = '<div class="quant-view-wrap"><div class="quant-tese-box">' +
          formatExecSummary(ed.executiveSummary || ed.resumoExecutivo) +
          '</div></div>';
        return;
      }

      var html = '<div class="quant-view-wrap">';
      if (q.tese) {
        html += '<div class="quant-tese-box"><strong>Tese Quantitativa:</strong> ' + escapeHtml(q.tese) + '</div>';
      }

      if (Array.isArray(q.metricas) && q.metricas.length > 0) {
        html += '<div class="quant-table-wrap"><table class="quant-table"><thead><tr>' +
          '<th>Indicador / Ativo</th><th>Spread / Prêmio</th><th>Posicionamento</th>' +
          '</tr></thead><tbody>';

        q.metricas.forEach(function (m) {
          html += '<tr>' +
            '<td><strong>' + escapeHtml(m.indicador || '') + '</strong></td>' +
            '<td style="color:var(--grn);">' + escapeHtml(m.spread || '') + '</td>' +
            '<td>' + escapeHtml(m.status || '') + '</td>' +
            '</tr>';
        });

        html += '</tbody></table></div>';
      }

      if (q.conclusaoTecnica) {
        html += '<div class="quant-conclusao"><strong>Diretriz do Leo:</strong> ' + escapeHtml(q.conclusaoTecnica) + '</div>';
      }

      html += '</div>';
      container.innerHTML = html;
    } else {
      // Modo Executivo (1 minuto)
      var exec = ed.executiveSummary || ed.resumoExecutivo;
      container.innerHTML = '<div class="exec-view-wrap">' + formatExecSummary(exec) + '</div>';
    }
  }

  function formatExecSummary(summary) {
    if (Array.isArray(summary)) {
      var items = summary.map(function (s) {
        return '<li class="exec-bullet-item">' +
          '<span class="exec-bullet-icon">✦</span>' +
          '<span>' + escapeHtml(s) + '</span>' +
          '</li>';
      }).join('');
      return '<ul class="exec-bullets-list">' + items + '</ul>';
    }
    return '<p class="exec-bullet-item"><span>' + escapeHtml(summary || '') + '</span></p>';
  }

  /**
   * 3. Renderiza a Matriz de Impacto em 4 Quadrantes
   */
  function renderImpactMatrix(impact) {
    if (!impact) return;

    var rfEl = document.getElementById('quadrant-rf-desc');
    var eqEl = document.getElementById('quadrant-eq-desc');
    var offEl = document.getElementById('quadrant-off-desc');
    var reEl = document.getElementById('quadrant-re-desc');

    if (rfEl) rfEl.textContent = impact.rendaFixa || '';
    if (eqEl) eqEl.textContent = impact.acoes || '';
    if (offEl) offEl.textContent = impact.offshore || '';
    if (reEl) reEl.textContent = impact.imobiliario || impact.imoveis || impact.liquidez || '';
  }

  /**
   * 4. Filtros e Busca de Edições
   */
  function setupFiltersAndSearch() {
    var pillsContainer = document.getElementById('filter-pills-row');
    if (pillsContainer) {
      var pills = pillsContainer.querySelectorAll('.filter-pill');
      pills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          pills.forEach(function (p) { p.classList.remove('is-active'); });
          this.classList.add('is-active');
          activeCategory = this.getAttribute('data-category') || 'all';
          renderEditionsGrid();
        });
      });
    }

    var searchInput = document.getElementById('search-editions');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = (this.value || '').trim().toLowerCase();
        renderEditionsGrid();
      });
    }

    renderEditionsGrid();
  }

  function renderEditionsGrid() {
    var grid = document.getElementById('editions-grid');
    if (!grid) return;

    var data = window.EDITORIAL_DATA;
    if (!data || !data.editions) return;

    var filtered = data.editions.filter(function (ed) {
      // 1. Filtro por Categoria
      var catMatch = false;
      if (activeCategory === 'all' || activeCategory === 'Todas') {
        catMatch = true;
      } else {
        var edCatKey = (ed.categoryKey || '').toLowerCase();
        var edCat = (ed.category || ed.categoria || '').toLowerCase();
        var targetCat = activeCategory.toLowerCase();
        catMatch = edCatKey.includes(targetCat) || edCat.includes(targetCat);
      }

      if (!catMatch) return false;

      // 2. Filtro por Busca Textual
      if (!searchQuery) return true;

      var title = (ed.title || ed.titulo || '').toLowerCase();
      var tags = Array.isArray(ed.tags) ? ed.tags.join(' ').toLowerCase() : '';
      var cat = (ed.category || ed.categoria || '').toLowerCase();
      var summaryText = Array.isArray(ed.executiveSummary) ? ed.executiveSummary.join(' ').toLowerCase() : '';

      return title.includes(searchQuery) || tags.includes(searchQuery) || cat.includes(searchQuery) || summaryText.includes(searchQuery);
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--mut);font-family:var(--s);">' +
        '<div style="font-size:32px;margin-bottom:12px;">🔍</div>' +
        '<div style="font-size:16px;color:var(--txt);margin-bottom:6px;">Nenhuma edição encontrada</div>' +
        '<div style="font-size:13.5px;">Tente buscar por outro termo ou selecione a categoria "Todas".</div>' +
        '</div>';
      return;
    }

    var html = '';
    filtered.forEach(function (ed) {
      var snippet = '';
      if (Array.isArray(ed.executiveSummary) && ed.executiveSummary.length > 0) {
        snippet = ed.executiveSummary[0];
      } else if (typeof ed.executiveSummary === 'string') {
        snippet = ed.executiveSummary;
      }

      var tagsHtml = '';
      if (Array.isArray(ed.tags)) {
        tagsHtml = ed.tags.slice(0, 3).map(function (tag) {
          return '<span class="edition-tag">#' + escapeHtml(tag) + '</span>';
        }).join('');
      }

      html += '<article class="edition-card" data-id="' + ed.id + '">' +
        '<div class="edition-card-top">' +
          '<div class="edition-card-meta">' +
            '<span class="edition-card-cat">' + escapeHtml(ed.category || ed.categoria) + '</span>' +
            '<span class="edition-card-date">' + escapeHtml(ed.date || ed.data) + '</span>' +
          '</div>' +
          '<h3 class="edition-card-title">' + escapeHtml(ed.title || ed.titulo) + '</h3>' +
          '<p class="edition-card-snippet">' + escapeHtml(snippet) + '</p>' +
        '</div>' +
        '<div>' +
          '<div class="edition-card-tags">' + tagsHtml + '</div>' +
          '<button type="button" class="edition-card-cta-btn" onclick="window.loadEditionIntoCockpit(\'' + ed.id + '\')">' +
            '<span>Abrir Análise no Cockpit</span>' +
            '<span style="color:var(--grn);font-weight:bold;">↑</span>' +
          '</button>' +
        '</div>' +
      '</article>';
    });

    grid.innerHTML = html;
  }

  // Permite carregar qualquer edição do grid diretamente no cockpit superior
  window.loadEditionIntoCockpit = function (id) {
    setupFeaturedEdition(id);
    var target = document.getElementById('featured-edition-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * 5. Captura VIP de Newsletter
   */
  function setupNewsletterForm() {
    var form = document.getElementById('newsletter-form');
    var input = document.getElementById('newsletter-email');
    var feedback = document.getElementById('newsletter-feedback');
    var btn = document.getElementById('newsletter-btn');

    if (!form || !input || !feedback) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = (input.value || '').trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        feedback.style.color = '#EF4444';
        feedback.textContent = 'Por favor, insira um endereço de e-mail válido.';
        input.focus();
        return;
      }

      // Sucesso: Persistência no navegador
      try {
        localStorage.setItem('subscribed_newsletter', email);
      } catch (err) {}

      feedback.style.color = 'var(--grn)';
      feedback.textContent = '✓ Inscrição VIP confirmada! Você receberá nossa inteligência macro semanal aos sábados.';
      input.value = '';
      if (btn) {
        btn.textContent = 'Inscrição Ativa ✓';
        btn.disabled = true;
        btn.style.opacity = '0.85';
      }
    });
  }

  /**
   * 6. Canvas de Ondas Cósmicas Macroeconômicas (60fps)
   */
  function initRadarCanvas() {
    var canvas = document.getElementById('radar-universe');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var width, height;
    var waves = [
      { amplitude: 35, frequency: 0.008, speed: 0.015, color: 'rgba(28, 217, 138, 0.12)', offset: 0 },
      { amplitude: 45, frequency: 0.005, speed: -0.012, color: 'rgba(59, 54, 204, 0.14)', offset: 2 },
      { amplitude: 25, frequency: 0.012, speed: 0.018, color: 'rgba(107, 102, 232, 0.10)', offset: 4 }
    ];

    var particles = [];
    var particleCount = 45;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    function initParticles() {
      particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.5 + 0.2
        });
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    var step = 0;
    function animate() {
      step += 1;
      ctx.clearRect(0, 0, width, height);

      // Desenha ondas senoidais sutis no terço inferior
      var centerY = height * 0.65;
      waves.forEach(function (w) {
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        for (var x = 0; x <= width; x += 10) {
          var y = centerY + Math.sin(x * w.frequency + step * w.speed + w.offset) * w.amplitude;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Desenha partículas estelares
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(28, 217, 138, ' + p.alpha + ')';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Executa na carga do DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlog);
  } else {
    initBlog();
  }
})();
