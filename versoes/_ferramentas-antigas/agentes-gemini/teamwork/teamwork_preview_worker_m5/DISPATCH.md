## 2026-10-20T02:13:09Z
Você é o Worker M5 (teamwork_preview_worker_m5) responsável por implementar o Milestone M5: Evolução Gamificada da Home & Linktree (Fortaleza Patrimonial).
Seu diretório de trabalho exclusivo é:
c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_worker_m5\

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATÓRIO:
1. Leia obrigatoriamente:
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\ORIGINAL_REQUEST.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\PROJECT.md
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\tests\tier1-features\f22_f24-home-blocks.test.js
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\tests\tier1-features\f25-linktree.test.js
   - c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\orchestrator\DISPATCH.md (seção das 23:48:14Z e 00:48:02Z sobre a Fortaleza Patrimonial)

2. Arquivos sob sua Posse Exclusiva:
   - index.html
   - linktree.html
   - css/shared-outlier.css (ajustes complementares se necessário)

3. Requisitos e Especificações Técnicas de M5 (Features F01, F05, F22 a F25):
   A. Preservação Sagrada em index.html:
      - As 15 seções originais aprovadas na tag Git v1-checkpoint-aprovado devem permanecer 100% preservadas em conteúdo, lógica e IDs (#sobre, #servicos, #metodo, #parceria, #presenca, #cta, #contato, etc.).
      - NUNCA delete ou substitua o conteúdo original; insira os novos blocos nos pontos de encaixe exatos.
      - NUNCA duplique IDs de elementos.

   B. Inserção dos 3 Blocos Gamificados na Home (index.html):
      1. Bloco Home A (Preview Raio-X Patrimonial):
         - Inserir entre a Seção 7 (#servicos) e Seção 8 (#metodo).
         - Visual imersivo Private Wealth com orbe luminescente ou scanner de Raio-X.
         - Call-to-action chamando o visitante para fazer o diagnóstico em 2 minutos.
         - Link explícito direcionando para `raiox.html`.
      2. Bloco Home B (Vitrine do Simulador de Liberdade):
         - Inserir entre a Seção 9 (#parceria) e Seção 10 (#depoimentos ou equivalente).
         - Mini-vitrine interativa com visual do Astrolábio ou telemetria em JetBrains Mono.
         - Demonstração do ganho de anos de liberdade pelo modelo fiduciário vs sangria de taxas dos bancos.
         - Link explícito direcionando para `simulador.html`.
      3. Bloco Home C (Radar da Semana & Newsletter):
         - Inserir entre a Seção 12 (#presenca) e Seção 13 (#faq / #cta).
         - Vitrine conectada aos dados da semana (Selic, IPCA, Dólar, Sentimento 68/100).
         - Chamada para ler a última edição e assinar a inteligência privada.
         - Link explícito direcionando para `blog.html`.

   C. Ruptura Radical — Mapa Espacial Panorâmico da Fortaleza Patrimonial (index.html):
      - Inserir na index.html uma seção monumental (ex: integrada a #metodo ou em seção dedicada) com o Mapa Espacial da Fortaleza (inspirado na Mandala das págs 2-3 do PDF do Leonardo):
        * "VOCÊ / SUA FAMÍLIA" no centro com iluminação de destaque.
        * 4 Grandes Territórios orbitando:
          1. [01]-[04] Planejamento Financeiro (Orçamento, Metas, Caixa, Aposentadoria)
          2. [05]-[08] Previdência & Seguros (Previdência Privada, Vida Resgatável, Sucessão em Vida, D&O)
          3. [09]-[12] Proteção & Blindagem (Holding Familiar, Offshore, Trust, Governança)
          4. [13]-[16] Serviços Especiais & M&A (Fusões/Aquisições, Valuation, Planejamento Tributário, Real Estate)
        * Interatividade fluida (hover tátil com coordenadas [01] a [16], spotlight e detalhes da estrutura).

   D. Refinamentos Técnicos Identificados em index.html:
      - Garantir que TODAS as ocorrências de `<br>` tenham espaço antecedente (`texto <br>texto`), verificando especialmente as linhas 525, 645, 755 e 887.
      - Adicionar `<div class="svc-item-desc">Assessoria dedicada em operações societárias</div>` faltante no item "M&A — Fusões e Aquisições" no Painel 04 de Serviços.
      - Atualizar o Schema JSON-LD `sameAs` de Leonardo Arruda com os links sociais reais:
        `https://www.linkedin.com/in/leonardo-arruda-b49ab8104/` e `https://www.instagram.com/leoarruda.s/`.
      - Ocultar cursor dinâmico (#c-dot e #c-ring) em touch screens via media query `@media (hover: none), (pointer: coarse) { #c-dot, #c-ring { display: none !important; } }`.

   E. Atualização de linktree.html (Hub Mobile-First):
      - Atualizar com badges de autoridade (CEA, ANBIMA, Portfel, Grupo Primo).
      - Estatísticas institucionais: +R$ 20Bi sob custódia, +25k clientes, +700 consultores, 97 NPS.
      - Links para formulário oficial (forms.office.com), redes sociais e conexão direta com as novas rotas 2026:
        * `simulador.html` ("Simulador de Liberdade Financeira")
        * `raiox.html` ("Raio-X da Carteira Patrimonial")
        * `blog.html` ("Radar Macroeconômico Semanal")
      - Visual consistente com a paleta Private Wealth / Astra (#04020C, #3B36CC, #1CD98A).
      - Zero violações de quebra `<br>` (espaço antes de `<br>`).

4. Validação & Verificação Rigorosa:
   - Execute: `node tests/run-all.js --milestone=m5` (deve passar 100% dos testes de M5!)
   - Execute: `node tests/run-all.js` (deve passar 92/92 testes sem nenhuma regressão!)
   - Execute auditoria estática de `<br>` e de transparência em `index.html` e `linktree.html`.
   - Execute teste de layout no Chrome Headless para checar zero transbordamentos.
   - Registre todos os comandos e saídas em seu handoff.md (5 componentes).

5. Ao terminar, envie uma mensagem via send_message com o resumo e o caminho do seu handoff.md.
