/**
 * Verificação da página inicial (a Jornada em modo "uma tela") em Chrome real.
 *
 * Confere: sem rolagem da página, cada capítulo cabe na tela em oito
 * tamanhos, navegação por botão, teclado, roda, gesto e endereço, o painel de
 * aprofundamento, as calculadoras, a filosofia do consultor, o funcionamento
 * sem JavaScript, links, emoji e termos proibidos.
 *
 * Uso: node tests/jornada-check.mjs   (a versão ilustrada fica em jornada.html)
 */
import { chromium } from 'playwright-core';
import { pathToFileURL, fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = pathToFileURL(join(root, 'jornada.html')).href;
const shots = join(root, 'tests', 'shots');
if (!existsSync(shots)) mkdirSync(shots, { recursive: true });

let pass = 0, fail = 0;
function t(name, ok, detail = '') {
  if (ok) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (detail ? '  -> ' + detail : '')); }
}
const section = s => console.log('\n== ' + s + ' ==');
const IDS = ['mirante', 'partida', 'guia', 'nevoa', 'mapa', 'fortaleza', 'cume', 'farol', 'primeiro-passo'];

/* ---------------------------------------------------------------- */
section('Estático: links internos, emoji e vocabulário');
const html = readFileSync(join(root, 'jornada.html'), 'utf8');
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
for (const a of new Set([...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]))) {
  if (a.startsWith('i-')) continue;
  t('âncora #' + a, ids.has(a));
}
for (const s of new Set([...html.matchAll(/data-sheet="([^"]+)"/g)].map(m => m[1]))) {
  t('painel ' + s + ' existe', ids.has(s));
}
const localFiles = new Set(
  [...html.matchAll(/(?:href|src)="([^"#:]+\.(?:html|css|js|png|jpe?g|webp))"/g)]
    .map(m => decodeURIComponent(m[1]))
    .filter(p => !p.startsWith('midias/jornada/'))
);
for (const f of localFiles) t('arquivo ' + f, existsSync(join(root, f)));

const emoji = [...html].filter(c => { const p = c.codePointAt(0); return (p >= 0x1F300 && p <= 0x1FAFF) || (p >= 0x2600 && p <= 0x27BF); });
t('nenhum emoji', emoji.length === 0, emoji.join(' '));
const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/C-level/g, '');
for (const w of ['XP', 'missão', 'Missão', 'Level', 'level', 'jogador', 'game', 'quest']) {
  t('sem o termo "' + w + '"', !new RegExp('\\b' + w + '\\b').test(visible));
}

// Os links das outras páginas para a home são conferidos em site-check.mjs.

/* ---------------------------------------------------------------- */
const browser = await chromium.launch({ executablePath: CHROME });

async function open(vp, hash = '') {
  const mobile = vp.width < 900;
  const page = await browser.newPage({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.goto(url + hash, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  return { page, errors };
}

const current = page => page.evaluate(() => document.querySelector('.jx-ch.is-active') && document.querySelector('.jx-ch.is-active').id);
const waitMove = page => page.waitForTimeout(950); // trava da roda/gesto entre capítulos

const VIEWPORTS = [
  { width: 360, height: 640 }, { width: 375, height: 667 }, { width: 390, height: 844 }, { width: 430, height: 932 },
  { width: 768, height: 1024 }, { width: 1280, height: 720 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }
];

for (const vp of VIEWPORTS) {
  section('Tela ' + vp.width + 'x' + vp.height);
  const { page, errors } = await open(vp);
  t('sem erros de JavaScript', errors.length === 0, errors.slice(0, 2).join(' | '));

  const dims = await page.evaluate(() => ({
    sh: document.documentElement.scrollHeight, ih: innerHeight,
    sw: document.documentElement.scrollWidth, iw: document.documentElement.clientWidth
  }));
  t('a página não rola (uma tela só)', dims.sh <= dims.ih + 1, dims.sh + ' > ' + dims.ih);
  t('sem rolagem horizontal', dims.sw <= dims.iw + 1, dims.sw + ' > ' + dims.iw);

  const sobra = [];
  const escapam = [];
  for (const id of IDS) {
    await page.evaluate(id => window.Jornada.stage.go(window.Jornada.stage.ids.indexOf(id)), id);
    await page.waitForTimeout(60);
    const r = await page.evaluate(id => {
      const pn = document.querySelector('#' + id + ' .jx-panel');
      const W = document.documentElement.clientWidth;
      const out = [...pn.querySelectorAll('*')].filter(el => { const b = el.getBoundingClientRect(); return b.width && b.right > W + 1; }).length;
      return { over: pn.scrollHeight - pn.clientHeight, out };
    }, id);
    if (r.over > 2) sobra.push(id + ' +' + r.over + 'px');
    if (r.out) escapam.push(id);
  }
  t('todo capítulo cabe na tela', sobra.length === 0, sobra.join(', '));
  t('nada sai pela lateral', escapam.length === 0, escapam.join(', '));

  if (vp.width < 900) {
    const small = await page.evaluate(() => [...document.querySelectorAll('.jx-hud button, .jx-ch.is-active .jx-btn, .jx-ch.is-active button')]
      .filter(e => e.offsetParent && e.getBoundingClientRect().height < 44 && !e.classList.contains('jx-linkbtn')).map(e => (e.className || e.tagName) + ' ' + Math.round(e.getBoundingClientRect().height)));
    t('alvos de toque com 44px ou mais', small.length === 0, small.slice(0, 3).join(', '));
  } else if (vp.width > 1180) {
    t('trilha dos nove marcos visível', await page.isVisible('.jx-trail'));
  }

  if (vp.width === 1440 || vp.width === 390) {
    for (const id of IDS) {
      await page.evaluate(id => window.Jornada.stage.go(window.Jornada.stage.ids.indexOf(id)), id);
      await page.waitForTimeout(800);
      await page.screenshot({ path: join(shots, `tela-${vp.width}-${String(IDS.indexOf(id)).padStart(2, '0')}-${id}.png`) });
    }
  }
  await page.close();
}

/* ---------------------------------------------------------------- */
section('Navegação');
{
  const { page } = await open({ width: 1440, height: 900 });
  t('começa no Prólogo', (await current(page)) === 'mirante');
  t('só um capítulo visível', (await page.$$eval('.jx-ch', cs => cs.filter(c => getComputedStyle(c).visibility === 'visible').length)) === 1);
  t('capítulos escondidos são inertes', (await page.$$eval('.jx-ch:not(.is-active)', cs => cs.every(c => c.hasAttribute('inert')))));
  t('"voltar" desativado no início', await page.isDisabled('.jx-hud [data-go="prev"]'));

  await page.click('.jx-hud [data-go="next"]');
  t('botão "próximo" avança', (await current(page)) === 'partida');
  t('o endereço acompanha (#partida)', (await page.evaluate(() => location.hash)) === '#partida');
  t('título da barra atualiza', /Ponto de Partida/.test(await page.textContent('#jx-now-title')));
  t('o botão anuncia o próximo capítulo', /Guia/.test(await page.textContent('#jx-next-label')));

  await page.click('.jx-hud [data-go="prev"]');
  t('botão "voltar" retorna', (await current(page)) === 'mirante');

  await page.click('#mirante [data-go="next"]');
  t('"Começar a jornada" avança', (await current(page)) === 'partida');

  await page.keyboard.press('ArrowRight');
  t('seta para a direita avança', (await current(page)) === 'guia');
  await page.keyboard.press('ArrowLeft');
  t('seta para a esquerda volta', (await current(page)) === 'partida');
  await page.keyboard.press('End');
  t('End vai ao epílogo', (await current(page)) === 'primeiro-passo');
  t('"próximo" desativado no fim', await page.isDisabled('.jx-hud [data-go="next"]'));
  await page.keyboard.press('Home');
  t('Home volta ao início', (await current(page)) === 'mirante');

  await waitMove(page);
  await page.mouse.move(900, 450);
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(200);
  t('roda do mouse avança um capítulo', (await current(page)) === 'partida');
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(100);
  t('um giro rápido não pula dois capítulos', (await current(page)) === 'partida');
  await waitMove(page);
  await page.mouse.wheel(0, -200);
  await page.waitForTimeout(200);
  t('roda para cima volta', (await current(page)) === 'mirante');

  await page.click('.jx-trail a[data-target="farol"]');
  t('trilha leva ao capítulo escolhido', (await current(page)) === 'farol');
  t('trilha marca o atual e os já percorridos',
    await page.evaluate(() => document.querySelector('.jx-trail a[data-target="farol"]').classList.contains('is-active')
      && document.querySelector('.jx-trail a[data-target="cume"]').classList.contains('is-past')));
  await page.close();
}

{
  const { page } = await open({ width: 1440, height: 900 }, '#fortaleza');
  t('link direto abre no capítulo (#fortaleza)', (await current(page)) === 'fortaleza');
  await page.evaluate(() => { location.hash = 'cume'; });
  await page.waitForTimeout(200);
  t('mudar o endereço muda de capítulo', (await current(page)) === 'cume');
  await page.close();
}

{
  section('Toque no celular');
  const { page } = await open({ width: 390, height: 844 });
  async function swipe(x0, y0, x1, y1) {
    await page.evaluate(([x0, y0, x1, y1]) => {
      const el = document.elementFromPoint(x0, y0);
      const mk = (x, y) => new Touch({ identifier: 1, target: el, clientX: x, clientY: y });
      el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [mk(x0, y0)], changedTouches: [mk(x0, y0)] }));
      el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [mk(x1, y1)] }));
    }, [x0, y0, x1, y1]);
    await page.waitForTimeout(150);
  }
  await swipe(320, 200, 120, 210);
  t('deslizar para a esquerda avança', (await current(page)) === 'partida');
  await swipe(100, 200, 320, 210);
  t('deslizar para a direita volta', (await current(page)) === 'mirante');
  await swipe(200, 250, 205, 80);
  t('deslizar para cima avança', (await current(page)) === 'partida');

  await page.click('.jx-hud-index');
  await page.waitForTimeout(250);
  t('índice do celular abre', await page.isVisible('#jx-index'));
  await page.click('#jx-index a[href="#cume"]');
  await page.waitForTimeout(300);
  t('índice leva ao capítulo e fecha', (await current(page)) === 'cume' && !(await page.isVisible('#jx-index')));
  t('contador mostra "7 de 9"', /7 de 9/.test(await page.textContent('#jx-hud-count')));
  await page.close();
}

