import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 3. Parceria Layout & Cards
old_parceria = r'''<!-- PARCERIA -->\s*<section id="parceria" .*?</div>\s*</section>'''

new_parceria = '''<!-- PARCERIA -->
<section id="parceria" style="position:relative;padding:120px 56px;border-top:1px solid rgba(59,54,204,.35);overflow:hidden;background:#04020C;">
  
  <!-- IMAGEM COM MÁSCARA -->
  <div style="position:absolute;top:0;bottom:0;right:0;width:50%;background:url('midias/fotos novas do leonardo/leonardo-arruda-consultor-de-investimentos-portfel (1).jpeg') center/cover no-repeat;mask-image:linear-gradient(to right, transparent, black 40%);-webkit-mask-image:linear-gradient(to right, transparent, black 40%);opacity:0.9"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to right, #04020C 50%, transparent);pointer-events:none"></div>

  <div style="max-width:1300px;margin:0 auto;position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;">
    
    <!-- CONTEUDO TEXTO (ESQUERDA) -->
    <div data-reveal style="max-width:560px;">
      <div style="font-family:var(--m);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--vio2);margin-bottom:14px">O que Leonardo Arruda & Portfel oferecem?</div>
      <h2 style="font-family:var(--d);font-weight:400;font-size:clamp(36px,3.5vw,52px);line-height:1.0;letter-spacing:-.02em;color:var(--txt)">Estrutura de elite<br>para o seu patrimônio.</h2>
      <p style="font-family:var(--s);font-size:16.5px;line-height:1.6;color:var(--mut);margin-top:24px;font-weight:300;">Minha consultoria une o atendimento pessoal, próximo e artesanal com a estrutura institucional robusta da maior plataforma independente do Brasil.</p>
    </div>
    
    <!-- CARDS (MEIO/DIREITA) -->
    <div data-reveal style="display:flex;flex-direction:column;gap:12px;padding-right:20%">
      <div style="background:rgba(8,5,23,0.85);border:1px solid rgba(107,102,232,0.2);padding:24px 28px;border-radius:12px;backdrop-filter:blur(8px)">
        <div style="font-family:var(--d);font-size:19px;color:#fff;margin-bottom:6px;font-weight:500">Fee Based · Sem conflito</div>
        <div style="font-family:var(--s);font-size:14px;color:rgba(255,255,255,0.6);line-height:1.55;font-weight:300">Remuneração transparente, alinhada ao cliente e nunca ao produto.</div>
      </div>
      <div style="background:rgba(8,5,23,0.85);border:1px solid rgba(107,102,232,0.2);padding:24px 28px;border-radius:12px;backdrop-filter:blur(8px)">
        <div style="font-family:var(--d);font-size:19px;color:#fff;margin-bottom:6px;font-weight:500">Produtos exclusivos</div>
        <div style="font-family:var(--s);font-size:14px;color:rgba(255,255,255,0.6);line-height:1.55;font-weight:300">Fundos exclusivos, estruturas offshore e produtos que bancos não oferecem.</div>
      </div>
      <div style="background:rgba(8,5,23,0.85);border:1px solid rgba(107,102,232,0.2);padding:24px 28px;border-radius:12px;backdrop-filter:blur(8px)">
        <div style="font-family:var(--d);font-size:19px;color:#fff;margin-bottom:6px;font-weight:500">Plataforma nacional</div>
        <div style="font-family:var(--s);font-size:14px;color:rgba(255,255,255,0.6);line-height:1.55;font-weight:300">Infraestrutura e tecnologia de uma das maiores consultorias do Grupo Primo.</div>
      </div>
    </div>
    
  </div>
</section>'''

# Because dotall regex might match too much if not careful, I will use a simple split/join strategy if dotall is risky.
content = re.sub(old_parceria, new_parceria, content, flags=re.DOTALL)


# 4. Três decisões (Método) CSS and HTML adjustments
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
  background: var\(--txt\);
  min-width: 400px;
\}
\.met-card:hover \.met-card-open \{
  opacity: 1;
  pointer-events: auto;
  transition-delay: 0\.1s;
\}
\.met-card-open h3 \{
  font-family: var\(--d\);
  font-size: 42px;
  color: var\(--bg\);
  margin-bottom: 20px;
  line-height: 1\.0;
  font-weight: 500;
  letter-spacing: -0\.02em;
\}
\.met-card-open p \{
  font-family: var\(--s\);
  font-size: 16px;
  line-height: 1\.6;
  color: #222;
  font-weight: 400;
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
  background: var(--s2);
  min-width: 400px;
  border: 1px solid rgba(107,102,232,0.15);
}
.met-card.is-active .met-card-open {
  opacity: 1;
  pointer-events: auto;
}
.met-card:hover .met-card-open {
  opacity: 1;
  pointer-events: auto;
  transition-delay: 0.1s;
}
.met-card-open h3 {
  font-family: var(--d);
  font-size: clamp(34px, 3.5vw, 44px);
  color: var(--txt);
  margin-bottom: 20px;
  line-height: 1.0;
  font-weight: 400;
  letter-spacing: -0.01em;
}
.met-card-open p {
  font-family: var(--s);
  font-size: 16px;
  line-height: 1.6;
  color: var(--mut);
  font-weight: 300;
}'''

content = re.sub(old_met_css, new_met_css, content, flags=re.MULTILINE)

# Make the first card active initially, and handle hover via JS
content = content.replace('<div class="met-card">', '<div class="met-card is-active">', 1)

# Inject JS for met-card
# To avoid the active card staying active when hovering others:
js_snippet = '''
  // MET-CARD HOVER
  const metCards = document.querySelectorAll('.met-card');
  metCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      metCards.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
    });
  });
'''
if '// MET-CARD HOVER' not in content:
    content = content.replace('// REVEAL', js_snippet + '\n  // REVEAL')


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Parceria and Método updated.")
