const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function captureSovereignty() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-sov-state-'));
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9898',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));
  const ver = await (await fetch('http://127.0.0.1:9898/json/version')).json();
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
  await sendSession('Runtime.enable');
  const fileUrl = 'file:///' + path.resolve(__dirname, '..', '..', 'simulador.html').replace(/\\/g, '/');
  const outDir = path.resolve(__dirname, '..', '..', '.agents', 'teamwork', 'teamwork_preview_worker_visual_overhaul');

  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1000));

  // Aciona o cenário M&A (R$ 5M de P0, 25k de PMT, soberania imediata atingida)
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('[data-crisis-scenario="evento-ma"]');
      if (btn) btn.click();
    })()`
  });

  await new Promise(r => setTimeout(r, 1200)); // Aguarda transmutação cromática para esmeralda e ouro

  const ssSov = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'screenshot_soberania_atingida.png'), Buffer.from(ssSov.data, 'base64'));
  console.log('✔ Screenshot de Soberania Viva salvo em screenshot_soberania_atingida.png');

  ws.close();
  proc.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
}

captureSovereignty().catch(console.error);
