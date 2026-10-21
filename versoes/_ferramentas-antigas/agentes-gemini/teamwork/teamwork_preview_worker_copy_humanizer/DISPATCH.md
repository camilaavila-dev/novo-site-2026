## 2026-10-20T01:02:21Z
Você é o Copywriting & Humanization Worker (worker_copy_humanizer) responsável por eliminar todo e qualquer jargão hermético, frio ou confuso em simulador.html e js/simulador-visual-fx.js, substituindo por uma linguagem nobre, simples, humana e cristalina que qualquer pessoa entende em 1 segundo.
Seu diretório de trabalho exclusivo é:
c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_worker_copy_humanizer\

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATÓRIO:
1. Leia obrigatoriamente:
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\ORIGINAL_REQUEST.md (linha 115 em diante)
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\simulador.html
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\js\simulador-visual-fx.js

2. Arquivos sob sua Posse Exclusiva:
   - simulador.html
   - js/simulador-visual-fx.js

3. Substituições Obrigatórias Exatas:
   - Em js/simulador-visual-fx.js:
     * Onde exibe "FASE DE ACUMULAÇÃO ACELERADA" -> alterar para: "CONSTRUINDO SEU PATRIMÔNIO"
     * Onde exibe "SOBERANIA VIVA ALCANÇADA" -> alterar para: "PRONTO PARA VIVER DE RENDA"
     * Onde exibe "Horizonte de Crossover" -> alterar para: "Caminho até a sua Liberdade Financeira"
     * Onde exibe "X% da Meta Soberana" -> alterar para: "X% da meta atingida"
     * Onde exibe "Modo Expansão: Giro contínuo de juros compostos alimentando a base patrimonial" -> alterar para:
       - Enquanto não atingir a meta: "Seu dinheiro está crescendo mês a mês para gerar a renda que você escolheu."
       - Ao atingir a meta: "Os rendimentos da sua carteira já pagam o seu custo de vida sem precisar mexer no patrimônio."
   - Em simulador.html:
     * Varrer textos e legendas: substituir referências confusas a "Fee-Drag", "Crossover", "SWR 3,5%" por termos humanos como:
       - "Renda mensal segura (sem gastar seu patrimônio)"
       - "Ganho real já descontando a inflação"
       - "Quanto você deixa de perder em taxas ocultas de banco"
       - "O ano em que seus investimentos pagam todas as suas despesas"

