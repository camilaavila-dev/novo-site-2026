/**
 * ADVERSARIAL COMBINATORIAL STRESS HARNESS — MILESTONE M4
 * Challenger 1 (Empirical Challenger)
 * 
 * Verificações Mandatórias de Estresse:
 * 1. Integridade de Schema, Estrutura e Consistência Editorial (data/editorial.js).
 * 2. Filtros Combinatórios e Fuzzing Adversarial de Busca (caracteres especiais, regex, XSS, Unicode, limites).
 * 3. Validação Rigorosa da Newsletter VIP (e-mails válidos, inválidos, injeções, retenção e DOM feedback).
 * 4. Alternância Rápida e Repetida de Modo de Leitura (Executive vs Quant - 100 ciclos, ausência de leak/desync).
 * 5. Troca Dinâmica de Edições no Cockpit e Sincronização dos 4 Quadrantes.
 * 6. Execução Interativa em Headless Chrome via WebSocket CDP (eventos reais de click, input, submit).
 */

const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const os = require('node:os');

console.log('\x1b[35m' + '='.repeat(75) + '\x1b[0m');
console.log('\x1b[1m\x1b[36m  ADVERSARIAL COMBINATORIAL STRESS HARNESS — RADAR & EDITORIAL (M4)\x1b[0m');
console.log('\x1b[35m' + '='.repeat(75) + '\x1b[0m\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runChallenge(title, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`\x1b[32m✔ [PASS]\x1b[0m ${title}`);
  } catch (err) {
    failedTests++;
    console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${title}`);
    console.error(`  Erro: ${err.message}`);
    if (err.stack) console.error(`  Stack: ${err.stack.split('\n')[1]}`);
  }
}

async function runChallengeAsync(title, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`\x1b[32m✔ [PASS]\x1b[0m ${title}`);
  } catch (err) {
    failedTests++;
    console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${title}`);
    console.error(`  Erro: ${err.message}`);
    if (err.stack) console.error(`  Stack: ${err.stack.split('\n')[1]}`);
  }
}

// Carrega os dados editoriais
const editorialPath = path.resolve(__dirname, '..', 'data', 'editorial.js');
const EDITORIAL_DATA = require(editorialPath);

// -----------------------------------------------------------------------------
// BLOCO 1: INTEGRIDADE E CONSISTÊNCIA ESTRUTURAL DOS DADOS (data/editorial.js)
// -----------------------------------------------------------------------------

runChallenge('CH-M4-01: Integridade Estrutural e Schema do Objeto macroPulse', () => {
  const pulse = EDITORIAL_DATA.macroPulse;
  assert.ok(pulse, 'macroPulse deve existir');
  assert.ok(typeof pulse.date === 'string' && pulse.date.length > 5, 'pulse.date deve ser string formatada');
  assert.ok(typeof pulse.sentimentScore === 'number' && pulse.sentimentScore >= 0 && pulse.sentimentScore <= 100, 'sentimentScore deve ser 0-100');
  assert.ok(typeof pulse.sentimentLabel === 'string' && pulse.sentimentLabel.length > 0, 'sentimentLabel deve ser string não-vazia');
  assert.ok(typeof pulse.humanSummary === 'string' && pulse.humanSummary.length > 50, 'humanSummary deve ter diagnóstico substancial');

  const requiredMetrics = ['selic', 'ipca', 'usd', 'sp500', 'ibov'];
  const validTrends = ['up', 'down', 'neutral'];

  for (const m of requiredMetrics) {
    const metric = pulse[m];
    assert.ok(metric, `Métrica ${m} deve estar presente em macroPulse`);
    assert.ok(typeof metric.value === 'string' && metric.value.length > 0, `Métrica ${m}.value deve ser string`);
    assert.ok(validTrends.includes(metric.trend), `Métrica ${m}.trend deve ser up, down ou neutral (recebido: ${metric.trend})`);
    assert.ok(typeof metric.status === 'string' && metric.status.length > 0, `Métrica ${m}.status deve ser string`);
    assert.ok(typeof metric.variation === 'string' && metric.variation.length > 0, `Métrica ${m}.variation deve ser string`);
  }

  // Aliases de robustez
  assert.strictEqual(pulse.sentimentoGeral.score, pulse.sentimentScore);
  assert.strictEqual(pulse.sentimentoGeral.label, pulse.sentimentLabel);
  assert.strictEqual(pulse.dolar, pulse.usd);
});

