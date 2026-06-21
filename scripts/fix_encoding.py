import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Try latin-1 -> utf-8 decode
try:
    content = content.encode('latin1').decode('utf-8')
except Exception as e:
    print("Direct decode failed, falling back to manual replacement")
    # Manual replacements
    replacements = {
        'Ã§': 'ç', 'Ã£': 'ã', 'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ã´': 'ô', 'Ãª': 'ê', 'Ãµ': 'õ', 'Ãº': 'ú',
        'Ã‡': 'Ç', 'Ãƒ': 'Ã', 'Ã ': 'Á', 'Ã‰': 'É', 'Ã ': 'Í', 'Ã“': 'Ó', 'Ã”': 'Ô', 'ÃŠ': 'Ê', 'Ã•': 'Õ', 'Ãš': 'Ú',
        'Ã¢': 'â', 'Ã‚': 'Â', 'Ã ': 'à', 'Ã€': 'À'
    }
    for bad, good in replacements.items():
        content = content.replace(bad, good)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done.')
