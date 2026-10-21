import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Header Buttons
old_header_btn = r'<a href="https://forms\.office\.com/Pages/ResponsePage\.aspx\?id=6ez5YgM1m0G2Yyy_xOsD25muVoj4MslItAJalz086_lURDhJV1Y0QlVaUTZFV0RORUZMMUg2S1NKTi4u"[^>]*>\s*<svg[^>]*>.*?</svg>\s*Agendar conversa\s*</a>'
new_header_btn = '''<a href="https://forms.office.com/Pages/ResponsePage.aspx?id=6ez5YgM1m0G2Yyy_xOsD25muVoj4MslItAJalz086_lURDhJV1Y0QlVaUTZFV0RORUZMMUg2S1NKTi4u" target="_blank" id="header-cta" style="display:inline-flex;align-items:center;gap:12px;padding:12px 26px;background:rgba(28,217,138,.1);color:var(--grn);font-family:var(--s);font-weight:600;font-size:13px;border-radius:30px;text-decoration:none;transition:all .3s" onmouseover="this.style.background='var(--grn)';this.style.color='var(--bg)'" onmouseout="this.style.background='rgba(28,217,138,.1)';this.style.color='var(--grn)'">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
    Agendar conversa
  </a>
  <a href="https://linktr.ee/leonardoarruda" target="_blank" id="header-menu-btn" style="display:none;align-items:center;justify-content:center;padding:12px;background:rgba(255,255,255,.05);border-radius:12px;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.1)">
    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
  </a>'''
content = re.sub(old_header_btn, new_header_btn, content, flags=re.DOTALL)

# 2. Hero missing spaces and top text
content = content.replace('Você levou<br>anos construindo.<br><em', 'Você levou <br>anos construindo. <br><em')
content = content.replace('ANBIMA CEA · Portfel · Grupo Primo', '<span class="hero-top-text">ANBIMA CEA · Portfel · Grupo Primo</span>')

# 3. Parceria Button text
content = content.replace('Conhecer a estrutura ->', 'Conhecer a estrutura')

# 4. Mobile CSS Update
old_mobile_css = r'@media \(max-width: 900px\) \{.*?\n\}'
new_mobile_css = '''@media (max-width: 900px) {
  /* GLOBAL */
  section { padding: 60px 24px !important; }
  h1 { font-size: clamp(42px, 12vw, 60px) !important; }
  h2 { font-size: clamp(32px, 8vw, 42px) !important; }
  h1 br, h2 br { display: none; }
  
  /* NAV */
  #site-nav { padding: 0 24px !important; }
  #site-nav div a:not([target="_blank"]) { display: none !important; } 
  #header-cta { display: none !important; }
  #header-menu-btn { display: inline-flex !important; }
  
  /* HERO */
  #hero-vid { width: 100vw; height: 100vh; object-fit: cover; }
  .hero-content { padding: 0 24px 60px !important; }
  .hero-scroll { display: none !important; }
  .hero-top-text { font-size: 8px !important; letter-spacing: 0.1em !important; white-space: nowrap !important; }
  
  /* STATS */
  .stats-grid { grid-template-columns: 1fr 1fr !important; }
  .stats-grid > div { padding: 32px 16px !important; border-bottom: 1px solid rgba(255,255,255,.08); }
  .stats-grid > div:nth-child(even) { border-right: none !important; }
  .stats-grid > div:nth-last-child(-n+2) { border-bottom: none !important; }

  /* MEDIA LOGOS */
  .media-logos { gap: 24px !important; }
  .media-logos img { height: 20px !important; }
  
  /* FILOSOFIA */
  .filo-flex { flex-direction: column !important; gap: 24px !important; }
  .filo-flex div { width: auto !important; }

  /* SOBRE */
  .sobre-grid { grid-template-columns: 1fr !important; }
  
  /* PARA QUEM */
  .para-quem-grid { grid-template-columns: 1fr !important; }
  
  /* SERVIÇOS */
  .svc-wrap { grid-template-columns: 1fr !important; display: flex !important; flex-direction: column !important; min-height: auto !important; }
  .svc-nav { border-right: none !important; border-bottom: none !important; flex-direction: column !important; overflow: visible !important; white-space: normal !important; gap: 0 !important; }
  .svc-tab { padding: 16px 20px !important; min-width: 100% !important; border-bottom: 1px solid var(--brd) !important; border-right: none !important; text-align: left !important; }
  .svc-tab::before { width: 3px !important; height: 100% !important; top: 0 !important; left: 0 !important; bottom: auto !important; transform-origin: top !important; transform: scaleY(0) !important; }
  .svc-tab.is-active::before { transform: scaleY(1) !important; }
  .svc-panel { position: relative !important; padding: 32px 24px !important; }
  .svc-panels { min-height: auto !important; }
  .svc-item { padding-left: 16px !important; }
  
  /* METODO */
  .met-wrap { grid-template-columns: 1fr !important; gap: 20px !important; }
  .met-connector { display: none !important; }
  .met-step:not(:first-child)::before { display: none !important; }
  .met-step { padding: 0 !important; }
  .met-card { opacity: 1 !important; transform: none !important; padding: 24px !important; }
  .met-card .met-desc { max-height: 500px !important; opacity: 1 !important; margin-top: 14px !important; }
  
  /* PARCERIA */
  .parceria-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
  .parceria-grid > div:last-child { display: none !important; }
  #parceria [style*="max-width:58%"] { max-width: 100% !important; }
  .parceria-bg { background-position: right bottom !important; background-size: contain !important; opacity: 0.25 !important; mask-image: linear-gradient(to top, transparent 0%, black 30%) !important; -webkit-mask-image: linear-gradient(to top, transparent 0%, black 30%) !important; }

  /* PRESENÇA */
  .map-bg { width: 100% !important; opacity: 0.2 !important; }
  
  /* FAQ */
  .faq-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
  
  /* CTA */
  #cta { padding: 60px 24px !important; }
  #cta h2 { font-size: clamp(32px, 8vw, 42px) !important; }

  /* FOOTER */
  footer { padding: 40px 24px !important; }
  .footer-top { flex-direction: column !important; gap: 40px !important; }
  .footer-links { gap: 40px !important; flex-direction: column !important; }
}'''

# Replace the media query block. We'll use a safer approach in case the regex dotall fails due to length.
# The mobile css is at the top of the file before </head>.
css_pattern = r'@media \(max-width: 900px\) \{.*?^\}\n</style>'
content = re.sub(css_pattern, new_mobile_css + '\n</style>', content, flags=re.DOTALL | re.MULTILINE)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Mobile and textual fixes applied successfully.")
