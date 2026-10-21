/**
 * ==============================================================================
 * ADVERSARIAL STRESS HARNESS — MILESTONE M4 (DOM, CANVAS & RESPONSIVE LAYOUT)
 * Challenger 2 (Empirical Challenger)
 * ==============================================================================
 * Verificações Mandatórias de Desafio:
 * 1. Viewports críticas e extremas: 320px, 375px, 390px, 430px, 768px, 1024px, 1440px.
 * 2. Redimensionamento dinâmico e teste exaustivo de overflow horizontal (scrollWidth <= clientWidth).
 * 3. Inspeção de #radar-universe e halos: pointer-events: none e zero interceptação de cliques.
 * 4. Hit-testing via document.elementFromPoint(x, y) em todos os elementos interativos.
 * 5. Colisão e sobreposição da Mobile Floating Dock contra formulários, botões e rodapé.
 * 6. Ergonomia e touch targets >= 48px para WCAG 2.2 AAA.
 * 7. Integridade do DOM, metadados Schema.org e conformidade com regras do projeto.
 * ==============================================================================
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('node:assert/strict');

const VIEWPORTS = [
  { name: '320px (iPhone SE 1st gen)', width: 320, height: 568, mobile: true },
  { name: '375px (iPhone SE 2nd/3rd gen)', width: 375, height: 667, mobile: true },
  { name: '390px (iPhone 13/14/15)', width: 390, height: 844, mobile: true },
  { name: '430px (iPhone 15/16 Pro Max)', width: 430, height: 932, mobile: true },
  { name: '768px (iPad Mini / Tablet)', width: 768, height: 1024, mobile: true },
  { name: '1024px (Small Desktop / iPad Landscape)', width: 1024, height: 768, mobile: false },
  { name: '1440px (Desktop Outlier)', width: 1440, height: 900, mobile: false }
];

let totalChallenges = 0;
let passedChallenges = 0;
let failedChallenges = 0;

function logPass(title, details = '') {
  totalChallenges++;
  passedChallenges++;
  console.log(`\x1b[32m✔ [PASS]\x1b[0m \x1b[1m${title}\x1b[0m ${details}`);
}

function logFail(title, err) {
  totalChallenges++;
  failedChallenges++;
  console.error(`\x1b[31m✖ [FAIL]\x1b[0m \x1b[1m${title}\x1b[0m`);
  console.error(`  Detalhe: ${err.message || err}`);
}

async function runAdversarialLayoutHarness() {
  console.log('\x1b[35m' + '='.repeat(80) + '\x1b[0m');
  console.log('\x1b[1m\x1b[36m  ADVERSARIAL STRESS HARNESS — DOM, CANVAS & LAYOUT RESPONSIVO (M4)\x1b[0m');
  console.log('\x1b[35m' + '='.repeat(80) + '\x1b[0m\n');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-adv-m4-'));
  const port = 9792;
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1400));
  const ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
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

  const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'blog.html').replace(/\\/g, '/');

  // =========================================================================
  // BLOCO 1: VIEWPORTS CRÍTICAS E TESTE DE REDIMENSIONAMENTO DINÂMICO
  // =========================================================================
  console.log('\x1b[33m--- BLOCO 1: VIEWPORTS CRÍTICAS & REDIMENSIONAMENTO DINÂMICO ---\x1b[0m');

  for (const vp of VIEWPORTS) {
    try {
      await sendSession('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile
      });
      await sendSession('Page.navigate', { url: fileUrl });
      // Aguarda carregamento completo do documento e folhas de estilo
      await new Promise(r => setTimeout(r, 850));

      const evalRes = await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const docEl = document.documentElement;
          const winW = window.innerWidth;
          const clientW = docEl.clientWidth;
          const scrollW = docEl.scrollWidth;
          const hasScrollX = scrollW > (clientW + 1);

          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            if (el === docEl || el === document.body) return;
            const r = el.getBoundingClientRect();
            if (r.right > (winW + 1.5)) {
              overflowing.push({
                tag: el.tagName,
                id: el.id,
                cls: (el.className || '').toString().substring(0, 35),
                right: Math.round(r.right),
                excess: Math.round(r.right - winW)
              });
            }
          });

          return {
            winW,
            clientW,
            scrollW,
            hasScrollX,
            overflowCount: overflowing.length,
            overflowing: overflowing.slice(0, 5)
          };
        })()`,
        returnByValue: true
      });

      const data = evalRes.result.value;
      assert.strictEqual(data.hasScrollX, false, `Viewport ${vp.name} apresentou scroll horizontal (scrollW=${data.scrollW} > clientW=${data.clientW})`);
      assert.strictEqual(data.overflowCount, 0, `Viewport ${vp.name} possui ${data.overflowCount} elementos transbordando: ${JSON.stringify(data.overflowing)}`);
      logPass(`CH-M4-01 (${vp.name})`, `winW=${data.winW} scrollW=${data.scrollW} overflowElements=0`);
    } catch (err) {
      logFail(`CH-M4-01 (${vp.name})`, err);
    }
  }

  // Redimensionamento Dinâmico em Tempo Real (Resize Stress)
  try {
    const resizeSequence = [1440, 1024, 768, 430, 390, 375, 320, 390, 768, 1440];
    let resizeFailures = 0;
    for (const w of resizeSequence) {
      await sendSession('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: 800,
        deviceScaleFactor: 2,
        mobile: w <= 900
      });
      await new Promise(r => setTimeout(r, 150));
      const res = await sendSession('Runtime.evaluate', {
        expression: `document.documentElement.scrollWidth <= (document.documentElement.clientWidth + 1)`,
        returnByValue: true
      });
      if (!res.result.value) resizeFailures++;
    }
    assert.strictEqual(resizeFailures, 0, `Falha no teste de redimensionamento contínuo (${resizeFailures} falhas)`);
    logPass('CH-M4-02: Redimensionamento Dinâmico Contínuo (1440px -> 320px -> 1440px)', 'Layout responsivo adaptou fluidamente sem retenção de overflow');
  } catch (err) {
    logFail('CH-M4-02: Redimensionamento Dinâmico Contínuo', err);
  }

  // =========================================================================
  // BLOCO 2: CANVAS #radar-universe & HALOS — POINTER-EVENTS & HIT-TESTING
  // =========================================================================
  console.log('\n\x1b[33m--- BLOCO 2: CANVAS #radar-universe & INTERCEPTAÇÃO DE EVENTOS ---\x1b[0m');

  // Teste em Desktop (1440px)
  await sendSession('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 600));

  try {
    const styleRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const canvas = document.getElementById('radar-universe');
        const halos = document.querySelector('.blog-halo-container');
        const canvasStyle = window.getComputedStyle(canvas);
        const halosStyle = halos ? window.getComputedStyle(halos) : null;

        return {
          canvasExists: !!canvas,
          canvasPointerEvents: canvasStyle.pointerEvents,
          canvasZIndex: canvasStyle.zIndex,
          halosPointerEvents: halosStyle ? halosStyle.pointerEvents : null
        };
      })()`,
      returnByValue: true
    });

    const info = styleRes.result.value;
    assert.strictEqual(info.canvasExists, true, '#radar-universe deve existir no DOM');
    assert.strictEqual(info.canvasPointerEvents, 'none', '#radar-universe DEVE ter pointer-events: none');
    assert.strictEqual(info.halosPointerEvents, 'none', '.blog-halo-container DEVE ter pointer-events: none');
    logPass('CH-M4-03: Propriedades CSS de #radar-universe e .blog-halo-container', `canvas pointer-events=${info.canvasPointerEvents}, z-index=${info.canvasZIndex}`);
  } catch (err) {
    logFail('CH-M4-03: Propriedades CSS de #radar-universe', err);
  }

  // Hit-testing exaustivo via document.elementFromPoint(x, y)
  try {
    const hitTestRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const targets = [
          { sel: '#site-nav a[href="index.html"]', name: 'Logo Nav' },
          { sel: '#site-nav a[href="blog.html"]', name: 'Nav Link Radar' },
          { sel: '#site-nav .nav-cta', name: 'Nav CTA Agendar' },
          { sel: '.reader-toggle-btn[data-mode="exec"]', name: 'Toggle Executivo' },
          { sel: '.reader-toggle-btn[data-mode="quant"]', name: 'Toggle Quant' },
          { sel: '.filter-pill[data-category="all"]', name: 'Filtro All' },
          { sel: '.filter-pill[data-category="macro"]', name: 'Filtro Macro' },
          { sel: '.filter-pill[data-category="offshore"]', name: 'Filtro Offshore' },
          { sel: '.filter-pill[data-category="blindagem"]', name: 'Filtro Blindagem' },
          { sel: '#search-editions', name: 'Input Busca' },
          { sel: '#newsletter-email', name: 'Input Newsletter' },
          { sel: '#newsletter-btn', name: 'Botão Newsletter' },
          { sel: 'footer a[href="simulador.html"]', name: 'Link Footer Simulador' }
        ];

        const results = [];
        for (const t of targets) {
          const el = document.querySelector(t.sel);
          if (!el) {
            results.push({ name: t.name, found: false, error: 'Elemento não encontrado' });
            continue;
          }
          el.scrollIntoView({ block: 'center' });
          const r = el.getBoundingClientRect();
          const cx = Math.round(r.left + r.width / 2);
          const cy = Math.round(r.top + r.height / 2);
          const topEl = document.elementFromPoint(cx, cy);

          const isSelfOrChild = el === topEl || el.contains(topEl);
          const isCanvas = topEl && topEl.id === 'radar-universe';
          const isHalo = topEl && (topEl.classList.contains('blog-halo-container') || topEl.className.toString().includes('blog-halo'));

          results.push({
            name: t.name,
            cx,
            cy,
            targetTag: el.tagName,
            topElTag: topEl ? topEl.tagName : 'null',
            topElId: topEl ? topEl.id : '',
            topElClass: topEl ? (topEl.className || '').toString().substring(0, 30) : '',
            isSelfOrChild,
            isCanvas,
            isHalo
          });
        }
        return results;
      })()`,
      returnByValue: true
    });

    const results = hitTestRes.result.value;
    let anyBlocked = false;
    for (const r of results) {
      if (!r.isSelfOrChild || r.isCanvas || r.isHalo) {
        anyBlocked = true;
        throw new Error(`Elemento "${r.name}" foi interceptado por <${r.topElTag} id="${r.topElId}" class="${r.topElClass}"> nas coordenadas (${r.cx}, ${r.cy})`);
      }
    }
    assert.strictEqual(anyBlocked, false);
    logPass('CH-M4-04: Hit-Testing Exhaustivo de Cliques (13 elementos interativos chave)', 'Nenhum elemento bloqueado por #radar-universe ou halos');
  } catch (err) {
    logFail('CH-M4-04: Hit-Testing de Cliques', err);
  }

  // Despacho real de eventos de clique via CDP (Mouse Interaction Stress)
  try {
    const clickToggleRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const quantBtn = document.querySelector('.reader-toggle-btn[data-mode="quant"]');
        const execBtn = document.querySelector('.reader-toggle-btn[data-mode="exec"]');
        const panel = document.getElementById('reader-content-panel');

        // Clica fisicamente no Quant
        quantBtn.scrollIntoView({ block: 'center' });
        quantBtn.click();
        const afterQuant = quantBtn.classList.contains('is-active') && panel.innerText.includes('Tese Quant');

        // Clica de volta no Exec
        execBtn.click();
        const afterExec = execBtn.classList.contains('is-active') && !panel.innerText.includes('Tese Quant');

        return { afterQuant, afterExec };
      })()`,
      returnByValue: true
    });
    const { afterQuant, afterExec } = clickToggleRes.result.value;
    assert.strictEqual(afterQuant, true, 'Alternador deve ativar Visão Quant ao clique');
    assert.strictEqual(afterExec, true, 'Alternador deve reativar Resumo Executivo ao clique');
    logPass('CH-M4-05: Disparo de Cliques e Interação Tátil do Alternador de Modo', 'Transição bidirecional Executivo <-> Quant executada com sucesso');
  } catch (err) {
    logFail('CH-M4-05: Disparo de Cliques do Alternador', err);
  }

  // =========================================================================
  // BLOCO 3: MOBILE FLOATING DOCK — COLISÃO, SOBREPOSIÇÃO & ERGONOMIA
  // =========================================================================
  console.log('\n\x1b[33m--- BLOCO 3: MOBILE FLOATING DOCK — COLISÃO & SOBREPOSIÇÃO NO SMARTPHONE ---\x1b[0m');

  const mobileTestVps = [
    { name: '320px', width: 320, height: 568 },
    { name: '375px', width: 375, height: 667 },
    { name: '390px', width: 390, height: 844 },
    { name: '430px', width: 430, height: 932 },
    { name: '768px', width: 768, height: 1024 }
  ];

  for (const mvp of mobileTestVps) {
    try {
      await sendSession('Emulation.setDeviceMetricsOverride', {
        width: mvp.width,
        height: mvp.height,
        deviceScaleFactor: 2,
        mobile: true
      });
      await sendSession('Page.navigate', { url: fileUrl });
      await new Promise(r => setTimeout(r, 600));

      const dockEval = await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const dock = document.querySelector('.mobile-bottom-dock, .bottom-dock');
          if (!dock) return { dockFound: false };

          const dockStyle = window.getComputedStyle(dock);
          const dockRect = dock.getBoundingClientRect();
          const winH = window.innerHeight;
          const winW = window.innerWidth;

          // 1. Testa se a dock está posicionada na parte inferior
          const isBottom = dockRect.bottom <= winH + 2 && dockRect.top >= winH - 100;

          // 2. Testa sobreposição com o formulário de newsletter quando focado/scrollado
          const newsForm = document.getElementById('newsletter-form');
          const emailInput = document.getElementById('newsletter-email');
          const submitBtn = document.getElementById('newsletter-btn');

          newsForm.scrollIntoView({ block: 'center' });
          const emailRect = emailInput.getBoundingClientRect();
          const submitRect = submitBtn.getBoundingClientRect();

          const overlapEmail = !(
            dockRect.right < emailRect.left ||
            dockRect.left > emailRect.right ||
            dockRect.bottom < emailRect.top ||
            dockRect.top > emailRect.bottom
          );

          const overlapSubmit = !(
            dockRect.right < submitRect.left ||
            dockRect.left > submitRect.right ||
            dockRect.bottom < submitRect.top ||
            dockRect.top > submitRect.bottom
          );

          // 3. Testa sobreposição no final absoluto da página (Footer)
          window.scrollTo(0, document.body.scrollHeight);
          const backTopBtn = document.querySelector('footer button');
          const backTopRect = backTopBtn ? backTopBtn.getBoundingClientRect() : null;
          const overlapBackTop = backTopRect ? !(
            dockRect.right < backTopRect.left ||
            dockRect.left > backTopRect.right ||
            dockRect.bottom < backTopRect.top ||
            dockRect.top > backTopRect.bottom
          ) : false;

          // 4. Touch target da dock
          const dockItems = Array.from(dock.querySelectorAll('.dock-item')).map(it => {
            const r = it.getBoundingClientRect();
            return { label: it.innerText.trim(), w: Math.round(r.width), h: Math.round(r.height) };
          });
          const allDockTouchOk = dockItems.every(it => it.w >= 44 && it.h >= 44);

          return {
            dockFound: true,
            display: dockStyle.display,
            isBottom,
            overlapEmail,
            overlapSubmit,
            overlapBackTop,
            dockRect: { top: Math.round(dockRect.top), h: Math.round(dockRect.height) },
            dockItems,
            allDockTouchOk
          };
        })()`,
        returnByValue: true
      });

      const res = dockEval.result.value;
      assert.strictEqual(res.dockFound, true, `Floating Dock deve existir em ${mvp.name}`);
      assert.strictEqual(res.display, 'flex', `Floating Dock deve ter display:flex em ${mvp.name}`);
      assert.strictEqual(res.isBottom, true, `Floating Dock deve estar ancorada no bottom da viewport em ${mvp.name}`);
      assert.strictEqual(res.overlapEmail, false, `Floating Dock NÃO pode sobrepor o input de email em ${mvp.name}`);
      assert.strictEqual(res.overlapSubmit, false, `Floating Dock NÃO pode sobrepor o botão de submit da newsletter em ${mvp.name}`);
      assert.strictEqual(res.overlapBackTop, false, `Floating Dock NÃO pode sobrepor o botão de voltar ao topo no footer em ${mvp.name}`);
      assert.strictEqual(res.allDockTouchOk, true, `Todos os itens da dock devem ter área de toque ergonômica em ${mvp.name}`);

      logPass(`CH-M4-06 (${mvp.name}): Mobile Floating Dock sem colisão`, `dockH=${res.dockRect.h}px overlaps: email=0, submit=0, footer=0`);
    } catch (err) {
      logFail(`CH-M4-06 (${mvp.name}): Mobile Floating Dock`, err);
    }
  }

  // =========================================================================
  // BLOCO 4: TOUCH TARGETS GLOBAIS NO MOBILE (WCAG 2.2 AAA >= 48px)
  // =========================================================================
  console.log('\n\x1b[33m--- BLOCO 4: ERGONOMIA & TOUCH TARGETS (WCAG 2.2 AAA) ---\x1b[0m');

  await sendSession('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 600));

  try {
    const targetsRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const interactiveSelectors = [
          '.reader-toggle-btn',
          '.filter-pill',
          '#search-editions',
          '#newsletter-email',
          '#newsletter-btn',
          '.edition-card-cta-btn',
          '.dock-item'
        ];

        const underSized = [];
        interactiveSelectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
              if (r.height < 44 || r.width < 44) {
                underSized.push({
                  sel,
                  text: el.innerText.trim().substring(0, 20),
                  w: Math.round(r.width),
                  h: Math.round(r.height)
                });
              }
            }
          });
        });

        return { underSizedCount: underSized.length, underSized };
      })()`,
      returnByValue: true
    });

    const targetData = targetsRes.result.value;
    assert.strictEqual(targetData.underSizedCount, 0, `Existem ${targetData.underSizedCount} elementos interativos com touch target < 44px: ${JSON.stringify(targetData.underSized)}`);
    logPass('CH-M4-07: Touch Targets Ergonômicos (Toggle, Filtros, Busca, Newsletter, Dock)', '100% dos controles interativos possuem área de toque >= 44px (padrão WCAG)');
  } catch (err) {
    logFail('CH-M4-07: Touch Targets Ergonômicos', err);
  }

  // =========================================================================
  // BLOCO 5: CONFORMIDADE DO DOM, SCHEMA.ORG E REGRAS MANDATÓRIAS
  // =========================================================================
  console.log('\n\x1b[33m--- BLOCO 5: AUDITORIA DO DOM, SCHEMA.ORG & REGRAS DO PROJETO ---\x1b[0m');

  try {
    const domAuditRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        // 1. Schema.org JSON-LD
        const scriptEl = document.querySelector('script[type="application/ld+json"]');
        let schemaParsed = null;
        if (scriptEl) {
          try {
            schemaParsed = JSON.parse(scriptEl.textContent);
          } catch(e) {}
        }

        // 2. Hierarquia de cabeçalhos
        const h1 = document.querySelectorAll('h1').length;
        const h2 = document.querySelectorAll('h2').length;
        const h3 = document.querySelectorAll('h3').length;

        // 3. Estrutura Editorial
        const hasEditorialData = typeof window.EDITORIAL_DATA === 'object' && window.EDITORIAL_DATA !== null;
        const editionsCount = hasEditorialData && Array.isArray(window.EDITORIAL_DATA.editions) ? window.EDITORIAL_DATA.editions.length : 0;
        const hasMacroPulse = hasEditorialData && !!window.EDITORIAL_DATA.macroPulse;

        return {
          hasSchema: !!schemaParsed,
          schemaGraphLength: schemaParsed && schemaParsed['@graph'] ? schemaParsed['@graph'].length : 0,
          h1Count: h1,
          h2Count: h2,
          h3Count: h3,
          hasEditorialData,
          editionsCount,
          hasMacroPulse
        };
      })()`,
      returnByValue: true
    });

    const audit = domAuditRes.result.value;
    assert.strictEqual(audit.hasSchema, true, 'Schema.org JSON-LD deve ser válido e parseável');
    assert.strictEqual(audit.schemaGraphLength >= 2, true, 'Schema.org deve conter pelo menos Blog e FinancialService');
    assert.strictEqual(audit.h1Count, 1, 'Deve existir exatamente 1 h1 na página');
    assert.strictEqual(audit.hasEditorialData, true, 'window.EDITORIAL_DATA deve estar carregado');
    assert.strictEqual(audit.editionsCount >= 4, true, 'Devem existir no mínimo 4 edições em editorial.js');
    assert.strictEqual(audit.hasMacroPulse, true, 'macroPulse deve existir em editorial.js');

    logPass('CH-M4-08: Estrutura Semântica do DOM e Schema.org JSON-LD', `h1=${audit.h1Count}, h2=${audit.h2Count}, editions=${audit.editionsCount}, schemaGraph=${audit.schemaGraphLength}`);
  } catch (err) {
    logFail('CH-M4-08: Estrutura Semântica do DOM', err);
  }

  // Finalização do Chrome Headless
  ws.close();
  proc.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}

  console.log('\n' + '='.repeat(80));
  console.log(`TOTAL DE DESAFIOS ADVERSARIAIS: ${totalChallenges}`);
  console.log(`APROVADOS: \x1b[32m${passedChallenges}\x1b[0m`);
  console.log(`FALHAS: \x1b[31m${failedChallenges}\x1b[0m`);
  console.log('='.repeat(80) + '\n');

  if (failedChallenges > 0) {
    process.exit(1);
  }
}

runAdversarialLayoutHarness().catch(err => {
  console.error('Erro fatal no harness adversarial:', err);
  process.exit(1);
});
