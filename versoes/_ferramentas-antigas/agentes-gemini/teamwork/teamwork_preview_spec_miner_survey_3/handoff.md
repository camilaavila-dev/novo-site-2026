# Relatório de Handoff — Spec Miner (Editorial & GEO)

**Autor:** Spec Miner (teamwork_preview_spec_miner_survey_3)  
**Destinatário:** Orquestrador (971a465a-16b6-43b8-a7b3-fb44ff80c9f4)  
**Data:** 19 de Outubro de 2026  
**Tipo de Handoff:** Hard (Tarefa Concluída com Sucesso)  
**Artefato Principal Produzido:** `.agents/teamwork/teamwork_preview_spec_miner_survey_3/report.md`

---

## 1. Observation (Observações Objetivas)
- **Documento de Requisitos Analisado:** `.agents/teamwork/ORIGINAL_REQUEST.md`, seções R1, R2, R3, R4, R5 e Critérios de Aceitação (linhas 1 a 74).
- **Baseline do Código Inspecionado:**
  - `index.html`: 1311 linhas, checkpoint `v1-checkpoint-aprovado`. Identificados elementos de cursor dinâmico (`#c-dot`, `#c-ring`), scroll progress bar (`#prog`), Schema.org atual (linhas 48 a 137), navegação `#site-nav`, hero com vídeo fullscreen e classes de responsividade mobile (linhas 139 a 231). Constatada a aplicação da regra de espaço antes de `<br>` na linha 282 (`Você levou <br>anos construindo. <br><em style="font-style:italic;color:var(--grn)">Cuide como merece.</em>`).
  - `llms.txt`: 35 linhas, cobrindo dados biográficos básicos e 3 perguntas de FAQ. Necessita expansão semântica para cobrir as novas ferramentas interativas (Simulador, Raio-X, Terminal Editorial) e metodologia aprofundada.
  - `sitemap.xml`: 16 linhas, contendo apenas 2 URLs (`/` e `/linktree.html`). Faltam as novas rotas projetadas (`/simulador.html`, `/raiox.html`, `/blog.html`, `/termos.html`, `/privacidade.html`).
  - `informação/cerebro_da_marca_leo_consultor_de_investimento.md`: 931 linhas de dados estratégicos detalhando os 3 públicos-alvo (Investidor em crescimento, Empresário/Profissional Liberal, Família com foco em sucessão), o modelo Fee Based com devolução integral de comissões, métricas da Portfel (+R$20Bi sob consultoria, +25k clientes, NPS 97) e diretrizes de copywriting sem promessas milagrosas.
  - Scripts utilitários do projeto (`fix_mobile2.py`, etc.), demonstrando histórico de correções prévias de layout no acordeão do método e paddings mobile.

---

## 2. Logic Chain (Cadeia Lógica de Raciocínio)
1. **Desacoplamento Editorial (R4):** Para garantir que a publicação semanal de análises macroeconômicas não exija manipulação manual do HTML base, deduz-se que uma arquitetura declarativa client-side (`data/editorial.js` exportando `window.EDITORIAL_DATA`) é a solução ideal: permite injeção reativa limpa, zero dependência de servidor e atualização trivial via substituição de um objeto JSON/JS.
2. **Dualidade de Persona (Executivo vs Nerd):** Investidores C-levels demandam síntese de 60 segundos ("Resumo Executivo"), enquanto perfis analíticos exigem aprofundamento quantitativo ("Visão Nerd/Quant"). O alternador tátil segmentado com 4 quadrantes práticos ("O que isso muda no seu patrimônio?") atende simultaneamente às duas personas sem fragmentar a URL.
3. **GEO & Inteligência Artificial (R5):** Modelos generativos como Perplexity e SearchGPT priorizam documentos estruturados em Markdown semântico (`llms.txt`) e entidades formalizadas via Schema.org JSON-LD (`FinancialService`, `Person`, `SoftwareApplication` para as calculadoras e `BlogPosting`). O enriquecimento desses metadados posiciona o Leonardo como referência primária para consultas sobre consultoria Fee Based no Brasil.
4. **Ergonomia Mobile para Telas Grandes (390x844 e 430x932):** Mais de 50% da área útil em telas Pro Max fica inacessível com uso em uma mão. A introdução de um *Mobile Bottom Dock* glassmorphism na zona do polegar com touch targets superiores a 48px e a garantia de espaço antes de `<br>` eliminam fricções ergonômicas e falhas de renderização tipográfica.

---

## 3. Caveats (Ressalvas e Limitações)
- **Atuação Exclusiva como Spec Miner:** Nenhuma modificação nos arquivos produtivos (`index.html`, `llms.txt`, `sitemap.xml`) foi aplicada nesta etapa, respeitando a integridade do papel de especificação. A implementação caberá aos agentes executores designados nas próximas fases.
- **Validação de Formulário Externo:** O formulário de agendamento utiliza URL externa do Microsoft Forms (`forms.office.com`). Quaisquer limitações de parametrização de URL no envio de dados dependem da API do Forms ou devem ser complementadas com integração via WhatsApp/e-mail no futuro.

---

## 4. Conclusion (Conclusão)
A especificação de R4, R5, Ergonomia Mobile e o Inventário Completo de Critérios de Aceitação foi finalizada com sucesso e gravada com nível cirúrgico de detalhe em:  
`c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_spec_miner_survey_3\report.md`

O documento inclui os esquemas de dados prontos para copiar/colar em JavaScript, o texto integral formatado para o `llms.txt` expandido, o XML completo do `sitemap.xml`, os blocos JSON-LD de Schema.org, a arquitetura do Mobile Dock e as tabelas canônicas de Features e Edge Cases.

---

## 5. Verification Method (Método de Verificação Independente)
1. **Inspeção do Relatório:**
   - Verificar a integridade do arquivo executando `view_file` em `c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_spec_miner_survey_3\report.md`.
2. **Conferência das Seções Obrigatórias:**
   - Seção 2: Especificação de R4 (estrutura declarativa, Termômetro Macroeconômico de 5 métricas + sentimento, alternador Executivo vs Nerd e Newsletter).
   - Seção 3: Especificação de R5 (llms.txt expandido, Schemas Schema.org JSON-LD para Person, FinancialService, SoftwareApplication, BlogPosting, FAQPage e sitemap.xml).
   - Seção 4: Ergonomia Mobile (viewports 390x844 e 430x932, touch targets >= 48px, thumb zone, dock inferior e espaço antes de `<br>`).
   - Seção 5: Tabelas formais `Features Discovered` (22 features mapeadas) e `Edge Cases` (12 cenários de borda).
