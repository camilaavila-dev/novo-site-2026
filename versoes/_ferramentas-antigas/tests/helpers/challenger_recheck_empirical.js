/**
 * CHALLENGER RECHECK EMPIRICAL AUDIT (MILESTONE M3)
 * Verificação empírica independente e rigorosa para reavaliação de M3 pós-fix
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9870 + Math.floor(Math.random() * 50);
const BASE_DIR = path.resolve(__dirname, '..', '..');

const VIEWPORTS = [
  { name: '320px (iPhone SE 1st gen)', width: 320, height: 568, mobile: true },
  { name: '360px (Galaxy S8/S9 / Common Android)', width: 360, height: 640, mobile: true },
  { name: '375px (iPhone SE 2nd/3rd gen)', width: 375, height: 667, mobile: true },
  { name: '390px (iPhone 14/15/16)', width: 390, height: 844, mobile: true },
  { name: '412px (Pixel 7 / Galaxy S21)', width: 412, height: 915, mobile: true },
  { name: '414px (iPhone XR / 11 Plus)', width: 414, height: 896, mobile: true },
  { name: '430px (iPhone 15/16 Pro Max)', width: 430, height: 932, mobile: true },
  { name: '768px (iPad Portrait)', width: 768, height: 1024, mobile: true },
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
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  CHALLENGER RECHECK EMPÍRICO — MILESTONE M3');
  console.log('═══════════════════════════════════════════════════════════\n');

  const htmlPath = path.join(BASE_DIR, 'raiox.html');
  const cssPath = path.join(BASE_DIR, 'css', 'raiox.css');
  const jsPath = path.join(BASE_DIR, 'js', 'raiox-core.js');

  const html = fs.readFileSync(htmlPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  // 1. Auditoria de quebras <br>
  const brRegex = /([^\s>])<br\s*\/?>/gi;
  const brViolations = [];
  let m;
  while ((m = brRegex.exec(html)) !== null) {
    brViolations.push(m[0]);
  }
  console.log(`[BR-CHECK] Violações de <br> sem espaço: ${brViolations.length}`);
  if (brViolations.length > 0) throw new Error('Violações de <br> encontradas');

  // 2. Auditoria de filtros SVG
  const hasFilter = html.includes('feColorMatrix') || css.includes('feColorMatrix') ||
                    html.includes('feComponentTransfer') || css.includes('feComponentTransfer');
  console.log(`[SVG-FILTER-CHECK] Filtros proibidos presentes: ${hasFilter}`);
  if (hasFilter) throw new Error('Filtros SVG proibidos encontrados');

  // 3. Inicializar Chrome Headless
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-m3-recheck-'));
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await wait(1000);
  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    try {
      const ver = await getJson(`http://127.0.0.1:${PORT}/json/version`);
      wsUrl = ver.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (e) {}
    await wait(300);
  }

  if (!wsUrl) {
    chromeProc.kill();
    throw new Error('Falha ao conectar ao Chrome CDP');
  }

  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const data = JSON.parse(e.data);
    if (data.id && pending.has(data.id)) pending.get(data.id)(data.result);
  };
  const send = (method, params = {}) => new Promise(res => {
    const id = msgId++;
    pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const sendSession = (method, params = {}) => new Promise(res => {
    const id = msgId++;
    pending.set(id, res);
    ws.send(JSON.stringify({ id, sessionId, method, params }));
  });

  await sendSession('Page.enable');
  await sendSession('DOM.enable');
  await sendSession('Runtime.enable');

  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  let overallPassed = true;

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n───────────────────────────────────────────────────────────`);
      console.log(`VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`───────────────────────────────────────────────────────────`);

      await sendSession('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile
      });
      await sendSession('Page.navigate', { url: fileUrl });
      await wait(600);

      // A) Checagem em repouso (Hero + Etapa 1)
      const initCheck = await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const docEl = document.documentElement;
          const winW = window.innerWidth;
          const scrollW = docEl.scrollWidth;
          const clientW = docEl.clientWidth;
          const hasScrollX = scrollW > clientW;

          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            if (el === docEl || el === document.body) return;
            const r = el.getBoundingClientRect();
            if (r.right > winW + 1.0) {
              overflowing.push({ tag: el.tagName, id: el.id, cls: el.className, right: Math.round(r.right), width: Math.round(r.width) });
            }
          });

          return { winW, scrollW, clientW, hasScrollX, overflowCount: overflowing.length, overflowing };
        })()`,
        returnByValue: true
      });

      const ic = initCheck.result.value;
      const icOk = !ic.hasScrollX && ic.overflowCount === 0;
      console.log(`[Inicial] scrollW=${ic.scrollW} clientW=${ic.clientW} hasScrollX=${ic.hasScrollX} overflowElements=${ic.overflowCount} -> ${icOk ? 'PASS' : 'FAIL'}`);
      if (!icOk) {
        overallPassed = false;
        console.error('  Elementos transbordando:', ic.overflowing);
      }

      // B) Clicar nas 5 etapas do quiz com confirmação ativa de transição
      for (let s = 1; s <= 5; s++) {
        await sendSession('Runtime.evaluate', {
          expression: `(() => {
            const cards = document.querySelectorAll('.rx-option-card');
            if (cards.length > 0) cards[${(s - 1) % 4}].click();
          })()`
        });

        // Aguarda transição de step (ou revelação do painel no passo 5)
        let transitioned = false;
        let lastVal = null;
        for (let retry = 0; retry < 20; retry++) {
          await wait(100);
          const st = await sendSession('Runtime.evaluate', {
            expression: `(() => {
              const stepEl = document.getElementById('rx-step-num');
              const stepNum = stepEl ? parseInt(stepEl.textContent, 10) : 0;
              const resultsPanel = document.getElementById('rx-results-panel');
              const panelVis = resultsPanel && window.getComputedStyle(resultsPanel).display !== 'none';
              const cards = document.querySelectorAll('.rx-option-card').length;
              return { stepNum, panelVis, cards };
            })()`,
            returnByValue: true
          });
          lastVal = st.result?.value;
          if (s < 5 && lastVal && lastVal.stepNum > s) { transitioned = true; break; }
          if (s === 5 && lastVal && lastVal.panelVis) { transitioned = true; break; }
        }
        if (!transitioned && vp.width === 320) {
          console.log(`[DEBUG 320px] Falha na transição do passo ${s}! Último estado:`, lastVal);
        }
      }
      await wait(600);

      // C) Checagem Pós-Quiz: Painel de Resultados, Aura e Touch Targets
      const postCheck = await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const docEl = document.documentElement;
          const winW = window.innerWidth;
          const scrollW = docEl.scrollWidth;
          const clientW = docEl.clientWidth;
          const hasScrollX = scrollW > clientW;

          const resultsPanel = document.getElementById('rx-results-panel');
          const isPanelVisible = resultsPanel && window.getComputedStyle(resultsPanel).display !== 'none';

          const halo = document.getElementById('rx-archetype-halo');
          let haloMetrics = null;
          if (halo) {
            const hr = halo.getBoundingClientRect();
            haloMetrics = {
              left: Math.round(hr.left),
              right: Math.round(hr.right),
              width: Math.round(hr.width),
              height: Math.round(hr.height),
              isContained: hr.right <= winW + 1.0
            };
          }

          const stage = document.querySelector('.rx-insignia-stage');
          let stageMetrics = null;
          if (stage) {
            const sr = stage.getBoundingClientRect();
            stageMetrics = {
              left: Math.round(sr.left),
              right: Math.round(sr.right),
              width: Math.round(sr.width),
              isContained: sr.right <= winW + 1.0
            };
          }

          const poly = document.querySelector('#radar-svg #radar-data-poly');
          const hasRadarPoly = !!poly;

          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            if (el === docEl || el === document.body) return;
            const r = el.getBoundingClientRect();
            if (r.right > winW + 1.0) {
              overflowing.push({ tag: el.tagName, id: el.id, cls: (el.className || '').toString().substring(0, 30), right: Math.round(r.right), width: Math.round(r.width) });
            }
          });

          // Touch targets dos botões principais de ação
          const ctaBtn = document.getElementById('rx-cta-btn');
          const wppBtn = document.getElementById('rx-wpp-btn');
          const restartBtn = document.getElementById('rx-restart-btn');
          const prevBtn = document.getElementById('rx-prev-btn');

          const touchTargets = [];
          [ctaBtn, wppBtn, restartBtn].forEach(el => {
            if (el) {
              const r = el.getBoundingClientRect();
              touchTargets.push({
                id: el.id,
                w: Math.round(r.width),
                h: Math.round(r.height),
                ge48: r.width >= 48 && r.height >= 48
              });
            }
          });

          return {
            scrollW, clientW, hasScrollX,
            isPanelVisible,
            hasRadarPoly,
            haloMetrics,
            stageMetrics,
            overflowCount: overflowing.length,
            overflowing,
            touchTargets
          };
        })()`,
        returnByValue: true
      });

      const pc = postCheck.result.value;
      const pcOk = !pc.hasScrollX && pc.overflowCount === 0 && pc.isPanelVisible && pc.hasRadarPoly;
      const haloOk = pc.haloMetrics && pc.haloMetrics.isContained;
      const stageOk = pc.stageMetrics && pc.stageMetrics.isContained;
      const touchOk = pc.touchTargets.every(t => t.ge48);

      console.log(`[Pós-Quiz] PanelVisible=${pc.isPanelVisible} RadarPoly=${pc.hasRadarPoly} scrollW=${pc.scrollW} clientW=${pc.clientW} hasScrollX=${pc.hasScrollX}`);
      console.log(`[Aura Halo] right=${pc.haloMetrics?.right}px (winW=${vp.width}px, width=${pc.haloMetrics?.width}px, Contained=${haloOk})`);
      console.log(`[Stage] right=${pc.stageMetrics?.right}px (width=${pc.stageMetrics?.width}px, Contained=${stageOk})`);
      console.log(`[Touch Targets >= 48px]:`, pc.touchTargets.map(t => `${t.id}: ${t.w}x${t.h}px (${t.ge48 ? 'OK' : 'SUB48'})`).join(' | '));
      console.log(`[Total Overflow Elements]: ${pc.overflowCount}`);

      if (!pcOk || !haloOk || !stageOk || !touchOk) {
        overallPassed = false;
        console.error(`  ✖ FALHA na viewport ${vp.name}: pcOk=${pcOk}, haloOk=${haloOk}, stageOk=${stageOk}, touchOk=${touchOk}`);
        if (pc.overflowCount > 0) {
          console.error('  Elementos transbordando:', pc.overflowing);
        }
      } else {
        console.log(`  ✔ PASS: Viewport ${vp.name} 100% conforme`);
      }
    }
  } finally {
    ws.close();
    chromeProc.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  if (overallPassed) {
    console.log('✔ AUDITORIA EMPÍRICA CONCLUÍDA COM 100% DE APROVAÇÃO!');
    console.log('═══════════════════════════════════════════════════════════\n');
    process.exit(0);
  } else {
    console.error('✖ FALHA: Auditoria empírica identificou não-conformidades.');
    console.log('═══════════════════════════════════════════════════════════\n');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('ERRO FATAL:', err);
  process.exit(1);
});
