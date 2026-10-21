import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 5. Gratuito text replacement
content = content.replace('Reuniões de diagnóstico gratuito', 'Reuniões de diagnóstico sem custo')
content = content.replace('Agendar conversa gratuita', 'Agendar conversa sem custo')
content = content.replace('Gratuito · Sem compromisso', 'Sem custo · Sem compromisso')


# 6. CTA background and text
old_cta_regex = r'''<section id="cta" style="position:relative;overflow:hidden;background:var\(--s3\);padding:140px 56px;border-top:1px solid rgba\(59,54,204,\.35\)">
  <div style="position:absolute;inset:0;background:url\('midias/fotos novas do leonardo/leonardo-arruda-consultor-de-investimentos-portfel \(2\)\.jpeg'\) center 20%/cover no-repeat;opacity:0\.25;mix-blend-mode:luminosity;"></div>'''

new_cta_replacement = '''<section id="cta" style="position:relative;overflow:hidden;background:var(--s3);padding:140px 56px;border-top:1px solid rgba(59,54,204,.35)">
  <div style="position:absolute;inset:0;background:url('midias/fotos novas do leonardo/leonardo-arruda-consultor-de-investimentos-portfel (2).jpeg') center 10%/cover no-repeat;opacity:0.35;"></div>'''

content = re.sub(old_cta_regex, new_cta_replacement, content)


# 7. Rodapé replacement
old_footer_regex = r'<footer .*?</footer>'

new_footer = '''<footer style="background:var(--bg);padding:60px 56px;border-top:1px solid var(--brd)">
  <div style="max-width:1300px;margin:0 auto">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:60px;flex-wrap:wrap;gap:40px">
      <div>
        <div style="margin-bottom:14px"><img src="midias/logo-leo.webp" alt="Leonardo Arruda" style="height:34px;filter:invert(1);mix-blend-mode:screen;object-fit:contain"></div>
        <div style="font-family:var(--s);font-size:13.5px;color:var(--sub);line-height:1.8;font-weight:300">
          Consultor de Investimentos · ANBIMA CEA<br>
          Portfel · Grupo Primo · Itapetininga, SP<br><br>
          <strong style="color:var(--txt);font-weight:500">LEONARDO ARRUDA DOS SANTOS LTDA - ME</strong><br>
          Nome Fantasia: LA CONSULTORIA & NEGOCIOS<br>
          CNPJ: 54.475.818/0001-90
        </div>
      </div>
      <div style="display:flex;gap:80px;flex-wrap:wrap">
        <div>
          <div style="font-family:var(--m);font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--sub);margin-bottom:18px">Menu</div>
          <div style="display:flex;flex-direction:column;gap:12px">
            <a href="#sobre" style="font-family:var(--s);font-size:13.5px;color:var(--mut);text-decoration:none;font-weight:300">Sobre o consultor</a>
            <a href="#servicos" style="font-family:var(--s);font-size:13.5px;color:var(--mut);text-decoration:none;font-weight:300">Escopo de Atuação</a>
            <a href="#metodo" style="font-family:var(--s);font-size:13.5px;color:var(--mut);text-decoration:none;font-weight:300">O Método</a>
            <a href="#presenca" style="font-family:var(--s);font-size:13.5px;color:var(--mut);text-decoration:none;font-weight:300">Atendimento Global</a>
          </div>
        </div>
        <div>
          <div style="font-family:var(--m);font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--sub);margin-bottom:18px">Ecossistema</div>
          <div style="display:flex;flex-direction:column;gap:12px">
            <a href="https://portfel.com.br" target="_blank" style="font-family:var(--s);font-size:13.5px;color:var(--mut);text-decoration:none;font-weight:300">Portfel Consultoria</a>
            <a href="https://investimentos.com.br" target="_blank" style="font-family:var(--s);font-size:13.5px;color:var(--mut);text-decoration:none;font-weight:300">Portal Investimentos.com.br</a>
            <a href="https://grupoprimo.com.br" target="_blank" style="font-family:var(--s);font-size:13.5px;color:var(--mut);text-decoration:none;font-weight:300">Grupo Primo</a>
          </div>
        </div>
      </div>
    </div>
    
    <div style="border-top:1px solid var(--brd2);padding-top:32px;margin-bottom:32px;">
      <p style="font-family:var(--s);font-size:12px;line-height:1.8;color:rgba(237,232,213,.35);font-weight:300;max-width:1000px;text-align:justify;">
        A Portfel Consultoria Financeira LTDA, inscrita no CNPJ/ME sob o nº 37.576.416/0001-62, é registrada como Consultoria de Valores Mobiliários na Comissão de Valores Mobiliários (CVM), nos termos da Resolução CVM nº 19/2021 e é controlada pela O Primo Rico Mídia, Educacional e Participações S.A.<br><br>
        A Portfel não realiza intermediação, custódia ou administração de recursos de clientes. Todas as aplicações devem ser efetuadas diretamente em instituições autorizadas a operar pelo Banco Central do Brasil e/ou pela CVM.<br><br>
        As informações disponibilizadas têm caráter exclusivamente informativo e não constituem oferta ou recomendação de investimento. Rentabilidade passada não garante resultados futuros.
      </p>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:24px;border-top:1px solid var(--brd2)">
      <div style="font-family:var(--m);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--sub)">© 2026 Leonardo Arruda. Todos os direitos reservados.</div>
      <div style="font-family:var(--m);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--sub);display:flex;gap:20px">
        <a href="#" style="color:var(--sub);text-decoration:none">Política de Privacidade</a>
        <a href="#" style="color:var(--sub);text-decoration:none">Termos de Uso</a>
      </div>
    </div>
  </div>
</footer>'''

content = re.sub(old_footer_regex, new_footer, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Textos, CTA e Rodapé atualizados.")
