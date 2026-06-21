import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# --- 2. COMO FUNCIONA (Método) ---
# Update met-card CSS
old_met_css = r'''\.met-card-open \{
  position: absolute;
  inset: 0;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transition: opacity 0\.4s;
  pointer-events: none;
  background: #fff;
  min-width: 400px;
\}
\.met-card:hover \.met-card-open \{
  opacity: 1;
  pointer-events: auto;
  transition-delay: 0\.1s;
\}
\.met-card-open h3 \{
  font-family: var\(--d\);
  font-size: 38px;
  color: #04020C;
  margin-bottom: 20px;
  line-height: 1\.0;
  font-weight: 400;
\}
\.met-card-open p \{
  font-family: var\(--s\);
  font-size: 15\.5px;
  line-height: 1\.7;
  color: #444;
  font-weight: 300;
\}'''

new_met_css = '''.met-card-open {
  position: absolute;
  inset: 0;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  background: var(--txt);
  min-width: 400px;
}
.met-card:hover .met-card-open {
  opacity: 1;
  pointer-events: auto;
  transition-delay: 0.1s;
}
.met-card-open h3 {
  font-family: var(--d);
  font-size: 42px;
  color: var(--bg);
  margin-bottom: 20px;
  line-height: 1.0;
  font-weight: 500;
  letter-spacing: -0.02em;
}
.met-card-open p {
  font-family: var(--s);
  font-size: 16px;
  line-height: 1.6;
  color: #222;
  font-weight: 400;
}'''

content = re.sub(old_met_css, new_met_css, content, flags=re.MULTILINE)

# Update Bottom Strip in Método
old_strip = r'''<div data-reveal style="display:grid;grid-template-columns:repeat\(3,1fr\);gap:1px;background:var\(--brd\);margin-top:60px;border-radius:10px;overflow:hidden">.*?</div>\s*</div>\s*</section>'''
new_strip = '''<div data-reveal style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--brd2);margin-top:70px;border-radius:12px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.2)">
      <div style="background:var(--s2);padding:28px 32px;display:flex;flex-direction:column;gap:12px">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--txt)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        <span style="font-family:var(--s);font-size:15px;color:var(--mut);font-weight:300;line-height:1.4">Resposta em até<br><strong style="color:var(--txt);font-weight:500;font-size:17px">24 horas</strong></span>
      </div>
      <div style="background:var(--s2);padding:28px 32px;display:flex;flex-direction:column;gap:12px">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--txt)" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span style="font-family:var(--s);font-size:15px;color:var(--mut);font-weight:300;line-height:1.4">Modelo fee-based<br><strong style="color:var(--txt);font-weight:500;font-size:17px">Sem conflito</strong></span>
      </div>
      <div style="background:var(--s2);padding:28px 32px;display:flex;flex-direction:column;gap:12px">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--txt)" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span style="font-family:var(--s);font-size:15px;color:var(--mut);font-weight:300;line-height:1.4">Alinhamento total<br><strong style="color:var(--txt);font-weight:500;font-size:17px">1ª conversa grátis</strong></span>
      </div>
    </div>

  </div>
</section>'''

content = re.sub(old_strip, new_strip, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Metodo updated.")
