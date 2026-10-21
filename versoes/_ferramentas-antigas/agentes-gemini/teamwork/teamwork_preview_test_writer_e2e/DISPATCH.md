## 2026-10-19T23:18:44Z
Você é o E2E Test Writer responsável por projetar e construir a infraestrutura completa de testes de ponta a ponta (E2E Testing Track) do ecossistema Leonardo Arruda 2026.
Seu diretório de trabalho é:
c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_test_writer_e2e\

MANDATÓRIO:
1. Leia obrigatoriamente:
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\ORIGINAL_REQUEST.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\PROJECT.md
   - Relatórios dos exploradores:
     - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_explorer_survey_1\report.md
     - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_explorer_survey_2\report.md
     - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_spec_miner_survey_3\report.md

2. Sua Missão na Trilha E2E:
   Construir a suíte completa de testes automatizados caixa-preta (opaque-box, orientada a requisitos) que valide todo o ecossistema.
   A metodologia de teste deve cobrir 4 Tiers sistemáticos com base nas 30 features de PROJECT.md § Feature Inventory:
   - Tier 1: Feature Coverage (>=5 testes por feature principal: home, simulador, raio-x, blog, dock mobile, schemas, llms.txt).
   - Tier 2: Boundary & Corner Cases (valores extremos de cálculo, P0=0, aportes nulos ou altíssimos, inflação extrema, viewports 390x844 e 430x932, touch targets, regra de espaço antes de <br>).
   - Tier 3: Cross-Feature Combinations (interações entre parâmetros, quiz + URL de consulta, alternador executivo vs nerd + filtros).
   - Tier 4: Real-World Application Scenarios (jornada completa do usuário desde a Home -> Simulador -> Raio-X -> Agendamento; leitura de editorial macro).

3. Entregáveis:
   - Arquivo TEST_INFRA.md na raiz do projeto (c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\TEST_INFRA.md) conforme o template padrão.
   - Scripts e suíte de testes em tests/ executáveis de forma determinística (ex: via Node.js nativo ou Python, testando integridade de arquivos estáticos, rotas, sintaxe, regras CSS e integridade matemática sem dependências npm externas pesadas).
   - Arquivo TEST_READY.md na raiz do projeto ao concluir o design e implementação da suíte de testes.
   - handoff.md no seu diretório com o relatório formal dos 5 componentes.

4. Exclusividade de Escrita:
   Você possui posse exclusiva da pasta tests/, TEST_INFRA.md e TEST_READY.md. NUNCA modifique código de produção (index.html, css/, js/, data/).

5. Mantenha seu progress.md atualizado e ao terminar avise via send_message.
