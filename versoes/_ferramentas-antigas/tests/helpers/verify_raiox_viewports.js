const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const VIEWPORTS = [
  { name: '320px (iPhone SE 1st)', width: 320, height: 568, mobile: true },
  { name: '375px (iPhone SE 2nd/3rd)', width: 375, height: 667, mobile: true },
  { name: '390px (iPhone 14/15)', width: 390, height: 844, mobile: true },
  { name: '430px (iPhone 15/16 Pro Max)', width: 430, height: 932, mobile: true },
  { name: '1440px (Desktop Outlier)', width: 1440, height: 900, mobile: false }
];

async function verifyRaioXViewports() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-rx-'));
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9788',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  const ver = await (await fetch('http://127.0.0.1:9788/json/version')).json();
  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) pending.get(m.id)(m.result);
  };
  const send = (method, params = {}) => new Promise(res => {
    const msgId = id++;
    pending.set(msgId, res);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const sendSession = (method, params = {}) => new Promise(res => {
    const msgId = id++;
    pending.set(msgId, res);
    ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
  });

  await sendSession('Page.enable');
  await sendSession('DOM.enable');
  await sendSession('Runtime.enable');

  const fileUrl = 'file:///' + path.resolve(__dirname, '..', '..', 'raiox.html').replace(/\\/g, '/');

  console.log('=== VERIFICAÇÃO RIGOROSA DE VIEWPORTS — RAIOX.HTML ===');
  let allPass = true;
  for (const vp of VIEWPORTS) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });
    await sendSession('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 800));

    const res = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const docEl = document.documentElement;
        const winW = window.innerWidth;
        const clientW = docEl.clientWidth;
        const scrollW = docEl.scrollWidth;
        const hasScrollX = scrollW > clientW;

        const overflowing = [];
        document.querySelectorAll('*').forEach(el => {
          if (el === docEl || el === document.body) return;
          const r = el.getBoundingClientRect();
          if (r.right > winW + 1.0) {
            overflowing.push({
              tag: el.tagName,
              id: el.id,
              cls: (el.className || '').toString().substring(0, 30),
              right: Math.round(r.right),
              width: Math.round(r.width)
            });
          }
        });

        // Test touch targets >= 48px
        const interactive = [];
        document.querySelectorAll('button, a, input, select').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            interactive.push({
              tag: el.tagName,
              cls: (el.className || '').toString().substring(0, 25),
              w: Math.round(r.width),
              h: Math.round(r.height)
            });
          }
        });

        return {
          expectedW: ${vp.width},
          winW,
          clientW,
          scrollW,
          hasScrollX,
          overflowCount: overflowing.length,
          topOverflowing: overflowing.slice(0, 4),
          interactiveCount: interactive.length
        };
      })()`,
      returnByValue: true
    });

    const v = res.result.value;
    const ok = !v.hasScrollX && v.overflowCount === 0;
    if (!ok) allPass = false;
    const status = ok ? '✔ OK' : '✖ FALHA';
    console.log(`[${status}] [${vp.name.padEnd(28)}] winW=${v.winW} clientW=${v.clientW} scrollW=${v.scrollW} hasScrollX=${v.hasScrollX} overflowElements=${v.overflowCount}`);
    if (v.overflowCount > 0) {
      console.log('   Elementos transbordando:', JSON.stringify(v.topOverflowing));
    }
  }

  // Agora vamos testar a interação completa de responder as 5 etapas e verificar a renderização do radar!
  console.log('\n=== TESTANDO JORNADA INTERATIVA COMPLETA NO BROWSER REAL ===');
  await sendSession('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 600));

  const quizResult = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      // Simula cliques em 5 opções
      // Etapa 1: opção 1 (score 35)
      const opt1 = document.querySelectorAll('.rx-option-card')[1];
      opt1.click();
      return true;
    })()`,
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 450));
  // Etapa 2
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const opt2 = document.querySelectorAll('.rx-option-card')[1]; // score 40
      opt2.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 450));
  // Etapa 3
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const opt3 = document.querySelectorAll('.rx-option-card')[2]; // score 70
      opt3.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 450));
  // Etapa 4
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const opt4 = document.querySelectorAll('.rx-option-card')[2]; // score 80
      opt4.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 450));
  // Etapa 5
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const opt5 = document.querySelectorAll('.rx-option-card')[1]; // score 30
      opt5.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  // Inspeciona resultados pós-quiz
  const postQuizCheck = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const resultsPanel = document.getElementById('rx-results-panel');
      const scoreVal = document.getElementById('rx-score-value').textContent;
      const arqName = document.getElementById('rx-archetype-name').textContent;
      const radarSvg = document.getElementById('radar-svg');
      const poly = radarSvg ? radarSvg.querySelector('#radar-data-poly') : null;
      const polyPoints = poly ? poly.getAttribute('points') : null;
      const ctaHref = document.getElementById('rx-cta-btn').getAttribute('href');
      const wppHref = document.getElementById('rx-wpp-btn').getAttribute('href');

      return {
        resultsVisible: resultsPanel && resultsPanel.style.display !== 'none',
        scoreVal,
        arqName,
        hasPolygon: !!poly,
        polyPoints,
        ctaHref,
        wppHref
      };
    })()`,
    returnByValue: true
  });

  console.log('Resultado da Jornada Interativa:', JSON.stringify(postQuizCheck.result.value, null, 2));

  ws.close();
  proc.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}

  if (!allPass) {
    process.exit(1);
  }
}

verifyRaioXViewports().catch(err => {
  console.error(err);
  process.exit(1);
});
