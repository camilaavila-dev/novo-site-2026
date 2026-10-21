# BRIEFING — 2026-10-20T01:30:00Z

## Mission
Eliminar jargões herméticos, frios ou confusos em simulador.html e js/simulador-visual-fx.js, substituindo por uma linguagem nobre, simples, humana e cristalina que qualquer pessoa entende em 1 segundo.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_worker_copy_humanizer\
- Original parent: 971a465a-16b6-43b8-a7b3-fb44ff80c9f4
- Milestone: m2-copy-humanization

## 🔒 Key Constraints
- Arquivos sob posse exclusiva: `simulador.html` e `js/simulador-visual-fx.js`
- NUNCA alterar IDs ou classes dos elementos HTML (#hud-ano-soberania, #hud-patrimonio-real, #hud-renda-passiva, #hud-fee-delta, #hud-narrative, etc.)
- Regra de espaço antes de `<br>` (ex: `texto <br>texto`)
- Garantir aprovação em:
  * `node tests/run-all.js --milestone=m2` (13/13 PASS)
  * `node tests/run-all.js` (83/83 PASS)
  * `node .agents/teamwork/teamwork_preview_reviewer_m2_2/audit_simulador_layout.js` (0 transbordamentos)
  * Regra de espaço antes de `<br>` (0 violações)
- Sempre conversar em português do Brasil
- Não usar cheats, dummy implementations ou hardcoded mocks

## Current Parent
- Conversation ID: 971a465a-16b6-43b8-a7b3-fb44ff80c9f4
- Updated: 2026-10-20T01:30:00Z

## Task Summary
- **What to build**: Humanização integral de copy, bidirecionalidade de inputs no teclado e layout cockpit Bento Grid compacto.
- **Success criteria**:
  - Eliminação de jargões técnicos frios (ex: Fee-Drag, Crossover, SWR 3,5%, Fase de Acumulação Acelerada, Soberania Viva Alcançada).
  - Substituição por termos nobres, transparentes, didáticos e calorosos.
  - Zero quebras de layout ou transbordamentos em mobile/desktop (320px, 390px, 430px, 1440px).
  - 83/83 testes passando.
- **Interface contracts**: Preservação estrita de seletores DOM, atributos e APIs.
- **Code layout**: `simulador.html` na raiz, `js/` para lógica e visual, `css/` para estilos.

## Key Decisions Made
- Substituição do badge do astrolábio por "CONSTRUINDO SUA RENDA MENSAL" e "✦ LIBERDADE FINANCEIRA ALCANÇADA".
- Campos de exibição `#disp-p0`, `#disp-pmt`, `#disp-anos`, `#disp-despesa` convertidos em `<input>` com two-way data binding em tempo real.
- Bento Grid com Astrolábio horizontal compacto (140px) ao lado dos 4 KPIs, e gráfico de 220px de altura para acomodação em tela única no desktop.
- `pointer-events: none !important;` aplicado a todos os elementos de fundo para zero interceptação de cliques.

## Artifact Index
- `.agents/teamwork/teamwork_preview_worker_copy_humanizer/DISPATCH.md` — Assignment from orchestrator
- `.agents/teamwork/teamwork_preview_worker_copy_humanizer/BRIEFING.md` — Agent memory
- `.agents/teamwork/teamwork_preview_worker_copy_humanizer/progress.md` — Progress heartbeat
- `.agents/teamwork/teamwork_preview_worker_copy_humanizer/handoff.md` — Final handoff report

## Change Tracker
- **Files modified**:
  - `simulador.html`: Humanização de copy, inputs digitáveis bidirecionais, bento grid layout
  - `js/simulador-visual-fx.js`: Badges, métricas, narrativas e crises humanizadas
  - `js/simulador-core.js`: Two-way data binding teclado <-> slider, narrativa do HUD, tooltips do gráfico
  - `css/simulador.css`: Bento grid desktop, correção de sintaxe `#sim-chart`, regras responsivas mobile/tablet
- **Build status**: 83/83 PASS em `node tests/run-all.js`
- **Pending issues**: None

## Quality Status
- **Build/test result**: 13/13 M2 PASS, 83/83 Full PASS
- **CDP Layout Audit**: 0 transbordamentos em 320px, 390px, 430px e 1440px
- **Lint status**: 0 violações de espaço antes de `<br>`
- **Tests added/modified**: Cobertura existente preservada 100%

## Loaded Skills
- None
