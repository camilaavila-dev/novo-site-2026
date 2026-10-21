## 2026-10-20T00:00:44Z

Você é o Worker M2 responsável por implementar o Milestone M2: Laboratório de Calculadoras & Simulador de Aposentadoria / Soberania Financeira.
Seu diretório de trabalho é:
c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_worker_m2\

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATÓRIO:
1. Leia obrigatoriamente:
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\ORIGINAL_REQUEST.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\PROJECT.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_explorer_survey_2\report.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\TEST_INFRA.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\TEST_READY.md

2. Arquivos sob sua Posse Exclusiva:
   - simulador.html
   - js/simulador-core.js
   - css/simulador.css

3. Requisitos e Especificações Técnicas de M2 (Features F06 a F11):
   - js/simulador-core.js:
     Implementar o motor de cálculo conforme Interface Contract em PROJECT.md e especificações exatas de Explorer 2 e TEST_INFRA.md:
     - calculateRealReturn(nominalRate, inflationRate): Equação de Fisher exata: ((1 + nominal) / (1 + inflation)) - 1.
     - calculateAccumulation(p0, pmtMonthly, realAnnualRate, months): Cálculo mensal discreto de acumulação composta retornando array de pontos com mês, patrimônio, total investido e juros reais acumulados.
     - calculateSovereigntyYear(p0, pmtMonthly, realAnnualRate, targetMonthlyExpense, swrRate): Cálculo do crossover point onde o capital acumulado atinge (despesa_mensal * 12) / SWR (calibrado em 3.5%).
     - compareFeeDrag(p0, pmtMonthly, grossNominalRate, inflationRate, feeTrad, feePortfel, months): Comparação determinística entre modelo tradicional (comissão ~2.0%) e modelo Fee-Based/Portfel (~0.7%), retornando saldos finais, delta patrimonial e a métrica de "anos de liberdade ganhos".
     - Gráfico interativo vivo em Canvas/SVG nativo (0kb dependências externas) com renderização das curvas de patrimônio, crossover de soberania e tooltip de scrubbing.
   - css/simulador.css:
     - Estilos dedicados no padrão Omshiva.ai / Astra / Private Wealth: cards translúcidos glassmorphism (backdrop-filter: blur(24px)), halos violeta/esmeralda, trilhos de sliders táteis com halo de foco, display de telemetria em JetBrains Mono.
     - Responsividade completa para desktop (1440x900) e smartphones de tela grande (390x844 e 430x932), garantindo touch targets >= 48px e zero overflow horizontal.
   - simulador.html:
     - Header com branding, links de navegação para Home, Raio-X, Radar, Contato.
     - Inclusão de css/shared-outlier.css e css/simulador.css.
     - Inclusão de js/shared-navigation.js e js/simulador-core.js.
     - Sliders táteis de alta precisão para: Patrimônio Atual (P0), Aporte Mensal (PMT), Despesa Mensal Desejada na Aposentadoria, Prazo de Acumulação, e Retorno Estimado vs Inflação.
     - Painéis HUD de resultado em tempo real:
       * "Ano da Soberania Financeira" (Idade / Ano exato de crossover)
       * "Patrimônio Acumulado Real (Poder de Compra de Hoje)"
       * "Renda Passiva Mensal Perpétua / SWR 3,5%"
       * "Vantagem Líquida Fee-Based" (+R$ 467k a +R$ 2M+) e "Anos de Liberdade Ganhos"
     - Gráfico vivo responsivo mostrando o momento da independência.
     - CTA contextualizado para agendamento de reunião estratégica com Leonardo Arruda.
     - Rodapé com links corretos e ativação da Mobile Bottom Floating Dock na base.
     - Regra de formatação: sempre espaço antes de <br> (texto <br>texto).

4. Validação & Verificação:
   - Execute os testes E2E do marco:
     node tests/run-all.js --milestone=m2
   - Execute a suíte completa para checar regressões:
     node tests/run-all.js
   - Registre todos os comandos e saídas em seu handoff.md (5 componentes).

5. Ao terminar, envie uma mensagem via send_message.
