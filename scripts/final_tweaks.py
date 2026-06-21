import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Card texture and text color
content = content.replace('background: #fff;', "background: url('midias/card_texture.png') center/cover no-repeat;")
content = content.replace('color: #04020C;', 'color: #fff;')

# 2. CTA Overlay
content = content.replace('opacity:0.35;', 'opacity:0.65;')

# 3. Rodapé text
old_footer_text = r'''Consultor de Investimentos · ANBIMA CEA<br>
          Portfel · Grupo Primo · Itapetininga, SP<br><br>
          <strong style="color:var\(--txt\);font-weight:500">LEONARDO ARRUDA DOS SANTOS LTDA - ME</strong><br>
          Nome Fantasia: LA CONSULTORIA & NEGOCIOS<br>
          CNPJ: 54\.475\.818/0001-90'''

new_footer_text = '''Consultor de Investimentos · ANBIMA CEA<br>
          Portfel · Grupo Primo<br><br>
          <strong style="color:var(--txt);font-weight:500">LA CONSULTORIA & NEGÓCIOS</strong><br>
          CNPJ: 54.475.818/0001-90'''

content = re.sub(old_footer_text, new_footer_text, content)

# 4. Encoding
content = content.replace('âˆ’', '—')
content = content.replace('â€”', '—')
content = content.replace('Â·', '·')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Ajustes finais concluidos!")
