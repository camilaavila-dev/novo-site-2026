import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# --- 5. Atendimento ---
old_presenca = r'''<!-- PRESENÇA / ONDE LEO ATENDE -->
<section id="presenca" style="background:var\(--s1\);padding:88px 56px;border-top:1px solid var\(--brd\)">
.*?
</section>'''

new_presenca = '''<!-- PRESENÇA / ONDE LEO ATENDE -->
<section id="presenca" style="position:relative;background:var(--bg);padding:140px 56px;border-top:1px solid var(--brd);overflow:hidden;">
  <div style="position:absolute;top:0;bottom:0;right:0;width:55%;background:url('midias/Mapa de Atendimento.jpeg') center/cover no-repeat;mask-image:linear-gradient(to right, transparent, black 40%);-webkit-mask-image:linear-gradient(to right, transparent, black 40%);opacity:.65"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to right, var(--bg) 40%, transparent);pointer-events:none"></div>
  
  <div style="max-width:1300px;margin:0 auto;position:relative;z-index:2">
    <div data-reveal style="max-width:550px">
      <div style="font-family:var(--m);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--grn);margin-bottom:20px">Atendimento Global</div>
      <h2 style="font-family:var(--d);font-weight:400;font-size:clamp(36px,3.5vw,52px);line-height:1.05;letter-spacing:-.02em;color:var(--txt)">Hoje tenho clientes em todo o Brasil e na Europa.</h2>
      
      <div style="display:flex;align-items:center;gap:16px;margin-top:48px;margin-bottom:48px">
        <div style="width:54px;height:54px;border-radius:50%;overflow:hidden;flex:none;border:1px solid var(--brd2)">
          <img src="midias/leo-photo-2.jpg" alt="Leonardo Arruda" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;filter:saturate(.5) contrast(1.1)">
        </div>
        <div>
          <div style="font-family:var(--d);font-weight:500;font-size:18px;color:var(--txt)">Leonardo Arruda</div>
          <div style="font-family:var(--m);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--sub);margin-top:3px">Consultor · Atendimento Remoto e Presencial</div>
        </div>
      </div>

      <a href="https://forms.office.com/pages/responsepage.aspx?id=0sB_G11vUEO_0B1-yL_T41SihZlTmsJEnYw1V7x5G8RURVhRMFRNMlUyUkhSRUdQUDU4UEs5TEVIMi4u" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;background:var(--txt);color:var(--bg);font-family:var(--s);font-size:15px;font-weight:500;padding:0 36px;height:54px;border-radius:27px;text-decoration:none;transition:transform .2s, opacity .2s;box-shadow:0 10px 30px rgba(237,232,213,.15)">Agendar Reunião</a>
    </div>
  </div>
</section>'''

content = re.sub(old_presenca, new_presenca, content, flags=re.DOTALL)


# --- 6. CTA Final ---
old_cta = r'''<!-- CTA FINAL -->
<section id="cta" style="position:relative;overflow:hidden;background:var\(--grn-bg\);padding:120px 56px;border-top:1px solid rgba\(28,217,138,\.12\)">
.*?
</section>'''

new_cta = '''<!-- CTA FINAL -->
<section id="cta" style="position:relative;overflow:hidden;background:var(--s3);padding:140px 56px;border-top:1px solid rgba(59,54,204,.35)">
  <div style="position:absolute;inset:0;background:url('midias/fotos novas do leonardo/leonardo-arruda-consultor-de-investimentos-portfel (2).jpeg') center 20%/cover no-repeat;opacity:0.25;mix-blend-mode:luminosity;"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to top, var(--s3) 10%, transparent);pointer-events:none"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom, var(--s3) 5%, transparent);pointer-events:none"></div>

  <div style="max-width:1300px;margin:0 auto;text-align:center;position:relative;z-index:2">
    <div data-reveal>
      <div style="font-family:var(--m);font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--vio2);margin-bottom:20px">Pronto para começar?</div>
      <h2 style="font-family:var(--d);font-weight:300;font-size:clamp(44px,5vw,78px);line-height:1.0;letter-spacing:-.025em;color:var(--txt);text-shadow:0 10px 40px rgba(0,0,0,.5)">Organize o patrimônio<br>que você construiu.</h2>
      <p style="font-family:var(--s);font-size:18px;line-height:1.65;color:rgba(237,232,213,.7);margin:26px auto 0;max-width:50ch;font-weight:300">Uma conversa inicial. Sem compromisso. Para entender o seu cenário e ver se faz sentido avançar juntos.</p>
      <div style="margin-top:40px">
        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=6ez5YgM1m0G2Yyy_xOsD25muVoj4MslItAJalz086_lURDhJV1Y0QlVaUTZFV0RORUZMMUg2S1NKTi4u" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;padding:0 48px;height:56px;background:var(--txt);color:var(--bg);font-family:var(--s);font-weight:500;font-size:16px;border-radius:28px;text-decoration:none;box-shadow:0 10px 30px rgba(237,232,213,.2);transition:transform .2s">Agendar conversa gratuita</a>
      </div>
      <div style="font-family:var(--m);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(237,232,213,.4);margin-top:28px">Resposta em até 24h · Gratuito · Sem compromisso</div>
    </div>
  </div>
</section>'''

content = re.sub(old_cta, new_cta, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Atendimento & CTA updated.")
