const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function capture() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-visual-overhaul-'));
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9899',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));
  const ver = await (await fetch('http://127.0.0.1:9899/json/version')).json();
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
  const outDir = path.resolve(__dirname, '..', '..', '.agents', 'teamwork', 'teamwork_preview_worker_visual_overhaul');

  // 1. Desktop 1440x1100 (Visão Geral do Simulador com Astrolábio e HUD)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1500)); // Aguarda render dos canvas 3D

  const ssDesktop = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'screenshot_simulador_desktop.png'), Buffer.from(ssDesktop.data, 'base64'));
  console.log('✔ Screenshot Desktop salvo em screenshot_simulador_desktop.png');

  // 2. Mobile 390x844 (iPhone 14)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1200));

  const ssMobile = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'screenshot_simulador_mobile.png'), Buffer.from(ssMobile.data, 'base64'));
  console.log('✔ Screenshot Mobile salvo em screenshot_simulador_mobile.png');

  ws.close();
  proc.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
}

capture().catch(console.error);
