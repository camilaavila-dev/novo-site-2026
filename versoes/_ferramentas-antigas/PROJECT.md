# Project: Leonardo Arruda 2026+ Outlier Web Ecosystem ("Site do Futuro")

## Architecture
- **Paradigma:** Client-Side Determinístico de Alta Performance (Zero dependência de servidor Node/React em runtime, 100% estático HTML5 / CSS3 / Vanilla JS).
- **Design System ("Nerd com Pose de Elite" / Astra / Omshiva.ai):**
  - Paleta: Obsidiana (`--bg:#04020C`, `--s1:#080517`, `--s2:#0B071A`, `--s3:#130E28`), Violeta Luminescente (`--vio:#3B36CC`, `--vio2:#6B66E8`, `--vio3:#1B1762`), Esmeralda Neon (`--grn:#1CD98A`, `--grn2:#23F09A`), Pergaminho Nobre (`--txt:#EDE8D5`), Texto Mudo (`--mut:#9590B0`, `--sub:#524E6A`).
  - Tipografia: Editorial de Luxo (`Cormorant Garamond`), Interface Moderna (`DM Sans`), Telemetria HUD / Quant (`JetBrains Mono`).
  - Efeitos: Halos de luz luminescentes, máscaras de gradiente suave (`mask-image`), backdrop blur (`backdrop-filter: blur(20px)`), telemetria tátil com dados em tempo real.
- **Topologia de Páginas:**
  1. `index.html`: Home institucional evoluída com 15 seções originais 100% preservadas + 3 novos blocos gamificados (Preview Raio-X, Vitrine Simulador, Radar Macro) + Top Navigation unificada + Mobile Bottom Floating Dock.
  2. `simulador.html`: Laboratório de Calculadoras & Simulador de Aposentadoria / Soberania Financeira (Fisher, SWR 3,5%, Fee-Drag delta, anos de liberdade ganhos, sliders táteis, gráfico dinâmico em SVG/Canvas nativo).
  3. `raiox.html`: Jornada Gamificada "Raio-X & Arquétipo Patrimonial" (Quiz executivo em 5 etapas, 5 dimensões de blindagem, Score 0-100, Radar de 5 eixos SVG, 5 arquétipos, gargalos ocultos, CTA pré-parametrizado).
  4. `blog.html`: Terminal Editorial Interativo (Radar Macroeconômico semanal com 5 métricas + sentimento, alternador Executivo vs. Nerd/Quant, callout "O que muda no seu patrimônio?", dados declarativos em `data/editorial.js`, filtro de temas e captura de newsletter).
  5. `linktree.html`, `termos.html`, `privacidade.html`: Atualizados com navegação consistente, links de rodapé corrigidos e metadados.
- **Camada GEO & AI Search:**
  - `llms.txt`: Documentação semântica para LLMs/SearchGPT/Perplexity.
  - `sitemap.xml`: Rotas completas do ecossistema.
  - Schema.org JSON-LD: Entidades `Person`, `FinancialService`, `SoftwareApplication`, `BlogPosting` e `FAQPage`.
- **Ergonomia Mobile para Telas Grandes (390x844 e 430x932):**
  - Mobile Bottom Floating Dock na zona do polegar (Thumb Zone).
  - Touch targets >= 48px, zero scroll horizontal (`scrollWidth <= clientWidth`).
  - Regra de quebra segura mobile: sempre espaço antes de `<br>` (`texto <br>texto`).
  - Tratamento de transparência: arquivos nativos com canal alfa limpo em `midias/` (sem filtros SVG em CSS).
- **Wow-Factor & Scrollytelling Architecture (Astra / Omshiva.ai Overhaul — Ruptura Radical):**
  - `simulador.html`: Astrolábio / Núcleo 3D de Soberania (Three.js/WebGL/Canvas 3D) com anéis orbitais e partículas reativas em tempo real + **Wargame de Crises Interativo** (linha do tempo onde o usuário dispara choques reais: Cisne Negro, Choque Selic, Inflação Global e Liquidez M&A, vendo a fortaleza patrimonial reagir e se blindar dinamicamente).
  - `raiox.html`: **Lente Física de Raio-X & Escaneamento Visual Tátil** (feixe de laser luminoso e decodificação tátil da anatomia patrimonial pelos 5 Territórios, com escudo 3D concêntrico que se constrói e desmascara gargalos ocultos).
  - `index.html`: **Mapa Espacial Panorâmico ("A Fortaleza Patrimonial · 4 Territórios & 16 Estruturas")** em tela cheia explorável por coordenadas interativas `[01]` a `[16]`, com spotlight dinâmico, zoom e cards 3D, superando qualquer layout tradicional de fintech.
  - `blog.html`: **Observatório Macroeconômico 3D** com globo/malha de dados e ondas de frequência reativas, tipografia editorial monumental e scrollytelling.
  - *Preservação Obrigatória:* Manter 100% dos contratos JS (`window.OutlierSimulador`, `window.OutlierRaioX`, `window.EDITORIAL_DATA`) e seletores de teste E2E intactos.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F01 | Preservação Baseline Home | Preservar 100% das 15 seções aprovadas do checkpoint Git `v1-checkpoint-aprovado` | M1 / M5 | Survey Explorer 1 / Baseline |
