/**
 * EMPIRICAL CHALLENGER 2 STRESS HARNESS (MILESTONE M2)
 * Rigorous Chrome Headless Interaction & Layout Stress for simulador.html
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9555;
const BASE_DIR = path.resolve(__dirname, '..', '..');

const VIEWPORTS = [
  { name: '320px (iPhone SE 1st)', width: 320, height: 568, mobile: true },
  { name: '375px (iPhone SE 2nd/3rd)', width: 375, height: 667, mobile: true },
  { name: '390px (iPhone 14/15)', width: 390, height: 844, mobile: true },
  { name: '430px (iPhone 15/16 Pro Max)', width: 430, height: 932, mobile: true },
  { name: '1440px (Desktop Outlier)', width: 1440, height: 900, mobile: false }
];

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getJson(url) {
  const res = await fetch(url);
  return res.json();
}

async function run() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-m2-stress-'));

  console.log('1. Iniciando Chrome Headless na porta', PORT, '...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 25; i++) {
    await wait(300);
    try {
      const version = await getJson(`http://127.0.0.1:${PORT}/json/version`);
      wsUrl = version.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error('Falha ao conectar com o Chrome Headless');
    chromeProc.kill();
    return;
  }

  console.log('Conectado via WebSocket CDP:', wsUrl);
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

  function sendSession(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('DOM.enable');
  await sendSession('Runtime.enable');

  const fileUrl = 'file:///' + path.join(BASE_DIR, 'simulador.html').replace(/\\/g, '/');

  const fullResults = {
    viewports: {},
    canvasRetina: {},
    canvasScrubbing: {},
    dockOverlap: {}
  };

  // =========================================================================
  // TESTE 1: OVERFLOW HORIZONTAL EM 320px, 375px, 390px, 430px e 1440px
  // =========================================================================
  console.log('\n--- EXECUTANDO TESTE 1: OVERFLOW HORIZONTAL ---');
  for (const vp of VIEWPORTS) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });

    await sendSession('Page.navigate', { url: fileUrl });
    await wait(500);

    const overflowEval = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const docEl = document.documentElement;
        const winW = window.innerWidth;
        const scrollW = docEl.scrollWidth;
        const clientW = docEl.clientWidth;

        const overflowing = [];
        document.querySelectorAll('*').forEach(el => {
          if (el === docEl || el === document.body) return;
          const r = el.getBoundingClientRect();
          if (r.right > winW + 1.0) {
            overflowing.push({
              tag: el.tagName,
              id: el.id,
              cls: el.className,
              right: Math.round(r.right),
              width: Math.round(r.width),
              snippet: (el.outerHTML || '').substring(0, 80).replace(/\\s+/g, ' ')
            });
          }
        });

        return {
          winW,
          scrollW,
          clientW,
          hasScrollX: scrollW > clientW,
          overflowCount: overflowing.length,
          topOverflowing: overflowing.slice(0, 5)
        };
      })()`,
      returnByValue: true
    });

    fullResults.viewports[vp.name] = overflowEval.result.value;
    console.log(`Viewport ${vp.name.padEnd(28)}: scrollW=${overflowEval.result.value.scrollW} clientW=${overflowEval.result.value.clientW} hasScrollX=${overflowEval.result.value.hasScrollX}`);
    if (overflowEval.result.value.hasScrollX) {
      console.log('  ⚠️ Elementos com overflow:', overflowEval.result.value.topOverflowing);
    }
  }

  // =========================================================================
  // TESTE 2: REDIMENSIONAMENTO DE JANELA (RESIZE) & RETINA SCALING DO CANVAS
  // =========================================================================
  console.log('\n--- EXECUTANDO TESTE 2: RESIZE & RETINA SCALING DO CANVAS ---');
  const dprList = [1, 2, 3];
  for (const dpr of dprList) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 768,
      deviceScaleFactor: dpr,
      mobile: false
    });
    await sendSession('Page.navigate', { url: fileUrl });
    await wait(400);

    // Avalia tamanho interno do canvas vs getBoundingClientRect
    const canvasMetrics = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const canvas = document.getElementById('sim-chart');
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, Math.min(100, canvas.width), Math.min(100, canvas.height));
        // Checar se o canvas desenhou algo (não é todo transparente)
        let hasPixels = false;
        for (let i = 3; i < imgData.data.length; i += 4) {
          if (imgData.data[i] > 0) {
            hasPixels = true;
            break;
          }
        }
        return {
          dpr,
          cssWidth: Math.round(rect.width),
          cssHeight: Math.round(rect.height),
          canvasBufferWidth: canvas.width,
          canvasBufferHeight: canvas.height,
          expectedBufferWidth: Math.round(rect.width * dpr),
          expectedBufferHeight: Math.round(rect.height * dpr),
          bufferMatchesDpr: Math.abs(canvas.width - Math.round(rect.width * dpr)) <= 2,
          hasDrawnPixels: hasPixels
        };
      })()`,
      returnByValue: true
    });

    fullResults.canvasRetina[`DPR_${dpr}`] = canvasMetrics.result.value;
    console.log(`DPR ${dpr}: buffer=${canvasMetrics.result.value.canvasBufferWidth}x${canvasMetrics.result.value.canvasBufferHeight} css=${canvasMetrics.result.value.cssWidth}x${canvasMetrics.result.value.cssHeight} match=${canvasMetrics.result.value.bufferMatchesDpr} hasPixels=${canvasMetrics.result.value.hasDrawnPixels}`);
  }

  // Teste de Redimensionamento Dinâmico em Série (1440 -> 390 -> 768 -> 1440)
  console.log('\n--- Testando resize dinâmico sequencial ---');
  const resizeSequence = [
    { w: 1440, h: 900 },
    { w: 390, h: 844 },
    { w: 768, h: 1024 },
    { w: 1440, h: 900 }
  ];
  const resizeResults = [];
  for (const step of resizeSequence) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: step.w,
      height: step.h,
      deviceScaleFactor: 2,
      mobile: step.w < 900
    });
    // Dispara evento resize na window
    await sendSession('Runtime.evaluate', {
      expression: `window.dispatchEvent(new Event('resize'))`
    });
    await wait(300);

    const checkStep = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const canvas = document.getElementById('sim-chart');
        const rect = canvas.getBoundingClientRect();
        return {
          vpW: window.innerWidth,
          cssW: Math.round(rect.width),
          cssH: Math.round(rect.height),
          bufferW: canvas.width,
          bufferH: canvas.height,
          ratio: (canvas.width / rect.width).toFixed(2)
        };
      })()`,
      returnByValue: true
    });
    resizeResults.push(checkStep.result.value);
    console.log(`Resize para ${step.w}px: css=${checkStep.result.value.cssW}px, buffer=${checkStep.result.value.bufferW}px, ratio=${checkStep.result.value.ratio}`);
  }
  fullResults.canvasRetina['DynamicResize'] = resizeResults;

  // =========================================================================
  // TESTE 3: EVENTOS DE TOQUE & MOUSE NO CANVAS (SCRUBBING & TOOLTIP)
  // =========================================================================
  console.log('\n--- EXECUTANDO TESTE 3: INTERAÇÃO, SCRUBBING & TOOLTIP ---');
  // Ajusta para viewport mobile 390px
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sendSession('Page.navigate', { url: fileUrl });
  await wait(500);

  const interactionResults = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.getElementById('sim-chart');
      const tooltip = document.getElementById('sim-tooltip');
      const rect = canvas.getBoundingClientRect();

      const eventsLog = [];

      // Helper para simular ponteiro
      function triggerPointer(type, clientX, clientY) {
        if (type.startsWith('touch')) {
          const touchObj = new Touch({
            identifier: 1,
            target: canvas,
            clientX: clientX,
            clientY: clientY,
            pageX: clientX,
            pageY: clientY
          });
          const evt = new TouchEvent(type, {
            touches: type === 'touchend' ? [] : [touchObj],
            targetTouches: type === 'touchend' ? [] : [touchObj],
            changedTouches: [touchObj],
            bubbles: true,
            cancelable: true
          });
          canvas.dispatchEvent(evt);
        } else {
          const evt = new MouseEvent(type, {
            clientX: clientX,
            clientY: clientY,
            bubbles: true,
            cancelable: true
          });
          canvas.dispatchEvent(evt);
        }
      }

      // Teste A: touchstart no meio do canvas
      const midX = rect.left + rect.width * 0.5;
      const midY = rect.top + rect.height * 0.5;

      triggerPointer('touchstart', midX, midY);
      const afterTouchStart = {
        step: 'touchstart_mid',
        tooltipOpacity: window.getComputedStyle(tooltip).opacity,
        tooltipDisplay: window.getComputedStyle(tooltip).display,
        tooltipHtml: tooltip.innerHTML
      };
      eventsLog.push(afterTouchStart);

      // Teste B: touchmove ao longo de 25%, 50%, 75%
      const points = [0.25, 0.5, 0.75];
      const moveSteps = [];
      for (const p of points) {
        const px = rect.left + rect.width * p;
        triggerPointer('touchmove', px, midY);
        const ttRect = tooltip.getBoundingClientRect();
        moveSteps.push({
          pct: p,
          tooltipOpacity: window.getComputedStyle(tooltip).opacity,
          tooltipLeft: Math.round(parseFloat(tooltip.style.left || '0')),
          tooltipTop: Math.round(parseFloat(tooltip.style.top || '0')),
          tooltipWidth: Math.round(ttRect.width),
          hasDeltaGanho: tooltip.innerHTML.includes('Delta Ganho'),
          tooltipContentPreview: tooltip.textContent.replace(/\\s+/g, ' ').trim()
        });
      }
      eventsLog.push({ step: 'touchmove_steps', moveSteps });

      // Teste C: touchend
      triggerPointer('touchend', midX, midY);
      const afterTouchEnd = {
        step: 'touchend',
        tooltipOpacity: window.getComputedStyle(tooltip).opacity
      };
      eventsLog.push(afterTouchEnd);

      // Teste D: mousemove e mouseleave
      triggerPointer('mousemove', midX, midY);
      const afterMouseMove = {
        step: 'mousemove_mid',
        tooltipOpacity: window.getComputedStyle(tooltip).opacity
      };
      triggerPointer('mouseleave', midX, midY);
      const afterMouseLeave = {
        step: 'mouseleave',
        tooltipOpacity: window.getComputedStyle(tooltip).opacity
      };
      eventsLog.push({ afterMouseMove, afterMouseLeave });

      // Teste E: Tooltip overflow em tela 320px estreita
      return {
        eventsLog
      };
    })()`,
    returnByValue: true
  });

  fullResults.canvasScrubbing = interactionResults.result.value;
  console.log('Interação Scrubbing:', JSON.stringify(interactionResults.result.value, null, 2));

  // =========================================================================
  // TESTE 3.2: TESTE DO TOOLTIP EM 320px (CONTAINER ESTREITO)
  // =========================================================================
  console.log('\n--- EXECUTANDO TESTE 3.2: TOOLTIP BOUNDS EM 320px ---');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 320,
    height: 568,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sendSession('Page.navigate', { url: fileUrl });
  await wait(500);

  const tooltipNarrowCheck = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.getElementById('sim-chart');
      const tooltip = document.getElementById('sim-tooltip');
      const card = canvas.closest('.sim-chart-card');
      const canvasWrap = canvas.closest('.sim-canvas-wrap');
      const rect = canvas.getBoundingClientRect();
      const wrapRect = canvasWrap.getBoundingClientRect();

      // Simula touchmove no canto esquerdo e direito
      function checkAt(ratio) {
        const x = rect.left + rect.width * ratio;
        const y = rect.top + rect.height * 0.5;
        const touch = new Touch({ identifier: 1, target: canvas, clientX: x, clientY: y });
        canvas.dispatchEvent(new TouchEvent('touchmove', { touches: [touch] }));

        const ttRect = tooltip.getBoundingClientRect();
        return {
          ratio,
          canvasWidth: Math.round(rect.width),
          canvasWrapWidth: Math.round(wrapRect.width),
          ttWidth: Math.round(ttRect.width),
          ttLeft: Math.round(ttRect.left),
          ttRight: Math.round(ttRect.right),
          cardLeft: Math.round(card.getBoundingClientRect().left),
          cardRight: Math.round(card.getBoundingClientRect().right),
          overflowsLeft: ttRect.left < card.getBoundingClientRect().left,
          overflowsRight: ttRect.right > card.getBoundingClientRect().right
        };
      }

      return {
        leftSide: checkAt(0.15),
        midSide: checkAt(0.50),
        rightSide: checkAt(0.85)
      };
    })()`,
    returnByValue: true
  });
  fullResults.canvasScrubbing['narrow320Tooltip'] = tooltipNarrowCheck.result.value;
  console.log('Tooltip em 320px:', JSON.stringify(tooltipNarrowCheck.result.value, null, 2));

  // =========================================================================
  // TESTE 4: MOBILE DOCK OVERLAP COM BOTÕES, SLIDERS E GRÁFICO
  // =========================================================================
  console.log('\n--- EXECUTANDO TESTE 4: MOBILE DOCK OVERLAP AUDIT ---');
  for (const vp of VIEWPORTS.filter(v => v.mobile)) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sendSession('Page.navigate', { url: fileUrl });
    await wait(500);

    const overlapAudit = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const dock = document.querySelector('.mobile-bottom-dock, .bottom-dock');
        if (!dock) return { dockPresent: false };

        const dockRect = dock.getBoundingClientRect();
        const winH = window.innerHeight;

        // Elementos interativos críticos a testar sobreposição
        const elementsToTest = [
          { name: 'CTA Simulador', el: document.getElementById('cta-simulador') },
          { name: 'Canvas Chart', el: document.getElementById('sim-chart') },
          { name: 'Slider P0', el: document.getElementById('slider-p0') },
          { name: 'Slider PMT', el: document.getElementById('slider-pmt') },
          { name: 'Slider Anos', el: document.getElementById('slider-anos') },
          { name: 'Slider Despesa', el: document.getElementById('slider-despesa') },
          { name: 'Footer Voltar Topo', el: document.querySelector('footer button') }
        ];

        try {
          // 1. Posição no scroll topo (y = 0)
          window.scrollTo(0, 0);
          const atTopOverlaps = [];
          elementsToTest.forEach(item => {
            if (!item.el) return;
            const r = item.el.getBoundingClientRect();
            const intersects = !(r.bottom < dockRect.top || r.top > dockRect.bottom || r.right < dockRect.left || r.left > dockRect.right);
            if (intersects) {
              atTopOverlaps.push({ name: item.name, top: Math.round(r.top), bottom: Math.round(r.bottom) });
            }
          });

          // 2. Rola até o final absoluto da página (scrollHeight)
          window.scrollTo(0, document.documentElement.scrollHeight);
          const atBottomOverlaps = [];
          elementsToTest.forEach(item => {
            if (!item.el) return;
            const r = item.el.getBoundingClientRect();
            const intersects = !(r.bottom < dockRect.top || r.top > dockRect.bottom || r.right < dockRect.left || r.left > dockRect.right);
            if (intersects) {
              atBottomOverlaps.push({ name: item.name, top: Math.round(r.top), bottom: Math.round(r.bottom) });
            }
          });

          // 3. Rola até o CTA do simulador estar centralizado
          const cta = document.getElementById('cta-simulador');
          let ctaVisibleUnobstructed = false;
          let ctaRectWhenScrolled = null;
          if (cta) {
            cta.scrollIntoView({ block: 'center' });
            const r = cta.getBoundingClientRect();
            ctaRectWhenScrolled = { top: Math.round(r.top), bottom: Math.round(r.bottom) };
            ctaVisibleUnobstructed = r.bottom <= dockRect.top;
          }

          // 4. Margem do body no fundo
          const bodyPadBottom = parseInt(window.getComputedStyle(document.body).paddingBottom || '0', 10);
          const pageWrapperPadBottom = parseInt(window.getComputedStyle(document.querySelector('.sim-page-wrapper')).paddingBottom || '0', 10);

          return {
            dockPresent: true,
            dockRect: {
              top: Math.round(dockRect.top),
              bottom: Math.round(dockRect.bottom),
              height: Math.round(dockRect.height)
            },
            bodyPadBottom,
            pageWrapperPadBottom,
            atTopOverlaps,
            atBottomOverlaps,
            ctaVisibleUnobstructed,
            ctaRectWhenScrolled
          };
        } catch (err) {
          return { error: err.message, stack: err.stack };
        }
      })()`,
      returnByValue: true
    });

    const val = (overlapAudit && overlapAudit.result && overlapAudit.result.value) || { dockPresent: false, atTopOverlaps: [], atBottomOverlaps: [], ctaVisibleUnobstructed: false };
    fullResults.dockOverlap[vp.name] = val;
    const atTopCount = (val.atTopOverlaps && val.atTopOverlaps.length) || 0;
    const atBottomCount = (val.atBottomOverlaps && val.atBottomOverlaps.length) || 0;
    console.log(`Dock Overlap ${vp.name.padEnd(28)}: atTop=${atTopCount} atBottom=${atBottomCount} ctaUnobstructed=${val.ctaVisibleUnobstructed}`);
    if (atTopCount > 0) {
      console.log(`  ⚠️ Elementos sobrepostos no topo em ${vp.name}:`, val.atTopOverlaps);
    }
    if (atBottomCount > 0) {
      console.log(`  ⚠️ Elementos sobrepostos no fundo em ${vp.name}:`, val.atBottomOverlaps);
    }
  }

  // Cleanup
  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {}

  const outPath = path.join(BASE_DIR, '.agents', 'teamwork', 'teamwork_preview_challenger_m2_2', 'challenger_m2_results.json');
  fs.writeFileSync(outPath, JSON.stringify(fullResults, null, 2));
  console.log('\nResultados detalhados gravados em:', outPath);
}

run().catch(err => {
  console.error('Erro na execução:', err);
  process.exit(1);
});
