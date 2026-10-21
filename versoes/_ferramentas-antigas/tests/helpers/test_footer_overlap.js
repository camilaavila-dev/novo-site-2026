const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9666;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-footer-'));

const chromeProc = spawn(CHROME_PATH, [
  '--headless=new',
  '--remote-debugging-port=' + PORT,
  '--user-data-dir=' + tempDir,
  'about:blank'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1200));

  const v = await (await fetch('http://127.0.0.1:' + PORT + '/json/version')).json();
  const ws = new WebSocket(v.webSocketDebuggerUrl);
  let id = 1;
  const req = (method, params = {}) => new Promise(res => {
    const msgId = id++;
    const handler = (ev) => {
      const d = JSON.parse(ev.data);
      if (d.id === msgId) { ws.removeEventListener('message', handler); res(d.result); }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
  await new Promise(r => ws.onopen = r);
  const { targetId } = await req('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await req('Target.attachToTarget', { targetId, flatten: true });
  const reqS = (method, params = {}) => new Promise(res => {
    const msgId = id++;
    const handler = (ev) => {
      const d = JSON.parse(ev.data);
      if (d.id === msgId) { ws.removeEventListener('message', handler); res(d.result); }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
  });
  await reqS('Page.enable');
  await reqS('Runtime.enable');

  const pages = ['index.html', 'termos.html', 'privacidade.html'];
  const viewports = [
    { name: '320x568 (iPhone SE 1)', width: 320, height: 568 },
    { name: '375x667 (SE)', width: 375, height: 667 },
    { name: '390x844 (iPhone 14/15)', width: 390, height: 844 },
    { name: '430x932 (Pro Max)', width: 430, height: 932 }
  ];

  for (const page of pages) {
    console.log(`\n=== TESTANDO OVERLAP: ${page} ===`);
    for (const vp of viewports) {
      await reqS('Emulation.setDeviceMetricsOverride', { width: vp.width, height: vp.height, deviceScaleFactor: 2, mobile: true });
      const fUrl = 'file:///' + path.resolve(__dirname, '..', '..', page).replace(/\\/g, '/');
      await reqS('Page.navigate', { url: fUrl });
      await new Promise(r => setTimeout(r, 700));

      // Desativa scroll suave e rola instantaneamente até o fim
      await reqS('Runtime.evaluate', {
        expression: `
          document.documentElement.style.scrollBehavior = 'auto';
          document.body.style.scrollBehavior = 'auto';
          window.scrollTo(0, 1000000);
        `
      });
      await new Promise(r => setTimeout(r, 400));

      const res = await reqS('Runtime.evaluate', {
        expression: `(() => {
          const dock = document.querySelector('.mobile-bottom-dock, .bottom-dock');
          const footer = document.querySelector('footer');
          const dockRect = dock ? dock.getBoundingClientRect() : null;
          const footerRect = footer ? footer.getBoundingClientRect() : null;
          
          // Encontra o elemento mais inferior visível dentro do rodapé
          const allFooterChildren = footer ? footer.querySelectorAll('*') : [];
          let maxBottom = 0;
          let lowestSnippet = '';
          allFooterChildren.forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.bottom > maxBottom) {
              maxBottom = r.bottom;
              lowestSnippet = (el.outerHTML || '').substring(0, 50).replace(/\\s+/g, ' ');
            }
          });

          return {
            scrollY: window.scrollY,
            maxScroll: document.documentElement.scrollHeight - window.innerHeight,
            viewportHeight: window.innerHeight,
            dockTop: dockRect ? Math.round(dockRect.top) : null,
            dockHeight: dockRect ? Math.round(dockRect.height) : null,
            lowestFooterElBottom: Math.round(maxBottom),
            gapCleared: dockRect ? Math.round(dockRect.top - maxBottom) : null,
            hasOverlap: dockRect ? maxBottom > dockRect.top : false,
            lowestSnippet
          };
        })()`,
        returnByValue: true
      });

      const r = res.result.value;
      const status = r.hasOverlap ? `❌ SOBREPOSIÇÃO DETECTADA (invadiu ${-r.gapCleared}px)` : `✅ LIMPO (folga de ${r.gapCleared}px)`;
      console.log(`  Viewport ${vp.name.padEnd(22)}: ${status} | Dock Top: ${r.dockTop}px | Fim do Rodapé: ${r.lowestFooterElBottom}px | scrollY: ${r.scrollY}/${r.maxScroll}`);
    }
  }

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {}
}

run().catch(e => {
  console.error(e);
  chromeProc.kill();
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (err) {}
});
