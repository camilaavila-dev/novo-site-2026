const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const VIEWPORTS = [
  { name: '320px (iPhone SE 1st gen / Smallest standard)', width: 320, height: 568, mobile: true },
  { name: '360px (Galaxy S8 / Common Android)', width: 360, height: 640, mobile: true },
  { name: '375px (iPhone SE 2nd/3rd gen)', width: 375, height: 667, mobile: true },
  { name: '390px (iPhone 14/15)', width: 390, height: 844, mobile: true },
  { name: '414px (iPhone XR / 11 Plus)', width: 414, height: 896, mobile: true },
  { name: '430px (iPhone 15/16 Pro Max)', width: 430, height: 932, mobile: true },
  { name: '768px (iPad Portrait)', width: 768, height: 1024, mobile: true },
  { name: '1440px (Desktop Outlier)', width: 1440, height: 900, mobile: false }
];

async function runAdversarialAudit() {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('  REVIEWER 2 & CRITIC: AUDITORIA ADVERSARIAL DE UX, ERGONOMIA & ESTÉTICA');
  console.log('  Milestone M3: raiox.html / css/raiox.css / js/raiox-core.js');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  const htmlPath = path.resolve(__dirname, '..', '..', 'raiox.html');
  const cssPath = path.resolve(__dirname, '..', '..', 'css', 'raiox.css');
  const sharedCssPath = path.resolve(__dirname, '..', '..', 'css', 'shared-outlier.css');
  const jsCorePath = path.resolve(__dirname, '..', '..', 'js', 'raiox-core.js');

  const html = fs.readFileSync(htmlPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');
  const sharedCss = fs.readFileSync(sharedCssPath, 'utf8');
  const jsCore = fs.readFileSync(jsCorePath, 'utf8');

  // 1. AUDITORIA ESTÁTICA RIGOROSA DE <BR>
  console.log('--- 1. AUDITORIA ESTÁTICA DE QUEBRAS DE LINHA (<br>) ---');
  const allBrMatches = [];
  const brRegex = /([\s\S]{0,35})<br\s*\/?>([\s\S]{0,35})/gi;
  let brMatch;
  while ((brMatch = brRegex.exec(html)) !== null) {
    const fullSnippet = (brMatch[1] + '<br>' + brMatch[2]).replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
    const charBefore = brMatch[1].slice(-1);
    const hasSpaceBefore = /\s/.test(charBefore);
    allBrMatches.push({
      hasSpaceBefore,
      charBefore: JSON.stringify(charBefore),
      snippet: fullSnippet.trim()
    });
  }

  console.log(`Total de ocorrências de <br> encontradas no HTML: ${allBrMatches.length}`);
  let brViolations = 0;
  allBrMatches.forEach((item, idx) => {
    if (!item.hasSpaceBefore) {
      brViolations++;
      console.log(`  [VIOLAÇÃO] <br> #${idx+1}: charBefore=${item.charBefore} | Snippet: "${item.snippet}"`);
    } else {
      console.log(`  [OK] <br> #${idx+1}: charBefore=${item.charBefore} | Snippet: "${item.snippet}"`);
    }
  });

  // 2. AUDITORIA ESTÁTICA DE FILTROS SVG PROIBIDOS
  console.log('\n--- 2. AUDITORIA DE FILTROS SVG PROIBIDOS (feColorMatrix / feComponentTransfer) ---');
  const forbiddenSvgFilters = /feColorMatrix|feComponentTransfer/gi;
  const inHtml = forbiddenSvgFilters.test(html);
  const inCss = forbiddenSvgFilters.test(css);
  const inSharedCss = forbiddenSvgFilters.test(sharedCss);
  console.log(`  feColorMatrix/feComponentTransfer em raiox.html: ${inHtml ? 'DETECTADO (VIOLAÇÃO)' : 'NENHUM (PASS)'}`);
  console.log(`  feColorMatrix/feComponentTransfer em css/raiox.css: ${inCss ? 'DETECTADO (VIOLAÇÃO)' : 'NENHUM (PASS)'}`);
  console.log(`  feColorMatrix/feComponentTransfer em shared-outlier.css: ${inSharedCss ? 'DETECTADO (VIOLAÇÃO)' : 'NENHUM (PASS)'}`);

  // 3. AUDITORIA ESTÁTICA DE INTEGRIDADE (FACADES / TEST CHEATS)
  console.log('\n--- 3. AUDITORIA DE INTEGRIDADE NO CÓDIGO FONTE (js/raiox-core.js) ---');
  const cheatPatterns = [
    /if\s*\([^)]*__test[^)]*\)/i,
    /mock/i,
    /fake/i,
    /hardcoded/i,
    /dummy/i,
    /return\s*51\s*;/
  ];
  let cheatFlags = 0;
  cheatPatterns.forEach(pattern => {
    if (pattern.test(jsCore)) {
      console.log(`  [ALERTA] Padrão suspeito detectado: ${pattern}`);
      cheatFlags++;
    }
  });
  if (cheatFlags === 0) {
    console.log('  [PASS] Nenhum padrão de fachada, mock em runtime ou hardcode enganoso detectado.');
  }

  // 4. TESTE DINÂMICO NO CHROME REAL VIA CDP EM MÚLTIPLOS VIEWPORTS E ESTADOS
  console.log('\n--- 4. AUDITORIA EMPÍRICA NO GOOGLE CHROME HEADLESS (CDP) ---');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-audit-m3-'));
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9789',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
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

  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

  // TESTE 4.1: ZERO OVERFLOW EM TODOS OS VIEWPORTS (ESTADO INICIAL / QUIZ)
  console.log('\n[4.1] Teste de Overflow Horizontal no Estado de Quiz (Etapas 1 a 5):');
  let overflowFails = 0;

  for (const vp of VIEWPORTS) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });
    await sendSession('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 700));

    const evalRes = await sendSession('Runtime.evaluate', {
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
              cls: (el.className || '').toString().substring(0, 35),
              right: Math.round(r.right),
              w: Math.round(r.width)
            });
          }
        });

        // Checar touch targets de botões e links visíveis
        const sub48px = [];
        document.querySelectorAll('button, a[href]').forEach(el => {
          const r = el.getBoundingClientRect();
          const isVisible = r.width > 0 && r.height > 0 && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden';
          if (isVisible) {
            if (r.width < 44 || r.height < 44) {
              sub48px.push({
                tag: el.tagName,
                id: el.id,
                cls: (el.className || '').toString().substring(0, 30),
                text: el.textContent.trim().substring(0, 25),
                w: Math.round(r.width),
                h: Math.round(r.height)
              });
            }
          }
        });

        // Checar visibilidade e posição da Bottom Dock
        const dock = document.querySelector('.mobile-bottom-dock, .bottom-dock');
        let dockInfo = null;
        if (dock) {
          const dr = dock.getBoundingClientRect();
          const dStyle = window.getComputedStyle(dock);
          dockInfo = {
            display: dStyle.display,
            visible: dStyle.display !== 'none' && dr.height > 0,
            bottom: Math.round(dr.bottom),
            height: Math.round(dr.height),
            width: Math.round(dr.width)
          };
        }

        return {
          winW, clientW, scrollW, hasScrollX,
          overflowCount: overflowing.length,
          topOverflow: overflowing.slice(0, 3),
          sub48Count: sub48px.length,
          sub48List: sub48px,
          dockInfo
        };
      })()`,
      returnByValue: true
    });

    const v = evalRes.result.value;
    const ok = !v.hasScrollX && v.overflowCount === 0;
    if (!ok) overflowFails++;
    console.log(`  ${ok ? '✔' : '✖'} [${vp.name.padEnd(28)}] scrollW=${v.scrollW} clientW=${v.clientW} hasScrollX=${v.hasScrollX} overflowElements=${v.overflowCount} sub48pxInteractive=${v.sub48Count}`);
    if (v.overflowCount > 0) {
      console.log('     Transbordantes:', JSON.stringify(v.topOverflow));
    }
    if (v.sub48Count > 0) {
      console.log('     Touch targets < 44px:', JSON.stringify(v.sub48List));
    }
  }

  // TESTE 4.2: ESTADO PÓS-QUIZ (PAINEL DE RESULTADOS COM RADAR SVG & GARGALOS)
  console.log('\n[4.2] Teste de Overflow Horizontal & Ergonomia no Painel de Resultados (Pós-Quiz):');
  let postQuizOverflowFails = 0;

  for (const vp of VIEWPORTS) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });
    await sendSession('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 600));

    // Responder as 5 perguntas com delay entre passos para respeitar o setTimeout(320)
    for (let s = 0; s < 5; s++) {
      await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const cards = document.querySelectorAll('.rx-option-card');
          if (cards.length > 0) cards[0].click();
        })()`
      });
      await new Promise(r => setTimeout(r, 420));
    }
    // Aguardar revelação do painel
    await new Promise(r => setTimeout(r, 800));

    const postRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const docEl = document.documentElement;
        const winW = window.innerWidth;
        const clientW = docEl.clientWidth;
        const scrollW = docEl.scrollWidth;
        const hasScrollX = scrollW > clientW;

        const resultsPanel = document.getElementById('rx-results-panel');
        const radarSvg = document.getElementById('radar-svg');
        const ctaBtn = document.getElementById('rx-cta-btn');
        const wppBtn = document.getElementById('rx-wpp-btn');
        const restartBtn = document.getElementById('rx-restart-btn');

        const overflowing = [];
        document.querySelectorAll('*').forEach(el => {
          if (el === docEl || el === document.body) return;
          const r = el.getBoundingClientRect();
          if (r.right > winW + 1.0) {
            overflowing.push({
              tag: el.tagName,
              id: el.id,
              cls: (el.className || '').toString().substring(0, 35),
              right: Math.round(r.right),
              w: Math.round(r.width)
            });
          }
        });

        // Dimensões do radar SVG
        let radarMetrics = null;
        if (radarSvg) {
          const rr = radarSvg.getBoundingClientRect();
          radarMetrics = { w: Math.round(rr.width), h: Math.round(rr.height) };
        }

        // Bounding boxes dos CTAs
        const ctas = [];
        [ctaBtn, wppBtn, restartBtn].forEach(b => {
          if (b) {
            const br = b.getBoundingClientRect();
            ctas.push({ id: b.id, w: Math.round(br.width), h: Math.round(br.height) });
          }
        });

        // Checar se a dock sobrepõe os botões quando rolado até o final
        window.scrollTo(0, document.body.scrollHeight);
        const dock = document.querySelector('.mobile-bottom-dock, .bottom-dock');
        let dockOverlapWithCTAs = false;
        if (dock && window.getComputedStyle(dock).display !== 'none') {
          const dr = dock.getBoundingClientRect();
          [ctaBtn, wppBtn, restartBtn].forEach(b => {
            if (b) {
              const br = b.getBoundingClientRect();
              // Sobreposição vertical e horizontal
              const overlaps = !(br.right < dr.left || br.left > dr.right || br.bottom < dr.top || br.top > dr.bottom);
              if (overlaps) dockOverlapWithCTAs = true;
            }
          });
        }

        return {
          winW, clientW, scrollW, hasScrollX,
          resultsVisible: resultsPanel && window.getComputedStyle(resultsPanel).display !== 'none',
          overflowCount: overflowing.length,
          topOverflow: overflowing.slice(0, 3),
          radarMetrics,
          ctas,
          dockOverlapWithCTAs
        };
      })()`,
      returnByValue: true
    });

    const v = postRes.result.value;
    const ok = !v.hasScrollX && v.overflowCount === 0 && v.resultsVisible;
    if (!ok) postQuizOverflowFails++;
    console.log(`  ${ok ? '✔' : '✖'} [${vp.name.padEnd(28)}] scrollW=${v.scrollW} clientW=${v.clientW} hasScrollX=${v.hasScrollX} overflowElements=${v.overflowCount} radarSvg=${v.radarMetrics ? `${v.radarMetrics.w}x${v.radarMetrics.h}` : 'N/A'}`);
    if (v.overflowCount > 0) {
      console.log('     Transbordantes no Painel de Resultados:', JSON.stringify(v.topOverflow));
    }
    console.log(`     CTAs Bounding Boxes: ${JSON.stringify(v.ctas)} | Dock Overlap com CTAs ao fim: ${v.dockOverlapWithCTAs ? 'SIM (ALERTA)' : 'NÃO (PASS)'}`);
  }

  // 5. TESTE DE CORES E TIPOGRAFIA DE ACORDO COM O DESIGN SYSTEM
  console.log('\n--- 5. AUDITORIA DE DESIGN SYSTEM & TOKENS ---');
  await sendSession('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 600));

  const stylesAudit = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const computed = window.getComputedStyle(document.documentElement);
      const bg = computed.getPropertyValue('--bg').trim();
      const vio = computed.getPropertyValue('--vio').trim();
      const grn = computed.getPropertyValue('--grn').trim();
      const txt = computed.getPropertyValue('--txt').trim();
      const dFont = computed.getPropertyValue('--d').trim();
      const sFont = computed.getPropertyValue('--s').trim();
      const mFont = computed.getPropertyValue('--m').trim();

      const bodyComp = window.getComputedStyle(document.body);
      const h1Comp = window.getComputedStyle(document.querySelector('.rx-title'));

      return {
        tokens: { bg, vio, grn, txt, dFont, sFont, mFont },
        bodyBg: bodyComp.backgroundColor,
        bodyColor: bodyComp.color,
        h1Font: h1Comp.fontFamily,
        h1Size: h1Comp.fontSize
      };
    })()`,
    returnByValue: true
  });

  console.log('Resultados de Tokens e Tipografia:', JSON.stringify(stylesAudit.result.value, null, 2));

  // Concluir sessão CDP
  ws.close();
  proc.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log(`RESUMO DO AUDITOR ADVERSARIAL:`);
  console.log(`- Violações de quebra <br>: ${brViolations}`);
  console.log(`- Violações de filtros SVG proibidos: ${inHtml || inCss || inSharedCss ? 1 : 0}`);
  console.log(`- Violações de integridade no código: ${cheatFlags}`);
  console.log(`- Falhas de overflow no Quiz: ${overflowFails}`);
  console.log(`- Falhas de overflow no Painel de Resultados: ${postQuizOverflowFails}`);
  console.log('══════════════════════════════════════════════════════════════════════');

  return {
    brViolations,
    svgFilterViolations: (inHtml || inCss || inSharedCss ? 1 : 0),
    cheatFlags,
    overflowFails,
    postQuizOverflowFails
  };
}

runAdversarialAudit().then(res => {
  const success = res.brViolations === 0 && res.svgFilterViolations === 0 && res.cheatFlags === 0 && res.overflowFails === 0 && res.postQuizOverflowFails === 0;
  if (!success) {
    console.error('\n✖ AUDITORIA ADVERSARIAL APONTOU FALHAS CRÍTICAS!');
    process.exit(1);
  } else {
    console.log('\n✔ AUDITORIA ADVERSARIAL PASSOU COM LOUVOR!');
    process.exit(0);
  }
}).catch(err => {
  console.error(err);
  process.exit(1);
});