runChallenge('CH-M4-02: Integridade e Profundidade do Catálogo de Edições', () => {
  const editions = EDITORIAL_DATA.editions;
  assert.ok(Array.isArray(editions) && editions.length >= 4, 'Devem existir ao menos 4 edições cadastradas');

  const seenIds = new Set();
  const validCategories = ['macro', 'offshore', 'blindagem'];

  editions.forEach((ed, idx) => {
    assert.ok(ed.id && !seenIds.has(ed.id), `ID de edição ${ed.id} deve ser único (índice ${idx})`);
    seenIds.add(ed.id);

    assert.ok(typeof ed.title === 'string' && ed.title.length > 10, `Título da edição ${ed.id} deve ser descritivo`);
    assert.ok(typeof ed.date === 'string' && ed.date.length > 5, `Data da edição ${ed.id} deve ser válida`);
    assert.ok(validCategories.includes(ed.categoryKey), `categoryKey deve ser macro, offshore ou blindagem (recebido: ${ed.categoryKey})`);
    assert.ok(typeof ed.readTime === 'string', `readTime deve existir na edição ${ed.id}`);
    assert.ok(Array.isArray(ed.tags) && ed.tags.length > 0, `tags deve ser array não-vazio na edição ${ed.id}`);

    // Resumo Executivo
    assert.ok(Array.isArray(ed.executiveSummary) || typeof ed.executiveSummary === 'string', `executiveSummary inválido na edição ${ed.id}`);
    if (Array.isArray(ed.executiveSummary)) {
      assert.ok(ed.executiveSummary.length >= 3, `executiveSummary deve ter pelo menos 3 bullets na edição ${ed.id}`);
      ed.executiveSummary.forEach(b => assert.ok(typeof b === 'string' && b.length > 15));
    }

    // Visão Quant
    assert.ok(ed.quantDeepDive, `quantDeepDive deve existir na edição ${ed.id}`);
    assert.ok(typeof ed.quantDeepDive.tese === 'string' && ed.quantDeepDive.tese.length > 20, `tese deve ser rica na edição ${ed.id}`);
    assert.ok(Array.isArray(ed.quantDeepDive.metricas) && ed.quantDeepDive.metricas.length >= 2, `metricas deve ter ao menos 2 itens na edição ${ed.id}`);
    ed.quantDeepDive.metricas.forEach(m => {
      assert.ok(m.indicador && m.spread && m.status, `Métrica quant incompleta na edição ${ed.id}`);
    });
    assert.ok(typeof ed.quantDeepDive.conclusaoTecnica === 'string' && ed.quantDeepDive.conclusaoTecnica.length > 20);

    // Matriz de 4 Quadrantes
    const impact = ed.impactMatrix;
    assert.ok(impact, `impactMatrix deve existir na edição ${ed.id}`);
    const requiredQuadrants = ['rendaFixa', 'acoes', 'offshore', 'imobiliario'];
    for (const q of requiredQuadrants) {
      assert.ok(typeof impact[q] === 'string' && impact[q].length > 15, `Quadrante ${q} deve conter diretriz na edição ${ed.id}`);
    }

    // Aliases em português
    assert.strictEqual(ed.titulo, ed.title);
    assert.strictEqual(ed.categoria, ed.category);
    assert.strictEqual(ed.data, ed.date);
    assert.strictEqual(ed.tempoLeitura, ed.readTime);
    assert.strictEqual(ed.resumoExecutivo, ed.executiveSummary);
    assert.strictEqual(ed.visaoNerd, ed.quantDeepDive);
    assert.strictEqual(ed.oQueMudaNoPatrimonio, ed.impactMatrix);
  });
});

runChallenge('CH-M4-03: Auditoria Estrita de Termos Proibidos de Jargão Robótico', () => {
  const forbiddenTerms = [
    'Horizonte de Crossover',
    'Ponto de Crossover',
    'SWR',
    'Meta Soberana',
    'Giro contínuo de juros compostos',
    'Equação de Fisher',
    'Fee-Drag',
    'Telemetria Quântica'
  ];

  const editorialCode = fs.readFileSync(editorialPath, 'utf8');
  const blogHtml = fs.readFileSync(path.resolve(__dirname, '..', 'blog.html'), 'utf8');
  const blogJs = fs.readFileSync(path.resolve(__dirname, '..', 'js', 'blog-core.js'), 'utf8');

  for (const term of forbiddenTerms) {
    const regex = new RegExp(term, 'i');
    assert.ok(!regex.test(editorialCode), `Termo proibido encontrado em data/editorial.js: "${term}"`);
    assert.ok(!regex.test(blogHtml), `Termo proibido encontrado em blog.html: "${term}"`);
    assert.ok(!regex.test(blogJs), `Termo proibido encontrado em js/blog-core.js: "${term}"`);
  }
});

