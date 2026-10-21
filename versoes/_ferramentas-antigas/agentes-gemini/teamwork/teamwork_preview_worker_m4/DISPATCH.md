## 2026-10-20T01:42:35Z
Você é o Worker M4 (teamwork_preview_worker_m4) responsável por implementar o Milestone M4: Terminal Editorial Interativo (Radar Macroeconômico & Newsletter VIP).
Seu diretório de trabalho exclusivo é:
c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_worker_m4\

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATÓRIO:
1. Leia obrigatoriamente:
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\ORIGINAL_REQUEST.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\PROJECT.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\tests\tier1-features\f17_f21-editorial.test.js

2. Arquivos sob sua Posse Exclusiva:
   - data/editorial.js
   - blog.html
   - js/blog-core.js
   - css/blog.css

3. Requisitos e Especificações Técnicas de M4 (Features F17 a F21):
   A. data/editorial.js:
      - Exportar no escopo global window.EDITORIAL_DATA = { ... }.
      - macroPulse (ou termometroMacro):
        * sentimentScore: número de 0 a 100 (ex: 68 - Otimismo Cauteloso).
        * Indicadores: Selic (10,75% a.a.), IPCA (4,12% a.a. projetado), Dólar / USD (R$ 5,42), S&P 500 (5.860 pts), Ibovespa (131.200 pts).
        * Cada indicador deve conter valor, variação semanal (+0,25%, -1,1%, etc.) e status textual.
        * Resumo em linguagem humana sobre o momento econômico.
      - editions: Array com ao menos 3 edições completas e profundas:
        * Cada edição com id (ex: 'ed-01', 'ed-02', 'ed-03'), titulo, data, categoria ('Macro & Selic', 'Offshore & Câmbio', 'Blindagem & Sucessão'), tempoLeitura ('3 min'), tags.
        * executiveSummary: Síntese acolhedora e direta de 1 minuto ("O que você precisa saber").
        * quantDeepDive: Visão analítica quantitativa do Leo com gráficos, tabelas e detalhamento técnico.
        * impactMatrix (ou oQueMudaNoPatrimonio) com os 4 quadrantes exatos:
          - rendaFixa: análise para prefixados, NTN-B e pós-fixados.
          - acoes: visão para Bolsa Brasil e ações globais.
          - offshore: estratégia para dólar, treasury e jurisdições internacionais.
          - imobiliario: impacto em fundos imobiliários (FIIs) e tijolo.

   B. blog.html:
      - Header unificado com logo, links de navegação para Home (index.html), Simulador (simulador.html), Raio-X (raiox.html), Radar (blog.html) e Contato (index.html#contato).
      - Inclusão de css/shared-outlier.css, css/blog.css, data/editorial.js, js/shared-navigation.js e js/blog-core.js.
      - Cockpit do Observatório Macroeconômico:
        * Hero cinematográfico: "Radar Macroeconômico & Inteligência Financeira".
        * Termômetro HUD no topo com as 5 métricas essenciais em JetBrains Mono e o medidor de sentimento de mercado (0 a 100).
        * Canvas de ondas de frequência cósmica (#radar-universe / Canvas 2D suave a 60fps) com pointer-events: none.
        * Edição em Destaque com o Alternador tátil (Toggle) "Resumo Executivo (1 min)" vs "Visão Quant / Nerd do Leo" que alterna o conteúdo do card sem recarregar a página.
        * Seção tátil em 4 quadrantes: "O que isso muda no seu patrimônio?" (Renda Fixa, Ações, Dólar/Offshore, Imobiliário).
        * Barra de busca e pílulas de filtro por categoria com seletores .filter-pill e atributos data-category="all|macro|offshore|blindagem".
        * Grid com as demais edições em cards com efeito de tilt e badges luminosos.
        * Bloco de Captura VIP da Newsletter: input com type="email" obrigatório, botão de inscrição com feedback tátil de confirmação e micro-copy confidencial.
        * Rodapé com links corretos e ativação da Mobile Floating Dock (#mobile-dock).
        * Regra de formatação: SEMPRE espaço antes de <br> (texto <br>texto).
        * PROIBIDO uso de filtros SVG para transparência (feColorMatrix).

   C. css/blog.css:
      - Estética Private Wealth / Astra / Omshiva.ai: obsidiana #04020C, violeta #3B36CC, esmeralda #1CD98A, pergaminho #EDE8D5.
      - Responsividade completa para desktop (1440x900) e mobile (320px a 430px).
      - Em @media (max-width: 900px): #site-nav com padding 0 16px, links desktop com display: none !important.
      - Touch targets ergonômicos >= 48px para todos os botões, tabs e inputs.
      - Zero transbordamento horizontal.

   D. js/blog-core.js:
      - Renderização dinâmica do Termômetro e das edições a partir de window.EDITORIAL_DATA.
      - Controle de alternância entre "Resumo Executivo" e "Visão Quant".
      - Filtro dinâmico por categoria e busca textual em tempo real.
      - Validação de e-mail e tratamento do envio da newsletter com feedback visual elegante.
      - Canvas atmosférico 60fps do Observatório com partículas/ondas e pointer-events: none.

4. Validação & Verificação Rigorosa:
   - Execute: node tests/run-all.js --milestone=m4 (deve passar 100% dos testes de M4!)
   - Execute: node tests/run-all.js (deve passar 88/88 testes sem nenhuma regressão!)
   - Audite quebras <br> e filtros SVG:
     node -e "const { auditSpaceBeforeBr, auditImageTransparency } = require('./tests/helpers/dom-parser.js'); const fs = require('fs'); console.log(auditSpaceBeforeBr(fs.readFileSync('blog.html','utf8'))); console.log(auditImageTransparency(fs.readFileSync('blog.html','utf8')));"
   - Crie um teste de layout mobile para blog.html verificando 320px, 390px, 430px e 1440px via Chrome CDP e comprove 0 transbordamentos.
   - Registre todos os comandos e saídas em seu handoff.md (5 componentes).

5. Ao terminar, envie uma mensagem via send_message com o resumo e o caminho do seu handoff.md.
