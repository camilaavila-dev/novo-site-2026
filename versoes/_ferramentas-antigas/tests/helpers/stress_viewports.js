/**
 * EMPIRICAL CHALLENGER STRESS HARNESS
 * Real Chrome Headless Layout & Responsiveness Verification
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9444;
const BASE_DIR = path.resolve(__dirname, '..', '..');

const VIEWPORTS = [
  { name: '320px (iPhone SE 1st)', width: 320, height: 568, mobile: true },
  { name: '375px (iPhone SE 2nd/3rd)', width: 375, height: 667, mobile: true },
  { name: '390px (iPhone 14/15)', width: 390, height: 844, mobile: true },
  { name: '430px (iPhone 15/16 Pro Max)', width: 430, height: 932, mobile: true },
  { name: '768px (iPad Mini Portrait)', width: 768, height: 1024, mobile: true },
  { name: '1440px (Desktop Outlier)', width: 1440, height: 900, mobile: false }
];

const PAGES = ['index.html', 'termos.html', 'privacidade.html', 'linktree.html'];

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getJson(url) {
  const res = await fetch(url);
  return res.json();
}

async function run() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-stress-'));

  console.log('1. Iniciando Chrome Headless em porta', PORT, '...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await wait(400);
    try {
      const version = await getJson(`http://127.0.0.1:${PORT}/json/version`);
      wsUrl = version.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (e) {
      // waiting for chrome
    }
  }

  if (!wsUrl) {
    console.error('Falha ao conectar com o Chrome Headless');
    chromeProc.kill();
    return;
  }

  console.log('Chrome Headless ativo! Conectando via WebSocket CDP...');

  // Setup CDP Client
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

  // Create new target for testing
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

  const report = {};

  for (const pageName of PAGES) {
    report[pageName] = {};
    const fileUrl = 'file:///' + path.join(BASE_DIR, pageName).replace(/\\/g, '/');

    for (const vp of VIEWPORTS) {
      // 1. Configura viewport
      await sendSession('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile
      });

      // 2. Navega
      await sendSession('Page.navigate', { url: fileUrl });
      await wait(500); // aguarda scripts e render

      // 3. Executa medições
      const evalScript = `(() => {
        const docEl = document.documentElement;
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const scrollW = docEl.scrollWidth;
        const clientW = docEl.clientWidth;

        const overflowing = [];
        document.querySelectorAll('*').forEach(el => {
          if (el === docEl || el === document.body) return;
          const r = el.getBoundingClientRect();
          if (r.right > winW + 1.5) {
            overflowing.push({
              tag: el.tagName,
              id: el.id,
              cls: el.className,
              right: Math.round(r.right),
              width: Math.round(r.width),
              snippet: (el.outerHTML || '').substring(0, 90).replace(/\\s+/g, ' ')
            });
          }
        });

        // Dock móvel
        const dock = document.querySelector('.mobile-bottom-dock, .bottom-dock');
        let dockData = null;
        if (dock) {
          const r = dock.getBoundingClientRect();
          const s = window.getComputedStyle(dock);
          const items = [...dock.querySelectorAll('.dock-item')].map(it => {
            const ir = it.getBoundingClientRect();
            const labelEl = it.querySelector('.dock-label');
            const labelR = labelEl ? labelEl.getBoundingClientRect() : null;
            return {
              page: it.getAttribute('data-page'),
              width: Math.round(ir.width * 10) / 10,
              height: Math.round(ir.height * 10) / 10,
              labelWidth: labelR ? Math.round(labelR.width * 10) / 10 : 0,
              labelHeight: labelR ? Math.round(labelR.height * 10) / 10 : 0
            };
          });
          dockData = {
            display: s.display,
            width: Math.round(r.width * 10) / 10,
            left: Math.round(r.left * 10) / 10,
            right: Math.round(r.right * 10) / 10,
            overflowsViewport: r.right > winW + 1 || r.left < -1,
            items
          };
        }

        // Float cta
        const fcta = document.getElementById('float-cta');
        const fctaDisplay = fcta ? window.getComputedStyle(fcta).display : null;

        // Footer padding vs dock
        const bodyPadBottom = parseInt(window.getComputedStyle(document.body).paddingBottom || '0', 10);

        return {
          winW,
          winH,
          scrollW,
          clientW,
          hasScrollX: scrollW > clientW,
          overflowingCount: overflowing.length,
          topOverflowing: overflowing.slice(0, 4),
          dockData,
          fctaDisplay,
          bodyPadBottom
        };
      })()`;

      const evalRes = await sendSession('Runtime.evaluate', {
        expression: evalScript,
        returnByValue: true
      });

      report[pageName][vp.name] = evalRes.result.value;
    }
  }

  // Cleanup
  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n======================================================');
  console.log('EMPIRICAL STRESS TEST RESULTS');
  console.log('======================================================\n');

  for (const page of PAGES) {
    console.log(`\n📄 [PÁGINA: ${page}]`);
    for (const [vpName, res] of Object.entries(report[page])) {
      const scrollStatus = res.hasScrollX ? `❌ OVERFLOW (scrollW=${res.scrollW} > clientW=${res.clientW})` : `✅ ZERO OVERFLOW (${res.scrollW}px)`;
      console.log(`  📱 ${vpName.padEnd(28)}: ${scrollStatus}`);
      if (res.hasScrollX) {
        console.log(`     ⚠️ ${res.overflowingCount} elementos transbordando! Primeiros:`);
        res.topOverflowing.forEach(o => console.log(`        - <${o.tag} id="${o.id}" class="${o.cls}"> right=${o.right}px width=${o.width}px: ${o.snippet}`));
      }
      if (res.dockData) {
        const d = res.dockData;
        console.log(`     ⚓ Dock: display=${d.display}, width=${d.width}px, left=${d.left}px, right=${d.right}px, overflows=${d.overflowsViewport}`);
        const itemSummary = d.items.map(it => `${it.page}:${it.width}x${it.height}px`).join(' | ');
        console.log(`        Itens: ${itemSummary}`);
      }
      if (res.fctaDisplay) {
        console.log(`     🔘 #float-cta display=${res.fctaDisplay}`);
      }
    }
  }

  const outReportPath = path.join(__dirname, 'stress_results.json');
  fs.writeFileSync(outReportPath, JSON.stringify(report, null, 2));
  console.log('\nRelatório salvo em:', outReportPath);
}

run().catch(err => {
  console.error('Erro no runner:', err);
  process.exit(1);
});
