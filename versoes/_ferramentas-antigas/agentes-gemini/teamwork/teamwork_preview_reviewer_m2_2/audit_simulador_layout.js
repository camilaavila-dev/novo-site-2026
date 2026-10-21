const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9556;
const ROOT_DIR = 'c:\\Users\\Camila Ávila\\Desktop\\Projetos\\LEONARDO\\novo-site-2026';

const VIEWPORTS = [
  { name: '320px (iPhone SE 1st)', width: 320, height: 568, mobile: true },
  { name: '390px (iPhone 14/15)', width: 390, height: 844, mobile: true },
  { name: '430px (iPhone 15/16 Pro Max)', width: 430, height: 932, mobile: true },
  { name: '1440px (Desktop)', width: 1440, height: 900, mobile: false }
];

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getJson(url) {
  const res = await fetch(url);
  return res.json();
}

async function run() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-audit-m2-'));
  console.log('Iniciando Chrome...');

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await wait(300);
    try {
      const version = await getJson(`http://127.0.0.1:${PORT}/json/version`);
      wsUrl = version.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error('Falha ao conectar com Chrome');
    chromeProc.kill();
    return;
  }

  console.log('Conectado ao Chrome:', wsUrl);
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

  const fileUrl = 'file:///' + path.join(ROOT_DIR, 'simulador.html').replace(/\\/g, '/');
  console.log('Navegando para:', fileUrl);

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Testando Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });

    await sendSession('Page.navigate', { url: fileUrl });
    await wait(800);

    const evalRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        try {
          const docEl = document.documentElement;
          const winW = window.innerWidth;
          const winH = window.innerHeight;
          const scrollW = docEl.scrollWidth;
          const clientW = docEl.clientWidth;
          const bodyScrollW = document.body.scrollWidth;

          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            if (el === docEl || el === document.body) return;
            const r = el.getBoundingClientRect();
            if (r.right > winW + 1.5) {
              overflowing.push({
                tag: el.tagName,
                id: el.id,
                cls: (el.className || '').toString().substring(0, 40),
                left: Math.round(r.left),
                right: Math.round(r.right),
                width: Math.round(r.width),
                snippet: (el.outerHTML || '').substring(0, 80).replace(/\\s+/g, ' ')
              });
            }
          });

          // Top Nav
          const siteNav = document.getElementById('site-nav');
          let navInfo = null;
          if (siteNav) {
            const nr = siteNav.getBoundingClientRect();
            const ns = window.getComputedStyle(siteNav);
            const navLinks = document.getElementById('nav-links');
            const nls = navLinks ? window.getComputedStyle(navLinks) : null;
            const navCta = siteNav.querySelector('.nav-cta');
            const ncs = navCta ? window.getComputedStyle(navCta) : null;

            navInfo = {
              width: Math.round(nr.width),
              height: Math.round(nr.height),
              right: Math.round(nr.right),
              padding: ns.padding,
              linksDisplay: nls ? nls.display : null,
              ctaDisplay: ncs ? ncs.display : null
            };
          }

          // Dock
          const dock = document.querySelector('.mobile-bottom-dock, .bottom-dock');
          let dockInfo = null;
          if (dock) {
            const dr = dock.getBoundingClientRect();
            const ds = window.getComputedStyle(dock);
            const items = [...dock.querySelectorAll('.dock-item')].map(it => {
              const ir = it.getBoundingClientRect();
              return {
                page: it.getAttribute('data-page'),
                width: Math.round(ir.width),
                height: Math.round(ir.height)
              };
            });
            dockInfo = {
              display: ds.display,
              width: Math.round(dr.width),
              height: Math.round(dr.height),
              left: Math.round(dr.left),
              right: Math.round(dr.right),
              items
            };
          }

          // Sliders
          const sliders = [...document.querySelectorAll('.sim-slider')].map(sl => {
            const r = sl.getBoundingClientRect();
            return { id: sl.id, w: Math.round(r.width), h: Math.round(r.height) };
          });

          // Canvas
          const canvas = document.getElementById('sim-chart');
          let canvasInfo = null;
          if (canvas) {
            const cr = canvas.getBoundingClientRect();
            canvasInfo = {
              cssWidth: Math.round(cr.width),
              cssHeight: Math.round(cr.height),
              canvasWidth: canvas.width,
              canvasHeight: canvas.height
            };
          }

          // Main CTA
          const cta = document.getElementById('cta-simulador');
          let ctaInfo = null;
          if (cta) {
            const ctr = cta.getBoundingClientRect();
            ctaInfo = { w: Math.round(ctr.width), h: Math.round(ctr.height) };
          }

          return {
            winW,
            winH,
            scrollW,
            clientW,
            bodyScrollW,
            hasHorizontalScroll: scrollW > clientW + 1,
            overflowingCount: overflowing.length,
            topOverflowing: overflowing.slice(0, 5),
            navInfo,
            dockInfo,
            sliders: sliders.slice(0, 2),
            canvasInfo,
            ctaInfo
          };
        } catch (err) {
          return { error: err.message, stack: err.stack };
        }
      })()`,
      returnByValue: true
    });

    console.log(JSON.stringify(evalRes.result.value, null, 2));
  }

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {}
}

run().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
