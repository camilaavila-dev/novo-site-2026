import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Logo and Add Social Media
old_col1 = r'<div style="margin-bottom:14px"><img src="midias/01-logo-completa-leonardo-portfel-texto-branco-transparente.png" alt="Leonardo Arruda" style="height:34px;object-fit:contain;"></div>\s*<div style="font-family:var\(--s\);font-size:13\.5px;color:var\(--sub\);line-height:1\.8;font-weight:300">\s*Consultor de Investimentos · ANBIMA CEA<br>\s*Portfel · Grupo Primo<br><br>\s*<strong style="color:var\(--txt\);font-weight:500">LA CONSULTORIA & NEGÓCIOS</strong><br>\s*CNPJ: 54\.475\.818/0001-90\s*</div>'

new_col1 = '''<div style="margin-bottom:24px"><img src="midias/01-logo-completa-leonardo-portfel-texto-branco-transparente.png" alt="Leonardo Arruda" style="height:54px;object-fit:contain;"></div>
        <div style="font-family:var(--s);font-size:13.5px;color:var(--sub);line-height:1.8;font-weight:300">
          Consultor de Investimentos · ANBIMA CEA<br>
          Portfel · Grupo Primo<br><br>
          <strong style="color:var(--txt);font-weight:500">LA CONSULTORIA & NEGÓCIOS</strong><br>
          CNPJ: 54.475.818/0001-90
        </div>
        <div style="display:flex;gap:14px;margin-top:24px">
          <a href="#" target="_blank" style="color:var(--sub);text-decoration:none;transition:color .2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--sub)'" aria-label="Instagram">
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="#" target="_blank" style="color:var(--sub);text-decoration:none;transition:color .2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--sub)'" aria-label="LinkedIn">
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
          </a>
        </div>'''
content = re.sub(old_col1, new_col1, content, flags=re.DOTALL)

# 2. Update Disclaimer text color
content = content.replace('color:rgba(237,232,213,.35)', 'color:rgba(255,255,255,.55)')

# 3. Add Agencia Brasilis attribution and links to termos
old_rights = r'<div style="font-family:var\(--m\);font-size:10px;letter-spacing:\.12em;text-transform:uppercase;color:var\(--sub\)">© 2026 Leonardo Arruda\. Todos os direitos reservados\.</div>\s*<div style="font-family:var\(--m\);font-size:10px;letter-spacing:\.12em;text-transform:uppercase;color:var\(--sub\);display:flex;gap:20px">\s*<a href="#" style="color:var\(--sub\);text-decoration:none">Política de Privacidade</a>\s*<a href="#" style="color:var\(--sub\);text-decoration:none">Termos de Uso</a>\s*</div>'

new_rights = '''<div style="font-family:var(--m);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--sub);line-height:1.7">
        © 2026 Leonardo Arruda. Todos os direitos reservados.<br>
        Desenvolvido por <a href="https://agenciabrasilis.com" target="_blank" style="color:var(--sub);text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--sub)'">Agência Brasilis</a>
      </div>
      <div style="font-family:var(--m);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--sub);display:flex;gap:20px">
        <a href="termos.html" style="color:var(--sub);text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--sub)'">Política de Privacidade</a>
        <a href="termos.html" style="color:var(--sub);text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--sub)'">Termos de Uso</a>
      </div>'''

content = re.sub(old_rights, new_rights, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Footer updated successfully.")
