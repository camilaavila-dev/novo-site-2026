import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove SVG filter
svg_filter_pattern = r'<svg width="0" height="0" style="position:absolute; width:0; height:0; pointer-events:none;">.*?<\/svg>'
content = re.sub(svg_filter_pattern, '', content, flags=re.DOTALL)

# Replace logos
old_nav_logo = r'<img id="nav-logo" src="midias/logo-leo\.webp" alt="Leonardo Arruda" style="height:54px;object-fit:contain;transition:height 0\.4s ease; filter: url\(#remove-white\);">'
new_nav_logo = '<img id="nav-logo" src="midias/logo-leo-white.png" alt="Leonardo Arruda" style="height:54px;object-fit:contain;transition:height 0.4s ease;">'
content = re.sub(old_nav_logo, new_nav_logo, content)

old_footer_logo = r'<img src="midias/logo-leo\.webp" alt="Leonardo Arruda" style="height:34px;object-fit:contain; filter: url\(#remove-white\);">'
new_footer_logo = '<img src="midias/logo-leo-white.png" alt="Leonardo Arruda" style="height:34px;object-fit:contain;">'
content = re.sub(old_footer_logo, new_footer_logo, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
