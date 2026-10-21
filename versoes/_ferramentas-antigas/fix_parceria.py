import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add class to the subtext
old_subtext = r'<p style="font-family:var\(--s\);font-size:17px;line-height:1\.7;color:rgba\(255,255,255,\.48\);margin:22px 0 0;max-width:56ch;font-weight:300">Minha consultoria une o atendimento pessoal, próximo e artesanal com a estrutura institucional robusta da maior plataforma independente do Brasil\.</p>'
new_subtext = '<p class="parceria-subtext" style="font-family:var(--s);font-size:17px;line-height:1.7;color:rgba(255,255,255,.48);margin:22px 0 0;max-width:56ch;font-weight:300">Minha consultoria une o atendimento pessoal, próximo e artesanal com a estrutura institucional robusta da maior plataforma independente do Brasil.</p>'
content = re.sub(old_subtext, new_subtext, content)

# 2. Move the mobile image above the "Atuo através" text
# We'll extract the image tag and remove it from its current position, then place it before the <p>
img_pattern = r'(\s*<!-- IMAGEM MOBILE REVELADA APENAS NO CELULAR -->\s*<img[^>]*class="mobile-parceria-img"[^>]*>)'
match = re.search(img_pattern, content)
if match:
    img_tag = match.group(1)
    # Remove it
    content = content.replace(img_tag, '')
    
    # Find the target <p>
    p_pattern = r'(<p style="[^"]*">Atuo através da <strong[^>]*>Portfel</strong>)'
    content = re.sub(p_pattern, img_tag + r'\n        \1', content)

# 3. Add mobile CSS rules for these classes
css_addition = '''  .parceria-subtext { font-size: 19px !important; line-height: 1.6 !important; color: rgba(255,255,255,0.7) !important; margin-bottom: 24px !important; }
  .mobile-parceria-img { display: block !important; width: 100%; border-radius: 12px; margin-bottom: 32px; object-fit: cover; max-height: 350px; mask-image: linear-gradient(to top, transparent 0%, black 15%); -webkit-mask-image: linear-gradient(to top, transparent 0%, black 15%); }
  .parceria-bg { display: none !important; } /* Hide the background version on mobile since we have the inline image */'''

content = content.replace('/* PRESENÇA */', css_addition + '\n  \n  /* PRESENÇA */')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied Parceria mobile fixes.")
