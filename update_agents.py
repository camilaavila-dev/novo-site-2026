import os

filepath = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/.agents/AGENTS.md'
content = ''
if os.path.exists(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

new_rules = """
### Diretrizes Técnicas de Frontend
1. **Quebras de linha seguras (Mobile):** Ao utilizar tags `<br>` em textos que podem ter seu `display` alterado para `none` no celular, sempre insira um espaço antes da tag (ex: `texto <br>texto`). Isso previne que as palavras se fundam quando a quebra for ocultada pelo CSS.
2. **Tratamento de Transparência:** Nunca utilize filtros SVG (como `feColorMatrix` ou `feComponentTransfer`) direto no HTML/CSS para tentar limpar fundos brancos de logotipos ou imagens. Isso gera artefatos de renderização. Sempre utilize processamento de imagem nativo via script (ex: Python/Pillow) para gerar arquivos `.png` transparentes definitivos.
"""

if 'Diretrizes Técnicas de Frontend' not in content:
    with open(filepath, 'a', encoding='utf-8') as f:
        f.write('\n' + new_rules)
    print('Rules added.')
else:
    print('Rules already exist.')