| F02 | Design System & Tokens Unificados | CSS compartilhado (`css/shared-outlier.css`) com tokens, halos, gradientes e tipografia | M1 | Survey Explorer 1 & Omshiva.ai |
| F03 | Navegação Superior Unificada | Header com branding, badges e links absolutos/relativos consistentes em todas as páginas | M1 | Survey Explorer 1 |
| F04 | Mobile Bottom Floating Dock | Dock tátil inferior glassmorphism na zona do polegar para telas grandes (Home, Simulador, Raio-X, Blog, CTA) | M1 | Survey Explorer 1 & Spec Miner 3 |
| F05 | Correção de Links & Débitos de Rodapé | Correção de links de privacidade/termos em `index.html` e links cruzados em `termos.html`/`privacidade.html` | M1 | Survey Explorer 1 |
| F06 | Motor Matemático de Liberdade Financeira | Cálculo exato de taxa real via Equação de Fisher ($r_{real} = \frac{1+r_{nom}}{1+i_{inf}} - 1$) e SWR (3,5%) | M2 | Survey Explorer 2 |
| F07 | Cálculo do Ano da Soberania Financeira | Crossover point analítico em que o rendimento real do patrimônio cobre os gastos mensais | M2 | Survey Explorer 2 |
| F08 | Modelagem do Delta Fee-Based vs Tradicional | Comparativo determinístico do Fee Drag ($c_{trad} \approx 2,0\%$ vs $c_{fee} \approx 0,7\%$) e projeção patrimonial | M2 | Survey Explorer 2 |
| F09 | Tradução em "Anos de Liberdade Ganhos" | Métrica humana de tempo de vida economizado pela eficiência de custos fiduciária | M2 | Survey Explorer 2 |
| F10 | Sliders Táteis com Display Monospace | Controles de alta sensibilidade para $P_0$, aporte mensal, despesa meta, taxa e anos com display JetBrains Mono | M2 | Survey Explorer 2 |
| F11 | Gráfico Interativo de Acumulação / Soberania | Renderização viva em Canvas/SVG nativo com curva de patrimônio, crossover e scrubbing | M2 | Survey Explorer 2 |
| F12 | Quiz Executivo Raio-X em 5 Etapas | Fluxo de 5 cards táteis sem atrito cobrindo as 5 dimensões de blindagem patrimonial | M3 | Survey Explorer 2 |
| F13 | Algoritmo de Score de Blindagem (0-100) | Pontuação global ponderada baseada nas respostas das 5 dimensões | M3 | Survey Explorer 2 |
| F14 | Taxonomia de 5 Arquétipos de Investidor | Mapeamento dinâmico: Construtor Exposto, Patriarca Tradicionalista, Acumulador Ineficiente, Estrategista em Transição, Soberano Blindado | M3 | Survey Explorer 2 |
| F15 | Radar Pentagonal de 5 Eixos SVG Nativo | Visualização geométrica interativa com malha pentagonal, eixos trigonométricos e preenchimento animado | M3 | Survey Explorer 2 |
| F16 | Detecção de Gargalos & CTA Customizado | Identificação dos 2 maiores gaps e botão de agendamento com parâmetros pré-preenchidos para reunião | M3 | Survey Explorer 2 |
| F17 | Estrutura Declarativa de Dados Editoriais | Arquivo desacoplado `data/editorial.js` (`window.EDITORIAL_DATA`) permitindo atualização semanal trivial | M4 | Survey Spec Miner 3 |
| F18 | Termômetro Macroeconômico da Semana | HUD com Selic, IPCA, Dólar, S&P 500, Ibovespa e medidor de sentimento de mercado (0-100) | M4 | Survey Spec Miner 3 |
| F19 | Alternador "Resumo Executivo" vs "Visão Quant" | Toggle tátil por edição alternando entre síntese de 1 min e análise matemática aprofundada do Leo | M4 | Survey Spec Miner 3 |
| F20 | Callout "O que isso muda no seu patrimônio?" | Seção tátil em 4 quadrantes (Renda Fixa, Ações, Dólar/Offshore, Imobiliário) | M4 | Survey Spec Miner 3 |
| F21 | Filtro de Edições & Captura VIP Newsletter | Busca/filtro por tags/categorias e formulário de assinatura da newsletter | M4 | Survey Spec Miner 3 |
| F22 | Bloco Home A: Preview Raio-X Patrimonial | Módulo gamificado inserido entre Seção 7 e 8 da Home convidando ao diagnóstico | M5 | Survey Explorer 1 |
| F23 | Bloco Home B: Vitrine Simulador de Liberdade | Módulo interativo inserido entre Seção 9 e 10 com mini-simulação de anos de liberdade | M5 | Survey Explorer 1 |
| F24 | Bloco Home C: Radar da Semana & Newsletter | Vitrine editorial inserida entre Seção 12 e 13 conectada aos dados de `data/editorial.js` | M5 | Survey Explorer 1 |
| F25 | Atualização do Linktree | `linktree.html` atualizado com as novas rotas do ecossistema e visual alinhado ao padrão 2026+ | M5 | Survey Explorer 1 |
| F26 | Otimização GEO `llms.txt` Expandido | Documentação semântica em Markdown estruturado para motores de busca de IA | M6 | Survey Spec Miner 3 |
| F27 | Schemas Schema.org JSON-LD Unificados | Marcação semântica com Person, FinancialService, SoftwareApplication, BlogPosting, FAQPage em todas as páginas | M6 | Survey Spec Miner 3 |
| F28 | Sitemap XML Completo | `sitemap.xml` atualizado com todas as rotas canônicas e prioridades | M6 | Survey Spec Miner 3 |
| F29 | Validação de Acessibilidade & Mobile Viewports | Zero overflow horizontal em 390x844 e 430x932, touch targets >= 48px, espaço antes de `<br>` | M6 / M7 | Survey Spec Miner 3 & Rules |
| F30 | E2E Test Suite & Adversarial Hardening | Suíte de testes automatizados Tiers 1-4 passando 100% + Hardening adversarial Tier 5 | M7 | Dual Track Test Infra |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Shared Outlier Design System & Navigation Dock | `css/shared-outlier.css`, `js/shared-navigation.js`, header unificado e Bottom Floating Dock para mobile | none | DONE (Aprovado em Gate Iteração 2; 26/26 testes E2E pass) |
| M2 | Simulador de Aposentadoria & Soberania Financeira | `simulador.html`, `js/simulador-core.js`, `css/simulador.css` (F06, F07, F08, F09, F10, F11) | M1 | DONE (Aprovado em Gate Iteração 2; 13/13 testes de M2 pass, zero transbordamentos mobile, Fisher/SWR/Canvas calibrados) |
| M3 | Jornada Gamificada Raio-X & Arquétipo Patrimonial | `raiox.html`, `js/raiox-core.js`, `css/raiox.css` (F12, F13, F14, F15, F16) | M1 | DONE (Aprovado em Gate Iteração 2; 15/15 testes de M3 pass, 83/83 globais, zero transbordamentos em 9 viewports, cockpit zero-scroll desktop e textos humanos) |
| M4 | Terminal Editorial Interativo: Radar & Newsletter | `blog.html`, `data/editorial.js`, `js/blog-core.js`, `css/blog.css` (F17, F18, F19, F20, F21) | M1 | DONE (Aprovado em Gate Iteração 1; 12/12 testes de M4 pass, 88/88 globais, 0 falhas, alternador tátil e matriz de 4 quadrantes reativa) |
| M5 | Evolução Gamificada da Home & Linktree | `index.html` (15 seções preservadas + 3 blocos A, B, C + links corrigidos) e `linktree.html` (F01, F05, F22, F23, F24, F25) | M2, M3, M4 | PLANNED |
| M6 | GEO / AI Search Ready & Schemas JSON-LD | `llms.txt`, `sitemap.xml`, injeção/validação de Schema.org JSON-LD em todas as páginas (F26, F27, F28, F29) | M5 | PLANNED |
| M7 | Final Milestone: 100% E2E Test Suite & Adversarial Hardening | Execução e aprovação 100% dos testes E2E Tiers 1-4 + Fase 2 de Adversarial Hardening Tier 5 (F30) | M6, TEST_READY.md | PLANNED |

