/**
 * EMPIRICAL CHALLENGER 2 STRESS HARNESS (MILESTONE M3)
 * Rigorous Chrome Headless Interaction, SVG Geometry & Layout Stress for raiox.html
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9820 + Math.floor(Math.random() * 50);
const BASE_DIR = path.resolve(__dirname, '..', '..');

const VIEWPORTS = [
  { name: '320px (iPhone SE 1st)', width: 320, height: 568, mobile: true },
  { name: '375px (iPhone SE 2nd/3rd)', width: 375, height: 667, mobile: true },
  { name: '390px (iPhone 14/15)', width: 390, height: 844, mobile: true },
  { name: '430px (iPhone 15/16 Pro Max)', width: 430, height: 932, mobile: true },
  { name: '1440px (Desktop Outlier)', width: 1440, height: 900, mobile: false }
];

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getJson(url) {
  const res = await fetch(url);
  return res.json();
}

// -----------------------------------------------------------------------------
// SEÇÃO 1: AUDITORIAS ESTÁTICAS RÍGIDAS (DOM, <br>, Filtros SVG, URLs)
// -----------------------------------------------------------------------------
function runStaticAudits() {
  console.log('\n======================================================');
  console.log('--- SEÇÃO 1: AUDITORIAS ESTÁTICAS (<br>, SVG, URLS) ---');
  console.log('======================================================');
  const rxHtmlPath = path.join(BASE_DIR, 'raiox.html');
  const rxCssPath = path.join(BASE_DIR, 'css', 'raiox.css');
  const rxJsPath = path.join(BASE_DIR, 'js', 'raiox-core.js');

  const html = fs.readFileSync(rxHtmlPath, 'utf8');
  const css = fs.readFileSync(rxCssPath, 'utf8');
  const OutlierRaioX = require(rxJsPath);

  let auditFailed = false;

  // 1.1: Quebras de linha <br>
  // Procura por qualquer <br> sem espaço antecedente (ex: texto<br> ou \n<br> sem espaço antes)
  // Regra do projeto: sempre espaço antes de <br> (ex: "texto <br>texto")
  const brRegex = /([^\s>])<br\s*\/?>/gi;
  const brViolations = [];
  let match;
  while ((match = brRegex.exec(html)) !== null) {
    brViolations.push({
      charBefore: match[1],
      snippet: html.substring(Math.max(0, match.index - 20), Math.min(html.length, match.index + 25))
    });
  }

  if (brViolations.length > 0) {
    console.error(`[✖ FALHA] Encontradas ${brViolations.length} violações de <br> sem espaço antecedente:`);
    brViolations.forEach(v => console.error(`   "${v.snippet}" (char antes: '${v.charBefore}')`));
    auditFailed = true;
  } else {
    // Contagem total de <br> presentes
    const totalBrs = (html.match(/<br\s*\/?>/gi) || []).length;
    console.log(`[✔ OK] Auditoria de <br>: ${totalBrs} tags <br> encontradas, TODAS com espaço antecedente.`);
  }

  // 1.2: Filtros SVG proibidos (feColorMatrix, feComponentTransfer)
  const forbiddenFilters = ['feColorMatrix', 'feComponentTransfer'];
  for (const filter of forbiddenFilters) {
    if (html.includes(filter) || css.includes(filter)) {
      console.error(`[✖ FALHA] Filtro proibido detectado: ${filter}`);
      auditFailed = true;
    }
  }
  console.log('[✔ OK] Auditoria de transparência: zero filtros SVG no HTML/CSS.');

  // 1.3: URL do WhatsApp & CTA
  const sampleCalc = OutlierRaioX.calculateScore([35, 40, 70, 80, 30]);
  const wppUrl = sampleCalc.whatsappUrl;
  const ctaUrl = sampleCalc.consultationUrl;

  console.log(`[INFO] URL WhatsApp gerada: ${wppUrl}`);
  console.log(`[INFO] URL CTA gerada: ${ctaUrl}`);

  // Validação WhatsApp
  try {
    const parsedWpp = new URL(wppUrl);
    if (!parsedWpp.searchParams.has('text')) {
      console.error('[✖ FALHA] WhatsApp URL não tem parâmetro text!');
      auditFailed = true;
    } else {
      const decoded = parsedWpp.searchParams.get('text');
      if (!decoded.includes('Olá Leonardo') || !decoded.includes('O Acumulador Ineficiente')) {
        console.error('[✖ FALHA] Conteúdo do WhatsApp decodificado incorretamente:', decoded);
        auditFailed = true;
      } else {
        console.log('[✔ OK] URL do WhatsApp perfeitamente codificada e decodificada com caracteres UTF-8.');
      }
    }
  } catch (err) {
    console.error('[✖ FALHA] URL do WhatsApp inválida:', err.message);
    auditFailed = true;
  }

  // Validação CTA
  if (!ctaUrl.startsWith('index.html#contato?')) {
    console.error('[✖ FALHA] URL CTA não aponta para index.html#contato?');
    auditFailed = true;
  } else {
    const query = ctaUrl.substring(ctaUrl.indexOf('?') + 1);
    const params = new URLSearchParams(query);
    const requiredKeys = ['score', 'arq', 'gap1', 'gap2', 'd1', 'd2', 'd3', 'd4', 'd5'];
    const missing = requiredKeys.filter(k => !params.has(k));
    if (missing.length > 0) {
      console.error('[✖ FALHA] Parâmetros faltando no CTA:', missing);
      auditFailed = true;
    } else {
      console.log('[✔ OK] URL do CTA contém todos os parâmetros obrigatórios.');
    }
  }

  if (auditFailed) {
    throw new Error('Falha em uma das auditorias estáticas!');
  }
}

// -----------------------------------------------------------------------------
// SEÇÃO 2: ESTRESSE GEOMÉTRICO SVG & ORÁCULO MATEMÁTICO (100 CASOS ALEATÓRIOS)
// -----------------------------------------------------------------------------
function runGeometricStress() {
  console.log('\n======================================================');
  console.log('--- SEÇÃO 2: ESTRESSE GEOMÉTRICO SVG & ORÁCULO MAT ---');
  console.log('======================================================');
  const rxJsPath = path.join(BASE_DIR, 'js', 'raiox-core.js');
  const OutlierRaioX = require(rxJsPath);

  // Teste 2.1: Caso extremo todos 0
  const zeroPts = OutlierRaioX.generateRadarPoints(0, 0, 0, 0, 0, 200, 200, 135);
  zeroPts.forEach((p, idx) => {
    if (p.x !== 200 || p.y !== 200) {
      throw new Error(`Ponto zero ${idx} não colapsou no centro (200, 200): (${p.x}, ${p.y})`);
    }
  });
  console.log('[✔ OK] Caso extremo 0 colapsa exatamente em (200, 200) para todos os 5 vértices.');

  // Teste 2.2: Caso extremo todos 100
  const maxPts = OutlierRaioX.generateRadarPoints(100, 100, 100, 100, 100, 200, 200, 135);
  if (maxPts[0].x !== 200 || maxPts[0].y !== 65) {
    throw new Error(`Vértice 0 superior não está em (200, 65): (${maxPts[0].x}, ${maxPts[0].y})`);
  }
  maxPts.forEach((p, idx) => {
    const dist = Math.hypot(p.x - 200, p.y - 200);
    if (Math.abs(dist - 135) > 0.2) {
      throw new Error(`Vértice ${idx} não está no raio 135: dist=${dist}`);
    }
  });
  console.log('[✔ OK] Caso extremo 100 coincide perfeitamente com raio trigonométrico de 135px.');

  // Teste 2.3: Fuzzing com 100 vetores aleatórios de scores
  let fuzzPassed = 0;
  for (let i = 0; i < 100; i++) {
    const d1 = Math.floor(Math.random() * 101);
    const d2 = Math.floor(Math.random() * 101);
    const d3 = Math.floor(Math.random() * 101);
    const d4 = Math.floor(Math.random() * 101);
    const d5 = Math.floor(Math.random() * 101);

    const calc = OutlierRaioX.calculateScore([d1, d2, d3, d4, d5]);
    if (isNaN(calc.overallScore) || calc.overallScore < 0 || calc.overallScore > 100) {
      throw new Error(`Score global inválido para [${d1},${d2},${d3},${d4},${d5}]: ${calc.overallScore}`);
    }
    if (!calc.archetype || !calc.archetype.id) {
      throw new Error(`Arquétipo nulo para [${d1},${d2},${d3},${d4},${d5}]`);
    }
    if (!Array.isArray(calc.bottlenecks) || calc.bottlenecks.length !== 2) {
      throw new Error(`Gargalos inválidos para [${d1},${d2},${d3},${d4},${d5}]`);
    }

    const pts = OutlierRaioX.generateRadarPoints(d1, d2, d3, d4, d5, 200, 200, 135);
    for (const p of pts) {
      if (isNaN(p.x) || isNaN(p.y) || !isFinite(p.x) || !isFinite(p.y)) {
        throw new Error(`Coordenadas SVG NaN/Infinitas geradas em [${d1},${d2},${d3},${d4},${d5}]`);
      }
    }
    fuzzPassed++;
  }
  console.log(`[✔ OK] Fuzzing trigonométrico: ${fuzzPassed}/100 vetores aleatórios com integridade total.`);
}

// -----------------------------------------------------------------------------
// SEÇÃO 3: TESTES EMPÍRICOS NO CHROME HEADLESS VIA DEVTOOLS PROTOCOL (CDP)
// -----------------------------------------------------------------------------
async function runChromeHeadlessStress() {
  console.log('\n======================================================');
  console.log('--- SEÇÃO 3: TESTES NO CHROME HEADLESS VIA CDP ---');
  console.log('======================================================');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-m3-challenger-'));

  console.log(`Iniciando Chrome Headless na porta ${PORT}...`);
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await wait(1000);
  let wsUrl = null;
  for (let i = 0; i < 35; i++) {
    try {
      const ver = await getJson(`http://127.0.0.1:${PORT}/json/version`);
      wsUrl = ver.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (e) {}
    await wait(300);
  }

  if (!wsUrl) {
    chromeProc.kill();
    throw new Error('Falha ao conectar com Chrome Headless na porta ' + PORT);
  }

  const ws = new WebSocket(wsUrl);
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

  const fileUrl = 'file:///' + path.resolve(BASE_DIR, 'raiox.html').replace(/\\/g, '/');

  let allChecksPass = true;

  try {
    // 3.1: OVERFLOW HORIZONTAL EM ESTADO INICIAL NAS 5 VIEWPORTS
    console.log('\n--- 3.1: Auditoria de Overflow no Estado Inicial (Hero + Etapa 1) ---');
    for (const vp of VIEWPORTS) {
      await sendSession('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile
      });
      await sendSession('Page.navigate', { url: fileUrl });
      await wait(600);

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

          return {
            winW, clientW, scrollW, hasScrollX,
            overflowCount: overflowing.length,
            topOverflowing: overflowing.slice(0, 3)
          };
        })()`,
        returnByValue: true
      });

      const v = res.result.value;
      const ok = !v.hasScrollX && v.overflowCount === 0;
      if (!ok) allChecksPass = false;
      const status = ok ? '✔ OK' : '✖ FALHA';
      console.log(`[${status}] [${vp.name.padEnd(28)}] scrollW=${v.scrollW} clientW=${v.clientW} hasScrollX=${v.hasScrollX} overflowElements=${v.overflowCount}`);
      if (v.overflowCount > 0) {
        console.log('   Elementos transbordando:', JSON.stringify(v.topOverflowing));
      }
    }

    // 3.2: TESTE DE OVERFLOW HORIZONTAL EM TODAS AS 5 ETAPAS DO QUIZ EM 320px
    console.log('\n--- 3.2: Auditoria de Overflow em Cada Etapa Intermediária (Viewport 320px) ---');
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 568,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sendSession('Page.navigate', { url: fileUrl });
    await wait(500);

    for (let step = 1; step <= 5; step++) {
      const stepCheck = await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const docEl = document.documentElement;
          const winW = window.innerWidth;
          const clientW = docEl.clientWidth;
          const scrollW = docEl.scrollWidth;
          const hasScrollX = scrollW > clientW;
          const stepNum = document.getElementById('rx-step-num').textContent;

          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            if (el === docEl || el === document.body) return;
            const r = el.getBoundingClientRect();
            if (r.right > winW + 1.0) {
              overflowing.push(el.tagName + (el.id ? '#' + el.id : ''));
            }
          });

          return { stepNum, hasScrollX, scrollW, clientW, overflowCount: overflowing.length };
        })()`,
        returnByValue: true
      });
      const sv = stepCheck.result.value;
      const stepOk = !sv.hasScrollX && sv.overflowCount === 0;
      if (!stepOk) allChecksPass = false;
      console.log(`[${stepOk ? '✔ OK' : '✖ FALHA'}] Etapa ${sv.stepNum}/5 em 320px: scrollW=${sv.scrollW} clientW=${sv.clientW} overflowElements=${sv.overflowCount}`);

      // Se não for a última etapa, clica na 1ª opção para avançar
      if (step < 5) {
        await sendSession('Runtime.evaluate', {
          expression: `document.querySelectorAll('.rx-option-card')[0].click();`
        });
        await wait(450);
      }
    }

    // 3.3: OVERFLOW HORIZONTAL DO PAINEL DE RESULTADOS NAS 5 VIEWPORTS
    console.log('\n--- 3.3: Auditoria do Painel de Resultados nas 5 Viewports (com Radar SVG ativo) ---');
    for (const vp of VIEWPORTS) {
      await sendSession('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile
      });
      await sendSession('Page.navigate', { url: fileUrl });
      await wait(400);

      // Clica nas 5 etapas com intervalo determinístico para respeitar setTimeout(320) do app
      for (let s = 0; s < 5; s++) {
        await sendSession('Runtime.evaluate', {
          expression: `(() => {
            const cards = document.querySelectorAll('.rx-option-card');
            if (cards.length > 0) cards[${s % 4}].click();
          })()`
        });
        await wait(500);
      }
      await wait(800);

      const resResults = await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const docEl = document.documentElement;
          const winW = window.innerWidth;
          const clientW = docEl.clientWidth;
          const scrollW = docEl.scrollWidth;
          const hasScrollX = scrollW > clientW;

          const resultsPanel = document.getElementById('rx-results-panel');
          const isVisible = resultsPanel && window.getComputedStyle(resultsPanel).display !== 'none';

          const poly = document.querySelector('#radar-svg #radar-data-poly');
          const polyPoints = poly ? poly.getAttribute('points') : null;

          const overflowing = [];
          document.querySelectorAll('#rx-results-panel *').forEach(el => {
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

          return {
            winW, clientW, scrollW, hasScrollX,
            isVisible,
            hasPolygon: !!poly,
            polyPoints,
            overflowCount: overflowing.length,
            topOverflowing: overflowing.slice(0, 3)
          };
        })()`,
        returnByValue: true
      });

      const rv = resResults.result.value;
      const resOk = rv.isVisible && !rv.hasScrollX && rv.overflowCount === 0 && rv.hasPolygon;
      if (!resOk) allChecksPass = false;
      const status = resOk ? '✔ OK' : '✖ FALHA';
      console.log(`[${status}] [${vp.name.padEnd(28)}] Painel Revelado: isVisible=${rv.isVisible} poly=${rv.hasPolygon} scrollW=${rv.scrollW} clientW=${rv.clientW} overflowElements=${rv.overflowCount}`);
      if (rv.overflowCount > 0) {
        console.log('   Elementos de resultados transbordando:', JSON.stringify(rv.topOverflowing));
      }

      // Teste adicional: se aplicarmos max-width: 100% no halo em tempo de execução, zera?
      if (rv.overflowCount > 0) {
        const testFix = await sendSession('Runtime.evaluate', {
          expression: `(() => {
            const halo = document.getElementById('rx-archetype-halo');
            if (halo) { halo.style.maxWidth = '100%'; halo.style.width = '100%'; }
            const winW = window.innerWidth;
            const remaining = [];
            document.querySelectorAll('#rx-results-panel *').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > winW + 1.0) remaining.push(el.tagName + '#' + el.id);
            });
            return { remainingCount: remaining.length, remaining };
          })()`,
          returnByValue: true
        });
        console.log(`   [Análise Diagnóstica] Com correção de max-width:100% no halo: remainingOverflow=${testFix.result.value.remainingCount}`);
      }
    }

    // 3.4: TESTE DE TRANSIÇÃO E INTERATIVIDADE COMPLETA: AVANÇAR, VOLTAR, MUDAR RESPOSTA E REINICIAR
    console.log('\n--- 3.4: Teste de Interatividade Avançada (Voltar Etapa, Mudar Resposta, Reiniciar) ---');
    await sendSession('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
    await sendSession('Page.navigate', { url: fileUrl });
    await wait(500);

    // Passo A: Etapa 1 -> Clica opção B (score 35)
    await sendSession('Runtime.evaluate', { expression: `document.querySelectorAll('.rx-option-card')[1].click();` });
    await wait(380);

    // Passo B: Etapa 2 -> Clica opção B (score 40)
    await sendSession('Runtime.evaluate', { expression: `document.querySelectorAll('.rx-option-card')[1].click();` });
    await wait(380);

    // Passo C: Etapa 3 -> Clica no botão "Território Anterior" para voltar à etapa 2
    const backRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const prevBtn = document.getElementById('rx-prev-btn');
        prevBtn.click();
        return document.getElementById('rx-step-num').textContent;
      })()`,
      returnByValue: true
    });
    console.log(`Voltou para etapa: ${backRes.result.value}`);

    // Passo D: Na etapa 2, muda para a opção D (score 100)
    await sendSession('Runtime.evaluate', { expression: `document.querySelectorAll('.rx-option-card')[3].click();` });
    await wait(380);

    // Passo E: Continua até o fim: Etapa 3 (opção C: score 70), Etapa 4 (opção C: score 80), Etapa 5 (opção B: score 30)
    // D1=35, D2=100, D3=70, D4=80, D5=30 -> Média = (35 + 100 + 70 + 80 + 30)/5 = 315/5 = 63!
    await sendSession('Runtime.evaluate', { expression: `document.querySelectorAll('.rx-option-card')[2].click();` });
    await wait(380);
    await sendSession('Runtime.evaluate', { expression: `document.querySelectorAll('.rx-option-card')[2].click();` });
    await wait(380);
    await sendSession('Runtime.evaluate', { expression: `document.querySelectorAll('.rx-option-card')[1].click();` });
    await wait(600);

    const changedCheck = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const scoreVal = document.getElementById('rx-score-value').textContent;
        const ctaHref = document.getElementById('rx-cta-btn').getAttribute('href');
        return { scoreVal, ctaHref };
      })()`,
      returnByValue: true
    });
    const expectedScore = '63';
    const actualScore = changedCheck.result.value.scoreVal;
    if (actualScore !== expectedScore) {
      console.error(`[✖ FALHA] Score recalculado após alteração de resposta: esperado=${expectedScore}, obtido=${actualScore}`);
      allChecksPass = false;
    } else {
      console.log(`[✔ OK] Recálculo pós-retrocesso perfeito: score atualizado para ${actualScore}/100.`);
    }

    // Passo F: Testa Botão "Reiniciar Escaneamento"
    const restartCheck = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const restartBtn = document.getElementById('rx-restart-btn');
        restartBtn.click();
        const quizContainer = document.getElementById('rx-quiz-container');
        const resultsPanel = document.getElementById('rx-results-panel');
        const stepNum = document.getElementById('rx-step-num').textContent;
        return {
          quizVisible: quizContainer.style.display !== 'none',
          resultsVisible: resultsPanel.style.display !== 'none',
          stepNum
        };
      })()`,
      returnByValue: true
    });
    const rst = restartCheck.result.value;
    if (!rst.quizVisible || rst.resultsVisible || rst.stepNum !== '1') {
      console.error('[✖ FALHA] Falha no botão Reiniciar Escaneamento:', JSON.stringify(rst));
      allChecksPass = false;
    } else {
      console.log('[✔ OK] Botão Reiniciar: quiz reiniciado na Etapa 1 com resultados ocultados.');
    }

  } finally {
    ws.close();
    chromeProc.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }

  if (!allChecksPass) {
    throw new Error('Falhas detectadas no Chrome Headless!');
  }
  console.log('\n======================================================');
  console.log('✔ TODAS AS VERIFICAÇÕES EMPÍRICAS FORAM APROVADAS COM ÊXITO!');
  console.log('======================================================\n');
}

async function main() {
  try {
    runStaticAudits();
    runGeometricStress();
    await runChromeHeadlessStress();
    process.exit(0);
  } catch (err) {
    console.error('\n✖ ERRO CRÍTICO NO CHALLENGER 2:', err.message);
    process.exit(1);
  }
}

main();
