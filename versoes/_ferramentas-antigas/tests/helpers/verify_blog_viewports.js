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

async function verifyBlogViewports() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-blog-'));
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9789',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  const ver = await (await fetch('http://127.0.0.1:9789/json/version')).json();
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

  const fileUrl = 'file:///' + path.resolve(__dirname, '..', '..', 'blog.html').replace(/\\/g, '/');

  console.log('=== VERIFICAÇÃO RIGOROSA DE VIEWPORTS E OVERFLOW — BLOG.HTML ===');
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
              id: el.id,
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

  // Testes de Interatividade no Navegador Real
  console.log('\n=== TESTANDO INTERATIVIDADE DO BLOG NO BROWSER REAL ===');
  await sendSession('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 600));

  // 1. Testa Alternador Executivo -> Quant -> Executivo
  const toggleResult = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const execBtn = document.querySelector('.reader-toggle-btn[data-mode="exec"]');
      const quantBtn = document.querySelector('.reader-toggle-btn[data-mode="quant"]');
      const panel = document.getElementById('reader-content-panel');

      const initialExecText = panel.innerText;

      // Clica em Quant
      quantBtn.click();
      const quantActive = quantBtn.classList.contains('is-active');
      const quantText = panel.innerText;
      const lsQuant = localStorage.getItem('leo_reader_preference');

      // Clica de volta em Exec
      execBtn.click();
      const execActive = execBtn.classList.contains('is-active');
      const lsExec = localStorage.getItem('leo_reader_preference');

      return {
        initialExecHasText: initialExecText.length > 20,
        quantActive,
        quantTextDifferent: quantText !== initialExecText,
        lsQuant,
        execActive,
        lsExec
      };
    })()`,
    returnByValue: true
  });
  console.log('Teste do Alternador Executivo/Quant:', JSON.stringify(toggleResult.result.value, null, 2));

  // 2. Testa Filtro de Categoria
  const filterResult = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const offshorePill = document.querySelector('.filter-pill[data-category="offshore"]');
      offshorePill.click();

      const gridCards = document.querySelectorAll('#editions-grid .edition-card');
      const titles = Array.from(gridCards).map(c => c.querySelector('.edition-card-title').textContent);

      // Restaura todas
      const allPill = document.querySelector('.filter-pill[data-category="all"]');
      allPill.click();
      const allCardsCount = document.querySelectorAll('#editions-grid .edition-card').length;

      return {
        offshoreCardCount: gridCards.length,
        offshoreTitles: titles,
        allCardsCount
      };
    })()`,
    returnByValue: true
  });
  console.log('Teste do Filtro de Categorias:', JSON.stringify(filterResult.result.value, null, 2));

  // 3. Testa Inscrição na Newsletter
  const newsletterResult = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const input = document.getElementById('newsletter-email');
      const form = document.getElementById('newsletter-form');
      const feedback = document.getElementById('newsletter-feedback');

      input.value = 'investidor.elite@familyoffice.com.br';
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      return {
        feedbackText: feedback.textContent,
        storedEmail: localStorage.getItem('subscribed_newsletter')
      };
    })()`,
    returnByValue: true
  });
  console.log('Teste da Newsletter VIP:', JSON.stringify(newsletterResult.result.value, null, 2));

  ws.close();
  proc.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}

  if (!allPass) {
    process.exit(1);
  }
  process.exit(0);
}

verifyBlogViewports().catch(err => {
  console.error(err);
  process.exit(1);
});
