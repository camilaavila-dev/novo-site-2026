## 2026-10-20T00:22:18Z
Você é o Worker M2 Fix (teamwork_preview_worker_m2_fix) responsável por sanar com precisão cirúrgica os 3 apontamentos identificados pelo Reviewer 2 e Challenger 2 no Milestone M2.
Seu diretório de trabalho é:
c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_worker_m2_fix\

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATÓRIO:
1. Leia obrigatoriamente:
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\ORIGINAL_REQUEST.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\PROJECT.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_reviewer_m2_2\handoff.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_challenger_m2_2\handoff.md

2. Itens a Corrigir:
   Item 1: Barra de Navegação Superior (#site-nav) no Mobile em css/simulador.css:
     Dentro da media query @media (max-width: 900px) (ou adicione-a se necessário):
     #site-nav {
       padding: 0 16px !important;
     }
     #site-nav div a.nav-link {
       display: none !important;
     }
     #site-nav > div {
       gap: 10px !important;
     }
     #site-nav .nav-cta {
       display: none !important;
     }
     Isso garante que em celulares de 320px a 430px os links do menu desktop não vazem para fora da tela (evitando a colisão e transbordamento até 672px).

   Item 2: Alinhamento de 5px em js/simulador-core.js:
     Na linha 310 (initEvents / handlePointer), alterar paddingLeft = 65; para paddingLeft = 70; e manter chartWidth = rect.width - paddingLeft - paddingRight;, alinhando perfeitamente a detecção do ponteiro com a renderização em render() (linha 414).

   Item 3: Evento touchstart no Canvas em js/simulador-core.js:
     Nas linhas 362-384, adicionar listener de touchstart no canvas para resposta imediata ao toque no celular:
     canvas.addEventListener('touchstart', function (e) {
       if (e.touches && e.touches[0]) {
         handlePointer(e.touches[0].clientX, e.touches[0].clientY);
       }
     }, { passive: true });

   Item 4: Touch Target das Pílulas Rápidas (.sim-pill) em css/simulador.css:
     Em @media (max-width: 900px), definir para .sim-pill:
     min-height: 40px; e padding: 8px 14px; com display: inline-flex; align-items: center; justify-content: center;, garantindo conformidade com a zona de toque do polegar.

3. Validação & Verificação:
   Execute os testes:
   - node .agents/teamwork/teamwork_preview_reviewer_m2_2/audit_simulador_layout.js (deve mostrar zero transbordamentos no mobile!)
   - node tests/adversarial-stress-m2.js (14/14 PASS)
   - node tests/run-all.js --milestone=m2 (13/13 PASS)
   - node tests/run-all.js (82/82 PASS)
   - Registre todos os comandos e saídas em seu handoff.md (5 componentes).

4. Ao terminar, envie uma mensagem via send_message.
