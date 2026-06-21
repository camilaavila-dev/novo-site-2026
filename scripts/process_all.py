import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. No dashes allowed!
content = content.replace('—', ' ')
content = content.replace('–', ' ')
content = content.replace('Fee Based · Sem conflito', 'Fee Based')

# Fix a specific place where the dash replacement might look weird:
content = content.replace('diretamente pelo investidor   não pelos', 'diretamente pelo investidor, não pelos')
content = content.replace('M&A   Fusões', 'M&A: Fusões')
content = content.replace('permanente   sem atalhos', 'permanente. Sem atalhos')

# 2. Prominence to Leo's name
content = content.replace('Sobre o consultor', 'Leonardo Arruda')

# 3. Parceria Layout and Fades
# Fade at the bottom
old_fade = r'''<div style="position:absolute;inset:0;background:linear-gradient\(90deg, #04020C 0%, rgba\(4,2,12,0\.85\) 40%, transparent 100%\);z-index:1;"></div>'''
new_fade = '''<div style="position:absolute;inset:0;background:linear-gradient(to top, #04020C 0%, transparent 15%), linear-gradient(90deg, #04020C 0%, rgba(4,2,12,0.85) 40%, transparent 100%);z-index:1;"></div>'''
content = re.sub(old_fade, new_fade, content)

# Layout grid: text left, cards center, empty right
old_grid = r'''<div data-reveal style="display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center">
      <div>
        <p style="font-family:var\(--s\);font-size:16px;line-height:1\.75;color:rgba\(255,255,255,\.52\);font-weight:300">Atuo através da <strong style="color:#fff;font-weight:500">Portfel</strong>, consultoria do ecossistema <strong style="color:#fff;font-weight:500">Grupo Primo</strong>\. Juntos, entregamos o que há de melhor no mercado financeiro global\. Acesso a estruturas e soluções avançadas que não estão disponíveis no varejo bancário\.</p>
        <a href="https://portfel\.com\.br" target="_blank" style="display:inline-flex;margin-top:30px;padding:14px 28px;background:rgba\(255,255,255,\.1\);color:#fff;font-family:var\(--s\);font-weight:500;font-size:14px;border-radius:7px;text-decoration:none;border:1px solid rgba\(255,255,255,\.16\)">Conhecer a estrutura â†’</a>
      </div>
      <div style="display:grid;gap:14px">'''

new_grid = '''<div data-reveal style="display:grid;grid-template-columns: 4fr 4fr 3fr;gap:60px;align-items:center">
      <div>
        <p style="font-family:var(--s);font-size:16px;line-height:1.75;color:rgba(255,255,255,.52);font-weight:300">Atuo através da <strong style="color:#fff;font-weight:500">Portfel</strong>, consultoria do ecossistema <strong style="color:#fff;font-weight:500">Grupo Primo</strong>. Juntos, entregamos o que há de melhor no mercado financeiro global. Acesso a estruturas e soluções avançadas que não estão disponíveis no varejo bancário.</p>
        <a href="https://portfel.com.br" target="_blank" style="display:inline-flex;margin-top:30px;padding:14px 28px;background:rgba(255,255,255,.1);color:#fff;font-family:var(--s);font-weight:500;font-size:14px;border-radius:7px;text-decoration:none;border:1px solid rgba(255,255,255,.16);transition:background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,.2)'" onmouseout="this.style.background='rgba(255,255,255,.1)'">Conhecer a estrutura -></a>
      </div>
      <div style="display:grid;gap:14px">'''
content = re.sub(old_grid, new_grid, content)

# Note: We need to close the empty column div after the cards. 
# Wait, grid just flows. If we have 2 children in a 3 column grid, the 3rd column just stays empty!
# That's perfect, the cards will go to col 2, and col 3 will be empty.

# 4. FAQ
old_faq = r'''<div data-faq-item style="border-top:1px solid var\(--brd\)">
        <button data-faq-btn style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:26px 0;background:none;border:none;cursor:pointer;text-align:left;gap:24px">
          <span style="font-family:var\(--d\);font-weight:500;font-size:19px;color:var\(--txt\);letter-spacing:-\.01em">Por que contratar consultoria se já invisto sozinho\?</span>'''

new_faq = '''<div data-faq-item style="border-top:1px solid var(--brd)">
        <button data-faq-btn style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:26px 0;background:none;border:none;cursor:pointer;text-align:left;gap:24px">
          <span style="font-family:var(--d);font-weight:500;font-size:19px;color:var(--txt);letter-spacing:-.01em">Qual a relação do Leonardo com a Portfel e o Grupo Primo?</span>
          <span data-faq-icon style="font-family:var(--m);font-size:18px;color:var(--vio2);flex:none;transition:transform .3s">+</span>
        </button>
        <div data-faq-answer style="max-height:0;overflow:hidden;transition:max-height .4s ease,opacity .35s ease;opacity:0">
          <p style="font-family:var(--s);font-size:15px;line-height:1.72;color:var(--mut);padding-bottom:26px;font-weight:300">Leonardo Arruda é um consultor de investimentos que atua de forma independente. Desde 2023, escolheu a plataforma da Portfel (ecossistema do Grupo Primo) pela robustez de infraestrutura e acesso a produtos de alto nível no Brasil e no exterior.</p>
        </div>
      </div>
      <div data-faq-item style="border-top:1px solid var(--brd)">
        <button data-faq-btn style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:26px 0;background:none;border:none;cursor:pointer;text-align:left;gap:24px">
          <span style="font-family:var(--d);font-weight:500;font-size:19px;color:var(--txt);letter-spacing:-.01em">Por que contratar consultoria se já invisto sozinho?</span>'''

content = re.sub(old_faq, new_faq, content)

# 5. Footer URL
content = content.replace('href="https://grupoprimo.com.br"', 'href="https://www.grupo-primo.com/"')


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Ajustes concluidos!")
