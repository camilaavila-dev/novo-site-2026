import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# The old logo name we replaced last time
old_logo = 'midias/logo-leo-white.png'
new_logo = 'midias/01-logo-completa-leonardo-portfel-texto-branco-transparente.png'

content = content.replace(old_logo, new_logo)

# Also check if there are any remaining references to midias/logo-leo.webp and replace them too
content = content.replace('midias/logo-leo.webp', new_logo)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Logo update complete.")