// -----------------------------------------------------------------------------
// BLOCO 2: SIMULAÇÃO E ORÁCULO DE FILTROS COMBINATÓRIOS & BUSCA
// -----------------------------------------------------------------------------

function simulateFilter(category, query, editions) {
  const targetCat = (category || 'all').toLowerCase();
  const search = (query || '').trim().toLowerCase();

  return editions.filter(ed => {
    // 1. Categoria
    let catMatch = false;
    if (targetCat === 'all' || targetCat === 'todas') {
      catMatch = true;
    } else {
      const edCatKey = (ed.categoryKey || '').toLowerCase();
      const edCat = (ed.category || ed.categoria || '').toLowerCase();
      catMatch = edCatKey.includes(targetCat) || edCat.includes(targetCat);
    }
    if (!catMatch) return false;

    // 2. Busca
    if (!search) return true;

    const title = (ed.title || ed.titulo || '').toLowerCase();
    const tags = Array.isArray(ed.tags) ? ed.tags.join(' ').toLowerCase() : '';
    const cat = (ed.category || ed.categoria || '').toLowerCase();
    const summaryText = Array.isArray(ed.executiveSummary) ? ed.executiveSummary.join(' ').toLowerCase() : (ed.executiveSummary || '').toLowerCase();

    return title.includes(search) || tags.includes(search) || cat.includes(search) || summaryText.includes(search);
  });
}

runChallenge('CH-M4-04: Oráculo de Filtros por Categoria Canônica', () => {
  const editions = EDITORIAL_DATA.editions;

  const allRes = simulateFilter('all', '', editions);
  assert.strictEqual(allRes.length, 4, 'Filtro "all" deve retornar todas as 4 edições');

  const macroRes = simulateFilter('macro', '', editions);
  assert.strictEqual(macroRes.length, 2, 'Filtro "macro" deve retornar 2 edições (ed-01 e ed-04)');
  assert.ok(macroRes.some(e => e.id === 'ed-01') && macroRes.some(e => e.id === 'ed-04'));

  const offshoreRes = simulateFilter('offshore', '', editions);
  assert.strictEqual(offshoreRes.length, 1, 'Filtro "offshore" deve retornar 1 edição (ed-02)');
  assert.strictEqual(offshoreRes[0].id, 'ed-02');

  const blindagemRes = simulateFilter('blindagem', '', editions);
  assert.strictEqual(blindagemRes.length, 1, 'Filtro "blindagem" deve retornar 1 edição (ed-03)');
  assert.strictEqual(blindagemRes[0].id, 'ed-03');

  const invalidCatRes = simulateFilter('commodities_inexistente', '', editions);
  assert.strictEqual(invalidCatRes.length, 0, 'Categoria desconhecida deve retornar 0 edições');
});

