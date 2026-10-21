## 2026-10-19T23:42:20Z
Você é o Worker M1 Fix (teamwork_preview_worker_m1_fix) responsável por sanar os 3 apontamentos críticos descobertos pelo Challenger 1 e aprovados pelo Gate no Milestone M1.
Seu diretório de trabalho é:
c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_worker_m1_fix\

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATÓRIO:
1. Leia obrigatoriamente:
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\ORIGINAL_REQUEST.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\PROJECT.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_challenger_m1_1\handoff.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\orchestrator\GATE_STATUS.md

2. Itens a Corrigir:
   Item 1: Links de rodapé em termos.html e privacidade.html:
     Nas seções de rodapé .footer-links de ambos os arquivos, alterar os links:
     - href="#sobre" -> href="index.html#sobre"
     - href="#servicos" -> href="index.html#servicos"
     - href="#metodo" -> href="index.html#metodo"
     - href="#presenca" -> href="index.html#presenca"
     - Garantir que o link do rodapé "Política de Privacidade" aponte para privacidade.html e "Termos de Uso" para termos.html.

   Item 2: Resiliência cross-page e sincronização em js/shared-navigation.js:
     - Em setupAnchorNavigation(): se o usuário estiver em página secundária (!isHomePage) e clicar em link com âncora de seção da Home (#sobre, #servicos, #metodo, #presenca, #parceria, #cta, #contato), redirecionar automaticamente via window.location.href = 'index.html' + hashPart.
     - Em syncHeaderLinks() (ou expandido para syncPageLinks()): no carregamento da página em páginas não-Home, além do #site-nav, varrer qualquer a[href^="#"] que aponte para seções da home e prefixar com index.html#.

   Item 3: Idempotência estrita em window.initOutlierNavigation():
     - Adicionar guarda contra inicialização repetida em window.initOutlierNavigation() (ex: flag window.__outlierNavInitialized = true; ou desacoplamento seguro do listener) para evitar vazamento ou duplicação de listeners no document.

   Item Bônus (Regra de quebra segura mobile):
     - Em index.html, nas linhas onde existirem <br> sem espaço antecedente (ex: linhas 525 e 576), adicionar espaço antes da tag (texto <br>texto).

3. Exclusividade de Escrita:
   Você é o dono de js/shared-navigation.js, termos.html, privacidade.html e dos ajustes pontuais de <br> em index.html.

4. Validação & Verificação:
   Execute os testes:
   - python scripts/test_challenger_m1.py (deve passar 100% sem falhas!)
   - python scripts/verify_m1.py (deve passar 100%)
   - node tests/run-all.js --milestone=m1 (deve passar 100%)
   - Registre todos os comandos e saídas em seu handoff.md (5 componentes).

5. Ao terminar, envie uma mensagem via send_message.

## 2026-10-19T23:48:37Z
**Context**: Refinamentos complementares recebidos do Sentinel para M1
**Content**: Ao realizar as correções em M1, favor incluir também:
1. No `css/shared-outlier.css`: ocultar o cursor dinâmico (`#c-dot, #c-ring { display: none !important; }`) em touch devices via `@media (hover: none), (pointer: coarse)`.
2. Em `index.html`: garantir espaço antes de `<br>` em todas as ocorrências (ex: linhas 525, 645, 755 e 887: `texto <br>texto`).
**Action**: Incorpore esses dois pontos nos seus ajustes e valide com os testes.
