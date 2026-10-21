/**
 * Verificação da página inicial em navegador real.
 * Uso: node tests/home-check.mjs   (capturas em tests/shots/home/)
 */
import { chromium } from 'playwright-core';
import { pathToFileURL, fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { mkdirSync } from 'fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = pathToFileURL(join(root, 'index.html')).href;
const shots = join(root, 'tests/shots/home');
mkdirSync(shots, { recursive: true });

let pass = 0, fail = 0;
function t(nome, ok, info) {
  if (ok) { pass++; console.log('  ✓ ' + nome); }
  else { fail++; console.log('  ✗ ' + nome + (info ? '  → ' + info : '')); }
}

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const atual = p => p.evaluate(() => window.Home.atual());

const SIZES = [['desk', 1440, 900], ['lap', 1366, 680], ['tab', 820, 1180], ['mob', 390, 844], ['mobsm', 360, 640], ['land', 844, 390]];
for (const [n, w, h] of SIZES) {
  console.log(`\n${n} ${w}×${h}`);
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(url, { waitUntil: 'networkidle' });
  const rolagem = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  t('a página não rola', rolagem <= 0, rolagem + 'px');
  for (let i = 0; i < 7; i++) {
    await p.evaluate(k => window.Home.go(k), i);
    await p.waitForTimeout(900);
    const r = await p.evaluate(() => {
      const s = document.querySelector('.hm-slide.is-active');
      const largo = [...s.querySelectorAll('*')].some(el => el.getBoundingClientRect().right > innerWidth + 1);
      return { sobra: s.scrollHeight - s.clientHeight, largo, id: s.id };
    });
    // Celular deitado pode rolar por dentro da tela; os demais tamanhos cabem inteiros.
    if (n !== 'land') t(`tela ${i + 1} (${r.id}) cabe sem rolar`, r.sobra <= 2, r.sobra + 'px');
    t(`tela ${i + 1} sem estouro lateral`, !r.largo);
    await p.screenshot({ path: join(shots, `${n}-${i + 1}.png`) });
  }
  t('sem erro de JavaScript', errs.length === 0, errs.join(' | '));
  await p.close();
}

console.log('\nnavegação');
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'load' });
  t('abre no início', (await atual(p)) === 'inicio');
  await p.keyboard.press('ArrowDown'); await p.waitForTimeout(100);
  t('seta para baixo avança', (await atual(p)) === 'custo');
  t('o endereço acompanha a tela', p.url().endsWith('#custo'), p.url());
  await p.keyboard.press('End');
  t('End vai para a última', (await atual(p)) === 'comecar');
  t('na última, avançar fica desabilitado', await p.$eval('.hm-arrows [data-go="next"]', b => b.disabled));
  await p.keyboard.press('Home');
  t('Home volta ao início', (await atual(p)) === 'inicio');
  await p.mouse.move(700, 450);
  await p.mouse.wheel(0, 120); await p.waitForTimeout(200);
  t('roda do mouse avança', (await atual(p)) === 'custo');
  await p.mouse.wheel(0, 120); await p.waitForTimeout(100);
  t('roda não pula duas telas de uma vez', (await atual(p)) === 'custo');
  await p.click('#hm-dots a[href="#quem"]');
  t('marca da barra leva à tela', (await atual(p)) === 'quem');
  const ocultas = await p.$$eval('.hm-slide:not(.is-active)', ss => ss.every(s => s.inert));
  t('telas ocultas ficam fora do foco', ocultas);
  await p.goto(url + '#servicos', { waitUntil: 'load' });
  t('endereço com #servicos abre na tela certa', (await atual(p)) === 'servicos');
  await p.close();
}

console.log('\ntoque');
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load' });
  const swipe = (y0, y1) => p.evaluate(([a, b]) => {
    const mk = y => [new Touch({ identifier: 1, target: document.body, clientX: 200, clientY: y })];
    window.dispatchEvent(new TouchEvent('touchstart', { touches: mk(a), changedTouches: mk(a) }));
    window.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: mk(b) }));
  }, [y0, y1]);
  await swipe(600, 300);
  t('deslizar para cima avança', (await atual(p)) === 'custo');
  await swipe(300, 600);
  t('deslizar para baixo volta', (await atual(p)) === 'inicio');
  await ctx.close();
}

console.log('\no custo invisível');
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url + '#custo', { waitUntil: 'load' });
  await p.waitForTimeout(900);
  const v1 = await p.textContent('#hm-custo-valor');
  t('R$ 1 milhão perde cerca de R$ 1,3 milhão', v1.trim() === 'R$ 1,3 milhão', v1);
  t('o gráfico tem as duas curvas', await p.$$eval('#hm-ref, #hm-bank', ps => ps.every(x => (x.getAttribute('d') || '').length > 50)));
  await p.click('.hm-chips [data-valor="3000000"]');
  await p.waitForTimeout(900);
  const v3 = await p.textContent('#hm-custo-valor');
  t('R$ 3 milhões perde cerca de R$ 4 milhões', v3.trim() === 'R$ 4 milhões', v3);
  t('a frase acompanha o valor escolhido', (await p.textContent('#hm-custo-base')).trim() === 'R$ 3 milhões');
  t('o botão escolhido fica marcado', await p.$eval('.hm-chips [data-valor="3000000"]', b => b.getAttribute('aria-pressed') === 'true'));
  await p.close();
}

console.log('\nsem JavaScript');
{
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load' });
  const r = await p.evaluate(() => ({
    rola: document.documentElement.scrollHeight > innerHeight * 4,
    visiveis: [...document.querySelectorAll('.hm-slide')].every(s => getComputedStyle(s).visibility === 'visible' && getComputedStyle(s).opacity === '1')
  }));
  t('as sete telas aparecem empilhadas', r.rola && r.visiveis);
  await ctx.close();
}

await browser.close();
console.log(`\n  ${pass} passaram, ${fail} falharam\n`);
process.exit(fail ? 1 : 0);