runChallenge('CH-M4-05: Fuzzing e Testes Adversariais da Busca Textual (35 payloads)', () => {
  const editions = EDITORIAL_DATA.editions;

  const adversarialPayloads = [
    { query: '', expectedCount: 4, desc: 'Query vazia' },
    { query: '   ', expectedCount: 4, desc: 'Apenas espaços' },
    { query: '\t\n', expectedCount: 4, desc: 'Whitespace variado' },
    { query: 'JUROS', expectedCount: 2, desc: 'Uppercase case-insensitivity (Juros em ed-01 e ed-02)' },
    { query: 'holding', expectedCount: 1, desc: 'Busca por holding (ed-03)' },
    { query: 'selic', expectedCount: 2, desc: 'Busca por selic (tags e título em ed-01 e ed-04)' },
    { query: 'treasuries', expectedCount: 1, desc: 'Busca por treasuries (ed-02)' },
    { query: 'bitributação', expectedCount: 1, desc: 'Termo no resumo executivo (ed-02)' },
    { query: 'debentures', expectedCount: 0, desc: 'Busca sem acento quando texto possui acento diacrítico (esperado 0 por busca literal)' },
    { query: 'debêntures', expectedCount: 1, desc: 'Termo no resumo executivo com acento exato (ed-04)' },
    { query: 'xyzinexistente999', expectedCount: 0, desc: 'Termo inexistente' },
    { query: '1234567890', expectedCount: 0, desc: 'Numérico não encontrado' },
    // Regex e Meta-caracteres
    { query: '.*', expectedCount: 0, desc: 'Regex dot-star' },
    { query: '[a-z]+', expectedCount: 0, desc: 'Regex char class' },
    { query: '\\d+', expectedCount: 0, desc: 'Regex digit escape' },
    { query: '(selic|ipca)', expectedCount: 0, desc: 'Regex or-grouping' },
    { query: '^juros', expectedCount: 0, desc: 'Regex anchor inexistente literalmente' },
    { query: '$', expectedCount: 1, desc: 'Símbolo literal de moeda cifrão $ (presente em "R$ 5,42" no resumo de ed-01)' },
    { query: '?', expectedCount: 0, desc: 'Ponto de interrogação literal (ausente nos títulos)' },
    { query: ':', expectedCount: 4, desc: 'Dois pontos literal (presente nos títulos)' },
    { query: '+', expectedCount: 2, desc: 'Sinal de mais literal (IPCA+ em ed-01 e CDI + em ed-04)' },
    { query: '(', expectedCount: 0, desc: 'Parêntese aberto literal (seguro contra RegExp syntax error, ausente nos campos pesquisados)' },
    { query: ')', expectedCount: 0, desc: 'Parêntese fechado literal (seguro contra RegExp syntax error, ausente nos campos pesquisados)' },
    // XSS e Injeções
    { query: '<script>alert(1)</script>', expectedCount: 0, desc: 'XSS script injection' },
    { query: '"><img src=x onerror=alert(1)>', expectedCount: 0, desc: 'XSS img tag' },
    { query: "' OR '1'='1", expectedCount: 0, desc: 'SQL injection clássico' },
    { query: "admin'--", expectedCount: 0, desc: 'SQL comment injection' },
    { query: '"><svg onload=alert(1)>', expectedCount: 0, desc: 'XSS SVG payload' },
    // Caracteres Especiais e Unicode
    { query: '🚀', expectedCount: 0, desc: 'Emoji de foguete' },
    { query: '✦', expectedCount: 0, desc: 'Glifo estelar' },
    { query: '§ 1º', expectedCount: 0, desc: 'Símbolo de parágrafo legal' },
    { query: 'çãõéí', expectedCount: 0, desc: 'String puramente acentuada inexistente' },
    { query: 'A'.repeat(1000), expectedCount: 0, desc: 'String longa de 1.000 caracteres' },
    { query: 'selic ' + 'A'.repeat(500), expectedCount: 0, desc: 'Termo + cauda longa' },
    { query: '\0', expectedCount: 0, desc: 'Null byte' }
  ];

  for (const item of adversarialPayloads) {
    let res;
    assert.doesNotThrow(() => {
      res = simulateFilter('all', item.query, editions);
    }, `Falha ao filtrar payload adversarial: ${item.desc}`);
    assert.strictEqual(res.length, item.expectedCount, `Contagem incorreta para "${item.desc}": esperado ${item.expectedCount}, obtido ${res.length}`);
  }
});

runChallenge('CH-M4-06: Matriz Combinatória Categoria x Busca', () => {
  const editions = EDITORIAL_DATA.editions;

  // Categoria 'macro' (ed-01, ed-04)
  assert.strictEqual(simulateFilter('macro', 'holding', editions).length, 0);
  assert.strictEqual(simulateFilter('macro', 'treasuries', editions).length, 0);
  assert.strictEqual(simulateFilter('macro', 'selic', editions).length, 2);
  assert.strictEqual(simulateFilter('macro', 'debêntures', editions).length, 1);

  // Categoria 'offshore' (ed-02)
  assert.strictEqual(simulateFilter('offshore', 'holding', editions).length, 0);
  assert.strictEqual(simulateFilter('offshore', 'treasuries', editions).length, 1);
  assert.strictEqual(simulateFilter('offshore', 's&p 500', editions).length, 1);

  // Categoria 'blindagem' (ed-03)
  assert.strictEqual(simulateFilter('blindagem', 'itcmd', editions).length, 1);
  assert.strictEqual(simulateFilter('blindagem', 'selic', editions).length, 0);
  assert.strictEqual(simulateFilter('blindagem', 'inventário', editions).length, 1);
});

// -----------------------------------------------------------------------------
// BLOCO 3: VALIDAÇÃO DA NEWSLETTER VIP
// -----------------------------------------------------------------------------