/* ---------------------------------------------------------------- */
section('Painel de aprofundamento');
{
  const { page, errors } = await open({ width: 1440, height: 900 }, '#guia');
  await page.click('#guia [data-sheet="d-guia"]');
  await page.waitForTimeout(400);
  t('painel abre', await page.isVisible('#jx-sheet'));
  t('mostra só o conteúdo do capítulo', await page.isVisible('#d-guia') && !(await page.isVisible('#d-cume')));
  t('título do painel preenchido', /Leonardo Arruda/.test(await page.textContent('#jx-sheet-title')));
  t('princípios do consultor aparecem', await page.isVisible('#d-guia .jx-principles-list'));
  t('nota do consultor aparece no painel do Guia', await page.isVisible('#d-guia .jx-quote'));

  await page.keyboard.press('ArrowRight');
  await page.mouse.move(1100, 500);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(300);
  t('com o painel aberto, a jornada não troca de capítulo', (await current(page)) === 'guia');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  t('Esc fecha o painel', !(await page.isVisible('#jx-sheet')));
  t('o foco volta ao botão que abriu', await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-sheet') === 'd-guia'));

  await page.evaluate(() => window.Jornada.stage.go(4));
  await page.click('#mapa [data-sheet="d-mapa"][data-tab="2"]');
  await page.waitForTimeout(300);
  t('pilar "Proteção" abre direto na aba certa', await page.isVisible('#pil-3') && !(await page.isVisible('#pil-1')));
  await page.click('[data-sheet-close]');
  await page.waitForTimeout(250);
  t('botão de fechar funciona', !(await page.isVisible('#jx-sheet')));

  await page.click('#mapa [data-sheet="d-mapa"][data-tab="0"]');
  await page.waitForTimeout(300);
  await page.mouse.click(200, 450); // fundo escurecido
  await page.waitForTimeout(250);
  t('clicar fora fecha o painel', !(await page.isVisible('#jx-sheet')));

  await page.evaluate(() => window.Jornada.stage.go(8));
  await page.click('[data-sheet="d-legal"]');
  await page.waitForTimeout(300);
  t('avisos legais acessíveis', /CVM/.test(await page.textContent('#d-legal')));
  await page.keyboard.press('Escape');

  await page.click('#primeiro-passo [data-sheet="d-passo"]');
  await page.waitForTimeout(300);
  await page.click('#d-passo details:first-of-type summary');
  t('perguntas frequentes abrem', await page.evaluate(() => document.querySelector('#d-passo details').open));
  await page.keyboard.press('Escape');
  t('sem erros de JavaScript', errors.length === 0, errors.join(' | '));
  await page.close();
}

/* ---------------------------------------------------------------- */
section('Calculadoras nos painéis');
{
  const { page, errors } = await open({ width: 1440, height: 900 });
  for (const [sheet, nome] of [['d-nevoa', 'taxas'], ['d-rendafixa', 'rendaFixa'], ['d-fortaleza', 'sucessao'], ['d-cume', 'independencia']]) {
    const ok = await page.evaluate(([sheet, nome]) => {
      const el = document.querySelector('#' + sheet + ' [data-instrumento="' + nome + '"]');
      return !!el && el.getAttribute('data-montado') === '1' && document.getElementById(nome + '-out').textContent.trim().length > 0;
    }, [sheet, nome]);
    t('painel ' + sheet + ' tem o instrumento ' + nome + ' funcionando', ok);
  }

  await page.evaluate(() => window.Jornada.stage.go(6));
  await page.click('#cume [data-sheet="d-cume"]');
  await page.waitForTimeout(300);

  async function setRange(id, v) {
    await page.evaluate(([id, v]) => {
      const el = document.getElementById(id);
      el.value = String(v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, [id, v]);
  }
  await setRange('independencia-inicial', 800000);
  await setRange('independencia-aporte', 15000);
  await setRange('independencia-renda', 30000);
  const esperado = await page.evaluate(() => {
    const r = window.Calculos.independencia({ inicial: 800000, aporte: 15000, renda: 30000, retirada: 3.5, realBruta: 5.5,
      custoReferencia: 0.7, custoBanco: 2, anosMeta: 15 });
    return String(new Date().getFullYear() + Math.ceil(r.mesesReferencia / 12));
  });
  t('ano da independência confere com o motor', (await page.textContent('#independencia-out')).trim() === esperado, esperado);

  const antes = await page.textContent('#independencia-out');
  await page.click('[data-instrumento="independencia"] .jx-seg[data-valor="4"]');
  t('retirada de 4% antecipa o ano', Number(await page.textContent('#independencia-out')) < Number(antes));

  // Arrastar um controle com as setas não troca de capítulo.
  await page.focus('#independencia-aporte');
  await page.keyboard.press('ArrowRight');
  t('setas num controle não mudam o capítulo', (await current(page)) === 'cume');
  await page.keyboard.press('Escape');

  await page.evaluate(() => window.Jornada.stage.go(3));
  await page.click('#nevoa [data-sheet="d-nevoa"]');
  await page.waitForTimeout(300);
  await page.fill('#taxas-inicial-txt', '2.500.000');
  await page.press('#taxas-inicial-txt', 'Enter');
  t('valor digitado move o controle', (await page.inputValue('#taxas-inicial')) === '2500000');
  await page.fill('#taxas-inicial-txt', 'abc');
  await page.press('#taxas-inicial-txt', 'Enter');
  t('texto inválido é ignorado', (await page.inputValue('#taxas-inicial')) === '2500000');
  t('digitar não troca de capítulo', (await current(page)) === 'nevoa');
  await page.keyboard.press('Escape');

  t('sem erros de JavaScript', errors.length === 0, errors.join(' | '));
  await page.close();
}

/* ---------------------------------------------------------------- */
section('Perfil e leitura da semana');
{
  const { page } = await open({ width: 1440, height: 900 }, '#partida');
  await page.click('.jx-profile[data-profile="familia"]');
  t('perfil fica selecionado', (await page.getAttribute('.jx-profile[data-profile="familia"]', 'aria-pressed')) === 'true');
  t('nota do perfil aparece', await page.isVisible('#jx-profile-note'));
  t('perfil personaliza o epílogo', /família/.test(await page.textContent('#jx-epilogue-line')));
  t('o perfil ainda cabe na tela', await page.evaluate(() => { const p = document.querySelector('#partida .jx-panel'); return p.scrollHeight <= p.clientHeight + 2; }));
  t('três indicadores na tela do Farol', (await page.$$eval('#farol [data-radar] > div', d => d.length)) === 3);
  t('todos os indicadores no painel', (await page.$$eval('#d-farol [data-radar] > div', d => d.length)) >= 5);
  await page.close();
}

{
  section('Sem JavaScript');
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  t('a página rola normalmente', await page.evaluate(() => document.documentElement.scrollHeight > innerHeight * 3));
  t('todos os capítulos visíveis', await page.$$eval('.jx-ch', cs => cs.every(c => getComputedStyle(c).visibility !== 'hidden')));
  t('conteúdo dos painéis visível', await page.isVisible('#pil-4') && await page.isVisible('#d-legal'));
  await ctx.close();
}

{
  section('Páginas internas e endereço antigo');
  for (const f of ['raiox.html', 'instrumentos.html', 'blog.html', 'termos.html', 'privacidade.html']) {
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto(pathToFileURL(join(root, f)).href, { waitUntil: 'load' });
    await p.waitForTimeout(300);
    t(f + ' sem erro de JavaScript', errs.length === 0, errs.join(''));
    await p.close();
  }
}

await browser.close();
console.log('\n---------------------------------------');
console.log(`  ${pass} passaram, ${fail} falharam\n`);
process.exit(fail ? 1 : 0);
