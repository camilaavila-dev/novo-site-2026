/* ==========================================================================
   LEONARDO ARRUDA · MOTOR DE JOGO DA JORNADA DO PATRIMÔNIO
   --------------------------------------------------------------------------
   Este arquivo e dono da LOGICA: estado, XP, badges, quests, modais e as 5
   calculadoras. O DESENHO vive em world-scenery.js / world-render.js (SVG).
   Nao desenhar aqui: o motor so entrega posicao e estado para a cena.
   --------------------------------------------------------------------------
   GAMIFICACAO,
   "POR TRÁS DO EXTRATO" (DRAW TO REVEAL) & SUÍTE DE 5 CALCULADORAS DA VIDA REAL
   ========================================================================== */

(function () {
  'use strict';

  const FORM_URL = 'https://forms.office.com/Pages/ResponsePage.aspx?id=6ez5YgM1m0G2Yyy_xOsD25muVoj4MslItAJalz086_lURDhJV1Y0QlVaUTZFV0RORUZMMUg2S1NKTi4u';

  // ---------------------------------------------------------------------------
  // 1. DEFINIÇÃO DAS 6 ILHAS DA JORNADA DE INVESTIMENTOS
  // ---------------------------------------------------------------------------
  const ISLANDS = [
    {
      id: 1, num: '01',
      title: 'O Consultor',
      sub: 'Quem conduz a análise',
      xpReward: 100,
      badgeIcon: 'trophy',
      badgeName: 'Dossiê aberto',
      color: '#6B66E8',
      questHint: 'entender o modelo de consultoria sem conflito de interesses'
    },
    {
      id: 2, num: '02',
      title: 'Raio-X da Carteira',
      sub: 'Onde o patrimônio vaza',
      xpReward: 120,
      badgeIcon: 'scan',
      badgeName: 'Diagnóstico feito',
      color: '#F2B705',
      questHint: 'mapear os custos invisíveis que corroem o rendimento real'
    },
    {
      id: 3, num: '03',
      title: 'Sala de Cálculo',
      sub: 'Cinco simulações',
      xpReward: 150,
      badgeIcon: 'calculator',
      badgeName: 'Cenários simulados',
      color: '#1CD98A',
      questHint: 'projetar renda, imóvel, custo bancário, dólar e sucessão'
    },
    {
      id: 4, num: '04',
      title: 'Os Quatro Pilares',
      sub: 'Blindagem familiar',
      xpReward: 120,
      badgeIcon: 'shield-chk',
      badgeName: 'Estrutura revisada',
      color: '#6B66E8',
      questHint: 'revisar proteção patrimonial, tributária e sucessória'
    },
    {
      id: 5, num: '05',
      title: 'Observatório',
      sub: 'O mercado da semana',
      xpReward: 100,
      badgeIcon: 'news',
      badgeName: 'Radar acompanhado',
      color: '#F2B705',
      questHint: 'ler o cenário macro traduzido para decisões concretas'
    },
    {
      id: 6, num: '06',
      title: 'A Conversa',
      sub: 'Reunião de estratégia',
      xpReward: 150,
      badgeIcon: 'crown',
      badgeName: 'Dossiê concluído',
      color: '#1CD98A',
      questHint: 'levar o diagnóstico para uma reunião individual com Leonardo'
    }
  ];

  // Avatares que o cliente pode alternar clicando no quadradinho do avatar
  // Perfis de investidor. O icone vem da folha vetorial (world-icons.js),
  // nunca de emoji: emoji muda de desenho em cada sistema operacional.
  const AVATARS = [
    { icon: 'user',   label: 'Empresário' },
    { icon: 'shield', label: 'Família' },
    { icon: 'globe',  label: 'Investidor global' },
    { icon: 'crown',  label: 'Legado' }
  ];

  // Estado da sessão de análise
  const state = {
    xp: 0,
    maxXp: 740,
    level: 1,
    visitedIslands: new Set(),
    avatarIdx: 0,
    currentNodeIdx: 0,
    audioPlaying: false,
    maskRevealedBonus: false,
    themeIdx: 0,
    activeCalcTab: 'renda'
  };

  // ---------------------------------------------------------------------------
  // 2. SINTETIZADOR DE ÁUDIO TÁTIL & RÁDIO MODO FOCO (WEB AUDIO API)
  // ---------------------------------------------------------------------------
  let audioCtx = null;
  let ambientInterval = null;

  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChime(freq = 528, type = 'sine', duration = 0.18) {
    try {
      ensureAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, audioCtx.currentTime + duration);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // Troca o símbolo de um <use> sem destruir o <svg> que o contém.
  // Escrever textContent aqui apagaria o ícone vetorial inteiro.
  function setIcon(el, name) {
    const use = el && el.querySelector('use');
    if (use) use.setAttribute('href', `#ic-${name}`);
  }

  function toggleAmbientMusic() {
    state.audioPlaying = !state.audioPlaying;
    const disc = document.getElementById('vibe-disc');
    const btn = document.getElementById('vibe-play-btn');
    const topBtn = document.getElementById('top-sound-btn');

    if (state.audioPlaying) {
      ensureAudio();
      if (disc) disc.classList.add('playing');
      setIcon(btn, 'sound-on');
      setIcon(topBtn, 'sound-on');
      playChime(440, 'triangle', 0.3);
      const chords = [261.63, 329.63, 392.00, 493.88, 587.33];
      let step = 0;
      ambientInterval = setInterval(() => {
        if (!state.audioPlaying) return;
        const note = chords[step % chords.length];
        playChime(note, 'sine', 0.85);
        step++;
      }, 1400);
    } else {
      if (ambientInterval) clearInterval(ambientInterval);
      if (disc) disc.classList.remove('playing');
      setIcon(btn, 'sound-off');
      setIcon(topBtn, 'sound-off');
    }
  }

  // ---------------------------------------------------------------------------
  // 3. SISTEMA DE XP, NÍVEIS, BADGES E MISSÕES
  // ---------------------------------------------------------------------------
  function showToast(msg) {
    const toast = document.getElementById('jw-xp-toast');
    if (!toast) return;
    const slot = document.getElementById('jw-xp-toast-text');
    if (slot) slot.textContent = msg;
    else toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2900);
  }

  function addXP(amount, reason) {
    state.xp = Math.min(state.maxXp, state.xp + amount);
    const newLevel = Math.min(6, 1 + Math.floor(state.xp / 130));
    const leveledUp = newLevel > state.level;
    state.level = newLevel;

    updateGamificationHUD();
    playChime(leveledUp ? 660 : 520, 'triangle', leveledUp ? 0.35 : 0.16);
    if (reason) {
      showToast(reason);
    }
  }

  function updateGamificationHUD() {
    const pct = Math.min(100, Math.round((state.xp / state.maxXp) * 100));
    const lvlNames = [
      'Leitura inicial',
      'Mapeamento',
      'Diagnóstico',
      'Projeção',
      'Estruturação',
      'Dossiê completo'
    ];
    const lvlTitle = lvlNames[Math.min(lvlNames.length - 1, state.level - 1)];

    const elLv = document.getElementById('hud-level-text');
    const elPct = document.getElementById('hud-exp-pct');
    const elExpNum = document.getElementById('hud-exp-num');
    const elFill1 = document.getElementById('hud-exp-fill-left');
    const elFill2 = document.getElementById('hud-exp-fill-right');
    const elXpRight = document.getElementById('hud-xp-right-num');
    const elQuestText = document.getElementById('hud-quest-text');
    const elBadgesCount = document.getElementById('hud-badges-count');

    if (elLv) elLv.textContent = lvlTitle;
    if (elPct) elPct.textContent = `${pct}%`;
    if (elExpNum) {
      elExpNum.textContent = `${state.visitedIslands.size} de 6 territórios mapeados`;
    }
    if (elFill1) elFill1.style.width = `${pct}%`;
    if (elFill2) elFill2.style.width = `${pct}%`;
    if (elXpRight) elXpRight.textContent = `${pct}% concluído`;
    if (elBadgesCount) elBadgesCount.textContent = `${state.visitedIslands.size}/6`;

    // Atualiza a próxima missão sugerida
    const nextIsland = ISLANDS.find(isl => !state.visitedIslands.has(isl.id));
    if (elQuestText) {
      if (nextIsland) {
        elQuestText.textContent = `Abra o território ${nextIsland.num}, ${nextIsland.title}, para ${nextIsland.questHint}.`;
      } else {
        elQuestText.textContent = 'Jornada completa. Seu dossiê está pronto para a conversa com o Leo.';
      }
    }

    // Marca as etapas concluídas no índice e nas medalhas.
    ISLANDS.forEach(isl => {
      const done = state.visitedIslands.has(isl.id);
      const badge = document.getElementById(`badge-slot-${isl.id}`);
      if (badge) badge.classList.toggle('unlocked', done);
      document.querySelectorAll(`.citadel-chip[data-island="${isl.id}"]`)
        .forEach(chip => chip.classList.toggle('done', done));
    });
  }

  // ---------------------------------------------------------------------------
  // 4. NAVEGAÇÃO DO PERSONAGEM PELAS ILHAS (WASD / SETAS / SCROLL / CLIQUE)
  // ---------------------------------------------------------------------------
  function walkToIsland(territoryId, openModal = true) {
    const t = ISLANDS.find(i => i.id === territoryId);
    if (!t) return;

    state.currentNodeIdx = territoryId;

    // A câmera enquadra o território; a chegada é o próprio movimento.
    if (window.WorldMap) window.WorldMap.focus(territoryId);

    document.querySelectorAll('.citadel-chip').forEach(el => {
      el.classList.toggle('active', Number(el.dataset.island) === territoryId);
    });

    // Sair do panorama apaga o estado ativo da barra superior.
    document.getElementById('nav-btn-world')?.classList.remove('is-active');

    onArriveAtIsland(territoryId, openModal);
  }

  function stepNextIsland(dir = 1) {
    let next = state.currentNodeIdx + dir;
    if (next < 1) next = 1;
    if (next > 6) next = 6;
    walkToIsland(next, false);
  }

  function onArriveAtIsland(territoryId, openModal) {
    const t = ISLANDS.find(i => i.id === territoryId);
    if (!t) return;

    if (window.WorldMap) window.WorldMap.markVisited(territoryId);

    if (!state.visitedIslands.has(territoryId)) {
      state.visitedIslands.add(territoryId);
      addXP(t.xpReward, `${t.num} · ${t.badgeName}`);
    } else {
      playChime(587.33, 'sine', 0.12);
      updateGamificationHUD();
    }

    if (openModal) {
      // Deixa a câmera chegar antes de abrir o painel.
      setTimeout(() => openIslandModal(territoryId), 620);
    }
  }

  // ---------------------------------------------------------------------------
  // 5. RENDERIZA  // ---------------------------------------------------------------------------
  // 5. RENDERIZAÇÃO DO MUNDO ISOMÉTRICO DE ILHAS + PONTES + PERSONAGEM (CANVAS)
  // ---------------------------------------------------------------------------

  function initWorldStage() {
    const host = document.getElementById('world-stage');
    if (!host || !window.WorldMap) return;

    window.WorldMap.mount({
      container: host,
      art: 'midias/cidadela-patrimonio.jpg',
      territories: ISLANDS,
      onSelect: (id) => walkToIsland(id, true)
    });

    // Clicar fora de um marcador devolve a visão panorâmica.
    host.addEventListener('click', (e) => {
      if (e.target.closest('.wm-marker')) return;
      if (window.WorldMap.focusId !== null) resetView();
    });
  }

  function resetView() {
    if (window.WorldMap) window.WorldMap.reset();
    state.currentNodeIdx = 0;
    document.querySelectorAll('.citadel-chip').forEach(el => el.classList.remove('active'));
    document.getElementById('nav-btn-world')?.classList.add('is-active');
  }

  // ---------------------------------------------------------------------------
  // 6. MODO "BEHIND THE MASK / POR TRÁS DO EXTRATO" (DRAW TO REVEAL)
  // ---------------------------------------------------------------------------
  let revealCanvas, rCtx;
  let maskImgLoaded = false;
  const leoImg = new Image();
  leoImg.src = 'midias/leo-arruda.png';
  leoImg.onload = () => { maskImgLoaded = true; };

  function initBehindTheMask() {
    revealCanvas = document.getElementById('reveal-canvas');
    if (!revealCanvas) return;
    rCtx = revealCanvas.getContext('2d');

    const brushPoints = [];

    function resizeMask() {
      revealCanvas.width = window.innerWidth;
      revealCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeMask);
    resizeMask();

    function addBrushPoint(x, y) {
      brushPoints.push({ x, y, r: 95, alpha: 1.0 });
      if (brushPoints.length > 55) brushPoints.shift();
      if (!state.maskRevealedBonus && brushPoints.length > 25) {
        state.maskRevealedBonus = true;
        addXP(100, 'Segredo Revelado: Você enxergou por trás da máscara dos bancos!');
      }
    }

    revealCanvas.addEventListener('mousemove', e => addBrushPoint(e.clientX, e.clientY));
    revealCanvas.addEventListener('touchmove', e => {
      if (e.touches[0]) addBrushPoint(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    function renderMask() {
      if (!document.getElementById('mask-view')?.classList.contains('active')) {
        requestAnimationFrame(renderMask);
        return;
      }
      const w = revealCanvas.width;
      const h = revealCanvas.height;
      rCtx.clearRect(0, 0, w, h);

      // CAMADA 1 (Fundo Escuro: A Fachada Tradicional)
      rCtx.fillStyle = '#05030E';
      rCtx.fillRect(0, 0, w, h);

      // Texto manuscrito sutil no fundo escuro (estilo Spider-Man "WITH GREAT POWER...")
      rCtx.save();
      rCtx.translate(w * 0.5, h * 0.52);
      rCtx.rotate(-0.06);
      rCtx.font = 'italic 600 34px "Cormorant Garamond", Georgia, serif';
      rCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      rCtx.textAlign = 'center';
      rCtx.fillText('COM GRANDE PATRIMÔNIO VEM A GRANDE RESPONSABILIDADE', 0, -40);
      rCtx.fillText('DE PROTEGER QUEM VOCÊ AMA CONTRA CONFLITOS OCULTOS', 0, 10);
      rCtx.fillText('100% DO SEU LADO · TRANSPARÊNCIA ABSOLUTA · PORTFEL', 0, 60);
      rCtx.restore();

      // Foto central em silhueta escura
      if (maskImgLoaded) {
        const imgH = h * 0.86;
        const imgW = (leoImg.width / leoImg.height) * imgH;
        rCtx.save();
        rCtx.globalAlpha = 0.35;
        rCtx.drawImage(leoImg, w * 0.5 - imgW * 0.5, h - imgH, imgW, imgH);
        rCtx.restore();
      }

      // CAMADA 2 (Revelada pelo pincel do mouse/dedo!)
      brushPoints.forEach(pt => {
        pt.alpha *= 0.985;
      });
      while (brushPoints.length && brushPoints[0].alpha < 0.04) {
        brushPoints.shift();
      }

      if (brushPoints.length > 0) {
        rCtx.save();
        rCtx.beginPath();
        brushPoints.forEach(pt => {
          rCtx.moveTo(pt.x + pt.r, pt.y);
          rCtx.arc(pt.x, pt.y, pt.r * pt.alpha, 0, Math.PI * 2);
        });
        rCtx.clip();

        // Fundo iluminado Esmeralda/Violeta dentro da máscara revelada
        const revGrad = rCtx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.6);
        revGrad.addColorStop(0, '#1B1447');
        revGrad.addColorStop(1, '#06261B');
        rCtx.fillStyle = revGrad;
        rCtx.fillRect(0, 0, w, h);

        // Frase Secreta Acesa em Ouro e Esmeralda!
        rCtx.save();
        rCtx.translate(w * 0.5, h * 0.52);
        rCtx.rotate(-0.06);
        rCtx.font = 'italic 700 36px "Cormorant Garamond", Georgia, serif';
        rCtx.fillStyle = '#1CD98A';
        rCtx.textAlign = 'center';
        rCtx.fillText('COM GRANDE PATRIMÔNIO VEM A GRANDE RESPONSABILIDADE', 0, -40);
        rCtx.fillStyle = '#F2B705';
        rCtx.fillText('ZERO COMISSÕES ESCONDIDAS · DEVOLUÇÃO DE REBATES', 0, 10);
        rCtx.fillStyle = '#FFFFFF';
        rCtx.fillText('ENGENHARIA DE VIDA, DÓLAR & SUCESSÃO FAMILIAR', 0, 60);
        rCtx.restore();

        if (maskImgLoaded) {
          const imgH = h * 0.86;
          const imgW = (leoImg.width / leoImg.height) * imgH;
          rCtx.drawImage(leoImg, w * 0.5 - imgW * 0.5, h - imgH, imgW, imgH);
        }

        rCtx.restore();

        // Anel brilhante no cursor atual
        const last = brushPoints[brushPoints.length - 1];
        rCtx.strokeStyle = '#1CD98A';
        rCtx.lineWidth = 2;
        rCtx.beginPath();
        rCtx.arc(last.x, last.y, last.r, 0, Math.PI * 2);
        rCtx.stroke();
      }

      requestAnimationFrame(renderMask);
    }
    requestAnimationFrame(renderMask);
  }

  // ---------------------------------------------------------------------------
  // 7. AS 5 CALCULADORAS PRÁTICAS DA VIDA REAL (TELA ÚNICA + DIGITÁVEIS)
  // ---------------------------------------------------------------------------
  const calcState = {
    // 1. Viver de Renda
    p0: 500000,
    pmt: 8000,
    anos: 15,
    rendaDesejada: 20000,
    // 2. Imóvel vs Investir
    valorImovel: 1200000,
    aluguelBruto: 4800,
    anosImovel: 15,
    // 3. Ralo do Banco vs Fee-Based
    patrimonioBanco: 1000000,
    taxaOcultaBanco: 2.1,
    anosBanco: 15,
    // 4. Proteção em Dólar
    patrimonioTotal: 1000000,
    pctDolarAtual: 5,
    pctDolarIdeal: 30,
    desvalRealAnos: 45,
    // 5. Inventário & Herança
    patrimonioHeranca: 2500000,
    numHerdeiros: 2
  };

  function fmtBRL(v) {
    return 'R$ ' + Math.round(v).toLocaleString('pt-BR');
  }

  function renderCalculatorSuite(containerId) {
    const root = document.getElementById(containerId);
    if (!root) return;

    const tabs = [
      { id: 'renda', icon: '🏝️', label: '1. Quando Posso Viver de Renda?' },
      { id: 'imovel', icon: '🏠', label: '2. Imóvel Alugado vs. Investir' },
      { id: 'banco', icon: '🏦', label: '3. O Ralo Invisível do Seu Banco' },
      { id: 'dolar', icon: '🌎', label: '4. Proteção em Dólar' },
      { id: 'heranca', icon: '🛡️', label: '5. Inventário & Herança' }
    ];

    let html = `
      <div class="calc-tabs-bar">
        ${tabs.map(t => `
          <button type="button" class="calc-tab-btn ${state.activeCalcTab === t.id ? 'active' : ''}" data-calctab="${t.id}">
            <span>${t.icon}</span> ${t.label}
          </button>
        `).join('')}
      </div>
      <div id="${containerId}-content"></div>
    `;
    root.innerHTML = html;

    root.querySelectorAll('.calc-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCalcTab = btn.dataset.calctab;
        playChime(523.25, 'sine', 0.1);
        renderCalculatorSuite(containerId);
      });
    });

    renderActiveCalcBody(`${containerId}-content`);
  }

  function renderActiveCalcBody(targetId) {
    const box = document.getElementById(targetId);
    if (!box) return;
    const t = state.activeCalcTab;

    if (t === 'renda') {
      const rRealAnual = 0.068; // ~6,8% a.a. acima da inflação na consultoria independente
      const rBancoAnual = 0.048; // ~4,8% a.a. após taxas ocultas de banco
      const rMes = Math.pow(1 + rRealAnual, 1 / 12) - 1;
      const rMesBanco = Math.pow(1 + rBancoAnual, 1 / 12) - 1;
      const nMeses = calcState.anos * 12;

      const totalLeo = calcState.p0 * Math.pow(1 + rMes, nMeses) + calcState.pmt * ((Math.pow(1 + rMes, nMeses) - 1) / rMes);
      const totalBanco = calcState.p0 * Math.pow(1 + rMesBanco, nMeses) + calcState.pmt * ((Math.pow(1 + rMesBanco, nMeses) - 1) / rMesBanco);
      const rendaGerada = (totalLeo * 0.0045); // ~0,45% real ao mês sem consumir principal
      const metaPatrimonio = calcState.rendaDesejada / 0.0045;
      const diffSalvo = Math.max(0, totalLeo - totalBanco);
      const anosPoupados = Math.max(1, (diffSalvo / (calcState.rendaDesejada * 12))).toFixed(1);

      box.innerHTML = `
        <div class="calc-cockpit-grid">
          <div class="calc-inputs-col">
            ${buildField('p0', 'Quanto você já tem guardado hoje?', 'R$', calcState.p0, 0, 10000000, 25000)}
            ${buildField('pmt', 'Quanto consegue investir por mês?', 'R$', calcState.pmt, 0, 150000, 1000)}
            ${buildField('anos', 'Daqui a quantos anos quer viver de renda?', 'anos', calcState.anos, 1, 35, 1)}
            ${buildField('rendaDesejada', 'Quanto quer receber por mês no futuro?', 'R$', calcState.rendaDesejada, 3000, 200000, 1000)}
          </div>
          <div class="calc-visual-col">
            <div class="calc-kpis-row">
              <div class="calc-kpi-box highlight">
                <div class="calc-kpi-label">Sua Renda Mensal Vitalícia</div>
                <div class="calc-kpi-val">${fmtBRL(rendaGerada)}/mês</div>
                <div class="calc-kpi-sub">Já descontando a inflação, sem gastar o principal</div>
              </div>
              <div class="calc-kpi-box">
                <div class="calc-kpi-label">Patrimônio Total Acumulado</div>
                <div class="calc-kpi-val">${fmtBRL(totalLeo)}</div>
                <div class="calc-kpi-sub">No banco comum seria ${fmtBRL(totalBanco)}</div>
              </div>
              <div class="calc-kpi-box">
                <div class="calc-kpi-label">Dinheiro Salvo de Taxas Ocultas</div>
                <div class="calc-kpi-val" style="color:var(--jw-gold)">+${fmtBRL(diffSalvo)}</div>
                <div class="calc-kpi-sub">Antecipa sua aposentadoria em <strong>${anosPoupados} anos</strong></div>
              </div>
            </div>
            <div class="calc-chart-box">
              <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--jw-mut);margin-bottom:8px;">
                <span>Comparativo no Poder de Compra de Hoje (${calcState.anos} anos)</span>
                <span>Meta para gerar ${fmtBRL(calcState.rendaDesejada)}/mês: <strong>${fmtBRL(metaPatrimonio)}</strong></span>
              </div>
              ${buildDualBarsSVG(totalLeo, totalBanco, metaPatrimonio, 'Com Consultoria Independente (Leo)', 'No Banco / Assessoria Comum')}
            </div>
            <div class="calc-tangible-strip">
              <div>💡 <strong>Na vida real:</strong> Os <strong>${fmtBRL(diffSalvo)}</strong> que você deixa de perder em taxas ocultas equivalem a <strong>${Math.max(1, Math.round(diffSalvo / 420000))} faculdades particulares de Medicina</strong> para seus filhos ou <strong>${anosPoupados} anos de liberdade antecipada</strong>!</div>
              <a href="${FORM_URL}" target="_blank" rel="noopener" class="jw-cta-top">Montar Meu Plano ↗</a>
            </div>
          </div>
        </div>
      `;
    } else if (t === 'imovel') {
      const nMeses = calcState.anosImovel * 12;
      // Aluguel líquido (descontando IR, condomínio/vacância média ~22%)
      const aluguelLiquido = calcState.aluguelBruto * 0.78;
      // Renda mensal líquida investindo o mesmo valor a 0,55% real isento (FIIs/NTN-B/Carteira)
      const rendaInvestimento = calcState.valorImovel * 0.0058;
      const diferencaMensal = Math.max(0, rendaInvestimento - aluguelLiquido);
      const acumDiferenca = diferencaMensal * ((Math.pow(1.0055, nMeses) - 1) / 0.0055);

      box.innerHTML = `
        <div class="calc-cockpit-grid">
          <div class="calc-inputs-col">
            ${buildField('valorImovel', 'Qual o valor de mercado do imóvel?', 'R$', calcState.valorImovel, 200000, 15000000, 50000)}
            ${buildField('aluguelBruto', 'Quanto ele rende de aluguel bruto por mês?', 'R$', calcState.aluguelBruto, 1000, 80000, 500)}
            ${buildField('anosImovel', 'Comparar por quantos anos?', 'anos', calcState.anosImovel, 1, 30, 1)}
          </div>
          <div class="calc-visual-col">
            <div class="calc-kpis-row">
              <div class="calc-kpi-box">
                <div class="calc-kpi-label">Aluguel Líquido no Bolso (Imóvel)</div>
                <div class="calc-kpi-val">${fmtBRL(aluguelLiquido)}/mês</div>
                <div class="calc-kpi-sub">Descontando IR, vacância e manutenção</div>
              </div>
              <div class="calc-kpi-box highlight">
                <div class="calc-kpi-label">Renda Líquida Investindo o Valor</div>
                <div class="calc-kpi-val">${fmtBRL(rendaInvestimento)}/mês</div>
                <div class="calc-kpi-sub">Com liquidez diária e zero dor de cabeça com inquilino</div>
              </div>
              <div class="calc-kpi-box">
                <div class="calc-kpi-label">Riqueza Extra Reinvestindo a Diferença</div>
                <div class="calc-kpi-val" style="color:var(--jw-gold)">+${fmtBRL(acumDiferenca)}</div>
                <div class="calc-kpi-sub">Em ${calcState.anosImovel} anos sem imobilizar seu capital</div>
              </div>
            </div>
            <div class="calc-chart-box">
              ${buildDualBarsSVG(rendaInvestimento, aluguelLiquido, rendaInvestimento, 'Renda Mensal na Carteira Planejada', 'Aluguel Líquido do Imóvel Físico')}
            </div>
            <div class="calc-tangible-strip">
              <div>🏠 <strong>Veredito Prático:</strong> Investindo os <strong>${fmtBRL(calcState.valorImovel)}</strong> você recebe <strong>+${fmtBRL(diferencaMensal)} todos os meses</strong> a mais do que no aluguel, sem risco de inquilino ou reforma!</div>
              <a href="${FORM_URL}" target="_blank" rel="noopener" class="jw-cta-top">Avaliar Meus Imóveis ↗</a>
            </div>
          </div>
        </div>
      `;
    } else if (t === 'banco') {
      const anos = calcState.anosBanco;
      const p = calcState.patrimonioBanco;
      const taxa = calcState.taxaOcultaBanco / 100;
      const finalLimpo = p * Math.pow(1.07, anos);
      const finalComTaxa = p * Math.pow(1.07 - taxa, anos);
      const perdido = Math.max(0, finalLimpo - finalComTaxa);
      const viagens = Math.max(1, Math.round(perdido / 45000));
      const carros = Math.max(1, (perdido / 220000).toFixed(1));

      box.innerHTML = `
        <div class="calc-cockpit-grid">
          <div class="calc-inputs-col">
            ${buildField('patrimonioBanco', 'Quanto você tem investido no banco/corretora?', 'R$', calcState.patrimonioBanco, 100000, 20000000, 50000)}
            ${buildField('taxaOcultaBanco', 'Taxa oculta média cobrada pelo banco (% ao ano)', '%', calcState.taxaOcultaBanco, 0.5, 4.0, 0.1)}
            ${buildField('anosBanco', 'Durante quantos anos?', 'anos', calcState.anosBanco, 1, 30, 1)}
          </div>
          <div class="calc-visual-col">
            <div class="calc-kpis-row">
              <div class="calc-kpi-box" style="border-color:rgba(255,77,121,0.5)">
                <div class="calc-kpi-label">Dinheiro Doado Invisivelmente ao Banco</div>
                <div class="calc-kpi-val" style="color:var(--jw-rose)">-${fmtBRL(perdido)}</div>
                <div class="calc-kpi-sub">Saíram do seu bolso em comissões e spreads ocultos</div>
              </div>
              <div class="calc-kpi-box highlight">
                <div class="calc-kpi-label">Patrimônio Preservado com o Leo</div>
                <div class="calc-kpi-val">${fmtBRL(finalLimpo)}</div>
                <div class="calc-kpi-sub">Com devolução de comissões (Cashback Fee-Based)</div>
              </div>
              <div class="calc-kpi-box">
                <div class="calc-kpi-label">O Que Você Comprou Para o Banco</div>
                <div class="calc-kpi-val" style="color:var(--jw-gold)">${viagens} Viagens</div>
                <div class="calc-kpi-sub">Ou <strong>${carros} carros de luxo</strong> deixados na mesa</div>
              </div>
            </div>
            <div class="calc-chart-box">
              ${buildDualBarsSVG(finalLimpo, finalComTaxa, finalLimpo, 'Seu Patrimônio Sem Conflito (Fee-Based)', 'Seu Patrimônio Drenado por Comissões Ocultas')}
            </div>
            <div class="calc-tangible-strip">
              <div>🚨 <strong>Feche o ralo:</strong> Em ${anos} anos, uma taxa "invisível" de ${calcState.taxaOcultaBanco}% drena <strong>${fmtBRL(perdido)}</strong> da sua família. Na consultoria independente, esse dinheiro volta para você.</div>
              <a href="${FORM_URL}" target="_blank" rel="noopener" class="jw-cta-top">Estancar Vazamento ↗</a>
            </div>
          </div>
        </div>
      `;
    } else if (t === 'dolar') {
      const p = calcState.patrimonioTotal;
      const choque = calcState.desvalRealAnos / 100;
      const perdaSemDolar = p * (1 - 1 / (1 + choque));
      const ganhoProtegido = p * (calcState.pctDolarIdeal / 100) * choque;

      box.innerHTML = `
        <div class="calc-cockpit-grid">
          <div class="calc-inputs-col">
            ${buildField('patrimonioTotal', 'Qual o seu patrimônio total hoje?', 'R$', calcState.patrimonioTotal, 200000, 20000000, 50000)}
            ${buildField('pctDolarIdeal', 'Quanto você quer proteger em Dólar/Exterior (%)?', '%', calcState.pctDolarIdeal, 5, 80, 5)}
            ${buildField('desvalRealAnos', 'Se o Dólar subir quantos % nos próximos anos?', '%', calcState.desvalRealAnos, 10, 100, 5)}
          </div>
          <div class="calc-visual-col">
            <div class="calc-kpis-row">
              <div class="calc-kpi-box highlight">
                <div class="calc-kpi-label">Fatia Blindada em Moeda Forte</div>
                <div class="calc-kpi-val">${fmtBRL(p * (calcState.pctDolarIdeal / 100))}</div>
                <div class="calc-kpi-sub">${calcState.pctDolarIdeal}% protegido fora do risco Brasil</div>
              </div>
              <div class="calc-kpi-box">
                <div class="calc-kpi-label">Ganho de Proteção Cambial</div>
                <div class="calc-kpi-val" style="color:var(--jw-gold)">+${fmtBRL(ganhoProtegido)}</div>
                <div class="calc-kpi-sub">Amortecendo a queda do poder de compra do Real</div>
              </div>
              <div class="calc-kpi-box">
                <div class="calc-kpi-label">Perda Global se Ficar 100% em Real</div>
                <div class="calc-kpi-val" style="color:var(--jw-rose)">-${fmtBRL(perdaSemDolar)}</div>
                <div class="calc-kpi-sub">De poder de compra internacional perdido</div>
              </div>
            </div>
            <div class="calc-chart-box">
              ${buildDualBarsSVG(p + ganhoProtegido, p - perdaSemDolar, p + ganhoProtegido, 'Carteira Dolarizada Internacionalmente', 'Carteira 100% Presa no Risco Brasil')}
            </div>
            <div class="calc-tangible-strip">
              <div>🌎 <strong>Fronteira Segura:</strong> Ter ${calcState.pctDolarIdeal}% em Dólar/Europa garante que viagens, estudos dos filhos fora e seu padrão de vida nunca dependam de Brasília.</div>
              <a href="${FORM_URL}" target="_blank" rel="noopener" class="jw-cta-top">Dolarizar Com Segurança ↗</a>
            </div>
          </div>
        </div>
      `;
    } else if (t === 'heranca') {
      const p = calcState.patrimonioHeranca;
      const custoInventario = p * 0.14; // ~14% entre ITCMD, honorários advocatícios e custas judiciais
      const custoPlanejado = p * 0.025; // Previdência/Seguro/Holding planejada
      const economia = Math.max(0, custoInventario - custoPlanejado);

      box.innerHTML = `
        <div class="calc-cockpit-grid">
          <div class="calc-inputs-col">
            ${buildField('patrimonioHeranca', 'Valor total do patrimônio da família (Imóveis + Investimentos)', 'R$', calcState.patrimonioHeranca, 300000, 30000000, 100000)}
            ${buildField('numHerdeiros', 'Quantos herdeiros / filhos na família?', 'herdeiros', calcState.numHerdeiros, 1, 8, 1)}
          </div>
          <div class="calc-visual-col">
            <div class="calc-kpis-row">
              <div class="calc-kpi-box" style="border-color:rgba(255,77,121,0.5)">
                <div class="calc-kpi-label">Perda num Inventário Tradicional</div>
                <div class="calc-kpi-val" style="color:var(--jw-rose)">-${fmtBRL(custoInventario)}</div>
                <div class="calc-kpi-sub">+ Contas bloqueadas de 1 a 3 anos na Justiça</div>
              </div>
              <div class="calc-kpi-box highlight">
                <div class="calc-kpi-label">Economia com Planejamento Sucessório</div>
                <div class="calc-kpi-val">+${fmtBRL(economia)}</div>
                <div class="calc-kpi-sub">Dinheiro que fica 100% com seus filhos em até 15 dias</div>
              </div>
              <div class="calc-kpi-box">
                <div class="calc-kpi-label">Proteção Extra por Herdeiro</div>
                <div class="calc-kpi-val" style="color:var(--jw-gold)">+${fmtBRL(economia / calcState.numHerdeiros)}</div>
                <div class="calc-kpi-sub">Preservados para cada um dos ${calcState.numHerdeiros} herdeiros</div>
              </div>
            </div>
            <div class="calc-chart-box">
              ${buildDualBarsSVG(p - custoPlanejado, p - custoInventario, p, 'Herança Líquida Planejada (Previdência/Seguro/Holding)', 'Herança Após Impostos e Custas de Inventário Comum')}
            </div>
            <div class="calc-tangible-strip">
              <div>🛡️ <strong>Paz para quem você ama:</strong> Sem planejamento, a família precisa ter <strong>${fmtBRL(custoInventario)} à vista</strong> para liberar os bens. Com o Leo, a liquidez cai na mão da família sem passar por inventário.</div>
              <a href="${FORM_URL}" target="_blank" rel="noopener" class="jw-cta-top">Blindar Minha Família ↗</a>
            </div>
          </div>
        </div>
      `;
    }

    // Conecta eventos de digitação no teclado E arraste dos sliders!
    box.querySelectorAll('[data-calcfield]').forEach(el => {
      const key = el.dataset.calcfield;
      el.addEventListener('input', (e) => {
        const raw = String(e.target.value).replace(/[^\d.,]/g, '').replace(',', '.');
        const num = parseFloat(raw);
        if (!isNaN(num)) {
          calcState[key] = num;
          // Se veio do slider, atualiza o input de texto; se veio do texto, re-renderiza no change
          if (e.target.type === 'range') {
            renderActiveCalcBody(targetId);
          }
        }
      });
      if (el.type === 'text') {
        el.addEventListener('change', () => renderActiveCalcBody(targetId));
        el.addEventListener('keyup', (ev) => {
          if (ev.key === 'Enter') renderActiveCalcBody(targetId);
        });
      }
    });
  }

  function buildField(key, label, unit, val, min, max, step) {
    const formatted = unit === 'R$' ? Math.round(val).toLocaleString('pt-BR') : val;
    return `
      <div class="calc-field">
        <div class="calc-field-top">
          <label class="calc-field-label">${label}</label>
          <div class="calc-num-input-wrap" title="Clique para digitar qualquer valor no teclado">
            <span class="calc-num-prefix">${unit}</span>
            <input type="text" class="calc-num-input" data-calcfield="${key}" value="${formatted}" aria-label="${label}">
          </div>
        </div>
        <input type="range" class="calc-range" data-calcfield="${key}" min="${min}" max="${max}" step="${step}" value="${val}">
      </div>
    `;
  }

  function buildDualBarsSVG(valA, valB, maxRef, labelA, labelB) {
    const maxV = Math.max(valA, valB, maxRef, 1);
    const pctA = Math.min(100, Math.max(12, Math.round((valA / maxV) * 100)));
    const pctB = Math.min(100, Math.max(12, Math.round((valB / maxV) * 100)));
    return `
      <div style="display:flex;flex-direction:column;gap:14px;margin:auto 0;">
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:5px;">
            <span style="color:var(--jw-grn)">✦ ${labelA}</span>
            <span style="font-family:var(--jw-font-m);color:var(--jw-grn)">${fmtBRL(valA)}</span>
          </div>
          <div style="height:22px;background:rgba(255,255,255,0.06);border-radius:999px;overflow:hidden;">
            <div style="height:100%;width:${pctA}%;background:linear-gradient(90deg,#3B36CC,#1CD98A);border-radius:999px;transition:width .35s ease;"></div>
          </div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;margin-bottom:5px;color:var(--jw-mut);">
            <span>• ${labelB}</span>
            <span style="font-family:var(--jw-font-m)">${fmtBRL(valB)}</span>
          </div>
          <div style="height:18px;background:rgba(255,255,255,0.06);border-radius:999px;overflow:hidden;">
            <div style="height:100%;width:${pctB}%;background:linear-gradient(90deg,#FF4D79,#F2B705);border-radius:999px;opacity:0.78;transition:width .35s ease;"></div>
          </div>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // 8. MODAIS INTERATIVOS DE CADA UMA DAS 6 ILHAS
  // ---------------------------------------------------------------------------
  function openIslandModal(islandId) {
    const backdrop = document.getElementById('jw-modal-backdrop');
    const numEl = document.getElementById('jw-modal-num');
    const titleEl = document.getElementById('jw-modal-title');
    const bodyEl = document.getElementById('jw-modal-body');
    if (!backdrop || !bodyEl) return;

    const isl = ISLANDS.find(i => i.id === islandId);
    if (!isl) return;

    numEl.textContent = `Território ${isl.num} · ${isl.sub}`;
    titleEl.textContent = isl.title;
    backdrop.classList.add('open');

    if (islandId === 3) {
      // Ilha 03: Abre a Suíte das 5 Calculadoras da Vida Real direto na tela!
      bodyEl.innerHTML = `<div id="modal-calc-suite"></div>`;
      renderCalculatorSuite('modal-calc-suite');
    } else if (islandId === 1) {
      bodyEl.innerHTML = `
        <div style="display:grid;grid-template-columns:260px 1fr;gap:24px;align-items:center;">
          <img src="midias/leo-arruda.png" alt="Leonardo Arruda" style="width:100%;height:310px;object-fit:cover;object-position:top;border-radius:18px;border:2px solid var(--jw-grn);">
          <div>
            <div style="font-family:var(--jw-font-m);font-size:11px;color:var(--jw-grn);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">Seu Estrategista Pessoal · ANBIMA CEA · Portfel (Grupo Primo)</div>
            <h3 style="font-family:var(--jw-font-d);font-size:32px;margin-bottom:12px;">Leonardo Arruda: 100% do seu lado da mesa, sem comissões escondidas.</h3>
            <p style="font-size:14px;line-height:1.6;color:var(--jw-mut);margin-bottom:14px;">
              Nos bancos e corretoras tradicionais, o gerente ou assessor ganha comissão sobre o produto que te empurra. Na consultoria independente <strong>Fee-Based da Portfel</strong>, nós eliminamos esse conflito: todas as comissões de produtos voltam para a sua conta (cashback) e meu único objetivo é fazer o seu patrimônio crescer com segurança.
            </p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px;">
              <div class="calc-kpi-box highlight"><div class="calc-kpi-label">Sob Consultoria Portfel</div><div class="calc-kpi-val">R$ 7 Bi+</div></div>
              <div class="calc-kpi-box"><div class="calc-kpi-label">Satisfação (NPS)</div><div class="calc-kpi-val">91 · Excelência</div></div>
              <div class="calc-kpi-box"><div class="calc-kpi-label">Certificação Máxima</div><div class="calc-kpi-val">ANBIMA CEA</div></div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <button type="button" class="jw-btn-primary" onclick="window.JW.goIsland(2)">Ir para Ilha 02: Raio-X da Carteira →</button>
              <button type="button" class="jw-btn-secondary" onclick="window.JW.openMaskView()">🎭 Ver Efeito "Por Trás do Extrato"</button>
              <a href="index-classico.html" class="jw-btn-secondary" style="text-decoration:none;">Ver Site Clássico Completo</a>
            </div>
          </div>
        </div>
      `;
    } else if (islandId === 2) {
      bodyEl.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:16px;">
          <p style="font-size:14px;color:var(--jw-mut);">Clique nas 4 armadilhas mais comuns dos bancos brasileiros abaixo para passar o <strong>Raio-X</strong> e revelar o que escondem de você:</p>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
            <div class="calc-kpi-box" style="cursor:pointer" onclick="this.classList.toggle('highlight');window.JW.bonusXP(30,'Escaneou COE de Banco')">
              <div style="font-weight:800;font-size:14px;margin-bottom:4px;">🔍 1. "COE com Capital Protegido"</div>
              <div style="font-size:12.5px;color:var(--jw-grn);"><strong>O que o Raio-X revela:</strong> Trava seu dinheiro por 3 a 5 anos, perde para a inflação e paga até 5% de comissão oculta para quem te vendeu no primeiro dia.</div>
            </div>
            <div class="calc-kpi-box" style="cursor:pointer" onclick="this.classList.toggle('highlight');window.JW.bonusXP(30,'Escaneou Fundos Caros')">
              <div style="font-weight:800;font-size:14px;margin-bottom:4px;">🔍 2. Fundos do Próprio Banco (2% a.a.)</div>
              <div style="font-size:12.5px;color:var(--jw-grn);"><strong>O que o Raio-X revela:</strong> Comem até 30% do seu ganho real ao longo de 15 anos em taxas de administração e performance desnecessárias.</div>
            </div>
            <div class="calc-kpi-box" style="cursor:pointer" onclick="this.classList.toggle('highlight');window.JW.bonusXP(30,'Escaneou Risco 100% Brasil')">
              <div style="font-weight:800;font-size:14px;margin-bottom:4px;">🔍 3. Patrimônio 100% em Real</div>
              <div style="font-size:12.5px;color:var(--jw-grn);"><strong>O que o Raio-X revela:</strong> Deixa o futuro da sua família 100% refém da inflação e da política brasileira, sem reserva em moeda forte (Dólar/Euro).</div>
            </div>
            <div class="calc-kpi-box" style="cursor:pointer" onclick="this.classList.toggle('highlight');window.JW.bonusXP(30,'Escaneou Falta de Sucessão')">
              <div style="font-weight:800;font-size:14px;margin-bottom:4px;">🔍 4. Tudo na Pessoa Física Sem Sucessão</div>
              <div style="font-size:12.5px;color:var(--jw-grn);"><strong>O que o Raio-X revela:</strong> Em uma emergência familiar, o inventário trava as contas e consome de 12% a 18% de tudo que você construiu.</div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
            <a href="raiox.html" class="jw-cta-top">Abrir Diagnóstico Completo de 5 Passos (Com Gráfico Radar) ↗</a>
            <button type="button" class="jw-btn-secondary" onclick="window.JW.goIsland(3)">Ir para Ilha 03: As 5 Calculadoras →</button>
          </div>
        </div>
      `;
    } else if (islandId === 4) {
      bodyEl.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;">
          <div class="calc-kpi-box highlight">
            <div style="font-family:var(--jw-font-m);font-size:10px;color:var(--jw-grn)">TERRITÓRIO 01 · MULTIPLICAR</div>
            <div style="font-size:16px;font-weight:800;margin:4px 0;">Planejamento Financeiro & Carteira</div>
            <p style="font-size:12.5px;color:var(--jw-mut);">Alocação sob medida para fazer seu dinheiro crescer acima da inflação, pagando o menor imposto dentro da lei e devolvendo comissões para você.</p>
          </div>
          <div class="calc-kpi-box">
            <div style="font-family:var(--jw-font-m);font-size:10px;color:var(--jw-gold)">TERRITÓRIO 02 · FAMÍLIA & FUTURO</div>
            <div style="font-size:16px;font-weight:800;margin:4px 0;">Aposentadoria, Previdência & Seguros</div>
            <p style="font-size:12.5px;color:var(--jw-mut);">Construção de renda vitalícia, redução de Imposto de Renda via PGBL/VGBL estratégico e seguro de vida internacional (Pan American).</p>
          </div>
          <div class="calc-kpi-box">
            <div style="font-family:var(--jw-font-m);font-size:10px;color:var(--jw-rose)">TERRITÓRIO 03 · MOEDA FORTE & HERANÇA</div>
            <div style="font-size:16px;font-weight:800;margin:4px 0;">Dólar, Offshore & Holding Familiar</div>
            <p style="font-size:12.5px;color:var(--jw-mut);">Investimentos diretos nos EUA e Europa, proteção cambial e estruturação sucessória para que seus filhos nunca dependam de inventário.</p>
          </div>
          <div class="calc-kpi-box">
            <div style="font-family:var(--jw-font-m);font-size:10px;color:var(--jw-accent)">TERRITÓRIO 04 · EMPRESÁRIOS</div>
            <div style="font-size:16px;font-weight:800;margin:4px 0;">Caixa de Empresa, Crédito & M&A</div>
            <p style="font-size:12.5px;color:var(--jw-mut);">Rentabilização do caixa PJ, câmbio corporativo com taxas institucionais e assessoria em compra/venda de empresas (Fusões e Aquisições).</p>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:16px;">
          <button type="button" class="jw-btn-primary" style="max-width:280px" onclick="window.JW.goIsland(5)">Ir para Ilha 05: Notícias da Semana →</button>
        </div>
      `;
    } else if (islandId === 5) {
      bodyEl.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div>
              <div style="font-family:var(--jw-font-m);font-size:10.5px;color:var(--jw-grn);">RADAR DA SEMANA & NEWSLETTER DO LEO</div>
              <h4 style="font-size:20px;font-weight:800;">O que aconteceu no mercado traduzido em 1 minuto para o seu bolso</h4>
            </div>
            <a href="blog.html" class="jw-cta-top">Abrir Portal Completo de Notícias & Newsletter ↗</a>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
            <div class="calc-kpi-box highlight">
              <div class="calc-kpi-label">Juros no Brasil (Selic Alta)</div>
              <div style="font-size:14px;font-weight:700;margin:4px 0;">Oportunidade histórica na Renda Fixa atrelada à inflação (IPCA + 7%)</div>
              <div class="calc-kpi-sub">Momento raro para travar renda real para os próximos 10 anos.</div>
            </div>
            <div class="calc-kpi-box">
              <div class="calc-kpi-label">Dólar & Exterior</div>
              <div style="font-size:14px;font-weight:700;margin:4px 0;">Por que comprar Dólar aos poucos protege o poder de compra da família</div>
              <div class="calc-kpi-sub">Como montar sua reserva global sem pagar spread caro de banco.</div>
            </div>
            <div class="calc-kpi-box">
              <div class="calc-kpi-label">Reforma Tributária & Herança</div>
              <div style="font-size:14px;font-weight:700;margin:4px 0;">Mudanças no imposto sobre herança (ITCMD progressivo)</div>
              <div class="calc-kpi-sub">Como antecipar a proteção da família antes das novas alíquotas.</div>
            </div>
          </div>
        </div>
      `;
    } else if (islandId === 6) {
      bodyEl.innerHTML = `
        <div style="text-align:center;padding:12px 20px;">
          <div style="font-size:42px;margin-bottom:8px;">👑</div>
          <h3 style="font-family:var(--jw-font-d);font-size:32px;margin-bottom:8px;">Parabéns por explorar a Jornada do Patrimônio!</h3>
          <p style="font-size:14.5px;color:var(--jw-mut);max-width:620px;margin:0 auto 18px;">
            Você acumulou <strong>${state.xp} XP (Nível ${state.level})</strong> e desbloqueou <strong>${state.visitedIslands.size} de 6 conquistas</strong>. Agora o próximo passo é levar os seus objetivos para uma conversa individual e gratuita de diagnóstico com o Leonardo Arruda.
          </p>
          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
            <a href="${FORM_URL}" target="_blank" rel="noopener" class="jw-cta-top" style="padding:14px 28px;font-size:14px;">Agendar Minha Conversa com o Leo ↗</a>
            <button type="button" class="jw-btn-secondary" onclick="window.JW.goIsland(3)">Voltar para as 5 Calculadoras 🧮</button>
          </div>
        </div>
      `;
    }
  }

  function closeModal() {
    const backdrop = document.getElementById('jw-modal-backdrop');
    if (backdrop) backdrop.classList.remove('open');
  }

  // ---------------------------------------------------------------------------
  // 9. CONTROLES: TECLADO, RODA E ATALHOS NUMERICOS
  // ---------------------------------------------------------------------------
  function bindControls() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'Escape') {
        if (document.getElementById('jw-modal-backdrop')?.classList.contains('open')) {
          closeModal();
        } else if (document.getElementById('mask-view')?.classList.contains('active')) {
          closeMaskView();
        } else {
          resetView();
        }
        return;
      }

      // Setas percorrem os territórios na ordem do dossiê.
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        stepNextIsland(1);
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        stepNextIsland(-1);
        return;
      }

      // 1 a 6 abrem o território correspondente.
      const n = Number(e.key);
      if (n >= 1 && n <= 6) {
        walkToIsland(n, true);
      }
    });

    // Roda do mouse percorre o mapa quando nenhum painel está aberto.
    let wheelLock = false;
    window.addEventListener('wheel', (e) => {
      if (document.getElementById('jw-modal-backdrop')?.classList.contains('open')) return;
      if (document.getElementById('mask-view')?.classList.contains('active')) return;
      if (wheelLock) return;
      wheelLock = true;
      setTimeout(() => { wheelLock = false; }, 620);
      if (e.deltaY > 15) stepNextIsland(1);
      else if (e.deltaY < -15) stepNextIsland(-1);
    }, { passive: true });

    // Atalhos numéricos na barra inferior.
    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => {
        closeMaskView();
        walkToIsland(Number(btn.dataset.goto), true);
      });
    });
  }

  // Atmosferas do HUD. O cenário é sempre crepuscular; o que muda é o acento
  // da interface sobre ele. Não existe mais tema "dia": céu claro brigava com
  // a direção de arte obsidiana.
  function cycleTheme() {
    const themes = ['', 'theme-emerald', 'theme-gold'];
    state.themeIdx = (state.themeIdx + 1) % themes.length;
    document.body.classList.remove('theme-emerald', 'theme-gold');
    if (themes[state.themeIdx]) document.body.classList.add(themes[state.themeIdx]);
    updateGamificationHUD();
  }

  function cycleAvatar() {
    state.avatarIdx = (state.avatarIdx + 1) % AVATARS.length;
    const slot = document.getElementById('quest-avatar-emoji');
    const avatar = AVATARS[state.avatarIdx];
    setIcon(slot, avatar.icon);
    if (slot) slot.title = avatar.label;
    updateGamificationHUD();
  }

  function openMaskView() {
    closeModal();
    const mv = document.getElementById('mask-view');
    if (mv) mv.classList.add('active');
    document.querySelectorAll('.jw-nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-btn-mask')?.classList.add('active');
  }

  function closeMaskView() {
    const mv = document.getElementById('mask-view');
    if (mv) mv.classList.remove('active');
    document.querySelectorAll('.jw-nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-btn-world')?.classList.add('active');
  }

  // API pública para botões do HTML
  window.JW = {
    goIsland: (id) => {
      closeMaskView();
      walkToIsland(id, true);
    },
    walkNext: () => {
      closeMaskView();
      const next = state.currentNodeIdx < 6 ? state.currentNodeIdx + 1 : 1;
      walkToIsland(next, true);
    },
    openCalculators: () => {
      closeMaskView();
      walkToIsland(3, true);
    },
    resetView,
    openTerritory: (id) => {
      closeMaskView();
      walkToIsland(id, true);
    },
    openMaskView,
    closeMaskView,
    closeModal,
    cycleTheme,
    cycleAvatar,
    toggleAmbientMusic,
    bonusXP: (amt, msg) => addXP(amt, msg),
    renderCalculatorSuite
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('world-stage')) {
      initWorldStage();
      initBehindTheMask();
      bindControls();
      updateGamificationHUD();
    }
    if (document.getElementById('standalone-calc-suite')) {
      renderCalculatorSuite('standalone-calc-suite');
    }
  });
})();