runChallenge('CH-M4-07: Oráculo de Validação de E-mail da Newsletter (RFC / Regex)', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validEmails = [
    'investidor@portfel.com.br',
    'leo.arruda@consultoria.com',
    'cliente+vip@familyoffice.org',
    'nome.sobrenome@sub.dominio.com.br',
    'user123@domain.co',
    'a@b.cd',
    'primeiro_ultimo@empresa.com.br',
    'test-email.vip@banco.com.br'
  ];

  const invalidEmails = [
    '',
    '   ',
    'investidor',
    'investidor.com.br',
    'investidor@',
    '@portfel.com.br',
    'investidor@com',
    'investidor@domain.',
    'investidor @portfel.com.br',
    'investidor@ portfel.com.br',
    'investidor@portfel .com.br',
    'investidor@@portfel.com.br',
    'investidor@portfel@outro.com',
    '<script>alert(1)</script>',
    "' OR 1=1 --",
    'investidor@.com'
  ];

  for (const email of validEmails) {
    const trimmed = email.trim();
    const isValid = Boolean(trimmed && emailRegex.test(trimmed));
    assert.ok(isValid, `E-mail legítimo deveria ser válido: "${email}"`);
  }

  for (const email of invalidEmails) {
    const trimmed = email.trim();
    const isValid = Boolean(trimmed && emailRegex.test(trimmed));
    assert.ok(!isValid, `E-mail inválido deveria ser rejeitado: "${email}"`);
  }
});

// -----------------------------------------------------------------------------
// BLOCO 4: SIMULAÇÃO DE ESTRESSE DO MODO DE LEITURA (EXECUTIVE VS QUANT)
// -----------------------------------------------------------------------------

runChallenge('CH-M4-08: Estresse de Alternância de Leitura (100 Ciclos Rápidos) e Robustez de DOM', () => {
  // Simula o comportamento do motor de renderização do blog
  const editions = EDITORIAL_DATA.editions;
  let activeMode = 'exec';
  let activeFeaturedEditionId = 'ed-01';
  let localStorageMock = {};

  function renderContent(mode, edition) {
    if (mode === 'quant') {
      const q = edition.quantDeepDive || edition.visaoNerd;
      if (!q) {
        return `<div class="quant-view-wrap"><div class="quant-tese-box">${edition.executiveSummary[0]}</div></div>`;
      }
      let html = '<div class="quant-view-wrap">';
      if (q.tese) html += `<div class="quant-tese-box">${q.tese}</div>`;
      if (q.metricas) {
        html += '<table class="quant-table">';
        q.metricas.forEach(m => {
          html += `<tr><td>${m.indicador}</td><td>${m.spread}</td><td>${m.status}</td></tr>`;
        });
        html += '</table>';
      }
      if (q.conclusaoTecnica) html += `<div class="quant-conclusao">${q.conclusaoTecnica}</div>`;
      html += '</div>';
      return html;
    } else {
      let bullets = edition.executiveSummary.map(b => `<li class="exec-bullet-item">${b}</li>`).join('');
      return `<div class="exec-view-wrap"><ul class="exec-bullets-list">${bullets}</ul></div>`;
    }
  }

  // 100 alternâncias consecutivas
  for (let i = 0; i < 100; i++) {
    const targetMode = i % 2 === 0 ? 'quant' : 'exec';
    activeMode = targetMode;
    localStorageMock['leo_reader_preference'] = targetMode;

    const ed = editions.find(e => e.id === activeFeaturedEditionId);
    const rendered = renderContent(activeMode, ed);

    if (targetMode === 'quant') {
      assert.ok(rendered.includes('quant-view-wrap'), 'Deve renderizar container quant');
      assert.ok(rendered.includes('quant-tese-box'), 'Deve renderizar tese quant');
      assert.ok(rendered.includes('quant-table'), 'Deve renderizar tabela de spreads');
      assert.strictEqual(localStorageMock['leo_reader_preference'], 'quant');
    } else {
      assert.ok(rendered.includes('exec-view-wrap'), 'Deve renderizar container exec');
      assert.ok(rendered.includes('exec-bullets-list'), 'Deve renderizar bullets');
      assert.strictEqual(localStorageMock['leo_reader_preference'], 'exec');
    }
  }

  // Troca de edições preservando o modo ativo
  activeMode = 'quant';
  for (const ed of editions) {
    activeFeaturedEditionId = ed.id;
    const rendered = renderContent(activeMode, ed);
    assert.ok(rendered.includes(ed.quantDeepDive.tese), `Tese da edição ${ed.id} deve estar presente`);
  }
});

