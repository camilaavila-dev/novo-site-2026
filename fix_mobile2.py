import os

filepath = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Header menu btn link
content = content.replace('href="https://linktr.ee/leonardoarruda" target="_blank" class="header-menu-btn"', 'href="/linktree" target="_self" class="header-menu-btn"')

# 2. Hide .nav-cta on mobile
old_nav_cta = '.nav-cta { padding: 8px 12px !important; font-size: 11px !important; white-space: nowrap !important; }'
new_nav_cta = '.nav-cta { display: none !important; }'
content = content.replace(old_nav_cta, new_nav_cta)

# 3. Escopo de atuação padding
old_svc_panel = '.svc-panel { position: relative !important; padding: 32px 0px !important; }'
new_svc_panel = '.svc-panel { position: relative !important; padding: 32px 24px !important; box-sizing: border-box !important; }'
content = content.replace(old_svc_panel, new_svc_panel)

# 4. Metodo mobile CSS
old_metodo_css = """  /* METODO */
  .met-wrap { grid-template-columns: 1fr !important; gap: 20px !important; }
  .met-connector { display: none !important; }
  .met-step:not(:first-child)::before { display: none !important; }
  .met-step { padding: 0 !important; }
  .met-card { opacity: 1 !important; transform: none !important; padding: 24px !important; }
  .met-card .met-desc { max-height: 500px !important; opacity: 1 !important; margin-top: 14px !important; }"""

new_metodo_css = """  /* METODO */
  .met-accordion { display: flex !important; flex-direction: column !important; height: auto !important; }
  .met-card { position: relative !important; width: 100% !important; min-height: auto !important; flex: none !important; margin-bottom: 16px; overflow: visible !important; border: 1px solid rgba(107,102,232,0.15) !important; background: linear-gradient(135deg, rgba(255,255,255,.04), rgba(255,255,255,.01)) !important; border-radius: 16px !important; }
  .met-card-closed { display: none !important; }
  .met-card-open { position: static !important; opacity: 1 !important; pointer-events: auto !important; padding: 32px 24px !important; background: none !important; border: none !important; min-width: 0 !important; }"""

content = content.replace(old_metodo_css, new_metodo_css)

# 5. Parceria max-width
old_parceria_html = '<div data-reveal style="text-align:left;margin-bottom:64px;max-width:58%;">'
new_parceria_html = '<div data-reveal class="parceria-title-wrap" style="text-align:left;margin-bottom:64px;max-width:58%;">'
content = content.replace(old_parceria_html, new_parceria_html)

# Add .parceria-title-wrap to mobile CSS
old_parceria_css = '#parceria [style*="max-width:58%"] { max-width: 100% !important; }'
new_parceria_css = '#parceria [style*="max-width:58%"] { max-width: 100% !important; }\n  .parceria-title-wrap { max-width: 100% !important; }'
content = content.replace(old_parceria_css, new_parceria_css)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Mobile fixes applied.")
