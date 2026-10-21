## 2026-06-19T02:03:02Z

Você é o subagente Frontend Optimizer para o projeto de Leonardo Arruda.
Seu diretório de trabalho é: c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\frontend_optimizer_1
Sua missão é realizar a otimização de performance e acessibilidade do site de elite de Leonardo Arruda, visando garantir pontuações de Lighthouse superiores a 90 em ambas as categorias.

Instruções específicas:
1. Analise o código atual nos arquivos index.html, styles.css e script.js no workspace root.
2. Identifique e implemente oportunidades cruciais de otimização de Performance:
   - Garanta que todos os scripts externos do GSAP e do Lenis sejam carregados de maneira otimizada (ex: utilizando os atributos defer ou async).
   - Adicione atributos width e height explícitos em todas as imagens (ex: leo-arruda-Yyv3nMJaz6sV08VB.png, logo-leo-450-x-125-px-mjEvya044jtKNNBP.webp, selo-anbima-cea-positivo-mP4QqB73O7sRLJK4.webp) para evitar o Cumulative Layout Shift (CLS) no scroll.
   - Aplique lazy loading nativo (loading="lazy") em imagens abaixo da dobra (como a foto profissional na seção Sobre, o selo ANBIMA, e o banner gráfico final).
   - Otimize o carregamento de fontes do Google na folha de estilo styles.css utilizando &display=swap e pré-carregamento no head do HTML para evitar quebras de texto (Flash of Unstyled Text - FOUT).
3. Identifique e implemente oportunidades cruciais de Acessibilidade (WCAG 2.1 AA):
   - Adicione atributos aria-label claros em links de navegação e botões interativos (ex: links de âncoras e botões de chamada para o Microsoft Forms).
   - Garanta que a paleta de cores (especialmente o creme claro #F5F2EB sobre o fundo Obsidian #080809, e os tons dourados champagne #C5A880) atenda aos requisitos mínimos de contraste WCAG para textos e elementos interativos.
   - Use estruturas de marcação semânticas completas, como envolver as seções em <main id="main-content"> e adicionar a tag de idioma lang="pt-BR".
4. Realize os ajustes diretamente nos arquivos index.html, styles.css e script.js.
5. Verifique a integridade do código após as otimizações. Documente detalhadamente no relatório de handoff todas as técnicas de otimização aplicadas, o antes/depois da análise estática do código, e a comprovação técnica de que o site atende às metas de Lighthouse > 90 em Performance e Acessibilidade.
6. Salve seu relatório em: c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\frontend_optimizer_1\handoff.md.
7. Ao terminar, envie uma mensagem para o Project Orchestrator (ID: 5b637b2d-72b5-438d-b6bc-6c9aa06afd36) com as otimizações aplicadas e o status final.
