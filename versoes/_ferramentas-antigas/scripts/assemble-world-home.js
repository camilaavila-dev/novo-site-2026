const fs = require('fs');

let html = fs.readFileSync('index-classico.html', 'utf8');

// 1. Add css/world-journey.css in <head>
html = html.replace(
  '<link rel="stylesheet" href="css/shared-outlier.css">',
  '<link rel="stylesheet" href="css/shared-outlier.css">\n<link rel="stylesheet" href="css/world-journey.css">'
);

// 2. Build the #jornada-world-app HTML block
const worldBlock = `
<!-- ==========================================================================
     MUNDO INTERATIVO DA JORNADA DE INVESTIMENTOS (ESTILO ANANYA + FROGSOUND)
     ========================================================================== -->
<section id="jornada-world-app" data-world-theme="day" aria-label="Mundo Interativo da Jornada de Investimentos">

  <!-- TOPO CENTRAL: ASSINATURA + PÍLULA DE NAVEGAÇÃO + TEMA/SOM/CTA -->
  <div class="world-top-bar" id="world-top-bar">
    <a href="#jornada-world-app" class="world-brand-sig" data-island-trigger="0" data-no-modal="true">
      <span class="world-brand-sig-text">Leonardo Arruda.</span>
      <span class="world-brand-sig-heart">♡</span>
    </a>

    <div class="world-nav-pill" role="navigation" aria-label="Estações da Jornada">
      <button type="button" class="world-nav-btn is-active" data-island-trigger="0" data-no-modal="true">🏠 HOME</button>
      <button type="button" class="world-nav-btn" data-island-trigger="1">SOBRE</button>
      <button type="button" class="world-nav-btn" data-island-trigger="3">CALCULADORAS</button>
      <button type="button" class="world-nav-btn" data-island-trigger="2">RAIO-X</button>
      <button type="button" class="world-nav-btn" data-island-trigger="5">NOTÍCIAS</button>
      <button type="button" class="world-nav-btn" data-island-trigger="6">CONTATO</button>
    </div>

    <div class="world-top-actions">
      <button type="button" id="world-theme-toggle" class="world-icon-circle" title="Alternar Atmosfera (Manhã / Pôr do Sol / Noite)">🌙</button>
      <button type="button" id="world-sound-toggle" class="world-icon-circle" title="Ativar/Pausar Trilha Sonora Modo Foco">🎵</button>
      <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=6ez5YgM1m0G2Yyy_xOsD25muVoj4MslItAJalz086_lURDhJV1Y0QlVaUTZFV0RORUZMMUg2S1NKTi4u" target="_blank" rel="noopener" class="world-top-cta">
        Falar com o Leo ↗
      </a>
    </div>
  </div>

  <!-- PALCO DO MUNDO 3D ISOMÉTRICO + CANVAS + ILHAS + PERSONAGEM -->
  <div class="world-camera-viewport">
    <div class="world-stage" id="world-stage">
      <img src="midias/mundo-jornada-ilhas.jpg" alt="Arquipélago 3D da Jornada de Investimentos" class="world-bg-image">
      <canvas id="world-canvas" aria-hidden="true"></canvas>

      <!-- PLACA DE MADEIRA DE ETAPAS (SOBRE O POSTE DE MADEIRA DO MIRANTE) -->
      <div class="world-wooden-signpost" aria-label="Marcos da Jornada">
        <button type="button" class="wooden-plank-btn" data-island-trigger="1">Organizar ☁</button>
        <button type="button" class="wooden-plank-btn" data-island-trigger="2">Planejar ★</button>
        <button type="button" class="wooden-plank-btn" data-island-trigger="3">Multiplicar 📈</button>
        <button type="button" class="wooden-plank-btn" data-island-trigger="4">Blindar 🛡️</button>
        <button type="button" class="wooden-plank-btn" data-island-trigger="6">Viver de Renda 🏝️</button>
      </div>

      <!-- ILHA 01: SOBRE O LEO & A PORTFEL -->
      <button type="button" class="world-island-pin" style="left:44%;top:27%" data-island-pin="1" data-island-trigger="1">
        <div class="island-pin-card">
          <span class="island-pin-num">01</span>
          <span class="island-pin-check">✓</span>
          <span class="island-pin-title">SOBRE O LEO &amp; PORTFEL</span>
          <span class="island-pin-sub">Quem guia você · Sem conflito 👤</span>
        </div>
        <div class="island-pin-stem"></div>
        <div class="island-pin-beacon"></div>
      </button>

      <!-- ILHA 02: RAIO-X DA CARTEIRA -->
      <button type="button" class="world-island-pin" style="left:58%;top:37%" data-island-pin="2" data-island-trigger="2">
        <div class="island-pin-card">
          <span class="island-pin-num">02</span>
          <span class="island-pin-check">✓</span>
          <span class="island-pin-title">RAIO-X DA CARTEIRA</span>
          <span class="island-pin-sub">Onde seu dinheiro vaza 🛡️</span>
        </div>
        <div class="island-pin-stem"></div>
        <div class="island-pin-beacon"></div>
      </button>

      <!-- ILHA 03: CALCULADORAS DA VIDA -->
      <button type="button" class="world-island-pin" style="left:73%;top:33%" data-island-pin="3" data-island-trigger="3">
        <div class="island-pin-card">
          <span class="island-pin-num">03</span>
          <span class="island-pin-check">✓</span>
          <span class="island-pin-title">CALCULADORAS DA VIDA</span>
          <span class="island-pin-sub">Renda · Imóvel · Taxas 🧮</span>
        </div>
        <div class="island-pin-stem"></div>
        <div class="island-pin-beacon"></div>
      </button>

      <!-- ILHA 04: OS 4 TERRITÓRIOS DE PROTEÇÃO -->
      <button type="button" class="world-island-pin" style="left:22%;top:42%" data-island-pin="4" data-island-trigger="4">
        <div class="island-pin-card">
          <span class="island-pin-num">04</span>
          <span class="island-pin-check">✓</span>
          <span class="island-pin-title">OS 4 TERRITÓRIOS</span>
          <span class="island-pin-sub">Renda, Seguros e Dólar 🏰</span>
        </div>
        <div class="island-pin-stem"></div>
        <div class="island-pin-beacon"></div>
      </button>

      <!-- ILHA 05: DIÁRIO & NOTÍCIAS DA SEMANA -->
      <button type="button" class="world-island-pin" style="left:69%;top:51%" data-island-pin="5" data-island-trigger="5">
        <div class="island-pin-card">
          <span class="island-pin-num">05</span>
          <span class="island-pin-check">✓</span>
          <span class="island-pin-title">DIÁRIO &amp; NOTÍCIAS</span>
          <span class="island-pin-sub">O pulso em 1 min 📰</span>
        </div>
        <div class="island-pin-stem"></div>
        <div class="island-pin-beacon"></div>
      </button>

      <!-- ILHA 06: CONVERSAR COM O LEO -->
      <button type="button" class="world-island-pin" style="left:58.5%;top:62%" data-island-pin="6" data-island-trigger="6">
        <div class="island-pin-card">
          <span class="island-pin-num">06</span>
          <span class="island-pin-check">✓</span>
          <span class="island-pin-title">CONVERSAR COM O LEO</span>
          <span class="island-pin-sub">Diagnóstico pessoal ✈️</span>
        </div>
        <div class="island-pin-stem"></div>
        <div class="island-pin-beacon"></div>
      </button>

      <!-- O USUÁRIO É O PERSONAGEM (AVATAR VIAJANTE QUE ANDA PELO MAPA) -->
      <div id="world-traveler" title="Você! Use WASD, Scroll ou clique nas ilhas para caminhar">
        <div class="traveler-wrap">
          <div id="traveler-xp-pop" class="traveler-xp-pop">+100 XP ✨</div>
          <div class="traveler-speech">
            <span id="traveler-lvl-pill" class="traveler-lvl-pill">Lv.1</span>
            <span id="traveler-speech-text">Use WASD, Scroll ou clique numa ilha! ✨</span>
          </div>
          <svg class="traveler-body" viewBox="0 0 80 115" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Seu Personagem Viajante">
            <!-- Pernas animadas -->
            <g class="traveler-leg-l">
              <rect x="28" y="74" width="9" height="24" rx="4.5" fill="#F2EAE4" stroke="#3E2C23" stroke-width="1.5"/>
              <rect x="26" y="94" width="13" height="8" rx="4" fill="#F48FB1" stroke="#3E2C23" stroke-width="1.5"/>
            </g>
            <g class="traveler-leg-r">
              <rect x="43" y="74" width="9" height="24" rx="4.5" fill="#F2EAE4" stroke="#3E2C23" stroke-width="1.5"/>
              <rect x="41" y="94" width="13" height="8" rx="4" fill="#F48FB1" stroke="#3E2C23" stroke-width="1.5"/>
            </g>
            <!-- Jaqueta / Casaco do Viajante -->
            <path id="traveler-coat-path" d="M22 44C22 38 29 35 40 35C51 35 58 38 58 44L62 76C62 78 60 80 57 80H23C20 80 18 78 18 76L22 44Z" fill="#F48FB1" stroke="#3E2C23" stroke-width="1.8"/>
            <!-- Mochila de Jornada com Broches (igual à menininha da referência!) -->
            <rect x="25" y="45" width="30" height="32" rx="10" fill="#EAD7C5" stroke="#3E2C23" stroke-width="1.8"/>
            <rect x="29" y="56" width="22" height="16" rx="6" fill="#DEC3AC" stroke="#3E2C23" stroke-width="1.4"/>
            <circle cx="35" cy="63" r="3" fill="#FFD166"/>
            <circle cx="45" cy="65" r="2.8" fill="#1CD98A"/>
            <circle cx="41" cy="51" r="2.5" fill="#E84A80"/>
            <!-- Cabeça e Cabelos Ondulados -->
            <circle cx="40" cy="24" r="16" fill="#3B2316"/>
            <path d="M22 24C22 13 30 7 40 7C50 7 58 13 58 24C58 34 55 46 50 48C45 50 35 50 30 48C25 46 22 34 22 24Z" fill="#2A170E"/>
            <!-- Laço Rosa/Dourado no Cabelo -->
            <g id="traveler-bow-group">
              <path d="M31 15L40 20L31 25Z" fill="#F8BBD0" stroke="#3E2C23" stroke-width="1.2"/>
              <path d="M49 15L40 20L49 25Z" fill="#F8BBD0" stroke="#3E2C23" stroke-width="1.2"/>
              <circle cx="40" cy="20" r="3.2" fill="#F48FB1" stroke="#3E2C23" stroke-width="1.2"/>
            </g>
          </svg>
          <div class="traveler-shadow"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- COLUNA FLUTUANTE ESQUERDA (HEADLINE + MISSÃO ATUAL + CREDENCIAIS) -->
  <aside class="world-hud-left" aria-label="Sua Jornada e Missão Atual">
    <div class="world-editorial-intro">
      <div class="world-eyebrow">✦ OLÁ, EU SOU O LEONARDO ARRUDA ❁ CEA · PORTFEL</div>
      <div class="world-hero-title">
        Construa &amp; proteja <span class="hl-accent">uma jornada patrimonial</span> <span class="hl-script">que traz paz. ♡</span>
      </div>
      <p class="world-hero-desc">
        Consultoria de investimentos independente (Fee-Based). Você é o personagem: caminhe pelas 6 ilhas para organizar, multiplicar e blindar seu futuro.
      </p>
      <div class="world-hero-btns">
        <button type="button" id="world-explore-next-btn" class="world-btn-explore">Explorar Minha Jornada +</button>
        <button type="button" class="world-btn-classic" data-scroll-classic="true">Ver Modo Clássico ↓</button>
      </div>
    </div>

    <!-- CARD MISSÃO ATUAL (CURRENT QUEST) -->
    <div class="world-glass-widget">
      <div class="widget-tag-title">
        <span>MISSÃO ATUAL (SUA JORNADA) ✦</span>
        <span style="color:var(--w-grn)">ATIVA</span>
      </div>
      <div class="quest-top-flex">
        <div id="hud-quest-desc" class="quest-desc">
          Suba de nível visitando as 6 ilhas patrimoniais e simulando seu futuro nas calculadoras ✨
        </div>
        <button type="button" id="quest-avatar-swap" class="quest-avatar-btn" title="Clique para trocar o estilo do seu personagem">
          <span id="quest-avatar-emoji" style="font-size:28px">👩‍💼</span>
          <span class="quest-avatar-swap-hint">TROCAR ↻</span>
        </button>
      </div>
      <div class="quest-progress-row">
        <div class="quest-lvl-header">
          <span id="hud-quest-lvl">Lv. 1</span>
          <span id="hud-quest-pct">17%</span>
        </div>
        <div class="quest-bar-track">
          <div id="hud-quest-bar" class="quest-bar-fill" style="width:17%"></div>
        </div>
        <div class="quest-exp-sub">
          <span id="hud-quest-exp">EXP · 100 / 600</span>
          <span>Rumo à Liberdade Financeira</span>
        </div>
      </div>
    </div>

    <!-- CARD PILARES & CREDENCIAIS (TECH STACK STYLE) -->
    <div class="world-glass-widget">
      <div class="widget-tag-title">
        <span>PILARES &amp; CREDENCIAIS</span>
        <span>PORTFEL · GRUPO PRIMO</span>
      </div>
      <div class="cred-stack-grid">
        <button type="button" class="cred-pill-item" data-island-trigger="1">
          <span class="cred-pill-icon" style="background:#3B36CC">CEA</span>
          <span class="cred-pill-label">ANBIMA</span>
        </button>
        <button type="button" class="cred-pill-item" data-island-trigger="1">
          <span class="cred-pill-icon" style="background:#1A162B">PF</span>
          <span class="cred-pill-label">Portfel</span>
        </button>
        <button type="button" class="cred-pill-item" data-island-trigger="1">
          <span class="cred-pill-icon" style="background:#0FA968">7Bi+</span>
          <span class="cred-pill-label">Gestão</span>
        </button>
        <button type="button" class="cred-pill-item" data-island-trigger="3">
          <span class="cred-pill-icon" style="background:#E84A80">FEE</span>
          <span class="cred-pill-label">Fee-Based</span>
        </button>
        <button type="button" class="cred-pill-item" data-island-trigger="4">
          <span class="cred-pill-icon" style="background:#2A9D8F">USD</span>
          <span class="cred-pill-label">Offshore</span>
        </button>
        <button type="button" class="cred-pill-item" data-island-trigger="4">
          <span class="cred-pill-icon" style="background:#E69F00">SUC</span>
          <span class="cred-pill-label">Sucessão</span>
        </button>
      </div>
    </div>

    <!-- BARRA DE MARCOS NA BASE ESQUERDA -->
    <div class="world-bottom-left-pill">
      <span style="color:#E84A80">🧭</span>
      <span>Organizar · Planejar · Multiplicar · Blindar · Viver de Renda</span>
      <span style="color:#1CD98A">+</span>
    </div>
  </aside>

  <!-- SELETOR TÁTIL LATERAL DE ATMOSFERAS / CORES (INSPIRADO NO FROGSOUND) -->
  <div class="world-theme-rail" role="group" aria-label="Seletor de Atmosfera do Mundo">
    <span class="world-theme-rail-label">CLIMA</span>
    <button type="button" class="world-theme-swatch is-active" data-world-theme-set="day" style="background:linear-gradient(135deg,#8DD5F5,#FFF3D6)" title="Manhã Clara (Padrão)" aria-label="Atmosfera Manhã Clara"></button>
    <button type="button" class="world-theme-swatch" data-world-theme-set="sunset" style="background:linear-gradient(135deg,#F4A261,#E84A80)" title="Pôr do Sol Dourado" aria-label="Atmosfera Pôr do Sol"></button>
    <button type="button" class="world-theme-swatch" data-world-theme-set="night" style="background:linear-gradient(135deg,#1A162B,#1CD98A)" title="Noite Estrelada" aria-label="Atmosfera Noite Estrelada"></button>
  </div>

  <!-- COLUNA FLUTUANTE DIREITA (GUIA LEO + BADGES + MODO FOCO + NOTA DO LEO) -->
  <aside class="world-hud-right" aria-label="Guia da Jornada e Conquistas">
    <!-- CARD DO GUIA (LEONARDO ARRUDA + XP + BADGES) -->
    <div class="world-glass-widget">
      <div class="guide-profile-header">
        <img src="midias/hero-leo.webp" alt="Leonardo Arruda" class="guide-avatar-img">
        <div>
          <div class="guide-name">Leonardo Arruda <span style="color:var(--w-accent)">❀</span></div>
          <div class="guide-bio">Construindo seu futuro financeiro, uma decisão clara por vez. 🏛️</div>
        </div>
      </div>

      <div class="guide-xp-box">
        <div class="widget-tag-title" style="margin-bottom:3px">
          <span>XP DA JORNADA</span>
          <span id="hud-daily-xp-val" style="font-family:var(--m)">100 / 600</span>
        </div>
        <div class="guide-xp-row">
          <span class="xp-coin-badge">XP</span>
          <div class="quest-bar-track" style="flex:1">
            <div id="hud-daily-xp-bar" class="quest-bar-fill" style="width:17%"></div>
          </div>
        </div>
      </div>

      <div>
        <div class="widget-tag-title" style="margin-bottom:4px">
          <span>CONQUISTAS (BADGES)</span>
          <span>CLIQUE P/ VISITAR</span>
        </div>
        <div class="badges-row">
          <button type="button" class="world-badge-slot" data-badge-slot="1" data-island-trigger="1" title="Ilha 01: Alinhamento Puro">⭐</button>
          <button type="button" class="world-badge-slot" data-badge-slot="2" data-island-trigger="2" title="Ilha 02: Olhos de Raio-X">🛡️</button>
          <button type="button" class="world-badge-slot" data-badge-slot="3" data-island-trigger="3" title="Ilha 03: Estrategista da Vida">🧮</button>
          <button type="button" class="world-badge-slot" data-badge-slot="4" data-island-trigger="4" title="Ilha 04: Guardião da Fortaleza">🏰</button>
          <button type="button" class="world-badge-slot" data-badge-slot="5" data-island-trigger="5" title="Ilha 05: Visão de Mercado">📰</button>
          <button type="button" class="world-badge-slot" data-badge-slot="6" data-island-trigger="6" title="Ilha 06: Soberania Patrimonial">👑</button>
        </div>
        <button type="button" data-island-trigger="6" style="all:unset;cursor:pointer;display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:8px;padding-top:6px;border-top:1px solid rgba(136,129,165,0.16);font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--w-txt-mut)">
          <span>VER PASSAPORTE COMPLETO</span>
          <span>→</span>
        </button>
      </div>
    </div>

    <!-- WIDGET MODO FOCO / TRILHA SONORA (CURRENT VIBE) -->
    <div class="world-glass-widget">
      <div class="widget-tag-title">
        <span>CURRENT VIBE · MODO FOCO</span>
        <span style="color:var(--w-accent)">♡</span>
      </div>
      <div class="vibe-player-row">
        <div class="vibe-cover">🎧</div>
        <div class="vibe-track-info">
          <div id="vibe-track-title" class="vibe-track-title">Focus Mode</div>
          <div id="vibe-track-sub" class="vibe-track-sub">lofi wealth &amp; mar</div>
        </div>
      </div>
      <div class="vibe-controls">
        <button type="button" id="vibe-prev-btn" class="vibe-ctrl-btn" title="Faixa anterior">⏮</button>
        <button type="button" id="vibe-play-btn" class="vibe-play-main" title="Tocar / Pausar Modo Foco">▶</button>
        <button type="button" id="vibe-next-btn" class="vibe-ctrl-btn" title="Próxima faixa">⏭</button>
      </div>
    </div>

    <!-- POST-IT INCLINADO: NOTA DO LEO (NOTE TO SELF) -->
    <div class="world-sticky-note">
      <div class="sticky-tape"></div>
      <div class="sticky-title">NOTA DO LEO ♡</div>
      <div class="sticky-quote">
        "Progresso e paz de espírito valem mais que promessas de lucro rápido."
      </div>
    </div>
  </aside>

  <!-- MAPA DO MUNDO (WORLD MAP MINI-MAPA NO CANTO INFERIOR DIREITO) -->
  <div class="world-minimap-card" aria-label="Mini-Mapa Interativo do Mundo">
    <img src="midias/mundo-jornada-ilhas.jpg" alt="Mini-mapa das ilhas" class="minimap-bg">
    <div class="minimap-overlay"></div>
    <div class="minimap-label">WORLD MAP</div>
    <svg class="minimap-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M 41 76 L 58.5 64 L 69 53 L 58 39 L 73 35 L 44 29 L 22 44" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.4" stroke-dasharray="2.5 2.5"/>
    </svg>
    <button type="button" class="minimap-node" style="left:44%;top:29%" data-minimap-island="1" data-island-trigger="1" title="Ilha 01: Sobre o Leo"></button>
    <button type="button" class="minimap-node" style="left:58%;top:39%" data-minimap-island="2" data-island-trigger="2" title="Ilha 02: Raio-X"></button>
    <button type="button" class="minimap-node" style="left:73%;top:35%" data-minimap-island="3" data-island-trigger="3" title="Ilha 03: Calculadoras"></button>
    <button type="button" class="minimap-node" style="left:22%;top:44%" data-minimap-island="4" data-island-trigger="4" title="Ilha 04: 4 Territórios"></button>
    <button type="button" class="minimap-node" style="left:69%;top:53%" data-minimap-island="5" data-island-trigger="5" title="Ilha 05: Notícias"></button>
    <button type="button" class="minimap-node" style="left:58.5%;top:64%" data-minimap-island="6" data-island-trigger="6" title="Ilha 06: Conversar com o Leo"></button>
    <div id="minimap-player-pin" title="Sua posição atual no mundo"></div>
    <div class="minimap-zoom-btns">
      <button type="button" id="minimap-zoom-in" class="minimap-zoom-btn" title="Aproximar câmera (+)">+</button>
      <button type="button" id="minimap-zoom-out" class="minimap-zoom-btn" title="Afastar câmera (-)">−</button>
    </div>
  </div>

  <!-- BASE CENTRAL: CONTROLE SCROLL / WASD INTERATIVO -->
  <div class="world-controls-center">
    <div class="world-scroll-pill">
      <span>🖱️ Scroll / Use <strong>WASD</strong> ou clique nas ilhas para caminhar pela jornada</span>
    </div>
    <div class="wasd-keys-row">
      <button type="button" class="wasd-key-btn" data-wasd="w" aria-label="Andar para cima (W)">W</button>
      <button type="button" class="wasd-key-btn" data-wasd="a" aria-label="Andar para esquerda (A)">A</button>
      <button type="button" class="wasd-key-btn" data-wasd="s" aria-label="Andar para baixo (S)">S</button>
      <button type="button" class="wasd-key-btn" data-wasd="d" aria-label="Andar para direita (D)">D</button>
    </div>
  </div>

  <!-- MODAL INTERATIVO DAS 6 ILHAS (ABRE QUANDO O PERSONAGEM CHEGA OU CLICA NA ILHA) -->
  <div id="island-modal-overlay" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="island-modal-window">
      <div class="island-modal-topbar">
        <div class="island-modal-badge-group">
          <span id="island-modal-num" class="island-modal-num-pill">ESTAÇÃO 03</span>
          <strong id="island-modal-title" style="font-family:var(--d);font-size:22px;color:#fff">CALCULADORAS DA VIDA</strong>
          <span class="island-modal-xp-tag">+100 XP CONQUISTADO ✨</span>
        </div>
        <div class="island-modal-nav-btns">
          <button type="button" id="island-modal-prev" class="island-modal-step-btn">← Ilha Anterior</button>
          <button type="button" id="island-modal-next" class="island-modal-step-btn">Próxima Ilha →</button>
          <button type="button" id="island-modal-close" class="island-modal-close" title="Fechar e continuar caminhando (ESC)">✕</button>
        </div>
      </div>
      <div id="island-modal-body" class="island-modal-body"></div>
    </div>
  </div>

</section>
`;

