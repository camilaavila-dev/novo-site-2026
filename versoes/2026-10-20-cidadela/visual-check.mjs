/**
 * Verificação visual real da Cidadela, em Chrome headless.
 * Mede geometria: sobreposição de painéis, tamanho de ícones, overflow,
 * e se os marcadores pousam dentro da tela.
 */
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'url';
import { join } from 'path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const root = process.cwd();
const url = pathToFileURL(join(root, 'index.html')).href;

let fail = 0, pass = 0;
const t = (n, c, d='') => { c ? (pass++, console.log('  PASS  '+n)) : (fail++, console.log('  FAIL  '+n+(d?'  -> '+d:''))); };

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(String(e)));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(900);

console.log('\n== Erros de console ==');
t('sem erro de JS', errors.length === 0, errors.slice(0,3).join(' | '));

console.log('\n== Ícones têm tamanho sensato ==');
const icons = await page.$$eval('#jornada-world-app .ic', els =>
  els.map(e => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; })
);
const huge = icons.filter(i => i.w > 48 || i.h > 48);
t(`${icons.length} ícones, nenhum gigante`, huge.length === 0,
  huge.length ? `${huge.length} acima de 48px, ex: ${huge[0].w}x${huge[0].h}` : '');
t('nenhum ícone com tamanho zero', icons.filter(i => i.w === 0).length === 0);

console.log('\n== Sem sobreposição entre nav do site e HUD ==');
const boxes = await page.evaluate(() => {
  const g = s => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { t: r.top, b: r.bottom, l: r.left, r: r.right, w: r.width, h: r.height }; };
  return { nav: g('#site-nav'), topbar: g('.citadel-topbar'),
           left: g('.citadel-hud-left'), right: g('.citadel-hud-right'), foot: g('.citadel-footer') };
});
const overlap = (a, b) => a && b && a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
t('topbar abaixo do site-nav', boxes.topbar && boxes.nav && boxes.topbar.t >= boxes.nav.b - 1,
  boxes.topbar ? `topbar.top=${Math.round(boxes.topbar.t)} nav.bottom=${Math.round(boxes.nav.b)}` : 'ausente');
t('painel esquerdo não colide com o nav', !overlap(boxes.left, boxes.nav));
t('painel direito não colide com o nav', !overlap(boxes.right, boxes.nav));
t('painel esquerdo não colide com a topbar', !overlap(boxes.left, boxes.topbar));
t('painel direito não colide com a topbar', !overlap(boxes.right, boxes.topbar));

console.log('\n== Painéis dentro da viewport ==');
for (const [name, b] of Object.entries({ esquerdo: boxes.left, direito: boxes.right, rodapé: boxes.foot })) {
  if (!b) { t('painel ' + name + ' existe', false); continue; }
  t(`painel ${name} dentro da tela`, b.l >= -1 && b.r <= 1601 && b.b <= 901,
    `l=${Math.round(b.l)} r=${Math.round(b.r)} b=${Math.round(b.b)}`);
}

console.log('\n== Sem rolagem horizontal ==');
const sw = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
t('scrollWidth <= clientWidth', sw.s <= sw.c + 1, `${sw.s} vs ${sw.c}`);

console.log('\n== Marcadores do mapa ==');
const marks = await page.$$eval('.wm-marker', els => els.map(e => {
  const r = e.getBoundingClientRect();
  return { id: e.dataset.territory, x: Math.round(r.left + r.width/2), y: Math.round(r.top + r.height/2), w: Math.round(r.width) };
}));
t('seis marcadores renderizados', marks.length === 6, 'achou ' + marks.length);
for (const m of marks) {
  t(`marcador ${m.id} visível na tela`, m.x > 0 && m.x < 1600 && m.y > 0 && m.y < 900, `x=${m.x} y=${m.y}`);
}

console.log('\n== A arte carregou ==');
const art = await page.$eval('.wm-art img', e => ({ src: e.getAttribute('src'), nw: e.naturalWidth, fell: e.dataset.fellBack }));
t('imagem da cidadela carregou', art.nw > 0, JSON.stringify(art));
t('usa a arte definitiva (sem fallback)', !art.fell, art.src);

console.log('\n== Interação: abrir um território ==');
await page.click('.wm-marker[data-territory="2"]');
await page.waitForTimeout(1400);
const after = await page.evaluate(() => ({
  focused: document.querySelector('.wm-stage')?.classList.contains('is-focused'),
  modal: document.querySelector('#jw-modal-backdrop')?.classList.contains('open'),
  title: document.querySelector('#jw-modal-title')?.textContent?.trim(),
  badge: document.querySelector('#badge-slot-2')?.classList.contains('unlocked')
}));
t('mapa entrou em foco', after.focused === true);
t('painel do território abriu', after.modal === true);
t('título preenchido', !!after.title, after.title);
t('etapa marcada como concluída', after.badge === true);

await page.screenshot({ path: 'tests/shot-citadel.png' });
console.log('\n  screenshot: tests/shot-citadel.png');

await browser.close();
console.log('\n---------------------------------------');
console.log(`  ${pass} passaram, ${fail} falharam\n`);
process.exit(fail ? 1 : 0);
