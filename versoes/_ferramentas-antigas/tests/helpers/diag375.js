const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function test375() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-diag-'));
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9666',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1000));
  const ver = await (await fetch('http://127.0.0.1:9666/json/version')).json();
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
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });

  const fileUrl = 'file:///' + path.resolve(__dirname, '..', '..', 'simulador.html').replace(/\\/g, '/');
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 800));

  const diag = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const docEl = document.documentElement;
      return {
        innerW: window.innerWidth,
        clientW: docEl.clientWidth,
        scrollW: docEl.scrollWidth,
        bodyScrollW: document.body.scrollWidth,
        metaViewport: document.querySelector('meta[name="viewport"]')?.content,
        canvasW: document.getElementById('sim-chart')?.clientWidth,
        canvasBufferW: document.getElementById('sim-chart')?.width
      };
    })()`,
    returnByValue: true
  });

  console.log('DIAGNOSTICO 375px:', diag.result.value);
  ws.close();
  proc.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
}

test375().catch(console.error);
