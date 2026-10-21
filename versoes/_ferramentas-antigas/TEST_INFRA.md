# TEST_INFRA.md — Infraestrutura & Arquitetura de Testes E2E
**Projeto:** Leonardo Arruda 2026+ Outlier Web Ecosystem ("Site do Futuro")  
**Trilha:** E2E Testing Track (Tiers 1 a 4)  
**Data:** 19 de Outubro de 2026  
**Responsável:** E2E Test Writer  
**Status:** Prontidão Completa (Ready for Milestone Execution)

---

## 1. Visão Geral & Filosofia de Testes

A infraestrutura de testes de ponta a ponta (E2E) do ecossistema Leonardo Arruda foi projetada sob o paradigma de **Testes Caixa-Preta Determinísticos (Opaque-Box)**, orientados a requisitos de produto, contratos de interface e modelagem quantitativa fiduciária.

### Princípios Cardinais:
1. **Zero Dependências Pesadas de Runtime:** Execução direta no motor nativo Node.js v22 (`node:test` e `node:assert/strict`), sem necessidade de instalar pacotes npm externos pesados (como Puppeteer, Playwright ou Chart.js), garantindo velocidade extrema (< 1,5s para toda a suíte) e 100% de reproducibilidade em qualquer máquina.
2. **Progressive Testability (Suporte ao Desenvolvimento Multi-Agente):** Durante o desenvolvimento de marcos iterativos (M1 a M6), a suíte opera em modo `--progressive` (padrão), validando integralmente os marcos concluídos e reportando marcos futuros como `[SKIP - PENDING MILESTONE]`, sem quebrar a esteira de entrega dos agentes de desenvolvimento. No marco final (M7), o modo `--strict` é ativado, exigindo 100% de presença e aprovação.
3. **Oráculo Matemático Autorizado:** Todo cálculo financeiro possui derivação formal a partir da teoria econômica clássica (Equação de Fisher, Safe Withdrawal Rate de Trinity/Bengen, Fee Drag determinístico) implementada em `tests/helpers/math-oracle.js`, servindo como verdade absoluta independente da implementação em produção.
4. **Isolamento de Escrita:** A suíte de testes possui posse exclusiva do diretório `tests/`, `TEST_INFRA.md` e `TEST_READY.md`. Jamais altera arquivos de produção (`index.html`, `css/`, `js/`, `data/`).

---

## 2. Taxonomia da Suíte de Testes (4 Tiers Sistemáticos)

