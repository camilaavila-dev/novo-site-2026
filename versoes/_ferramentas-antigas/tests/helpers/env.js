/**
 * TEST ENVIRONMENT CONFIGURATION & PATH HELPERS
 * Leonardo Arruda 2026+ E2E Test Suite
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');

function resolvePath(...segments) {
  return path.resolve(ROOT_DIR, ...segments);
}

function fileExists(relPath) {
  return fs.existsSync(resolvePath(relPath));
}

function readFile(relPath) {
  const fullPath = resolvePath(relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Arquivo não encontrado: ${relPath} (esperado em ${fullPath})`);
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

function getMode() {
  if (process.env.TEST_MODE === 'strict' || process.argv.includes('--strict') || process.argv.includes('--final')) {
    return 'strict';
  }
  return 'progressive';
}

const MILESTONE_REQUIREMENTS = {
  baseline: ['index.html', 'linktree.html', 'termos.html', 'privacidade.html', 'llms.txt', 'sitemap.xml', 'robots.txt'],
  m1: ['css/shared-outlier.css', 'js/shared-navigation.js'],
  m2: ['simulador.html', 'js/simulador-core.js', 'css/simulador.css'],
  m3: ['raiox.html', 'js/raiox-core.js', 'css/raiox.css'],
  m4: ['blog.html', 'data/editorial.js', 'js/blog-core.js', 'css/blog.css'],
  m5: ['index.html', 'linktree.html'],
  m6: ['llms.txt', 'sitemap.xml'],
  m7: ['TEST_INFRA.md', 'TEST_READY.md']
};

function isMilestoneReady(milestoneKey) {
  const reqs = MILESTONE_REQUIREMENTS[milestoneKey] || [];
  return reqs.every(f => fileExists(f));
}

function getMilestoneStatus() {
  const status = {};
  for (const [key, files] of Object.entries(MILESTONE_REQUIREMENTS)) {
    const present = files.filter(f => fileExists(f));
    status[key] = {
      ready: present.length === files.length,
      total: files.length,
      present: present.length,
      missing: files.filter(f => !fileExists(f))
    };
  }
  return status;
}

module.exports = {
  ROOT_DIR,
  resolvePath,
  fileExists,
  readFile,
  getMode,
  MILESTONE_REQUIREMENTS,
  isMilestoneReady,
  getMilestoneStatus
};
