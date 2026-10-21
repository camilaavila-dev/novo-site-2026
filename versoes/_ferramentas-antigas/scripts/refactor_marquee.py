import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# --- 3. Marquee ---
# Fix logos and infinite loop
old_marquee = r'''<style>\s*@keyframes scrollMarquee.*?</div>\s*</div>\s*</section>'''
new_marquee = '''<style>
@keyframes scrollMarquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-wrapper {
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 40px 0;
  display: flex;
}
.marquee-track {
  display: flex;
  align-items: center;
  animation: scrollMarquee 40s linear infinite;
  white-space: nowrap;
  width: max-content;
}
.marquee-track img {
  height: 38px;
  object-fit: contain;
  filter: grayscale(1) brightness(2) contrast(0.5);
  opacity: 0.6;
  transition: opacity 0.3s;
  margin: 0 60px;
}
.marquee-track img:hover {
  opacity: 1;
  filter: none;
}
</style>
    <div class="marquee-wrapper">
      <div class="marquee-track">
        <img src="midias/bancos parceiros/btg-pactual-nome-.svg" alt="BTG Pactual">
        <img src="midias/bancos parceiros/xp-investimentos-logo.svg" alt="XP Investimentos" style="height:58px">
        <img src="midias/bancos parceiros/logo-safra.svg" alt="Safra" style="height:44px">
        <img src="midias/bancos parceiros/morganstanley.webp" alt="Morgan Stanley" style="height:44px">
        <img src="midias/bancos parceiros/inter.svg" alt="Inter" style="height:44px">
        <img src="midias/bancos parceiros/logo-new-avenue.svg" alt="Avenue" style="height:44px">
        <img src="midias/bancos parceiros/nomad.webp" alt="Nomad" style="height:44px">
        <img src="midias/bancos parceiros/agora.webp" alt="Agora" style="height:44px">
        <!-- DUPLICATE SET -->
        <img src="midias/bancos parceiros/btg-pactual-nome-.svg" alt="BTG Pactual">
        <img src="midias/bancos parceiros/xp-investimentos-logo.svg" alt="XP Investimentos" style="height:58px">
        <img src="midias/bancos parceiros/logo-safra.svg" alt="Safra" style="height:44px">
        <img src="midias/bancos parceiros/morganstanley.webp" alt="Morgan Stanley" style="height:44px">
        <img src="midias/bancos parceiros/inter.svg" alt="Inter" style="height:44px">
        <img src="midias/bancos parceiros/logo-new-avenue.svg" alt="Avenue" style="height:44px">
        <img src="midias/bancos parceiros/nomad.webp" alt="Nomad" style="height:44px">
        <img src="midias/bancos parceiros/agora.webp" alt="Agora" style="height:44px">
      </div>
    </div>
  </div>
</section>'''

content = re.sub(old_marquee, new_marquee, content, flags=re.DOTALL)

# --- 4. Parceria (Estrutura de Elite) ---
old_parceria = r'''<!-- PARCERIA -->
<section id="parceria" style="position:relative;padding:120px 56px;border-top:1px solid rgba\(59,54,204,\.35\);overflow:hidden;background:#04020C;">
  <div style="position:absolute;inset:0;background:url\('midias/fotos novas do leonardo/leonardo-arruda-consultor-de-investimentos-portfel \(1\)\.jpeg'\) right center/contain no-repeat;mask-image:linear-gradient\(to right, transparent, black 80%\);-webkit-mask-image:linear-gradient\(to right, transparent, black 80%\);opacity:\.8"></div>
  <div style="max-width:1300px;margin:0 auto;position:relative;z-index:2">
    <div data-reveal style="text-align:center;margin-bottom:60px">
      <div style="font-family:var\(--m\);font-size:10\.5px;letter-spacing:\.2em;text-transform:uppercase;color:var\(--vio2\);margin-bottom:14px">O que Leonardo Arruda & Portfel oferecem\?</div>
      <h2 style="font-family:var\(--d\);font-weight:400;font-size:clamp\(32px,3vw,48px\);line-height:1\.0;letter-spacing:-\.02em;color:var\(--txt\)">Estrutura de elite<br>para o seu patrimônio\.</h2>
      <p style="font-family:var\(--s\);font-size:16px;line-height:1\.6;color:var\(--mut\);margin-top:18px;font-weight:300;max-width:600px;margin-left:auto;margin-right:auto">Minha consultoria une o atendimento pessoal, próximo e artesanal com a estrutura institucional robusta da maior plataforma independente do Brasil\.</p>
    </div>'''

new_parceria = '''<!-- PARCERIA -->
<section id="parceria" style="position:relative;padding:120px 56px 120px 0;border-top:1px solid rgba(59,54,204,.35);overflow:hidden;background:#04020C;">
  <div style="max-width:1300px;margin:0 auto;display:flex;align-items:center;gap:60px;">
    
    <!-- CONTEUDO TEXTO (ESQUERDA) -->
    <div data-reveal style="flex:1;padding-left:56px;">
      <div style="font-family:var(--m);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--vio2);margin-bottom:14px">O que Leonardo Arruda & Portfel oferecem?</div>
      <h2 style="font-family:var(--d);font-weight:400;font-size:clamp(36px,3.5vw,52px);line-height:1.0;letter-spacing:-.02em;color:var(--txt)">Estrutura de elite<br>para o seu patrimônio.</h2>
      <p style="font-family:var(--s);font-size:16.5px;line-height:1.6;color:var(--mut);margin-top:24px;font-weight:300;">Minha consultoria une o atendimento pessoal, próximo e artesanal com a estrutura institucional robusta da maior plataforma independente do Brasil.</p>
    </div>
    
    <!-- IMAGEM (DIREITA) -->
    <div data-reveal style="flex:1;height:550px;">
      <img src="midias/fotos novas do leonardo/leonardo-arruda-consultor-de-investimentos-portfel (1).jpeg" alt="Estrutura de Elite" style="width:100%;height:100%;object-fit:cover;object-position:center;border-radius:40px 0 0 40px;filter:saturate(0.8) contrast(1.1);">
    </div>
    
  </div>'''

content = re.sub(old_parceria, new_parceria, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Marquee & Parceria updated.")
