/**
 * Verificação das páginas internas em Chrome real: Instrumentos, Diagnóstico,
 * Leitura semanal, Links, Termos, Privacidade e redirecionamentos.
 *
 * Uso: node tests/site-check.mjs
 */
import { chromium } from 'playwright-core';
import { pathToFileURL, fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const shots = join(root, 'tests', 'shots');
if (!existsSync(shots)) mkdirSync(shots, { recursive: true });
const u = f => pathToFileURL(join(root, f)).href;

let pass = 0, fail = 0;
function t(name, ok, detail = '') {
  if (ok) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (detail ? '  -> ' + detail : '')); }
}
const section = s => console.log('\n== ' + s + ' ==');

const PAGES = ['index.html', 'instrumentos.html', 'raiox.html', 'blog.html', 'linktree.html', 'termos.html', 'privacidade.html'];

/* ---------------------------------------------------------------- */
section('Links internos de todas as páginas');
const idsOf = f => new Set([...readFileSync(join(root, f), 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
// Âncoras geradas por script (instrumentos, diagnóstico) também contam.
const dynamicIds = { 'instrumentos.html': ['taxas', 'renda-fixa', 'sucessao', 'independencia', 'imovel', 'holding'], 'raiox.html': [] };
for (const f of PAGES) {
  const src = readFileSync(join(root, f), 'utf8');
  for (const m of src.matchAll(/href="([^"#:]+\.html)?(#[^"]*)?"/g)) {
    const file = m[1] ? decodeURIComponent(m[1]) : f;
    const hash = m[2] ? m[2].slice(1) : '';
    if (!m[1] && !hash) continue;
    if (hash.startsWith('i-')) continue;
    const okFile = existsSync(join(root, file));
    const okHash = !hash || !okFile || idsOf(file).has(hash) || (dynamicIds[file] || []).includes(hash);
    if (!okFile || !okHash) t(f + ' -> ' + (m[1] || '') + (m[2] || ''), false, !okFile ? 'arquivo não existe' : 'âncora não existe');
  }
}
t('todos os links internos resolvem', true);

// Os links do diagnóstico ficam em data/diagnostico.js.
{
  const D = readFileSync(join(root, 'data/diagnostico.js'), 'utf8');
  for (const m of D.matchAll(/href: '([^'#]+)#([^']+)'/g)) {
    t('diagnóstico -> ' + m[1] + '#' + m[2], existsSync(join(root, m[1])) && (idsOf(m[1]).has(m[2]) || (dynamicIds[m[1]] || []).includes(m[2])));
  }
}

section('Nenhuma página carrega a Cormorant nem tem emoji');
for (const f of PAGES) {
  const src = readFileSync(join(root, f), 'utf8');
  t(f + ' sem Cormorant', !/Cormorant/.test(src));
  const visible = src.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const emoji = [...visible].filter(c => { const p = c.codePointAt(0); return (p >= 0x1F300 && p <= 0x1FAFF) || (p >= 0x2600 && p <= 0x27BF); });
  t(f + ' sem emoji', emoji.length === 0, emoji.join(' '));
}
for (const f of ['js/instrumentos.js', 'js/diagnostico.js', 'js/leitura.js', 'js/jornada.js', 'data/editorial.js', 'data/diagnostico.js', 'data/filosofia.js']) {
  const src = readFileSync(join(root, f), 'utf8');
  const emoji = [...src].filter(c => { const p = c.codePointAt(0); return (p >= 0x1F300 && p <= 0x1FAFF) || (p >= 0x2600 && p <= 0x27BF); });
  t(f + ' sem emoji', emoji.length === 0, emoji.join(' '));
}

section('Nenhuma recomendação de alocação publicada');
{
  const ed = readFileSync(join(root, 'data/editorial.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  t('leitura semanal sem "alocação recomendada"', !/aloca[çc][aã]o recomendada/i.test(ed));
  t('leitura semanal sem ordens de compra ou venda', !/\b(compre|venda|recomendamos)\b/i.test(ed));
}

/* ---------------------------------------------------------------- */
const browser = await chromium.launch({ executablePath: CHROME });

async function openPage(f, vp) {
  const page = await browser.newPage({ viewport: vp, isMobile: vp.width < 900, hasTouch: vp.width < 900 });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.goto(u(f), { waitUntil: 'load' });
  await page.waitForTimeout(600);
  return { page, errors };
}

for (const f of PAGES) {
  for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    section(f + ' · ' + vp.width + 'px');
    const { page, errors } = await openPage(f, vp);
    t('sem erros de JavaScript', errors.length === 0, errors.slice(0, 2).join(' | '));
    const ov = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    t('sem rolagem horizontal', ov[0] <= ov[1] + 1, ov.join(' > '));
    const esc = await page.evaluate(() => {
      const W = document.documentElement.clientWidth, out = [];
      document.querySelectorAll('main *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (!r.width || r.right <= W + 1 || getComputedStyle(el).position === 'fixed') return;
        // Dentro de um contêiner que recorta (overflow hidden), não transborda de fato.
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const o = getComputedStyle(p).overflowX;
          if (o === 'hidden' || o === 'clip') return;
        }
        out.push((el.className || el.tagName) + '@' + Math.round(r.right));
      });
      return out.slice(0, 3);
    });
    t('nada escapa da tela', esc.length === 0, esc.join(', '));
    t('um único título principal (h1)', (await page.$$eval('h1', h => h.length)) === 1);
    const cortados = await page.$$eval('.jx-num-in', is => is.filter(i => i.scrollWidth > i.clientWidth + 1).map(i => i.id + '=' + i.value));
    t('nenhum valor cortado nos campos', cortados.length === 0, cortados.join(', '));
    const cruas = await page.$$eval('button', bs => bs.filter(b => b.offsetParent && /rgb\(2(39|40), 2(39|40), 2(39|40)\)|rgb\(255, 255, 255\)/.test(getComputedStyle(b).backgroundColor)).map(b => b.textContent.trim()));
    t('nenhum botão com o fundo padrão do navegador', cruas.length === 0, cruas.join(' | '));
    const quebrados = await page.$$eval('.jx-topnav a', as => as.filter(a => a.offsetParent && a.getBoundingClientRect().height > 44).map(a => a.textContent));
    t('menu do cabeçalho em uma linha', quebrados.length === 0, quebrados.join(', '));
    const fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(x => x.status === 'loaded').map(x => x.family); });
    t('títulos em EB Garamond', fonts.some(x => /EB Garamond/.test(x)), [...new Set(fonts)].join(', '));
    await page.screenshot({ path: join(shots, 'pagina-' + f.replace('.html', '') + '-' + vp.width + '.png') });
    await page.close();
  }
}

/* ---------------------------------------------------------------- */
section('Cabeçalho sem sobreposição em todas as páginas');
for (const f of PAGES) {
  for (const w of [1280, 1440, 1920]) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(u(f), { waitUntil: 'load' });
    await p.waitForTimeout(300);
    const hit = await p.evaluate(() => {
      const els = [...document.querySelectorAll('.jx-top .jx-brand, .jx-top .jx-now, .jx-topnav a, .jx-top .jx-top-cta')]
        .filter(e => e.offsetParent !== null && getComputedStyle(e).display !== 'none');
      const box = els.map(e => [e.className || e.textContent.trim(), e.getBoundingClientRect()]);
      const out = [];
      for (let i = 0; i < box.length; i++) for (let j = i + 1; j < box.length; j++) {
        const a = box[i][1], b = box[j][1];
        if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) out.push(box[i][0] + ' x ' + box[j][0]);
      }
      return out;
    });
    t(f + ' a ' + w + 'px: nada se sobrepõe no cabeçalho', hit.length === 0, hit.join(' | '));
    await p.close();
  }
}

