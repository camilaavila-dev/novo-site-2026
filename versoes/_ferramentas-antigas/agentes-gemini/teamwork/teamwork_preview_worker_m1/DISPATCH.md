## 2026-10-19T23:18:44Z
Você é o Worker M1 responsável por implementar o Milestone 1: Shared Outlier Design System, Navegação Unificada e Mobile Bottom Floating Dock.
Seu diretório de trabalho é:
c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_worker_m1\

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATÓRIO:
1. Leia obrigatoriamente:
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\ORIGINAL_REQUEST.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\PROJECT.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_explorer_survey_1\report.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_spec_miner_survey_3\report.md

2. Escopo do Milestone M1:
   - Criar css/shared-outlier.css:
     - Tokens completos de cores (--bg:#04020C, violetas --vio, esmeraldas --grn, pergaminho --txt, etc.), tipografia (Cormorant Garamond, DM Sans, JetBrains Mono).
     - Estilos inspirados em Omshiva.ai / Astra: halos luminescentes, glassmorphism (backdrop-filter: blur(24px)), gradientes com máscara, bordas sutis.
     - Estilos da Mobile Bottom Floating Dock (fixa na base, centralizada, 5 botões: Home, Simulador, Raio-X, Radar, Agendar, com touch targets >= 48px, badges e efeitos táteis para a zona do polegar em smartphones 390x844 e 430x932).
     - Regras de quebra de linha segura mobile: garantir que <br> tenha espaço antes (texto <br>texto).
     - Utilitários globais de telemetria e botões HUD.
   - Criar js/shared-navigation.js:
     - Inicializador window.initOutlierNavigation(options):
       - Injeta ou sincroniza o Mobile Bottom Floating Dock em qualquer página.
       - Marca automaticamente o link ativo baseado no pathname atual.
       - Manipula scroll suave e links âncora cruzados (index.html#servicos, etc.).
   - Atualizar index.html:
     - Incluir a referência a css/shared-outlier.css e js/shared-navigation.js.
     - Corrigir o débito de links do rodapé (linha 1197-1198): link "Política de Privacidade" deve ir para privacidade.html e "Termos de Uso" para termos.html.
     - Preservar 100% das 15 seções existentes de index.html.
   - Atualizar termos.html e privacidade.html:
     - Incluir css/shared-outlier.css e js/shared-navigation.js.
     - Corrigir links do menu que apontavam para âncoras locais inexistentes para apontar para index.html#sobre, index.html#servicos, etc.

3. Exclusividade de Escrita:
   Você é o dono exclusivo de:
   - css/shared-outlier.css
   - js/shared-navigation.js
   - Modificações pontuais de navegação e rodapé em index.html, termos.html, privacidade.html.
   NÃO crie ou altere ainda simulador.html, raiox.html, blog.html ou data/editorial.js.

4. Validação & Verificação:
   - Execute testes e validações com seus próprios comandos/scripts (ex: sintaxe CSS/JS, tags abertas/fechadas, links válidos, ausência de erros).
   - Documente todos os comandos e resultados em seu handoff report (5 componentes).

5. Ao terminar, envie uma mensagem via send_message com o resumo e caminho do seu handoff.md.
