const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function captureChartScrubbing() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-scrub-'));
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9999',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  const ver = await (await fetch('http://127.0.0.1:9999/json/version')).json();
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

  // Desktop 1440px rolando até o gráfico e fazendo mousemove
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1000));

  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const chartEl = document.getElementById('sim-chart');
      chartEl.scrollIntoView({ block: 'center' });
      const rect = chartEl.getBoundingClientRect();
      const targetX = rect.left + rect.width * 0.55;
      const targetY = rect.top + rect.height * 0.5;

      const evt = new MouseEvent('mousemove', {
        clientX: targetX,
        clientY: targetY,
        bubbles: true
      });
      chartEl.dispatchEvent(evt);
    })()`
  });
  await new Promise(r => setTimeout(r, 300));

  const ssScrubDesktop = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'screenshot_scrubbing_desktop.png'), Buffer.from(ssScrubDesktop.data, 'base64'));

  // Mobile 390px rolando até o gráfico e fazendo touchmove
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1000));

  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const chartEl = document.getElementById('sim-chart');
      chartEl.scrollIntoView({ block: 'center' });
      const rect = chartEl.getBoundingClientRect();
      const targetX = rect.left + rect.width * 0.5;
      const targetY = rect.top + rect.height * 0.5;

      const touch = new Touch({
        identifier: 1,
        target: chartEl,
        clientX: targetX,
        clientY: targetY,
        pageX: targetX,
        pageY: targetY
      });
      chartEl.dispatchEvent(new TouchEvent('touchmove', {
        touches: [touch],
        targetTouches: [touch],
        changedTouches: [touch],
        bubbles: true
      }));
    })()`
  });
  await new Promise(r => setTimeout(r, 300));

  const ssScrubMobile = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'screenshot_scrubbing_mobile.png'), Buffer.from(ssScrubMobile.data, 'base64'));

  ws.close();
  proc.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  console.log('Screenshots de scrubbing capturados com sucesso!');
}

captureChartScrubbing().catch(console.error);
