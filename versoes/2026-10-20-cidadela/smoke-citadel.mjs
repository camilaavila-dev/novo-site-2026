/**
 * Smoke test estático da Cidadela do Patrimônio.
 *
 * Não abre navegador: valida que o HTML, o CSS e o motor concordam entre si —
 * arquivos referenciados existem, todo ícone usado está definido, todo ID que
 * o motor procura existe na página, a API pública está completa e a home
 * institucional continua intacta.
 *
 * Uso: node tests/smoke-citadel.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

let fail = 0;
let pass = 0;

function t(name, cond, detail = '') {
  if (cond) {
    pass++;
    console.log('  PASS  ' + name);
  } else {
    fail++;
    console.log('  FAIL  ' + name + (detail ? '  -> ' + detail : ''));
  }
}

function section(title) {
  console.log('\n== ' + title + ' ==');
}

const html = readFileSync(join(root, 'index.html'), 'utf8');
const engine = readFileSync(join(root, 'js/journey-world.js'), 'utf8');
const sprite = readFileSync(join(root, 'js/world-icons.js'), 'utf8');
const mapjs = readFileSync(join(root, 'js/world-map.js'), 'utf8');

/* ------------------------------------------------------------------ */
section('Arquivos referenciados pelo index');
const refs = [...html.matchAll(/(?:href|src)="((?:css|js|midias|data)\/[^"]+)"/g)]
  .map(m => decodeURIComponent(m[1]));
for (const r of [...new Set(refs)]) {
  t('existe ' + r, existsSync(join(root, r)));
}

/* ------------------------------------------------------------------ */
section('Ordem de carga dos scripts');
const order = [...html.matchAll(/<script src="(js\/[^"]+)"/g)].map(m => m[1]);
console.log('  ' + order.join('  ->  '));
t('world-icons antes do motor',
  order.indexOf('js/world-icons.js') < order.indexOf('js/journey-world.js'));
t('world-map antes do motor',
  order.indexOf('js/world-map.js') < order.indexOf('js/journey-world.js'));

/* ------------------------------------------------------------------ */
section('Zero emoji no bloco da Cidadela');
const block = html.slice(
  html.indexOf('A CIDADELA DO PATRIM'),
  html.indexOf('<!-- HERO (V')
);
const emoji = [...block].filter(c => {
  const p = c.codePointAt(0);
  return (p >= 0x1F300 && p <= 0x1FAFF)
      || (p >= 0x2600 && p <= 0x27BF)
      || (p >= 0x2B00 && p <= 0x2BFF);
});
t('nenhum emoji', emoji.length === 0, emoji.join(' '));

/* ------------------------------------------------------------------ */
section('Ícones: todo <use> tem símbolo definido');
const defined = new Set(
  [...sprite.matchAll(/^\s*'([a-z0-9-]+)':\s*'/gm)].map(m => m[1])
);
const used = new Set(
  [...html.matchAll(/href="#ic-([a-z0-9-]+)"/g)].map(m => m[1])
);
for (const u of [...used].sort()) {
  t('#ic-' + u, defined.has(u));
}
// O motor também troca ícones em tempo de execução.
for (const u of [...engine.matchAll(/setIcon\([^,]+,\s*'([a-z0-9-]+)'\)/g)].map(m => m[1])) {
  t('#ic-' + u + ' (runtime)', defined.has(u));
}

/* ------------------------------------------------------------------ */
section('IDs que o motor procura existem no HTML');
// Só existe nas páginas dedicadas de calculadora, não no index.
const optional = new Set(['standalone-calc-suite']);
const ids = [...new Set(
  [...engine.matchAll(/getElementById\('([^']+)'\)/g)].map(m => m[1])
)];
for (const id of ids.sort()) {
  if (optional.has(id)) continue;
  t('#' + id, html.includes('id="' + id + '"'));
}

/* ------------------------------------------------------------------ */
section('Contratos públicos');
t('window.JW', /window\.JW\s*=/.test(engine));
t('window.WorldMap', /window\.WorldMap\s*=/.test(mapjs));
t('window.WorldIcons', /window\.WorldIcons\s*=/.test(sprite));

const apiStart = engine.indexOf('window.JW = {');
const apiBlock = engine.slice(apiStart, engine.indexOf('\n  };', apiStart));
const API = [
  'resetView', 'openTerritory', 'openMaskView', 'closeMaskView',
  'closeModal', 'cycleTheme', 'cycleAvatar', 'toggleAmbientMusic',
  'renderCalculatorSuite'
];
for (const fn of API) {
  t('JW.' + fn, apiBlock.includes(fn));
}

// Todo window.JW.x chamado no HTML precisa existir na API.
for (const call of new Set([...html.matchAll(/window\.JW\.([a-zA-Z]+)\(/g)].map(m => m[1]))) {
  t('JW.' + call + ' chamado no HTML existe', apiBlock.includes(call));
}

/* ------------------------------------------------------------------ */
section('CSS: classes usadas estão definidas');
const citadel = readFileSync(join(root, 'css/citadel.css'), 'utf8');
const wmap = readFileSync(join(root, 'css/world-map.css'), 'utf8');
const css = citadel + wmap;
for (const cls of [
  'citadel-stage', 'citadel-card', 'citadel-headline', 'citadel-chip',
  'citadel-badge', 'citadel-footer', 'citadel-topbar', 'citadel-nav-btn',
  'citadel-avatar', 'citadel-sound-disc', 'jw-xp-toast',
  'wm-stage', 'wm-camera', 'wm-marker', 'wm-spotlight'
]) {
  t('.' + cls, css.includes('.' + cls));
}

/* ------------------------------------------------------------------ */
section('Mapa: seis territórios calibrados');
const terr = [...mapjs.matchAll(/id:\s*(\d),\s*num:\s*'(\d\d)'/g)];
t('seis territórios', terr.length === 6, 'achou ' + terr.length);
const engineTerr = [...engine.matchAll(/id:\s*(\d),\s*num:\s*'(\d\d)'/g)];
t('motor também define seis', engineTerr.length === 6, 'achou ' + engineTerr.length);

/* ------------------------------------------------------------------ */
section('Home institucional preservada');
for (const sec of [
  'classic-site-start', 'sobre', 'servicos', 'metodo',
  'fortaleza-patrimonial', 'vitrine-simulador', 'radar-semana', 'cta'
]) {
  t('seção #' + sec, html.includes('id="' + sec + '"'));
}
t('JSON-LD preservado', html.includes('application/ld+json'));
t('sem referência ao world-journey antigo', !html.includes('world-journey'));

/* ------------------------------------------------------------------ */
console.log('\n---------------------------------------');
console.log(`  ${pass} passaram, ${fail} falharam\n`);
process.exit(fail ? 1 : 0);
