#!/usr/bin/env node
/**
 * MASTER DETERMINISTIC TEST RUNNER CLI
 * Leonardo Arruda 2026+ Outlier Web Ecosystem ("Site do Futuro")
 * 
 * Uso:
 *   node tests/run-all.js
 *   node tests/run-all.js --tier=1
 *   node tests/run-all.js --milestone=m1
 *   node tests/run-all.js --mode=strict
 */

const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const { getMilestoneStatus, ROOT_DIR } = require('./helpers/env');

// Parse argumentos CLI
const args = process.argv.slice(2);
let tierFilter = null;
let milestoneFilter = null;
let isStrict = args.includes('--strict') || args.includes('--final');
let isVerbose = args.includes('--verbose') || args.includes('-v');

for (const arg of args) {
  if (arg.startsWith('--tier=')) {
    tierFilter = arg.split('=')[1].trim();
  }
  if (arg.startsWith('--milestone=')) {
    milestoneFilter = arg.split('=')[1].trim().toLowerCase();
  }
}

// Mapeamento de marcos para arquivos de teste
const MILESTONE_TEST_MAP = {
  baseline: [
    'tests/tier1-features/f01-home-baseline.test.js',
    'tests/tier1-features/f02-design-system.test.js',
    'tests/tier1-features/f03-navigation.test.js',
    'tests/tier1-features/f05-footer-links.test.js',
    'tests/tier1-features/f25-linktree.test.js',
    'tests/tier1-features/f26_f28-geo-seo.test.js',
    'tests/tier1-features/f29-mobile-ergonomics.test.js',
    'tests/tier2-boundary/*.test.js',
    'tests/tier3-cross-feature/*.test.js'
  ],
  m1: [
    'tests/tier1-features/f02-design-system.test.js',
    'tests/tier1-features/f03-navigation.test.js',
    'tests/tier1-features/f04-mobile-dock.test.js',
    'tests/tier1-features/f05-footer-links.test.js',
    'tests/tier2-boundary/touch-targets-spacing.test.js',
    'tests/tier3-cross-feature/navigation-matrix.test.js'
  ],
  m2: [
    'tests/tier1-features/f06_f11-simulador.test.js',
    'tests/tier2-boundary/math-extremes.test.js'
  ],
  m3: [
    'tests/tier1-features/f12_f16-raiox.test.js',
    'tests/tier2-boundary/math-extremes.test.js',
    'tests/tier3-cross-feature/quiz-to-consultation-url.test.js'
  ],
  m4: [
    'tests/tier1-features/f17_f21-editorial.test.js',
    'tests/tier2-boundary/format-resilience.test.js',
    'tests/tier3-cross-feature/executive-quant-toggle.test.js',
    'tests/tier4-scenarios/journey-executive-reader.test.js'
  ],
  m5: [
    'tests/tier1-features/f22_f24-home-blocks.test.js',
    'tests/tier1-features/f25-linktree.test.js',
    'tests/tier4-scenarios/journey-full-conversion.test.js',
    'tests/tier4-scenarios/journey-mobile-first.test.js'
  ],
  m6: [
    'tests/tier1-features/f26_f28-geo-seo.test.js',
    'tests/tier1-features/f29-mobile-ergonomics.test.js'
  ],
  m7: [
    'tests/**/*.test.js'
  ]
};

// Determina os arquivos a executar
let targetGlobs = [];

if (milestoneFilter && MILESTONE_TEST_MAP[milestoneFilter]) {
  targetGlobs = MILESTONE_TEST_MAP[milestoneFilter];
} else if (tierFilter) {
  const tierFolderMap = {
    '1': 'tests/tier1-features/*.test.js',
    '2': 'tests/tier2-boundary/*.test.js',
    '3': 'tests/tier3-cross-feature/*.test.js',
    '4': 'tests/tier4-scenarios/*.test.js'
  };
  targetGlobs = [tierFolderMap[tierFilter] || 'tests/**/*.test.js'];
} else {
  targetGlobs = ['tests/**/*.test.js'];
}

// Banner do Terminal
console.log('\x1b[35m' + '═'.repeat(74) + '\x1b[0m');
console.log('\x1b[1m\x1b[32m  LEONARDO ARRUDA 2026+ — E2E TEST SUITE RUNNER (4 TIERS)\x1b[0m');
console.log('\x1b[36m  Paradigma: Client-Side Determinístico · Zero-Deps Node v22 Runner\x1b[0m');
console.log('\x1b[35m' + '═'.repeat(74) + '\x1b[0m');

const status = getMilestoneStatus();
console.log(`\x1b[33mModo de Execução:\x1b[0m ${isStrict ? '\x1b[31mESTRITO (M7 Final Gate)\x1b[0m' : '\x1b[32mPROGRESSIVO (Desenvolvimento)\x1b[0m'}`);
if (milestoneFilter) console.log(`\x1b[33mFiltro de Marco:\x1b[0m ${milestoneFilter.toUpperCase()}`);
if (tierFilter) console.log(`\x1b[33mFiltro de Tier:\x1b[0m Tier ${tierFilter}`);

console.log('\n\x1b[1mStatus dos Marcos do Ecossistema:\x1b[0m');
for (const [m, s] of Object.entries(status)) {
  const icon = s.ready ? '\x1b[32m✔ CONCLUÍDO\x1b[0m' : '\x1b[33m⏳ PENDENTE\x1b[0m';
  console.log(`  • ${m.toUpperCase().padEnd(10)} [${s.present}/${s.total} arquivos] ${icon}`);
}
console.log('\x1b[35m' + '─'.repeat(74) + '\x1b[0m\n');

// Monta os argumentos para node --test
const nodeTestArgs = ['--test'];
if (isStrict) {
  process.env.TEST_MODE = 'strict';
} else {
  process.env.TEST_MODE = 'progressive';
}

for (const glob of targetGlobs) {
  nodeTestArgs.push(glob);
}

const child = spawn(process.execPath, nodeTestArgs, {
  cwd: ROOT_DIR,
  stdio: 'inherit',
  env: process.env
});

child.on('close', (code) => {
  console.log('\n\x1b[35m' + '═'.repeat(74) + '\x1b[0m');
  if (code === 0) {
    console.log('\x1b[1m\x1b[32m  ✔ SUÍTE E2E EXECUTADA COM SUCESSO (0 FALHAS)\x1b[0m');
  } else {
    console.log('\x1b[1m\x1b[31m  ✖ FALHA DETECTADA NA SUÍTE DE TESTES\x1b[0m');
  }
  console.log('\x1b[35m' + '═'.repeat(74) + '\x1b[0m\n');
  process.exit(code);
});