4. Preservação de Testes:
   - NUNCA altere os IDs ou classes dos elementos HTML (ex: #hud-ano-soberania, #hud-patrimonio-real, #hud-renda-passiva, #hud-fee-delta, #hud-narrative, etc.).
   - Execute e garanta:
     * node tests/run-all.js --milestone=m2 (13/13 PASS)
     * node tests/run-all.js (83/83 PASS)
     * node .agents/teamwork/teamwork_preview_reviewer_m2_2/audit_simulador_layout.js (0 transbordamentos)
     * Regra de espaço antes de <br> (0 violações)

5. Ao terminar, envie uma mensagem via send_message com o resumo e o caminho do seu handoff.md.


## 2026-10-20T01:03:19Z
[Message] timestamp=2026-10-20T01:03:19Z sender=971a465a-16b6-43b8-a7b3-fb44ff80c9f4 priority=MESSAGE_PRIORITY_HIGH content=**Context**: Humanização Total e Interatividade Digitável em simulador.html.
**Content**: ALERTA CRÍTICO DA USUÁRIA:
"é pra clientes nao pra outros consultores"
"quem entende sáporra"
"o usuario nao consegue preencher as coisas, ta muito ruim ainda"

VOCÊ DEVE IMPLEMENTAR EM simulador.html, js/simulador-visual-fx.js e js/simulador-core.js:
1. **INTERATIVIDADE DIGITÁVEL NO TECLADO (BIDIRECIONAL)**:
   - Transforme os displays de valor (ex: #disp-p0, #disp-pmt, #disp-anos, #disp-despesa) em CAMPOS DE INPUT DIGITÁVEIS (ou adicione inputs elegantes ao lado) onde o usuário pode CLICAR E DIGITAR no teclado (ex: digita 500000 e o slider se move para 500k; mexe o slider e o input atualiza!).
   - Garanta que #visual-universe, #astrolabe-canvas e halos tenham pointer-events: none para NUNCA bloquear cliques nos sliders e inputs!
2. **TEXTO 100% PARA CLIENTES (MÉDICOS, EMPRESÁRIOS, FAMÍLIAS)**:
   - Eyebrow do Hero: "Planejamento de Futuro · Simulador Interativo"
   - Título do Hero: "Quando você vai poder viver de renda?"
   - Subtítulo do Hero: "Descubra quanto seu patrimônio pode gerar de renda mensal para você e sua família no futuro — já descontando a inflação e sem precisar gastar o que você construiu."
   - As 4 Perguntas:
     1. "Quanto você já tem investido hoje?"
     2. "Quanto você consegue investir por mês?"
     3. "Por quantos anos você vai investir?"
     4. "Qual renda mensal você quer ter no futuro?"
   - Premissas: Recolher em um bloco/acordeão simples "⚙️ Ajustar taxas do cálculo (opcional — já calibrado para o Brasil)":
     - "Rendimento médio ao ano"
     - "Inflação média ao ano (IPCA)"
     - "Retirada anual segura (preservando o patrimônio)" (eliminar SWR, Trinity, Bengen)
   - Resultados:
     - "Quando você atinge sua meta"
     - "Sua renda mensal disponível no futuro"
     - "Total acumulado (no valor do dinheiro de hoje)"
3. PRESERVAÇÃO: Mantenha todos os IDs de elementos (#hud-ano-soberania, #hud-patrimonio-real, #hud-renda-passiva, #hud-fee-delta, #hud-narrative, etc.) para que todos os testes E2E continuem passando 100%.
**Action**: Implemente a interatividade digitável e a linguagem humana imediatamente.


## 2026-10-20T01:07:30Z
[Message] timestamp=2026-10-20T01:07:30Z sender=971a465a-16b6-43b8-a7b3-fb44ff80c9f4 priority=MESSAGE_PRIORITY_HIGH content=**Context**: Tabela Exata de Textos e Mecânicas em simulador.html e js/simulador-visual-fx.js.
**Content**: DIRETRIZES TEXTUAIS E MECÂNICAS EXATAS DA CLIENTE (PRIORIDADE ZERO):
1. Textos exatos em simulador.html e simulador-visual-fx.js:
   - Trocar FASE DE ACUMULAÇÃO ACELERADA por: **CONSTRUINDO SUA RENDA MENSAL** (e ao bater meta: **✦ LIBERDADE FINANCEIRA ALCANÇADA**)
   - Trocar Horizonte de Crossover por: **Quanto falta para viver de renda**
   - Trocar Crossover em X anos / 48% da Meta Soberana por: **Pronto em X anos** / **Você já tem 48% do valor necessário**
   - Trocar Modo Expansão... por: **Em construção: Seu dinheiro está crescendo mês a mês até pagar todas as suas contas sozinho.**
   - Trocar Singularidade Ativa... por: **Meta atingida: A partir daqui, só os rendimentos já pagam o seu padrão de vida sem mexer no valor principal.**
   - Hero Título: **Quando você pode parar de trabalhar por obrigação?**
   - Hero Subtítulo: **Descubra em que ano os seus investimentos passam a pagar 100% do seu estilo de vida — já descontando a inflação e sem deixar taxas escondidas comerem o seu futuro.**
   - Rótulos dos 4 inputs (com inputs clicáveis e digitáveis no teclado!):
     * **Quanto você já tem investido hoje**
     * **Quanto consegue guardar por mês**
     * **Por quantos anos vai investir**
     * **Quanto quer receber por mês no futuro**
   - Premissas: **Ajustes de Rentabilidade e Inflação (opcional)** e **Retirada anual segura (para o dinheiro nunca acabar)**
   - Resultados no HUD: **Ano da sua Liberdade**, **Sua Renda Mensal Vitalícia** e **Dinheiro salvo de taxas ocultas**
   - Título do Gráfico: **A Evolução do Seu Patrimônio Ano a Ano** (legendas: Com Consultoria Independente vs No Banco Comum vs Linha da Liberdade)
   - Pilares: **01 · DINHEIRO DE VERDADE (DESCONTANDO A INFLAÇÃO)**, **02 · RENDA QUE NUNCA SECA**, **03 · O RALO INVISÍVEL DAS COMISSÕES**
   - Mecânica Tangível: Card de **Equivalência de Vida Real** para o dinheiro salvo (ex: faculdades de medicina dos filhos, anos de trabalho poupados, viagens em família).
2. Interatividade Digitável: O usuário DEVE poder clicar e digitar no teclado os valores dos 4 campos, sincronizando com os sliders.
3. Preservação: Mantenha todos os IDs e seletores para garantir aprovação 100% dos testes.
**Action**: Aplique essa tabela de substituições literais agora.


## 2026-10-20T01:15:19Z
[Message] timestamp=2026-10-20T01:15:19Z sender=971a465a-16b6-43b8-a7b3-fb44ff80c9f4 priority=MESSAGE_PRIORITY_HIGH content=**Context**: Diretriz Mandatória de Cockpit de Tela Única (Zero-Scroll no Desktop) para simulador.html e css/simulador.css
**Content**: A usuária solicitou formalmente que as aplicações web encaixem na tela sem exigir rolagem no desktop (>= 1024px): "tem que encaixar melhor sem ter que rolar pagina nas aplicações web".
Você agora tem posse de escrita também sobre `css/simulador.css` para implementar o layout em Bento Grid de Tela Única:
1. Compactar hero: padding: 68px 0 10px, título e subtítulo sucintos.
2. Coluna esquerda (.sim-controls-panel): paddings compactos, acordeão fechado para taxas opcionais, inputs digitáveis no teclado sincronizados aos sliders.
3. Área direita (.sim-results-panel) em Bento Grid Compacto de Tela Única:
   - Linha Superior: .sim-astrolabe-card horizontal (~170px) AO LADO dos 3 .sim-kpi-grid!
   - Centro: .sim-chart-card (#sim-chart com ~210px-230px) visível imediatamente ao lado dos controles!
   - Inferior: #wargame-crises-card compacto logo abaixo do gráfico.
4. O usuário ajusta os inputs e vê simultaneamente o Astrolábio pulsar, os KPIs mudarem e o gráfico evoluir SEM ROLAR NENHUM PIXEL!
5. No mobile (< 900px), mantenha o empilhamento vertical sem overflow horizontal.
**Action**: Implemente essa arquitetura de Bento Grid compacta no desktop juntamente com a digitação no teclado e as substituições de texto humano. Preserve todos os IDs e seletores para garantir aprovação total dos testes.