---

## Interface Contracts

### 1. Shared Navigation & Bottom Dock (`js/shared-navigation.js`)
- Inicializador global: `window.initOutlierNavigation(options)`
- Componentes injetados:
  - Header Desktop/Mobile unificado com active state dependendo da página atual (`window.location.pathname`).
  - Mobile Bottom Dock:
    ```html
    <nav class="mobile-bottom-dock" aria-label="Navegação Rápida Mobile">
      <a href="index.html" class="dock-item" data-page="home"><span class="dock-icon">✦</span><span class="dock-label">Home</span></a>
      <a href="simulador.html" class="dock-item" data-page="simulador"><span class="dock-icon">∿</span><span class="dock-label">Simulador</span></a>
      <a href="raiox.html" class="dock-item" data-page="raiox"><span class="dock-icon">◈</span><span class="dock-label">Raio-X</span></a>
      <a href="blog.html" class="dock-item" data-page="blog"><span class="dock-icon">☵</span><span class="dock-label">Radar</span></a>
      <a href="index.html#contato" class="dock-item dock-cta"><span class="dock-icon">↗</span><span class="dock-label">Agendar</span></a>
    </nav>
    ```

### 2. Motor Matemático do Simulador (`js/simulador-core.js`)
- Módulo exporta / expõe:
  ```javascript
  window.OutlierSimulador = {
    calculateRealReturn(nominalRate, inflationRate) -> Number,
    calculateAccumulation(p0, pmtMonthly, realAnnualRate, months) -> Array<{month, balance, invested, interest}>,
    calculateSovereigntyYear(p0, pmtMonthly, realAnnualRate, targetMonthlyExpense, swrRate) -> {sovereigntyMonth, sovereigntyYear, capitalAtSovereignty},
    compareFeeDrag(p0, pmtMonthly, grossNominalRate, inflationRate, feeTrad, feePortfel, months) -> {balanceTrad, balancePortfel, feeDelta, yearsOfFreedomGained}
  }
  ```