section('Calculadoras: cada janela funciona e confere com o motor');
{
  const { page, errors } = await openPage('instrumentos.html', { width: 1440, height: 900 });
  const APPS = { taxas: 'taxas', 'renda-fixa': 'rendaFixa', sucessao: 'sucessao', independencia: 'independencia', imovel: 'imovel', holding: 'holding' };
  t('a tela de calculadoras não rola', await page.evaluate(() => document.querySelector('.ap-main').scrollHeight <= innerHeight));
  t('sete ícones na tela', (await page.$$('.ap-tile')).length === 7);
  for (const [app, n] of Object.entries(APPS)) {
    await page.click('.ap-tile[data-app="' + app + '"]');
    await page.waitForTimeout(200);
    t(app + ': o ícone abre a janela', await page.evaluate(() => document.getElementById('ap-win').open));
    t(app + ': a janela tem gráfico', await page.evaluate(() => document.querySelector('.ap-vis').children.length > 0));
    const ranges = await page.$$eval('#ap-win input[type="range"]', rs => rs.filter(r => r.offsetParent).map(r => r.id));
    for (const id of ranges) {
      await page.evaluate(a => window.Apps.abrir(a), app);
      const before = await page.evaluate(() => document.querySelector('.ap-out').textContent);
      await page.evaluate(id => {
        const el = document.getElementById(id);
        const span = parseFloat(el.max) - parseFloat(el.min);
        const v = parseFloat(el.value) === parseFloat(el.max) ? parseFloat(el.min) + span * 0.25 : parseFloat(el.min) + span * 0.85;
        el.value = String(v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, id);
      const after = await page.evaluate(() => document.querySelector('.ap-out').textContent);
      t('  ' + id + ' altera o resultado', before !== after);
    }
    await page.evaluate(a => window.Apps.abrir(a), app);
    const desalinhados = await page.evaluate(n => window.Instrumentos.definicoes[n].campos
      .filter(c => c.tipo !== 'escolha' && !c.so)
      .filter(c => Math.abs(parseFloat(document.getElementById(n + '-' + c.id).value) - c.valor) > 1e-9)
      .map(c => c.id), n);
    t(app + ': nenhum valor padrão é arredondado pelo controle', desalinhados.length === 0, desalinhados.join(', '));
    t(app + ': informa a data das premissas', /conferidas em/.test(await page.textContent('#ap-win .ap-fine')));
    await page.click('#ap-win-method');
    t(app + ': "Como calculamos" mostra o método e esconde o resultado',
      await page.evaluate(() => !document.querySelector('.ap-method').hidden && document.querySelector('.ap-out').hidden && /fórmula/i.test(document.querySelector('.ap-method').textContent)));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    t(app + ': Esc fecha e devolve o foco ao ícone', await page.evaluate(a => !document.getElementById('ap-win').open && document.activeElement.dataset.app === a, app));
  }

  // Holding: trocar para "venda" mostra os campos da venda e muda a conta.
  await page.evaluate(() => window.Apps.abrir('holding'));
  const antes = await page.textContent('.ap-out-big');
  await page.click('#ap-win .ap-segs button[data-valor="2"]');
  const modo = await page.evaluate(() => ({
    venda: !document.getElementById('holding-valorVenda').closest('.ap-field').hidden,
    aluguel: !document.getElementById('holding-aluguelMensal').closest('.ap-field').hidden,
    rot: document.querySelector('.ap-out-label').textContent
  }));
  t('holding: o modo venda troca os campos', modo.venda && !modo.aluguel);
  t('holding: o modo venda troca o resultado', /vend/i.test(modo.rot) && antes !== await page.textContent('.ap-out-big'), modo.rot);
  const vendaOk = await page.evaluate(() => {
    const r = window.Calculos.holdingVenda({ valorVenda: 3000000, custoAquisicao: 1000000, itbi: 3, socios: 1 }, window.PREMISSAS.holding);
    return document.querySelector('.ap-out-grid').textContent + '|' + document.querySelector('.ap-out-frase').textContent + '|' + Math.round(r.totalPJ);
  });
  t('holding: a venda padrão confere com o motor (R$ 416 mil pela holding)', /416/.test(vendaOk), vendaOk.slice(0, 200));
  await page.keyboard.press('Escape');

  // Imóvel: o valor exibido confere com o motor.
  await page.evaluate(() => window.Apps.abrir('imovel'));
  const conf = await page.evaluate(() => {
    const P = window.PREMISSAS;
    const r = window.Calculos.alugarOuComprar({ valorImovel: 1200000, entradaPct: 30, aluguelMensal: 5500, jurosFinanciamento: P.imovel.jurosFinanciamento,
      prazoAnos: 30, rendimentoInvestimento: 11, valorizacaoReal: 1, horizonteAnos: 15, custosCompraPct: P.imovel.custosCompra, inflacao: P.mercado.ipca12m });
    const txt = document.querySelector('.ap-out-frase').textContent;
    const v = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Math.round(Math.abs(r.vantagem)));
    return { ok: txt.includes(v.replace(/\s/g, ' ')) || txt.replace(/\s/g, ' ').includes(v.replace(/\s/g, ' ')), txt, v };
  });
  t('alugar ou comprar: tela confere com o motor', conf.ok, conf.v + ' em ' + conf.txt);
  await page.keyboard.press('Escape');

  const fresh = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await fresh.goto(u('instrumentos.html') + '#sucessao', { waitUntil: 'load' });
  await fresh.waitForTimeout(400);
  t('link direto (#sucessao) abre a calculadora', await fresh.evaluate(() => document.getElementById('ap-win').open && /sucessão/i.test(document.getElementById('ap-win-title').textContent)));
  await fresh.close();

  const mob = await browser.newPage({ viewport: { width: 360, height: 640 } });
  await mob.goto(u('instrumentos.html'), { waitUntil: 'load' });
  await mob.waitForTimeout(800);
  t('no celular, os sete ícones cabem numa tela', await mob.evaluate(() => [...document.querySelectorAll('.ap-tile')].every(e => e.getBoundingClientRect().bottom <= innerHeight)));
  await mob.close();
  t('sem erros de JavaScript', errors.length === 0, errors.join(' | '));
  await page.close();
}

/* ---------------------------------------------------------------- */
section('Diagnóstico: fluxo completo');
{
  const { page, errors } = await openPage('raiox.html', { width: 1440, height: 900 });

  async function responder(letras) {
    await page.click('[data-acao="comecar"]');
    for (let i = 0; i < letras.length; i++) {
      const idx = 'ABCD'.indexOf(letras[i]);
      await page.click('.jx-diag-opt >> nth=' + idx);
      await page.click('[data-acao="avancar"]');
    }
  }

  // Avançar sem responder não é possível.
  await page.click('[data-acao="comecar"]');
  t('"Próxima" fica desativado sem resposta', await page.isDisabled('[data-acao="avancar"]'));
  t('mostra "Pergunta 1 de 10"', /Pergunta 1 de 10/.test(await page.textContent('.jx-diag-progress')));

  // Voltar preserva a resposta anterior.
  await page.click('.jx-diag-opt >> nth=2');
  await page.click('[data-acao="avancar"]');
  await page.click('[data-acao="voltar"]');
  t('voltar preserva a resposta marcada', await page.isChecked('#q0-2'));

  // Teclado: setas trocam a opção, Enter avança.
  await page.focus('#q0-2');
  await page.keyboard.press('ArrowDown');
  t('setas do teclado mudam a opção', await page.isChecked('#q0-3'));
  await page.keyboard.press('Enter');
  t('Enter avança para a próxima pergunta', /Pergunta 2 de 10/.test(await page.textContent('.jx-diag-progress')));

  // Tudo no máximo.
  await page.reload({ waitUntil: 'load' });
  await responder('DDDDDDDDDD');
  let r = await page.evaluate(() => window.__diagnostico);
  t('tudo na melhor opção: nota 100', r.nota === 100, r.nota);
  t('estrutura madura', r.faixa.nome === 'Estrutura madura');
  await page.screenshot({ path: join(shots, 'diagnostico-resultado-100.png'), fullPage: false });

  // Refazer zera.
  await page.click('[data-acao="refazer"]');
  t('refazer volta para o início', await page.isVisible('[data-acao="comecar"]'));

  // Resultado misto: lacunas corretas e links funcionando.
  await responder('DDABCCDCAB');
  r = await page.evaluate(() => window.__diagnostico);
  // custos 100, diversif (0+35)/2=18, liquidez 70, tributacao (100+70)/2=85, sucessao (0+35)/2=18
  t('nota mista calculada corretamente', r.nota === 58, r.nota);
  t('lacunas: diversificação e sucessão', r.lacunas.map(l => l.id).join() === 'diversificacao,sucessao', r.lacunas.map(l => l.id).join());
  const gaps = await page.$$eval('.jx-gap', g => g.length);
  t('mostra as duas orientações', gaps === 2);
  const cruas = await page.$$eval('button', bs => bs.filter(b => b.offsetParent && /rgb\(2(39|40), 2(39|40), 2(39|40)\)|rgb\(255, 255, 255\)/.test(getComputedStyle(b).backgroundColor)).map(b => b.textContent.trim()));
  t('nenhum botão com o fundo padrão do navegador', cruas.length === 0, cruas.join(' | '));
  const resumo = await page.inputValue('.jx-diag-copy');
  t('resumo para colar no agendamento traz a nota', /nota 58 de 100/.test(resumo));
  await page.screenshot({ path: join(shots, 'diagnostico-resultado-misto.png'), fullPage: true });

  // Links das orientações abrem a página certa.
  const href = await page.getAttribute('.jx-gap-links a >> nth=1', 'href');
  t('link de orientação leva a um instrumento', /^instrumentos\.html#/.test(href), href);
  t('sem erros de JavaScript', errors.length === 0, errors.join(' | '));
  await page.close();
}

{
  section('Diagnóstico no celular');
  const { page, errors } = await openPage('raiox.html', { width: 390, height: 844 });
  await page.click('[data-acao="comecar"]');
  const h = await page.$$eval('.jx-diag-opt', os => os.map(o => o.getBoundingClientRect().height));
  t('opções com área de toque de 48px ou mais', h.every(x => x >= 48), h.join(','));
  for (let i = 0; i < 10; i++) { await page.click('.jx-diag-opt >> nth=1'); await page.click('[data-acao="avancar"]'); }
  t('resultado aparece no celular', await page.isVisible('.jx-diag-num'));
  await page.screenshot({ path: join(shots, 'diagnostico-celular.png'), fullPage: true });
  t('sem erros de JavaScript', errors.length === 0, errors.join(' | '));
  await page.close();
}

/* ---------------------------------------------------------------- */
section('Leitura semanal');
{
  const { page, errors } = await openPage('blog.html', { width: 1440, height: 900 });
  t('cinco indicadores da semana', (await page.$$eval('#lw-indicadores > div', d => d.length)) === 5);
  t('indicadores mostram a fonte', /Banco Central/.test(await page.textContent('#lw-indicadores')));
  t('Selic atualizada (13,75%)', /13,75%/.test(await page.textContent('#lw-indicadores')));
  t('pelo menos uma edição', (await page.$$eval('.lw-edition', e => e.length)) >= 1);
  t('a edição tem título principal (h1)', (await page.$$eval('h1', h => h.length)) === 1);
  t('número da semana em destaque', /8,8%/.test(await page.textContent('.lw-stat')));
  t('resumo em 1 minuto com três pontos', (await page.$$eval('.lw-brief li', l => l.length)) === 3);
  t('leitura completa visível, sem precisar clicar', await page.isVisible('.lw-body'));
  t('o que observar: quatro cartões', (await page.$$eval('.lw-observe li', l => l.length)) === 4);
  t('edição informa a autoria', /fontes citadas|Leonardo Arruda/.test(await page.textContent('.lw-byline')));
  t('fontes da edição com link', (await page.$$eval('.lw-sources a', a => a.length)) >= 1);
  t('com uma edição só, o arquivo fica escondido', !(await page.isVisible('#lw-arquivo-box')));
  t('a página rola (é texto longo)', await page.evaluate(() => document.documentElement.scrollHeight > innerHeight));
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(u('blog.html'), { waitUntil: 'load' });
  await m.waitForTimeout(300);
  t('no celular, sem rolagem horizontal', await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await m.close();
  t('sem erros de JavaScript', errors.length === 0, errors.join(' | '));
  await page.close();
}

/* ---------------------------------------------------------------- */
section('Mapa da jornada');
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; p.on('pageerror', e => errors.push(String(e)));
  p.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
  await p.goto(u('mapa.html'), { waitUntil: 'load' });
  await p.evaluate(() => { try { localStorage.removeItem('mapa-vistos'); } catch (e) {} });
  await p.waitForTimeout(500);
  t('nove lugares no mapa', (await p.$$('.mp-place')).length === 9);
  t('começa no Mirante, com a caixa aberta', (await p.evaluate(() => window.Mapa.aberto())) === 'mirante');
  const antes = await p.evaluate(() => window.Mapa.posicao());
  await p.keyboard.down('a'); await p.waitForTimeout(600); await p.keyboard.up('a');
  const depois = await p.evaluate(() => window.Mapa.posicao());
  t('a tecla A anda para a esquerda', depois.x < antes.x - 40, antes.x + ' -> ' + depois.x);
  t('ao sair do lugar a caixa fecha', (await p.evaluate(() => window.Mapa.aberto())) === null);
  const f = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await f.goto(u('mapa.html') + '#fortaleza', { waitUntil: 'load' });
  await f.waitForTimeout(400);
  t('#fortaleza começa na Fortaleza', (await f.evaluate(() => window.Mapa.aberto())) === 'fortaleza');
  t('a Fortaleza leva ao simulador de holding', await f.$eval('.mp-btn-main', a => a.getAttribute('href') === 'instrumentos.html#holding'));
  const dest = await f.$$eval('#mp-box-actions a', as => as.map(a => a.getAttribute('href')));
  await f.close();
  t('"Ver a cena" leva à versão ilustrada', dest.includes('jornada.html#fortaleza'), dest.join(' '));
  const html = readFileSync(join(root, 'mapa.html'), 'utf8') + readFileSync(join(root, 'js/mapa.js'), 'utf8');
  const emoji = [...html].filter(c => { const q = c.codePointAt(0); return (q >= 0x1F300 && q <= 0x1FAFF) || (q >= 0x2600 && q <= 0x27BF); });
  t('mapa sem emoji', emoji.length === 0, emoji.join(' '));
  t('sem erros de JavaScript nem arquivos faltando', errors.length === 0, errors.join(' | '));
  await p.close();
}

/* ---------------------------------------------------------------- */
section('Links (bio)');
{
  for (const [w, h] of [[390, 844], [360, 640]]) {
    const p = await browser.newPage({ viewport: { width: w, height: h } });
    const errors = []; p.on('pageerror', e => errors.push(String(e)));
    await p.goto(u('linktree.html'), { waitUntil: 'load' });
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => ({
      cta: document.querySelector('.lk-go').getBoundingClientRect().bottom <= innerHeight,
      atalhos: document.querySelectorAll('.lk-grid a').length,
      largo: document.documentElement.scrollWidth <= innerWidth
    }));
    t(w + 'px: agendar aparece sem rolar', r.cta);
    t(w + 'px: quatro atalhos do site', r.atalhos === 4);
    t(w + 'px: sem rolagem horizontal', r.largo);
    t(w + 'px: sem erros de JavaScript', errors.length === 0, errors.join(' | '));
    await p.close();
  }
}

/* ---------------------------------------------------------------- */
section('Redirecionamentos');
{
  const page = await browser.newPage();
  await page.goto(u('simulador.html'), { waitUntil: 'load' });
  await page.waitForTimeout(500);
  t('simulador.html leva aos Instrumentos', /instrumentos\.html#independencia$/.test(page.url()), page.url());
  await page.close();
}

await browser.close();
console.log('\n---------------------------------------');
console.log(`  ${pass} passaram, ${fail} falharam\n`);
process.exit(fail ? 1 : 0);
