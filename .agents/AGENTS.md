# Workspace Rules

### Diretrizes para Projetos de Design e Desenvolvimento "Outlier" / Alto Padrão
1. **Profundidade vs. Velocidade:** Nunca trate solicitações de design "luxo", "premium" ou "outlier" como tarefas rápidas. É obrigatório dedicar tempo significativo à pesquisa de referências (usando o browser), análise semiótica (como construir confiança, legado, honra) e ideação antes de escrever qualquer código.
2. **Separação de Responsabilidades:** Para projetos complexos, divida o trabalho em múltiplas frentes utilizando o sistema multi-agentes (ex: subagente de pesquisa visual, subagente de UX/Copywriting, subagente de engenharia frontend).
3. **Padrão de Qualidade "Award-Winning":** O código e o design gerados não devem ser apenas funcionais ou "bonitos". Devem incorporar técnicas avançadas (animações complexas com WebGL/GSAP, tipografia curada, interações imersivas) que o coloquem em nível de premiação (ex: Awwwards).


### Diretrizes Técnicas de Frontend
1. **Quebras de linha seguras (Mobile):** Ao utilizar tags `<br>` em textos que podem ter seu `display` alterado para `none` no celular, sempre insira um espaço antes da tag (ex: `texto <br>texto`). Isso previne que as palavras se fundam quando a quebra for ocultada pelo CSS.
2. **Tratamento de Transparência:** Nunca utilize filtros SVG (como `feColorMatrix` ou `feComponentTransfer`) direto no HTML/CSS para tentar limpar fundos brancos de logotipos ou imagens. Isso gera artefatos de renderização. Sempre utilize processamento de imagem nativo via script (ex: Python/Pillow) para gerar arquivos `.png` transparentes definitivos.