### 3. Motor do Raio-X Patrimonial (`js/raiox-core.js`)
- Módulo exporta / expõe:
  ```javascript
  window.OutlierRaioX = {
    questions: Array<QuizQuestion>,
    archetypes: Record<ArchetypeId, ArchetypeDef>,
    calculateScore(answers: Record<DimensionId, OptionIndex>) -> {
      dimensionScores: Record<DimensionId, Number>, // 0..100
      overallScore: Number, // 0..100
      archetype: ArchetypeDef,
      bottlenecks: Array<BottleneckDef>,
      consultationUrl: String
    },
    renderRadarChart(svgElementId, dimensionScores) -> void
  }
  ```

### 4. Estrutura de Dados Editorial (`data/editorial.js`)
- Estrutura global:
  ```javascript
  window.EDITORIAL_DATA = {
    macroPulse: {
      date: String,
      selic: { value: String, trend: 'neutral'|'up'|'down', note: String },
      ipca: { value: String, trend: 'neutral'|'up'|'down', note: String },
      usd: { value: String, trend: 'neutral'|'up'|'down', note: String },
      sp500: { value: String, trend: 'neutral'|'up'|'down', note: String },
      ibov: { value: String, trend: 'neutral'|'up'|'down', note: String },
      sentimentScore: Number, // 0 a 100
      sentimentLabel: String
    },
    editions: Array<{
      id: String,
      title: String,
      date: String,
      category: String,
      readTime: String,
      executiveSummary: String, // 1 min read
      quantDeepDive: String,    // Visão Nerd/Quant
      impactMatrix: {
        rendaFixa: String,
        acoes: String,
        offshore: String,
        imoveis: String
      }
    }>
  }
  ```

---

## Code Layout
```
c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\
├── index.html                  # Home evoluída (15 seções originais + 3 blocos interativos)
├── simulador.html              # Página dedicada: Laboratório de Calculadoras & Soberania Financeira
├── raiox.html                  # Página dedicada: Raio-X & Arquétipo Patrimonial com Radar SVG
├── blog.html                   # Página dedicada: Terminal Editorial & Newsletter
├── linktree.html               # Página Linktree atualizada
├── termos.html                 # Termos de uso jurídicos (links corrigidos)
├── privacidade.html            # Política de privacidade (links corrigidos)
├── llms.txt                    # Documentação para motores de resposta IA (SearchGPT, Perplexity)
├── sitemap.xml                 # Mapa de rotas do ecossistema
├── robots.txt                  # Diretivas de indexação
├── css/
│   ├── shared-outlier.css      # Design system, tokens, halos, dock inferior, utilitários
│   ├── simulador.css           # Estilos dedicados do simulador e sliders táteis
│   ├── raiox.css               # Estilos dedicados do quiz executivo e radar pentagonal
│   └── blog.css                # Estilos dedicados do radar macro e terminal editorial
├── js/
│   ├── shared-navigation.js    # Injeção de dock inferior mobile e gerenciamento de rotas
│   ├── simulador-core.js       # Matemática determinística do simulador e gráfico nativo
│   ├── raiox-core.js           # Lógica do diagnóstico, radar SVG e arquétipos
│   └── blog-core.js            # Renderização de notícias, macro pulse e alternador de leitura
├── data/
│   └── editorial.js            # Arquivo desacoplado com as análises e notícias semanais
└── midias/                     # Assets visuais limpos com canal alfa (logos, bancos, fotos)
```
