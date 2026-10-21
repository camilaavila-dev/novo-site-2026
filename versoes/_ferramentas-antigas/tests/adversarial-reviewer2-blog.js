const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { auditSpaceBeforeBr, auditImageTransparency } = require('./helpers/dom-parser.js');

const VIEWPORTS = [
  { name: '320px (Narrow Mobile / iPhone SE 1)', width: 320, height: 568, mobile: true },
  { name: '375px (iPhone SE 2/3 / iPhone 8)', width: 375, height: 667, mobile: true },
  { name: '390px (iPhone 14 / iPhone 15)', width: 390, height: 844, mobile: true },
  { name: '430px (iPhone 15/16 Pro Max)', width: 430, height: 932, mobile: true },
  { name: '768px (iPad Mini / Tablet)', width: 768, height: 1024, mobile: true },
  { name: '1024px (Small Desktop / iPad Pro)', width: 1024, height: 768, mobile: false },
  { name: '1440px (Desktop Outlier)', width: 1440, height: 900, mobile: false }
];

async function runAdversarialReview() {
  console.log('══════════════════════════════════════════════════════════════════');
  console.log('  REVIEWER 2 & CRITIC: ADVERSARIAL STRESS TEST — BLOG.HTML & CSS  ');
  console.log('══════════════════════════════════════════════════════════════════\n');

  const blogHtmlPath = path.resolve(__dirname, '..', 'blog.html');
  const blogCssPath = path.resolve(__dirname, '..', 'css', 'blog.css');
  const blogCoreJsPath = path.resolve(__dirname, '..', 'js', 'blog-core.js');
  const editorialDataPath = path.resolve(__dirname, '..', 'data', 'editorial.js');

  const htmlContent = fs.readFileSync(blogHtmlPath, 'utf8');
  const cssContent = fs.readFileSync(blogCssPath, 'utf8');
  const jsContent = fs.readFileSync(blogCoreJsPath, 'utf8');
  const dataContent = fs.readFileSync(editorialDataPath, 'utf8');

  // 1. Auditoria de integridade e anti-trapaça
  console.log('--- 1. AUDITORIA DE INTEGRIDADE & FACADES ---');
  let integrityIssues = [];

  // Checa se há bypasses ou mocks embutidos
  if (htmlContent.includes('mock') || jsContent.includes('fakeData')) {
    integrityIssues.push('Possível mock embutido em runtime');
  }
  // Checa se as funções essenciais têm lógica real
  const hasInitBlog = jsContent.includes('function initBlog');
  const hasRenderMacroHud = jsContent.includes('function renderMacroHud');
  const hasSetupFeatured = jsContent.includes('function setupFeaturedEdition');
  const hasSetReaderMode = jsContent.includes('function setReaderMode');
  const hasCanvasWaves = jsContent.includes('initRadarCanvas');

  console.log(`Funções vitais implementadas: initBlog=${hasInitBlog}, renderMacroHud=${hasRenderMacroHud}, setupFeatured=${hasSetupFeatured}, setReaderMode=${hasSetReaderMode}, canvasWaves=${hasCanvasWaves}`);
  if (!hasInitBlog || !hasRenderMacroHud || !hasSetupFeatured || !hasSetReaderMode || !hasCanvasWaves) {
    integrityIssues.push('Funções vitais ausentes ou facade');
  }

  // 2. Auditoria de regra mobile: espaço antes de <br>
  console.log('\n--- 2. AUDITORIA DA REGRA MOBILE (<br> COM ESPAÇO) ---');
  const brAudit = auditSpaceBeforeBr(htmlContent);
  console.log(`Violações de espaço antes de <br> em títulos: ${brAudit.violationCount}`);
  if (!brAudit.isValid) {
    console.log('Violações encontradas:', brAudit.violations);
  }

  // Checa se há qualquer <br> sem espaço no documento inteiro (fora de comentários)
  const allBadBrs = [];
  const cleanHtml = htmlContent.replace(/<!--[\s\S]*?-->/g, '');
  const regexBadBr = /([^\s>])<br\s*\/?>/gi;
  let matchBr;
  while ((matchBr = regexBadBr.exec(cleanHtml)) !== null) {
    allBadBrs.push({
      char: matchBr[1],
      index: matchBr.index,
      snippet: cleanHtml.substring(Math.max(0, matchBr.index - 20), Math.min(cleanHtml.length, matchBr.index + 20))
    });
  }
  console.log(`Total de <br> sem espaço no documento inteiro: ${allBadBrs.length}`);
  if (allBadBrs.length > 0) {
    console.log('Exemplos de <br> sem espaço:', allBadBrs.slice(0, 3));
  }

  // 3. Auditoria de Filtros SVG proibidos
  console.log('\n--- 3. AUDITORIA DE FILTROS SVG PARA TRANSPARÊNCIA ---');
  const svgFilterAudit = auditImageTransparency(htmlContent);
  console.log(`Possui filtros SVG proibidos (feColorMatrix/feComponentTransfer): ${svgFilterAudit.hasForbiddenFilter}`);
  console.log(`Imagens auditadas: ${svgFilterAudit.images.join(', ')}`);

  // 4. Testes de Renderização, Touch Targets e Viewports via Chrome Headless
  console.log('\n--- 4. TESTES NO BROWSER HEADLESS (CDP) ---');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-adv-blog-'));
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9792',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  const ver = await (await fetch('http://127.0.0.1:9792/json/version')).json();
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

  const fileUrl = 'file:///' + blogHtmlPath.replace(/\\/g, '/');

  let viewportResults = [];
  for (const vp of VIEWPORTS) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });
    await sendSession('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 700));

    // Teste de overflow em modo Executivo inicial
    const execCheck = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const docEl = document.documentElement;
        const winW = window.innerWidth;
        const scrollW = docEl.scrollWidth;
        const clientW = docEl.clientWidth;
        const hasScrollX = scrollW > clientW;

        const overflowing = [];
        document.querySelectorAll('*').forEach(el => {
          if (el === docEl || el === document.body) return;
          const r = el.getBoundingClientRect();
          if (r.right > winW + 1.0) {
            overflowing.push({ tag: el.tagName, id: el.id, cls: (el.className || '').toString(), right: Math.round(r.right), width: Math.round(r.width) });
          }
        });

        // Checar touch targets menores que 48px
        const smallTouchTargets = [];
        const interactiveElements = document.querySelectorAll('button, a.nav-link, a.nav-cta, a.dock-item, .reader-toggle-btn, .filter-pill, .edition-card-cta-btn, #newsletter-btn, input');
        interactiveElements.forEach(el => {
          const r = el.getBoundingClientRect();
          // Ignora elementos ocultos por display:none ou zero dimensões
          if (r.width === 0 && r.height === 0) return;
          if (r.height < 44 || r.width < 44) {
            smallTouchTargets.push({
              tag: el.tagName,
              id: el.id,
              cls: (el.className || '').toString().substring(0, 30),
              text: (el.innerText || el.value || '').substring(0, 20),
              w: Math.round(r.width),
              h: Math.round(r.height)
            });
          }
        });

        // Checar Mobile Bottom Dock
        const dock = document.querySelector('.mobile-bottom-dock');
        const dockVisible = dock ? window.getComputedStyle(dock).display !== 'none' : false;
        const dockItemsCount = dock ? dock.querySelectorAll('.dock-item').length : 0;

        return {
          winW,
          scrollW,
          clientW,
          hasScrollX,
          overflowCount: overflowing.length,
          topOverflow: overflowing.slice(0, 3),
          smallTouchCount: smallTouchTargets.length,
          smallTouchTargets: smallTouchTargets.slice(0, 5),
          dockVisible,
          dockItemsCount
        };
      })()`,
      returnByValue: true
    });

    // Teste 2: Clicar em "Visão Quant / Nerd do Leo" e re-checar overflow com tabela aberta
    const quantCheck = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const quantBtn = document.querySelector('.reader-toggle-btn[data-mode="quant"]');
        if (quantBtn) quantBtn.click();

        const docEl = document.documentElement;
        const winW = window.innerWidth;
        const scrollW = docEl.scrollWidth;
        const clientW = docEl.clientWidth;
        const hasScrollX = scrollW > clientW;

        const tableWrap = document.querySelector('.quant-table-wrap');
        const tableWrapOverflowX = tableWrap ? window.getComputedStyle(tableWrap).overflowX : null;

        const overflowing = [];
        document.querySelectorAll('*').forEach(el => {
          if (el === docEl || el === document.body) return;
          const r = el.getBoundingClientRect();
          if (r.right > winW + 1.0) {
            overflowing.push({ tag: el.tagName, id: el.id, cls: (el.className || '').toString(), right: Math.round(r.right) });
          }
        });

        return {
          hasScrollX,
          scrollW,
          clientW,
          overflowCount: overflowing.length,
          tableWrapOverflowX
        };
      })()`,
      returnByValue: true
    });

    const vExec = execCheck.result.value;
    const vQuant = quantCheck.result.value;
    const ok = !vExec.hasScrollX && vExec.overflowCount === 0 && !vQuant.hasScrollX && vQuant.overflowCount === 0;

    console.log(`[${ok ? '✔ PASS' : '✖ FAIL'}] Viewport ${vp.name}:`);
    console.log(`  Executivo: clientW=${vExec.clientW}, scrollW=${vExec.scrollW}, hasScrollX=${vExec.hasScrollX}, overflowElements=${vExec.overflowCount}`);
    console.log(`  Quant Mode: clientW=${vQuant.clientW}, scrollW=${vQuant.scrollW}, hasScrollX=${vQuant.hasScrollX}, tableWrapOverflowX=${vQuant.tableWrapOverflowX}`);
    console.log(`  Touch Targets < 44px: ${vExec.smallTouchCount} (Dock visível=${vExec.dockVisible}, itens=${vExec.dockItemsCount})`);
    if (vExec.smallTouchCount > 0) {
      console.log('    Detalhes touch pequeno:', JSON.stringify(vExec.smallTouchTargets));
    }

    viewportResults.push({ vp: vp.name, ok, exec: vExec, quant: vQuant });
  }

  // 5. Stress test de busca com caracteres adversários
  console.log('\n--- 5. STRESS TEST ADVERSÁRIO DE ENTRADAS & BUSCA ---');
  const searchStress = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const search = document.getElementById('search-editions');
      const grid = document.getElementById('editions-grid');

      const inputs = [
        '<script>alert(1)</script>',
        '[][(![]+[])[+[]]]',
        '.*+?^$\\\\{}()|[]',
        '   ',
        'QUALQUERCOISAINEXISTENTEXYZ123'
      ];

      const results = [];
      inputs.forEach(inp => {
        search.value = inp;
        search.dispatchEvent(new Event('input', { bubbles: true }));
        const cardsCount = grid.querySelectorAll('.edition-card').length;
        const hasEmptyState = grid.innerText.includes('Nenhuma edição encontrada');
        results.push({ inp, cardsCount, hasEmptyState, gridHtmlSafe: !grid.innerHTML.includes('<script>') });
      });

      return results;
    })()`,
    returnByValue: true
  });
  console.log('Resultados do teste de busca adversária:', JSON.stringify(searchStress.result.value, null, 2));

  // 6. Teste de Validação da Newsletter com entradas inválidas
  console.log('\n--- 6. STRESS TEST DA NEWSLETTER VIP COM EMAILS INVÁLIDOS ---');
  const newsletterStress = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const form = document.getElementById('newsletter-form');
      const input = document.getElementById('newsletter-email');
      const feedback = document.getElementById('newsletter-feedback');

      const testCases = [
        '',
        'invalido',
        'sem_arroba.com',
        'usuario@dominio',
        '"><script>alert(1)</script>@x.com'
      ];

      const res = [];
      testCases.forEach(email => {
        input.value = email;
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        res.push({
          email,
          feedbackText: feedback.textContent,
          color: feedback.style.color,
          stored: localStorage.getItem('subscribed_newsletter')
        });
      });

      return res;
    })()`,
    returnByValue: true
  });
  console.log('Resultados da validação de newsletter:', JSON.stringify(newsletterStress.result.value, null, 2));

  // 7. Checagem de Tokens CSS e Design System
  console.log('\n--- 7. AUDITORIA DE TOKENS E DESIGN SYSTEM ---');
  const designAudit = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const bodyStyles = window.getComputedStyle(document.body);
      const heroTitle = document.querySelector('.blog-title');
      const titleFont = heroTitle ? window.getComputedStyle(heroTitle).fontFamily : null;
      const metricVal = document.querySelector('.metric-value');
      const metricFont = metricVal ? window.getComputedStyle(metricVal).fontFamily : null;

      const bg = bodyStyles.backgroundColor;
      const color = bodyStyles.color;

      return {
        bg,
        color,
        titleFont,
        metricFont
      };
    })()`,
    returnByValue: true
  });
  console.log('Tokens e Fontes Computadas:', JSON.stringify(designAudit.result.value, null, 2));

  ws.close();
  proc.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}

  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('               FIM DOS TESTES ADVERSÁRIOS                         ');
  console.log('══════════════════════════════════════════════════════════════════');
}

runAdversarialReview().catch(err => {
  console.error(err);
  process.exit(1);
});
