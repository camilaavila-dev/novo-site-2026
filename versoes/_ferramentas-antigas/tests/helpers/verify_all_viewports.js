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

async function verifyAllViewports() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-vp-'));
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9777',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  const ver = await (await fetch('http://127.0.0.1:9777/json/version')).json();
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

  const fileUrl = 'file:///' + path.resolve(__dirname, '..', '..', 'simulador.html').replace(/\\/g, '/');

  console.log('=== VERIFICAÇÃO RIGOROSA DE VIEWPORTS ===');
  for (const vp of VIEWPORTS) {
    // 1. Aplica override
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });
    // 2. Navega
    await sendSession('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 800));

    // 3. Mede
    const res = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const docEl = document.documentElement;
        const winW = window.innerWidth;
        const clientW = docEl.clientWidth;
        const scrollW = docEl.scrollWidth;
        const hasScrollX = scrollW > clientW;

        // Inspeciona elementos que possam ultrapassar o viewport
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

        return {
          expectedW: ${vp.width},
          winW,
          clientW,
          scrollW,
          hasScrollX,
          overflowCount: overflowing.length,
          topOverflowing: overflowing.slice(0, 4)
        };
      })()`,
      returnByValue: true
    });

    const v = res.result.value;
    console.log(`[${vp.name.padEnd(28)}] winW=${v.winW} clientW=${v.clientW} scrollW=${v.scrollW} hasScrollX=${v.hasScrollX} overflowElements=${v.overflowCount}`);
    if (v.overflowCount > 0) {
      console.log('   Elementos transbordando:', JSON.stringify(v.topOverflowing));
    }
  }

  ws.close();
  proc.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
}

verifyAllViewports().catch(console.error);
