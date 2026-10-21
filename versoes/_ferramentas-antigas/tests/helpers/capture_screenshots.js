const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function captureScreenshots() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-ss-'));
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9888',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  const ver = await (await fetch('http://127.0.0.1:9888/json/version')).json();
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
  const fileUrl = 'file:///' + path.resolve(__dirname, '..', '..', 'simulador.html').replace(/\\/g, '/');
  const outDir = path.resolve(__dirname, '..', '..', '.agents', 'teamwork', 'teamwork_preview_challenger_m2_2');

  // 1. Mobile 375px
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1000));

  const ssMobile = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'screenshot_375px_mobile.png'), Buffer.from(ssMobile.data, 'base64'));

  // 2. Desktop 1440px
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1000));

  const ssDesktop = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'screenshot_1440px_desktop.png'), Buffer.from(ssDesktop.data, 'base64'));

  ws.close();
  proc.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  console.log('Screenshots capturados com sucesso em:', outDir);
}

captureScreenshots().catch(console.error);
