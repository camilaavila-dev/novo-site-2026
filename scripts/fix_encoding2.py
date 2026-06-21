import re
file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Â·', '·')
content = content.replace('â€”', '—')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Encoding fixes applied")
