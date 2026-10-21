/**
 * ==============================================================================
 * LEONARDO ARRUDA — SIMULADOR VISUAL FX (2026+)
 * Atmosfera Cósmica Quântica, Astrolábio 3D de Soberania & Wargame de Crises
 * ==============================================================================
 * Paradigma: Client-Side Determinístico, 60fps Nativo, Zero-Deps
 * Inspiração: Astra / Omshiva.ai / High-End Private Wealth UI
 * ==============================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var instance = factory();
    root.OutlierVisualFX = instance;
    if (typeof window !== 'undefined') {
      window.OutlierVisualFX = instance;
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // ============================================================================
  // 1. CANVAS DE FUNDO ATMOSFÉRICO QUÂNTICO (#visual-universe)
  // ============================================================================
  function UniverseBackground(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.particles = [];
    this.particleCount = 110;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.targetMouseX = this.mouseX;
    this.targetMouseY = this.mouseY;
    this.energyFactor = 1.0;
    this.targetEnergy = 1.0;
    this.isRunning = false;
    this.animationFrameId = null;

    this.init();
  }

  UniverseBackground.prototype.init = function () {
    var self = this;
    this.resize();

    // Cria partículas estelares com profundidade z
    this.particles = [];
    for (var i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 0.9 + 0.1, // 0.1 (fundo) a 1.0 (primeiro plano)
        baseRadius: Math.random() * 1.5 + 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        colorType: Math.random() > 0.4 ? 'violet' : (Math.random() > 0.5 ? 'emerald' : 'gold'),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25
      });
    }

    // Eventos
    window.addEventListener('resize', function () {
      self.resize();
    });

    window.addEventListener('mousemove', function (e) {
      self.targetMouseX = e.clientX;
      self.targetMouseY = e.clientY;
    }, { passive: true });

    this.start();
  };

  UniverseBackground.prototype.resize = function () {
    if (!this.canvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  };

  UniverseBackground.prototype.boostEnergy = function (multiplier) {
    this.targetEnergy = Math.min(3.5, (multiplier || 2.2));
  };

  UniverseBackground.prototype.start = function () {
    if (this.isRunning) return;
    this.isRunning = true;
    var self = this;

    function loop() {
      if (!self.isRunning) return;
      self.render();
      self.animationFrameId = requestAnimationFrame(loop);
    }
    this.animationFrameId = requestAnimationFrame(loop);
  };

  UniverseBackground.prototype.stop = function () {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  };

  UniverseBackground.prototype.render = function () {
    var ctx = this.ctx;
    var w = this.width;
    var h = this.height;

    // Suavização do mouse (inércia física)
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;
    var offsetX = (this.mouseX - w / 2) * 0.035;
    var offsetY = (this.mouseY - h / 2) * 0.035;

    // Decaimento suave da energia de propulsão
    this.energyFactor += (this.targetEnergy - this.energyFactor) * 0.08;
    this.targetEnergy += (1.0 - this.targetEnergy) * 0.02;

    ctx.clearRect(0, 0, w, h);

    // Gradiente nebular quântico dinâmico
    var grad = ctx.createRadialGradient(
      w * 0.5 + offsetX * 1.5,
      h * 0.35 + offsetY * 1.5,
      10,
      w * 0.5,
      h * 0.4,
      Math.max(w, h) * 0.75
    );
    grad.addColorStop(0, 'rgba(59, 54, 204, ' + (0.065 * this.energyFactor) + ')');
    grad.addColorStop(0.35, 'rgba(28, 217, 138, ' + (0.025 * this.energyFactor) + ')');
    grad.addColorStop(1, 'rgba(4, 2, 12, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Render das estrelas com paralaxe
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      p.twinklePhase += p.twinkleSpeed * this.energyFactor;

      // Movimento suave com wrapping contínuo
      p.x += (p.vx * this.energyFactor) + (offsetX * p.z * 0.015);
      p.y += (p.vy * this.energyFactor) + (offsetY * p.z * 0.015);

      if (p.x < 0) p.x += w;
      if (p.x > w) p.x -= w;
      if (p.y < 0) p.y += h;
      if (p.y > h) p.y -= h;

      var px = p.x + offsetX * p.z;
      var py = p.y + offsetY * p.z;

      var alpha = (0.35 + Math.sin(p.twinklePhase) * 0.35) * p.z * Math.min(this.energyFactor, 2.0);
      alpha = Math.max(0.08, Math.min(alpha, 0.95));

      var color = 'rgba(237, 232, 213, ' + alpha + ')';
      if (p.colorType === 'emerald') {
        color = 'rgba(28, 217, 138, ' + alpha + ')';
      } else if (p.colorType === 'violet') {
        color = 'rgba(107, 102, 232, ' + alpha + ')';
      } else if (p.colorType === 'gold') {
        color = 'rgba(242, 183, 5, ' + alpha + ')';
      }

      ctx.beginPath();
      ctx.arc(px, py, p.baseRadius * p.z, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  };


  // ============================================================================
  // 2. ASTROLÁBIO 3D & NÚCLEO DE SOBERANIA VIVA (#astrolabe-canvas)
  // ============================================================================
  function AstrolabeCore(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.size = 460;
    this.cx = 230;
    this.cy = 230;

    // Rotação 3D angular
    this.rotX = 0.55; // Inclinação da câmera
    this.rotY = 0;
    this.rotZ = 0;
    this.speed = 0.015;
    this.targetSpeed = 0.015;

    // Estado de Soberania (0.0 = Acumulação, 1.0 = Soberania Plena)
    this.sovereigntyState = 0; // Transição suave entre violeta e esmeralda
    this.targetSovereigntyState = 0;
    this.isSovereign = false;

    // Pulso de energia (shockwave / nova)
    this.pulseWaves = [];
    this.pulseTimer = 0;

    // Partículas orbitais no plano do astrolábio
    this.orbitalParticles = [];
    var count = 42;
    for (var i = 0; i < count; i++) {
      this.orbitalParticles.push({
        ring: Math.floor(Math.random() * 3), // 0: interno, 1: médio, 2: externo
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2 + 1,
        seed: Math.random()
      });
    }

    this.isRunning = false;
    this.init();
  }

  AstrolabeCore.prototype.init = function () {
    this.resize();
    var self = this;
    window.addEventListener('resize', function () {
      self.resize();
    });
    this.start();
  };

  AstrolabeCore.prototype.resize = function () {
    if (!this.canvas) return;
    var rect = this.canvas.getBoundingClientRect();
    var cssW = rect.width || 440;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.size = Math.min(480, Math.max(260, cssW));
    this.cx = this.size / 2;
    this.cy = this.size / 2;

    this.canvas.width = this.size * dpr;
    this.canvas.height = this.size * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  };

  AstrolabeCore.prototype.triggerNovaPulse = function () {
    this.pulseWaves.push({
      radius: 20,
      maxRadius: this.size * 0.48,
      opacity: 0.95,
      width: 4
    });
  };

  AstrolabeCore.prototype.updateTelemetry = function (data) {
    if (!data) return;
    var p0 = Number(data.p0) || 500000;
    var pmt = Number(data.pmt) || 10000;
    var isReached = data.sovereigntyYear !== null && Number(data.sovereigntyYear) <= (data.years || 15);

    // Ajusta velocidade de rotação baseada na taxa de acumulação
    var totalFlow = p0 * 0.0000008 + pmt * 0.00005;
    this.targetSpeed = Math.min(0.045, Math.max(0.012, 0.012 + totalFlow));

    // Define transição de estado cromático
    this.targetSovereigntyState = isReached ? 1.0 : (data.sovereigntyRatio || 0.35);
    if (isReached && !this.isSovereign) {
      this.triggerNovaPulse();
    }
    this.isSovereign = isReached;

    // Atualiza badges do DOM se existirem
    var badge = document.getElementById('astrolabe-status-badge');
    var statusText = document.getElementById('astrolabe-status-text');
    var metricVal = document.getElementById('astrolabe-metric-val');
    var legendState = document.getElementById('astrolabe-narrative-state');

    if (badge && statusText && metricVal) {
      if (isReached) {
        badge.className = 'astrolabe-badge is-sovereign';
        statusText.textContent = '✦ LIBERDADE FINANCEIRA ALCANÇADA';
        metricVal.innerHTML = '<span style="color:var(--grn)">Pronto em ' + data.sovereigntyYear + ' anos</span>';
        if (legendState) {
          legendState.innerHTML = '<strong style="color:var(--grn)">Meta atingida:</strong> A partir daqui, só os rendimentos já pagam o seu padrão de vida sem mexer no valor principal.';
        }
      } else {
        badge.className = 'astrolabe-badge is-accumulating';
        statusText.textContent = 'CONSTRUINDO SUA RENDA MENSAL';
        var pctCov = Math.min(99, Math.round((data.patrimonioFinalFee / (data.patrimonioSoberania || 8500000)) * 100)) || 45;
        metricVal.innerHTML = '<span style="color:var(--vio2)">Você já tem ' + pctCov + '% do valor necessário</span>';
        if (legendState) {
          legendState.innerHTML = '<strong style="color:var(--vio2)">Em construção:</strong> Seu dinheiro está crescendo mês a mês até pagar todas as suas contas sozinho.';
        }
      }
    }
  };

  AstrolabeCore.prototype.start = function () {
    if (this.isRunning) return;
    this.isRunning = true;
    var self = this;

    function loop() {
      if (!self.isRunning) return;
      self.render();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  };

  /**
   * Projeção 3D perspectiva simplificada
   */
  AstrolabeCore.prototype.project3D = function (x, y, z, rotX, rotY, rotZ) {
    // Rotação Y
    var cosY = Math.cos(rotY);
    var sinY = Math.sin(rotY);
    var x1 = x * cosY + z * sinY;
    var z1 = -x * sinY + z * cosY;

    // Rotação X
    var cosX = Math.cos(rotX);
    var sinX = Math.sin(rotX);
    var y2 = y * cosX - z1 * sinX;
    var z2 = y * sinX + z1 * cosX;

    // Rotação Z
    var cosZ = Math.cos(rotZ);
    var sinZ = Math.sin(rotZ);
    var x3 = x1 * cosZ - y2 * sinZ;
    var y3 = x1 * sinZ + y2 * cosZ;

    // Perspectiva
    var focal = 380;
    var scale = focal / (focal + z2 + 80);

    return {
      x: this.cx + x3 * scale,
      y: this.cy + y3 * scale,
      scale: scale,
      depth: z2
    };
  };

  AstrolabeCore.prototype.render = function () {
    var ctx = this.ctx;
    var s = this.size;
    var cx = this.cx;
    var cy = this.cy;

    ctx.clearRect(0, 0, s, s);

    // Interpolações suaves
    this.speed += (this.targetSpeed - this.speed) * 0.05;
    this.sovereigntyState += (this.targetSovereigntyState - this.sovereigntyState) * 0.04;
    this.rotY += this.speed;
    this.rotZ += this.speed * 0.45;

    // Paleta cromática interpolada: Violeta (#3B36CC/#6B66E8) -> Esmeralda (#1CD98A)
    var state = Math.max(0, Math.min(1, this.sovereigntyState));
    var r1 = Math.round(107 * (1 - state) + 28 * state);
    var g1 = Math.round(102 * (1 - state) + 217 * state);
    var b1 = Math.round(232 * (1 - state) + 138 * state);
    var themeColor = 'rgb(' + r1 + ',' + g1 + ',' + b1 + ')';
    var themeAlpha = function (a) { return 'rgba(' + r1 + ',' + g1 + ',' + b1 + ',' + a + ')'; };

    // 1. Halo cósmico de fundo
    var haloRadius = s * 0.45;
    var haloGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, haloRadius);
    haloGrad.addColorStop(0, themeAlpha(0.25 + state * 0.15));
    haloGrad.addColorStop(0.5, themeAlpha(0.08));
    haloGrad.addColorStop(1, 'rgba(4, 2, 12, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Anéis concêntricos 3D em perspectiva (Gimbal Rings)
    var rings = [
      { r: s * 0.40, tiltX: 0.65, tiltY: this.rotY * 0.8, tiltZ: 0.2, segments: 48, ticks: true },
      { r: s * 0.30, tiltX: -0.45, tiltY: -this.rotY * 1.1, tiltZ: 0.5, segments: 40, ticks: false },
      { r: s * 0.20, tiltX: 0.30, tiltY: this.rotY * 1.4, tiltZ: -0.4, segments: 32, ticks: true }
    ];

    for (var ri = 0; ri < rings.length; ri++) {
      var ring = rings[ri];
      ctx.beginPath();
      var firstPoint = null;

      for (var a = 0; a <= ring.segments; a++) {
        var ang = (a / ring.segments) * Math.PI * 2;
        var lx = Math.cos(ang) * ring.r;
        var ly = Math.sin(ang) * ring.r;
        var pt = this.project3D(lx, ly, 0, ring.tiltX, ring.tiltY, ring.tiltZ);

        if (a === 0) {
          ctx.moveTo(pt.x, pt.y);
          firstPoint = pt;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.strokeStyle = themeAlpha(ri === 0 ? 0.45 : (ri === 1 ? 0.35 : 0.6));
      ctx.lineWidth = ri === 2 ? 1.8 : 1.2;
      ctx.stroke();

      // Tick marks ornamentais no anel externo
      if (ring.ticks) {
        var tickCount = 12;
        for (var t = 0; t < tickCount; t++) {
          var tang = (t / tickCount) * Math.PI * 2;
          var tInner = this.project3D(Math.cos(tang) * (ring.r - 4), Math.sin(tang) * (ring.r - 4), 0, ring.tiltX, ring.tiltY, ring.tiltZ);
          var tOuter = this.project3D(Math.cos(tang) * (ring.r + 4), Math.sin(tang) * (ring.r + 4), 0, ring.tiltX, ring.tiltY, ring.tiltZ);
          ctx.beginPath();
          ctx.moveTo(tInner.x, tInner.y);
          ctx.lineTo(tOuter.x, tOuter.y);
          ctx.strokeStyle = themeAlpha(0.65);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 3. Partículas orbitais gravitando ao redor do núcleo
    for (var pIdx = 0; pIdx < this.orbitalParticles.length; pIdx++) {
      var op = this.orbitalParticles[pIdx];
      op.angle += op.speed * (this.speed / 0.015);
      var ringData = rings[op.ring];
      var pRad = ringData.r * (0.95 + op.seed * 0.1);
      var pX = Math.cos(op.angle) * pRad;
      var pY = Math.sin(op.angle) * pRad;
      var projected = this.project3D(pX, pY, 0, ringData.tiltX, ringData.tiltY, ringData.tiltZ);

      var pAlpha = 0.4 + (projected.scale - 0.7) * 0.8;
      pAlpha = Math.max(0.1, Math.min(0.9, pAlpha));

      ctx.beginPath();
      ctx.arc(projected.x, projected.y, op.size * projected.scale, 0, Math.PI * 2);
      ctx.fillStyle = themeAlpha(pAlpha);
      ctx.fill();
    }

    // 4. Ondas de pulso expansivo (Nova Shockwaves)
    for (var wi = this.pulseWaves.length - 1; wi >= 0; wi--) {
      var wave = this.pulseWaves[wi];
      wave.radius += 3.5;
      wave.opacity -= 0.022;

      if (wave.opacity <= 0 || wave.radius >= wave.maxRadius) {
        this.pulseWaves.splice(wi, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(cx, cy, wave.radius, 0, Math.PI * 2);
      ctx.strokeStyle = state > 0.5
        ? 'rgba(28, 217, 138, ' + wave.opacity + ')'
        : 'rgba(107, 102, 232, ' + wave.opacity + ')';
      ctx.lineWidth = wave.width;
      ctx.shadowColor = state > 0.5 ? '#1CD98A' : '#6B66E8';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 5. Singularidade Central / Núcleo Luminoso de Soberania
    var coreRadius = (16 + Math.sin(Date.now() * 0.003) * 3) * (1 + state * 0.35);
    var coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreRadius);
    if (state > 0.5) {
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.3, '#23F09A');
      coreGrad.addColorStop(0.7, '#1CD98A');
      coreGrad.addColorStop(1, 'rgba(28, 217, 138, 0)');
    } else {
      coreGrad.addColorStop(0, '#EDE8D5');
      coreGrad.addColorStop(0.3, '#6B66E8');
      coreGrad.addColorStop(0.7, '#3B36CC');
      coreGrad.addColorStop(1, 'rgba(59, 54, 204, 0)');
    }

    ctx.beginPath();
    ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = state > 0.5 ? '#1CD98A' : '#6B66E8';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Núcleo sólido de precisão geométrica central
    ctx.beginPath();
    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = state > 0.5 ? '#F2B705' : '#EDE8D5';
    ctx.fill();
  };


  // ============================================================================
  // 3. FÍSICA 3D NOS CARDS (TILT FÍSICO + REFLEXO ESPECULAR)
  // ============================================================================
  function init3DCardTilt() {
    var cards = document.querySelectorAll('.sim-tilt-card, .sim-glass-card, .sim-hud-card, .sim-chart-card');
    if (!cards || cards.length === 0) return;

    // Não aplicar tilt excessivo em telas puramente touch
    var isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -6; // max 6 graus
        var rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateZ(4px)';
        card.style.setProperty('--card-mouse-x', x.toFixed(1) + 'px');
        card.style.setProperty('--card-mouse-y', y.toFixed(1) + 'px');
      }, { passive: true });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }


  // ============================================================================
  // 4. WARGAME DE CRISES INTERATIVO (CENÁRIOS TÁTICOS DE MERCADO)
  // ============================================================================
  function initCrisisWargame(astrolabe, universe) {
    var scenarioButtons = document.querySelectorAll('[data-crisis-scenario]');
    if (!scenarioButtons || scenarioButtons.length === 0) return;

    var scenarios = {
      'choque-selic': {
        title: 'Choque Selic & Alta de Juros Real',
        p0: null,
        pmt: null,
        anos: 15,
        rnom: 14.75,
        iinf: 5.5,
        despesa: null,
        swr: 3.5,
        badgeText: 'CENÁRIO: CHOQUE SELIC (14,75% a.a.)',
        badgeClass: 'crisis-tag-amber',
        narrative: 'Em ambiente de juros altos, os 2% ao ano cobrados pelo modelo tradicional drenam quantias enormes do seu patrimônio. Com a consultoria independente Portfel, você fica com todo o ganho real.'
      },
      'cisne-negro': {
        title: 'Cisne Negro / Queda Global 40%',
        p0: null,
        pmt: null,
        anos: 15,
        rnom: 6.5,
        iinf: 4.5,
        despesa: null,
        swr: 3.0,
        badgeText: 'CENÁRIO: CISNE NEGRO / TESTE DE ESTRESSE',
        badgeClass: 'crisis-tag-coral',
        narrative: 'Queda severa de mercado no ciclo inicial. Graças a uma taxa de retirada prudente e sem comissões ocultas de banco, sua carteira sobrevive ilesa e mantém o patrimônio seguro.'
      },
      'hiperinflacao': {
        title: 'Hiperinflação & Dólar Disparado',
        p0: null,
        pmt: null,
        anos: 15,
        rnom: 16.5,
        iinf: 9.0,
        despesa: null,
        swr: 3.5,
        badgeText: 'CENÁRIO: HIPERINFLAÇÃO (IPCA 9,0%)',
        badgeClass: 'crisis-tag-coral',
        narrative: 'A armadilha dos números nominais: o saldo em reais parece crescer, mas só uma carteira dolarizada e indexada à inflação protege seu poder de compra de verdade.'
      },
      'evento-ma': {
        title: 'Venda de Empresa / Liquidez de Negócio',
        p0: 5000000,
        pmt: 25000,
        anos: 10,
        rnom: 11.5,
        iinf: 4.5,
        despesa: 35000,
        swr: 3.5,
        badgeText: 'CENÁRIO: LIQUIDEZ (R$ 5 MILHÕES)',
        badgeClass: 'crisis-tag-emerald',
        narrative: 'Entrada expressiva de capital que permite viver de renda imediatamente. O desafio agora é proteção patrimonial da família, governança e eficiência tributária.'
      },
      'baseline': {
        title: 'Cenário Base Fiduciário',
        p0: 500000,
        pmt: 10000,
        anos: 15,
        rnom: 11.5,
        iinf: 4.5,
        despesa: 25000,
        swr: 3.5,
        badgeText: 'CENÁRIO BASE CONSERVADOR',
        badgeClass: 'crisis-tag-violet',
        narrative: null
      }
    };

    function triggerScreenShock() {
      var wrapper = document.querySelector('.sim-page-wrapper') || document.body;
      wrapper.classList.remove('sim-screen-shockwave');
      // Força reflow
      void wrapper.offsetWidth;
      wrapper.classList.add('sim-screen-shockwave');
      setTimeout(function () {
        wrapper.classList.remove('sim-screen-shockwave');
      }, 700);
    }

    scenarioButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var scenarioKey = btn.getAttribute('data-crisis-scenario');
        var sc = scenarios[scenarioKey];
        if (!sc) return;

        // Atualiza botões ativos
        scenarioButtons.forEach(function (b) { b.classList.remove('is-active-crisis'); });
        btn.classList.add('is-active-crisis');

        // Atualiza sliders correspondentes
        var setVal = function (id, val) {
          if (val === null || val === undefined) return;
          var el = document.getElementById(id);
          if (el) {
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
        };

        if (sc.p0 !== null) setVal('slider-p0', sc.p0);
        if (sc.pmt !== null) setVal('slider-pmt', sc.pmt);
        if (sc.anos !== null) setVal('slider-anos', sc.anos);
        if (sc.rnom !== null) setVal('slider-rnom', sc.rnom);
        if (sc.iinf !== null) setVal('slider-iinf', sc.iinf);
        if (sc.despesa !== null) setVal('slider-despesa', sc.despesa);
        if (sc.swr !== null) setVal('slider-swr', sc.swr);

        // Dispara efeitos visuais cinematográficos
        triggerScreenShock();
        if (astrolabe) astrolabe.triggerNovaPulse();
        if (universe) universe.boostEnergy(2.8);

        // Feedback de telemetria da crise
        var banner = document.getElementById('crisis-telemetry-banner');
        var bannerText = document.getElementById('crisis-telemetry-text');
        if (banner && bannerText) {
          banner.style.display = 'flex';
          banner.className = 'crisis-banner ' + sc.badgeClass;
          bannerText.textContent = sc.title + ' — ' + (sc.narrative || 'Parâmetros recalibrados sob modelo fiduciário.');
        }
      });
    });
  }


  // ============================================================================
  // 5. INICIALIZAÇÃO INTEGRADA (ORQUESTRADOR DE EFEITOS)
  // ============================================================================
  function initVisualFX() {
    if (typeof document === 'undefined') return;

    // 1. Universo Cósmico
    var universe = new UniverseBackground('visual-universe');

    // 2. Astrolábio 3D
    var astrolabe = new AstrolabeCore('astrolabe-canvas');

    // 3. Efeito Tilt nos Cards
    init3DCardTilt();

    // 4. Wargame de Crises
    initCrisisWargame(astrolabe, universe);

    // 5. Sincronização dos Sliders com o Astrolábio e Universo
    var sliders = document.querySelectorAll('.sim-slider');
    sliders.forEach(function (sl) {
      sl.addEventListener('input', function () {
        if (universe) universe.boostEnergy(1.8);
        syncAstrolabeWithSimulation(astrolabe);
      }, { passive: true });
    });

    // Sincronização inicial
    setTimeout(function () {
      syncAstrolabeWithSimulation(astrolabe);
    }, 150);

    return {
      universe: universe,
      astrolabe: astrolabe
    };
  }

  function syncAstrolabeWithSimulation(astrolabe) {
    if (!astrolabe) return;
    try {
      var p0El = document.getElementById('slider-p0');
      var pmtEl = document.getElementById('slider-pmt');
      var anosEl = document.getElementById('slider-anos');
      var despesaEl = document.getElementById('slider-despesa');
      var rnomEl = document.getElementById('slider-rnom');
      var iinfEl = document.getElementById('slider-iinf');
      var swrEl = document.getElementById('slider-swr');

      var p0 = p0El ? parseFloat(p0El.value) : 500000;
      var pmt = pmtEl ? parseFloat(pmtEl.value) : 10000;
      var years = anosEl ? parseFloat(anosEl.value) : 15;
      var despesa = despesaEl ? parseFloat(despesaEl.value) : 25000;
      var rnom = rnomEl ? parseFloat(rnomEl.value) / 100 : 0.115;
      var iinf = iinfEl ? parseFloat(iinfEl.value) / 100 : 0.045;
      var swr = swrEl ? parseFloat(swrEl.value) / 100 : 0.035;

      var simApi = window.OutlierSimulador;
      if (simApi && typeof simApi.simulate === 'function') {
        var res = simApi.simulate({
          p0: p0,
          pmt: pmt,
          years: years,
          rNom: rnom,
          iInf: iinf,
          despesaMeta: despesa,
          swr: swr
        });
        astrolabe.updateTelemetry(res);
      }
    } catch (e) {
      // Falha silenciosa defensiva
    }
  }

  // Auto-inicialização na carga do DOM
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initVisualFX);
    } else {
      setTimeout(initVisualFX, 0);
    }
  }

  return {
    UniverseBackground: UniverseBackground,
    AstrolabeCore: AstrolabeCore,
    initVisualFX: initVisualFX
  };
});