// Insert #jornada-world-app right before <!-- HERO
html = html.replace(
  '<!-- HERO',
  worldBlock + '\n<!-- HERO'
);

// Add id="classic-site-start" to the classic hero section
html = html.replace(
  '<section style="position:relative;height:100vh;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end">',
  '<section id="classic-site-start" style="position:relative;height:100vh;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end">'
);

// Mount the 5 Practical Calculators studio inside #vitrine-simulador
html = html.replace(
  '<!-- PAINEL INTERATIVO COMPACTO DO SIMULADOR -->',
  '<!-- ESTÚDIO DAS 5 CALCULADORAS PRÁTICAS DA VIDA (DIGITÁVEIS NO TECLADO) -->\n    <div id="home-calc5-studio-mount" style="margin-bottom:36px;background:var(--s1);border:1px solid var(--brd2);border-radius:24px;padding:28px"></div>\n    <!-- PAINEL INTERATIVO COMPACTO DO SIMULADOR -->'
);

// Include js/world-journey.js before </body>
html = html.replace(
  '<script src="js/shared-navigation.js"></script>',
  '<script src="js/shared-navigation.js"></script>\n<script src="js/world-journey.js"></script>'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully generated index.html! Bytes:', Buffer.byteLength(html, 'utf8'));

// Self-verification assertions
const assert = require('assert');
const simHtml = fs.readFileSync('simulador.html', 'utf8');
const worldJs = fs.readFileSync('js/world-journey.js', 'utf8');
assert(html.includes('id="jornada-world-app"'), 'Missing #jornada-world-app');
assert(html.includes('midias/mundo-jornada-ilhas.jpg'), 'Missing 3D archipelago illustration');
assert(html.includes('midias/hero-leo.webp'), 'Missing Leonardo Arruda photo in HUD');
for (let i = 1; i <= 6; i++) {
  assert(html.includes(`data-island-pin="${i}"`), `Missing island pin ${i}`);
  assert(html.includes(`data-badge-slot="${i}"`), `Missing badge slot ${i}`);
}
assert(html.includes('id="world-traveler"'), 'Missing walking character #world-traveler');
assert(html.includes('id="minimap-player-pin"'), 'Missing WORLD MAP interactive mini-map');
assert(html.includes('id="vibe-play-btn"'), 'Missing CURRENT VIBE audio player');
assert(html.includes('NOTA DO LEO'), 'Missing sticky note NOTA DO LEO');
assert(html.includes('class="world-theme-rail"'), 'Missing Frogsound lateral theme selector rail');
assert(simHtml.includes('id="simulador-calc5-mount"'), 'Missing #simulador-calc5-mount in simulador.html');
['renda', 'imovel', 'banco', 'dolar', 'heranca'].forEach(tab => {
  assert(worldJs.includes(`id: '${tab}'`), `Missing calculator tab ${tab}`);
});
assert(worldJs.includes('window.OutlierWorldJourney'), 'Missing window.OutlierWorldJourney export');
assert(worldJs.includes('localStorage'), 'Missing localStorage persistence');
assert(worldJs.includes('rx-extrato-reveal-btn'), 'Missing Por Trás do Extrato Bancário reveal');
console.log('✔ ALL WORLD JOURNEY & 5 CALCULATORS ASSERTIONS PASSED!');