A suíte cobre 100% das 30 funcionalidades do ecossistema catalogadas em `PROJECT.md § Feature Inventory`, estruturada em 4 Tiers concêntricos:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 4: USER JOURNEYS                           │
│     (Jornada Investidor Private, Leitor C-Level, Mobile Dock UX)       │
├────────────────────────────────────────────────────────────────────────┤
│                 TIER 3: CROSS-FEATURE COMBINATIONS                     │
│         (Quiz -> URL CTA, Toggle Executivo vs Quant, Matriz 404)       │
├────────────────────────────────────────────────────────────────────────┤
│                 TIER 2: BOUNDARY & CORNER CASES                        │
│    (P0=0, PMT=0, P0=50M, Hiperinflação, Viewports 390x844 / 430x932)   │
├────────────────────────────────────────────────────────────────────────┤
│                    TIER 1: FEATURE COVERAGE                            │
│     (>=5 testes por feature: Home, Simulador, Raio-X, Blog, Dock, SEO) │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Tier 1: Feature Coverage (Cobertura de Funcionalidades)
- **`tests/tier1-features/f01-home-baseline.test.js`:** Preservação integral das 15 seções aprovadas da Home e integridade da tag Git `v1-checkpoint-aprovado`.
- **`tests/tier1-features/f02-design-system.test.js`:** Declaração de tokens da paleta Obsidiana (`--bg:#04020C`), Violeta (`--vio:#3B36CC`) e Esmeralda Neon (`--grn:#1CD98A`), tipografia (`--d`, `--s`, `--m`) e efeitos analógicos de grain/cursor.
- **`tests/tier1-features/f03-navigation.test.js`:** Barra de navegação unificada (#site-nav), transição de altura e blur no scroll, links âncora e barra de progresso `#prog`.
- **`tests/tier1-features/f04-mobile-dock.test.js`:** Barra inferior tátil na zona do polegar (Thumb Zone), 5 pontos de contato, touch targets e safe-area-inset.
- **`tests/tier1-features/f05-footer-links.test.js`:** Separação e correção dos links jurídicos de Privacidade e Termos, CNPJ oficial (54.475.818/0001-90) e disclaimer da Resolução CVM nº 19/2021.
- **`tests/tier1-features/f06_f11-simulador.test.js`:** Motor matemático de liberdade financeira, Equação de Fisher, SWR (3,5%), Crossover de soberania, modelagem do Fee Drag (2,0% vs 0,7%), anos de liberdade ganhos e contrato `window.OutlierSimulador`.
- **`tests/tier1-features/f12_f16-raiox.test.js`:** Quiz executivo em 5 etapas, cálculo do Score de Blindagem (0-100), taxonomia dos 5 arquétipos, geometria analítica do Radar Pentagonal SVG nativo e contrato `window.OutlierRaioX`.
- **`tests/tier1-features/f17_f21-editorial.test.js`:** Dados declarativos `data/editorial.js` (`window.EDITORIAL_DATA`), Termômetro Macroeconômico (5 métricas + sentimento), alternador Resumo Executivo vs Visão Quant, matriz de impacto em 4 quadrantes e newsletter.
- **`tests/tier1-features/f22_f24-home-blocks.test.js`:** Inserção dos 3 novos blocos gamificados na Home (Preview Raio-X, Vitrine Simulador, Radar Editorial) preservando seções adjacentes e IDs únicos.
- **`tests/tier1-features/f25-linktree.test.js`:** Hub mobile linktree.html, badges de certificação CEA, barra de 4 métricas da Portfel (+20Bi, +25k, +700, 97 NPS) e canais oficiais.
- **`tests/tier1-features/f26_f28-geo-seo.test.js`:** Otimização para motores de IA (`llms.txt`), marcação Schema.org JSON-LD unificada (`Person`, `FinancialService`, `FAQPage`), `sitemap.xml` e `robots.txt`.
- **`tests/tier1-features/f29-mobile-ergonomics.test.js`:** Meta viewport responsiva, touch targets mínimos >= 48px, ausência de filtros SVG em imagens e conformidade estrita da regra de espaço antes de `<br>`.

### 2.2. Tier 2: Boundary & Corner Cases (Limites & Casos Extremos)
- **`tests/tier2-boundary/math-extremes.test.js`:** Comportamento com $P_0 = 0$, $PMT = 0$, patrimônio multimilionário ($P_0 = \text{R\$\,50M}$), taxas reais negativas (inflação > rendimento), meta inalcançável e pontuações polares de diagnóstico (0 e 100).
- **`tests/tier2-boundary/responsive-viewports.test.js`:** Viewports críticas de smartphones modernos (`390x844` iPhone 14/15/16 e `430x932` Pro Max), landscape mode (`max-height: 500px`) e diretivas anti-overflow.
- **`tests/tier2-boundary/touch-targets-spacing.test.js`:** Área mínima de toque em botões flutuantes (`#float-cta`), acordeão de FAQ e dock items.
- **`tests/tier2-boundary/format-resilience.test.js`:** Tolerância a edições editoriais sem visão nerd preenchida, sanitização de inputs nos sliders e serialização de query strings com caracteres especiais.

### 2.3. Tier 3: Cross-Feature Combinations (Interações Cruzadas)
- **`tests/tier3-cross-feature/quiz-to-consultation-url.test.js`:** Fluxo completo do quiz -> score global -> classificação de arquétipo -> 2 maiores gargalos -> serialização na URL de agendamento (`#contato?score=...&arq=...`) e restauração no formulário.
- **`tests/tier3-cross-feature/executive-quant-toggle.test.js`:** Filtro por categorias combinado com alternador de leitura (executivo vs quantitativo) e persistência de preferência via `localStorage`.
- **`tests/tier3-cross-feature/navigation-matrix.test.js`:** Grafo de navegação cruzada entre todas as páginas do ecossistema, verificando ausência de links quebrados (404) e suporte a Clean URLs.

### 2.4. Tier 4: Real-World Application Scenarios (Jornadas do Usuário)
- **`tests/tier4-scenarios/journey-full-conversion.test.js`:** Jornada completa do investidor Private Wealth: Descoberta na Home -> Simulação com ganho de liberdade > R$ 1 milhão -> Diagnóstico Raio-X -> Agendamento estratégico.
- **`tests/tier4-scenarios/journey-executive-reader.test.js`:** Jornada do leitor C-Level / Médico: Pulso macroeconômico -> Resumo em 1 minuto -> Consulta de impacto em 4 quadrantes -> Inscrição na Newsletter VIP.
- **`tests/tier4-scenarios/journey-mobile-first.test.js`:** Navegação tátil de um usuário navegando exclusivamente pela barra inferior mobile na viewport 390x844.

---

## 3. Como Executar os Testes

A suíte pode ser disparada diretamente pelo terminal PowerShell através do Master Test Runner CLI ou pelo comando nativo do Node.js:

### 3.1. Execução Completa (Master Runner)
```powershell
node tests/run-all.js
```

### 3.2. Execução Filtrada por Tier
```powershell
# Executa apenas testes do Tier 1 (Cobertura de Features)
node tests/run-all.js --tier=1

# Executa apenas testes do Tier 2 (Casos Limite e Extremas)
node tests/run-all.js --tier=2

# Executa apenas testes do Tier 3 (Combinações Cruzadas)
node tests/run-all.js --tier=3

# Executa apenas testes do Tier 4 (Jornadas do Usuário)
node tests/run-all.js --tier=4
```

### 3.3. Execução Filtrada por Marco de Desenvolvimento (Milestone)
```powershell
# Validação do Marco M1 (Design System & Navigation Dock)
node tests/run-all.js --milestone=m1

# Validação do Marco M2 (Simulador de Aposentadoria)
node tests/run-all.js --milestone=m2

# Validação do Marco M3 (Raio-X Patrimonial)
node tests/run-all.js --milestone=m3

# Validação do Marco M4 (Terminal Editorial & Newsletter)
node tests/run-all.js --milestone=m4

# Validação do Marco M5 (Home Gamificada & Linktree)
node tests/run-all.js --milestone=m5

# Validação do Marco M6 (GEO, AI Search & Schemas)
node tests/run-all.js --milestone=m6
```

### 3.4. Execução do Marco Final M7 (Modo Estrito / Final Gate)
```powershell
node tests/run-all.js --strict
```

### 3.5. Execução Direta pelo Test Runner Nativo do Node
```powershell
node --test tests/**/*.test.js
```

---

## 4. Oráculo de Referência & Equações Autorizadas

Todo o resultado matemático esperado é derivado de formulações canônicas:

1. **Equação de Fisher (Taxa Real Contínua):**
   $$r_{real} = \frac{1 + r_{nom}}{1 + i_{inf}} - 1$$
   *Exemplo:* $r_{nom} = 11,5\%$, $i_{inf} = 4,5\% \implies r_{real} = 6,69856\%$ a.a.

2. **Taxa Mensal Equivalente:**
   $$r_m = (1 + r_{real})^{\frac{1}{12}} - 1$$

3. **Crossover da Soberania Financeira (SWR 3,5%):**
   $$P_{soberano} = \frac{D_{meta} \times 12}{SWR}$$
   *Exemplo:* $D_{meta} = \text{R\$\,25.000}$, $SWR = 3,5\% \implies P_{soberano} = \text{R\$\,8.571.429}$.

4. **Fee Drag Comparativo:**
   - Tradicional ($c_{trad} = 2,0\%$): $r_{nom, trad} = r_{nom} - 0,020$
   - Fee-Based ($c_{fee} = 0,7\%$): $r_{nom, fee} = r_{nom} - 0,007$
   - Delta acumulado em 15 anos com $P_0 = \text{R\$\,500k}$ e $PMT = \text{R\$\,10k/mês}$: $\Delta = \text{R\$\,467.710}$ a favor do cliente.

5. **Radar Pentagonal SVG Nativo:**
   $$\theta_k = -\frac{\pi}{2} + k \cdot \frac{2\pi}{5}, \quad k \in \{0, 1, 2, 3, 4\}$$
   $$x_k = 200 + 135 \cdot \left(\frac{D_k}{100}\right) \cdot \cos(\theta_k)$$
   $$y_k = 200 + 135 \cdot \left(\frac{D_k}{100}\right) \cdot \sin(\theta_k)$$

---

## 5. Mapeamento de Arquivos da Suíte de Testes

```
tests/
├── helpers/
│   ├── env.js                      # Configuração de caminhos, ambiente e status dos marcos
│   ├── math-oracle.js              # Oráculo de referência matemática e algoritmos quantitativos
│   ├── dom-parser.js               # Parser estático de HTML, CSS, JSON-LD e quebras <br>
│   └── mock-browser.js             # Ambiente de simulação leve de browser (window, document, storage)
├── tier1-features/
│   ├── f01-home-baseline.test.js   # F01: 15 seções originais da Home e tag v1-checkpoint-aprovado
│   ├── f02-design-system.test.js   # F02: Tokens de design, cores Obsidian/Violet/Emerald e fontes
│   ├── f03-navigation.test.js      # F03: Top navigation unificada, scroll effect e barra de progresso
│   ├── f04-mobile-dock.test.js     # F04: Mobile Bottom Floating Dock na zona do polegar
│   ├── f05-footer-links.test.js    # F05: Resolução de débitos em rodapé, termos e privacidade
│   ├── f06_f11-simulador.test.js   # F06-F11: Simulador, Fisher, SWR, Fee Drag e gráficos
│   ├── f12_f16-raiox.test.js       # F12-F16: Raio-X, Score 0-100, 5 arquétipos e Radar SVG
│   ├── f17_f21-editorial.test.js   # F17-F21: Terminal editorial, macro pulse, alternador de leitura
│   ├── f22_f24-home-blocks.test.js # F22-F24: Novos blocos A, B, C na Home
│   ├── f25-linktree.test.js        # F25: Linktree hub mobile e credenciais
│   ├── f26_f28-geo-seo.test.js     # F26-F28: llms.txt, sitemap.xml, Schema.org e robots.txt
│   └── f29-mobile-ergonomics.test.js # F29: Regra de espaço antes de <br>, touch targets e anti-overflow
├── tier2-boundary/
│   ├── math-extremes.test.js       # P0=0, PMT=0, P0=50M, inflação extrema, casos polares de score
│   ├── responsive-viewports.test.js # Viewports 390x844, 430x932, desktop 1440x900, landscape
│   ├── touch-targets-spacing.test.js # Dimensionamento mínimo de controles interativos (>= 48px)
│   └── format-resilience.test.js   # Resiliência diante de dados ausentes e inputs de borda
├── tier3-cross-feature/
│   ├── quiz-to-consultation-url.test.js # Cadeia quiz -> score -> arquétipo -> URL parametrizada
│   ├── executive-quant-toggle.test.js # Alternador de leitura + filtro de categorias + storage
│   └── navigation-matrix.test.js   # Matriz de links relativos e ausência de erros 404
├── tier4-scenarios/
│   ├── journey-full-conversion.test.js  # Jornada completa do investidor de alta renda
│   ├── journey-executive-reader.test.js # Jornada do leitor C-Level consumindo o radar semanal
│   └── journey-mobile-first.test.js     # Navegação completa do usuário mobile via dock inferior
└── run-all.js                      # Master CLI Test Runner com suporte a filtros e modos
```

---

## 6. Portão de Qualidade & Critérios de Conclusão

1. **Execução Determinística:** A suíte deve executar com `code 0` em tempo inferior a 2 segundos.
2. **Zero Facade Tests:** Cada teste valida comportamentos, equações ou propriedades estáticas reais.
3. **Progressão Segura:** Cada agente implementador de marco (`worker_m1`, `worker_m2`, etc.) pode rodar seu filtro de marco dedicado para verificar se suas entregas estão em conformidade antes de solicitar handoff.
4. **Final Gate:** O marco M7 exige que `node tests/run-all.js --strict` passe com 100% de aprovação e 0 skips.
