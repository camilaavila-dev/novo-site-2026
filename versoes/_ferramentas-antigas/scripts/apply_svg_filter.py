import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

svg_filter = '''<svg width="0" height="0" style="position:absolute; width:0; height:0; pointer-events:none;">
  <filter id="remove-white">
    <feColorMatrix type="matrix" values="
      0 0 0 0 1
      0 0 0 0 1
      0 0 0 0 1
      -0.333 -0.333 -0.333 0 1" />
  </filter>
</svg>'''

if 'id="remove-white"' not in content:
    content = content.replace('<body>', '<body>\n' + svg_filter)

# Fix the nav logo (which is currently pointing to the broken logo-leo-white.png)
old_nav_logo = r'<img id="nav-logo" src="midias/logo-leo-white\.png" alt="Leonardo Arruda" style="height:54px;object-fit:contain;transition:height 0\.4s ease">'
new_nav_logo = '<img id="nav-logo" src="midias/logo-leo.webp" alt="Leonardo Arruda" style="height:54px;object-fit:contain;transition:height 0.4s ease; filter: url(#remove-white);">'
content = re.sub(old_nav_logo, new_nav_logo, content)

# Fix the footer logo (also pointing to logo-leo-white.png)
old_footer_logo = r'<img src="midias/logo-leo-white\.png" alt="Leonardo Arruda" style="height:34px;object-fit:contain">'
new_footer_logo = '<img src="midias/logo-leo.webp" alt="Leonardo Arruda" style="height:34px;object-fit:contain; filter: url(#remove-white);">'
content = re.sub(old_footer_logo, new_footer_logo, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SVG Filter applied to logos!")