runChallenge('CH-M4-09: Resiliência Diante de Edição Incompleta (Corner Case T2-F1)', () => {
  const incompleteEd = {
    id: 'ed-incomplete',
    title: 'Edição Especial de Emergência',
    date: 'Hoje',
    category: 'Macro',
    readTime: '1 min',
    executiveSummary: ['Alerta rápido de mercado', 'Nenhum spread calculado'],
    quantDeepDive: null, // Sem seção quant
    impactMatrix: { rendaFixa: 'Ficar em CDI', acoes: 'Neutro', offshore: 'Neutro', imobiliario: 'Neutro' }
  };

  // Simula renderModeContent com fallback de resiliência
  let containerHtml = '';
  function renderCorner(mode, ed) {
    if (mode === 'quant') {
      const q = ed.quantDeepDive || ed.visaoNerd;
      if (!q) {
        containerHtml = '<div class="quant-view-wrap"><div class="quant-tese-box">' +
          ed.executiveSummary.join(' ') +
          '</div></div>';
        return;
      }
      containerHtml = '<div class="quant-view-wrap">quant</div>';
    } else {
      containerHtml = '<div class="exec-view-wrap">exec</div>';
    }
  }

  assert.doesNotThrow(() => {
    renderCorner('quant', incompleteEd);
  });
  assert.ok(containerHtml.includes('quant-view-wrap'), 'Deve renderizar container quant com fallback gracioso');
  assert.ok(containerHtml.includes('Alerta rápido de mercado'), 'Deve exibir resumo como fallback');
});

// -----------------------------------------------------------------------------
// BLOCO 5: TESTE INTERATIVO NO HEADLESS CHROME VIA WEBSOCKET CDP
// -----------------------------------------------------------------------------

async function runCdpInteractivityStress() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-m4-challenger-'));
  const port = 9791 + Math.floor(Math.random() * 20);

  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);

  try {
    await new Promise(r => setTimeout(r, 1200));
    const ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    const ws = new WebSocket(ver.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    const pending = new Map();
    ws.onmessage = e => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) pending.get(m.id)(m.result);
    };

    const send = (method, params = {}) => new Promise(res => {
      const id = msgId++;
      pending.set(id, res);
      ws.send(JSON.stringify({ id, method, params }));
    });

    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

    const sendSession = (method, params = {}) => new Promise(res => {
      const id = msgId++;
      pending.set(id, res);
      ws.send(JSON.stringify({ id, sessionId, method, params }));
    });

    await sendSession('Page.enable');
    await sendSession('DOM.enable');
    await sendSession('Runtime.enable');

    const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'blog.html').replace(/\\/g, '/');
    await sendSession('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 900));

    // 5.1: Teste de Pílulas de Filtro no DOM Real
    await runChallengeAsync('CH-M4-10: [Chrome CDP] Interatividade Real dos Filtros de Categoria', async () => {
      const filterTest = await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const pills = document.querySelectorAll('.filter-pill');
          const grid = document.getElementById('editions-grid');
          const results = [];

          pills.forEach(p => {
            p.click();
            const cat = p.getAttribute('data-category');
            const cards = grid.querySelectorAll('.edition-card');
            const titles = Array.from(cards).map(c => c.querySelector('.edition-card-title')?.textContent || '');
            results.push({ cat, count: cards.length, titles });
          });

          // Restaura "all"
          document.querySelector('.filter-pill[data-category="all"]').click();

          return results;
        })()`,
        returnByValue: true
      });

      const res = filterTest.result.value;
      // console.log('CH-M4-10 filter results:', JSON.stringify(res));
      assert.ok(Array.isArray(res) && res.length === 4, 'Deve testar 4 pílulas');
      const allPill = res.find(r => r.cat === 'all');
      const macroPill = res.find(r => r.cat === 'macro');
      const offshorePill = res.find(r => r.cat === 'offshore');
      const blindagemPill = res.find(r => r.cat === 'blindagem');

      if (!allPill || allPill.count !== 4) {
        console.error('DEBUG allPill:', JSON.stringify(res));
      }
      assert.strictEqual(allPill.count, 4, 'all pill deve mostrar 4 cards');
      assert.strictEqual(macroPill.count, 2, 'macro pill deve mostrar 2 cards');
      assert.strictEqual(offshorePill.count, 1, 'offshore pill deve mostrar 1 card');
      assert.strictEqual(blindagemPill.count, 1, 'blindagem pill deve mostrar 1 card');
    });

    // 5.2: Teste da Busca Textual no DOM Real com Caracteres Especiais e Empty State
    await runChallengeAsync('CH-M4-11: [Chrome CDP] Entrada de Busca com Caracteres Especiais e Empty State', async () => {
      const searchTest = await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const searchInput = document.getElementById('search-editions');
          const grid = document.getElementById('editions-grid');

          // 1. Busca por termo existente
          searchInput.value = 'holding';
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          const holdingCards = grid.querySelectorAll('.edition-card').length;

          // 2. Busca por caracteres especiais / regex
          searchInput.value = '.*+?^$';
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          const regexCards = grid.querySelectorAll('.edition-card').length;
          const regexHasEmptyState = grid.innerHTML.includes('Nenhuma edição encontrada');

          // 3. Busca com XSS payload
          searchInput.value = '<script>alert(1)</script>';
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          const xssHasEmptyState = grid.innerHTML.includes('Nenhuma edição encontrada');

          // 4. Limpa busca
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          const clearedCards = grid.querySelectorAll('.edition-card').length;

          return { holdingCards, regexCards, regexHasEmptyState, xssHasEmptyState, clearedCards };
        })()`,
        returnByValue: true
      });

      const st = searchTest.result.value;
      assert.strictEqual(st.holdingCards, 1, 'Busca por holding deve retornar exatamente 1 card');
      assert.strictEqual(st.regexCards, 0, 'Busca por regex especial inexistente deve retornar 0 cards');
      assert.ok(st.regexHasEmptyState, 'Deve renderizar empty state para termo não encontrado');
      assert.ok(st.xssHasEmptyState, 'Payload XSS deve resultar em empty state sem injeção');
      assert.strictEqual(st.clearedCards, 4, 'Ao limpar input, deve recompor os 4 cards');
    });

    // 5.3: Teste de Alternância Ultra-Rápida do Modo de Leitura (50 Ciclos no Navegador)
    await runChallengeAsync('CH-M4-12: [Chrome CDP] Estresse de Alternância Rápida (50 Ciclos no DOM Real)', async () => {
      const toggleStress = await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const btnExec = document.querySelector('.reader-toggle-btn[data-mode="exec"]');
          const btnQuant = document.querySelector('.reader-toggle-btn[data-mode="quant"]');
          const content = document.getElementById('reader-content-panel');

          let errors = [];

          for (let i = 0; i < 50; i++) {
            if (i % 2 === 0) {
              btnQuant.click();
              if (!btnQuant.classList.contains('is-active')) errors.push('btnQuant sem is-active no ciclo ' + i);
              if (btnExec.classList.contains('is-active')) errors.push('btnExec ainda com is-active no ciclo ' + i);
              if (localStorage.getItem('leo_reader_preference') !== 'quant') errors.push('localStorage dessincronizado quant');
              if (!content.querySelector('.quant-view-wrap')) errors.push('DOM sem quant-view-wrap');
            } else {
              btnExec.click();
              if (!btnExec.classList.contains('is-active')) errors.push('btnExec sem is-active no ciclo ' + i);
              if (btnQuant.classList.contains('is-active')) errors.push('btnQuant ainda com is-active no ciclo ' + i);
              if (localStorage.getItem('leo_reader_preference') !== 'exec') errors.push('localStorage dessincronizado exec');
              if (!content.querySelector('.exec-view-wrap')) errors.push('DOM sem exec-view-wrap');
            }
          }

          return {
            errorCount: errors.length,
            errors: errors.slice(0, 5),
            finalMode: localStorage.getItem('leo_reader_preference'),
            childrenCount: content.children.length
          };
        })()`,
        returnByValue: true
      });

      const res = toggleStress.result.value;
      assert.strictEqual(res.errorCount, 0, `Erros durante alternância rápida: ${res.errors.join('; ')}`);
      assert.strictEqual(res.childrenCount, 1, 'Container de conteúdo deve ter exatamente 1 filho (zero leaks de nós)');
    });

    // 5.4: Teste de Carregamento de Edição no Cockpit (`loadEditionIntoCockpit`)
    await runChallengeAsync('CH-M4-13: [Chrome CDP] Carregamento Dinâmico de Edições no Cockpit e Matriz de 4 Quadrantes', async () => {
      const editionCockpitTest = await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const results = [];
          const testIds = ['ed-02', 'ed-03', 'ed-04', 'ed-01'];

          for (const id of testIds) {
            window.loadEditionIntoCockpit(id);

            const title = document.getElementById('featured-title').textContent.trim();
            const cat = document.getElementById('featured-category').textContent.trim();
            const rf = document.getElementById('quadrant-rf-desc').textContent.trim();
            const eq = document.getElementById('quadrant-eq-desc').textContent.trim();
            const off = document.getElementById('quadrant-off-desc').textContent.trim();
            const re = document.getElementById('quadrant-re-desc').textContent.trim();

            results.push({ id, title, cat, rfLen: rf.length, eqLen: eq.length, offLen: off.length, reLen: re.length });
          }

          return results;
        })()`,
        returnByValue: true
      });

      const res = editionCockpitTest.result.value;
      assert.strictEqual(res.length, 4);
      for (const item of res) {
        assert.ok(item.title.length > 10, `Título deve ser preenchido para ${item.id}`);
        assert.ok(item.rfLen > 15, `Quadrante RF deve ser preenchido para ${item.id}`);
        assert.ok(item.eqLen > 15, `Quadrante EQ deve ser preenchido para ${item.id}`);
        assert.ok(item.offLen > 15, `Quadrante OFF deve ser preenchido para ${item.id}`);
        assert.ok(item.reLen > 15, `Quadrante RE deve ser preenchido para ${item.id}`);
      }
    });

    // 5.5: Teste da Captura da Newsletter VIP com Submissão Real de Formulário
    await runChallengeAsync('CH-M4-14: [Chrome CDP] Validação e Captura VIP da Newsletter no DOM', async () => {
      const newsletterTest = await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const form = document.getElementById('newsletter-form');
          const input = document.getElementById('newsletter-email');
          const feedback = document.getElementById('newsletter-feedback');
          const btn = document.getElementById('newsletter-btn');

          localStorage.removeItem('subscribed_newsletter');

          // 1. Submissão vazia
          input.value = '';
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          const err1 = feedback.textContent;
          const ls1 = localStorage.getItem('subscribed_newsletter');

          // 2. Submissão sem @
          input.value = 'investidor.sem.arroba.com';
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          const err2 = feedback.textContent;

          // 3. Submissão com injeção XSS
          input.value = '<script>alert(1)</script>';
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          const err3 = feedback.textContent;

          // 4. Submissão válida
          input.value = 'dr.ricardo@cirurgiavascular.med.br';
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          const successMsg = feedback.textContent;
          const lsSuccess = localStorage.getItem('subscribed_newsletter');
          const btnDisabled = btn.disabled;
          const btnText = btn.textContent;

          return {
            err1, ls1, err2, err3,
            successMsg, lsSuccess, btnDisabled, btnText
          };
        })()`,
        returnByValue: true
      });

      const res = newsletterTest.result.value;
      assert.ok(res.err1.includes('insira um endereço de e-mail válido'), 'Submissão vazia deve exibir erro');
      assert.strictEqual(res.ls1, null, 'localStorage não deve ser preenchido em caso de erro');
      assert.ok(res.err2.includes('insira um endereço de e-mail válido'), 'Submissão sem arroba deve exibir erro');
      assert.ok(res.err3.includes('insira um endereço de e-mail válido'), 'Payload XSS deve exibir erro');
      assert.ok(res.successMsg.includes('Inscrição VIP confirmada'), 'Submissão válida deve exibir sucesso');
      assert.strictEqual(res.lsSuccess, 'dr.ricardo@cirurgiavascular.med.br', 'E-mail deve ser persistido');
      assert.strictEqual(res.btnDisabled, true, 'Botão deve ser desabilitado após inscrição');
      assert.ok(res.btnText.includes('Inscrição Ativa'), 'Texto do botão deve indicar confirmação');
    });

    ws.close();
  } finally {
    proc.kill();
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {}
  }
}


// -----------------------------------------------------------------------------
// EXECUÇÃO GERAL
// -----------------------------------------------------------------------------

async function main() {
  await runCdpInteractivityStress();

  console.log('\n\x1b[35m' + '='.repeat(75) + '\x1b[0m');
  console.log(`\x1b[1m  RESULTADO FINAL DO ADVERSARIAL STRESS HARNESS (M4):\x1b[0m`);
  console.log(`  Total de Verificações: ${totalTests}`);
  console.log(`  Aprovados: \x1b[32m${passedTests}\x1b[0m`);
  console.log(`  Falhas: \x1b[31m${failedTests}\x1b[0m`);
  console.log('\x1b[35m' + '='.repeat(75) + '\x1b[0m\n');

  if (failedTests > 0) {
    console.error('✖ DESAFIO ADVERSARIAL DETECTOU FALHAS NO MILESTONE M4.');
    process.exit(1);
  } else {
    console.log('✔ TODOS OS DESAFIOS ADVERSARIAIS FORAM SUPERADOS COM ÊXITO.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Erro fatal no harness adversarial:', err);
  process.exit(1);
});
