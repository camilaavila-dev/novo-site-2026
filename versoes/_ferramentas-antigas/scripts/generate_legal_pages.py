import re

with open('c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

head_nav_match = re.search(r'(<!DOCTYPE html>.*?</nav>)', html, re.DOTALL)
footer_match = re.search(r'(<!-- FOOTER -->.*</html>)', html, re.DOTALL)

if not (head_nav_match and footer_match):
    print("Could not extract header and footer.")
    exit(1)

head_nav = head_nav_match.group(1)
footer = footer_match.group(1)

# Modify title in head
def replace_title(header, new_title):
    return re.sub(r'<title>.*?</title>', f'<title>{new_title}</title>', header)

# Base layout for legal pages
def build_page(title, content):
    h = replace_title(head_nav, title)
    body = f"""
<!-- LEGAL CONTENT -->
<section style="background:var(--bg);padding:140px 24px 80px;min-height:70vh;">
  <div style="max-width:800px;margin:0 auto;">
    <h1 style="font-family:var(--d);font-weight:400;font-size:clamp(32px,5vw,48px);line-height:1.1;letter-spacing:-.02em;color:var(--txt);margin-bottom:24px">{title.split(' | ')[0]}</h1>
    <div style="width:60px;height:2px;background:var(--grn);margin-bottom:48px;"></div>
    
    <div style="font-family:var(--s);font-size:16px;line-height:1.8;color:rgba(255,255,255,.7);font-weight:300;">
{content}
    </div>
  </div>
</section>
"""
    return h + "\n" + body + "\n" + footer

termos_content = """
      <h2 style="font-family:var(--d);font-size:24px;color:var(--txt);margin:40px 0 16px;font-weight:400">1. Aceitação dos Termos</h2>
      <p style="margin-bottom:24px">Ao acessar e utilizar este site, o usuário concorda com os presentes Termos de Uso. Caso não concorde com alguma das condições estabelecidas, recomenda-se a interrupção do uso deste canal.</p>

      <h2 style="font-family:var(--d);font-size:24px;color:var(--txt);margin:40px 0 16px;font-weight:400">2. Natureza Informativa e Limitação de Responsabilidade</h2>
      <p style="margin-bottom:24px">Todo o conteúdo disponibilizado neste site possui caráter exclusivamente informativo e educacional. <strong>Nenhuma informação contida neste site constitui recomendação direta de investimento, oferta de produtos financeiros, aconselhamento fiscal ou jurídico.</strong></p>
      <p style="margin-bottom:24px">O serviço de consultoria financeira prestado por Leonardo Arruda (vinculado à Portfel e Grupo Primo) é realizado de forma estritamente personalizada, mediante assinatura de contrato de prestação de serviços específico e alinhamento de perfil de risco (Suitability). Decisões de investimento tomadas com base no conteúdo deste site, sem o devido acompanhamento profissional contratado, são de inteira responsabilidade do usuário.</p>

      <h2 style="font-family:var(--d);font-size:24px;color:var(--txt);margin:40px 0 16px;font-weight:400">3. Vínculo Institucional</h2>
      <p style="margin-bottom:24px">Leonardo Arruda atua como Consultor de Investimentos (CVM/ANBIMA CEA) parceiro da Portfel. As opiniões aqui expressas são pessoais e profissionais, podendo não refletir integralmente as opiniões institucionais da Portfel, do Grupo Primo ou de instituições parceiras mencionadas.</p>

      <h2 style="font-family:var(--d);font-size:24px;color:var(--txt);margin:40px 0 16px;font-weight:400">4. Direitos Autorais e Propriedade Intelectual</h2>
      <p style="margin-bottom:24px">A estrutura, textos, logotipos, imagens e a identidade visual (design) presentes neste site são protegidos por leis de propriedade intelectual. É proibida a reprodução, distribuição ou modificação de qualquer conteúdo sem a prévia autorização.</p>
      <p style="margin-bottom:24px"><em>Design e desenvolvimento: Agência Brasilis (agenciabrasilis.com).</em></p>

      <h2 style="font-family:var(--d);font-size:24px;color:var(--txt);margin:40px 0 16px;font-weight:400">5. Modificações nos Termos</h2>
      <p style="margin-bottom:24px">Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento, sem aviso prévio. Recomendamos a leitura periódica desta página.</p>
"""

privacidade_content = """
      <p style="margin-bottom:24px">A proteção dos seus dados pessoais e o respeito à sua privacidade são pilares fundamentais da nossa atuação. Esta Política de Privacidade descreve como tratamos as informações coletadas por meio deste site, em total conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>

      <h2 style="font-family:var(--d);font-size:24px;color:var(--txt);margin:40px 0 16px;font-weight:400">1. Coleta de Dados</h2>
      <p style="margin-bottom:24px">Os únicos dados pessoais coletados neste site são aqueles fornecidos voluntariamente por você ao preencher nossos formulários de agendamento (via Microsoft Forms ou plataformas integradas similares). Esses dados geralmente incluem: Nome completo, E-mail, Telefone/WhatsApp, e informações financeiras preliminares que você optar por compartilhar para fins de triagem e contato inicial.</p>

      <h2 style="font-family:var(--d);font-size:24px;color:var(--txt);margin:40px 0 16px;font-weight:400">2. Uso das Informações</h2>
      <p style="margin-bottom:24px">Os dados fornecidos são utilizados <strong>exclusivamente</strong> para as seguintes finalidades:</p>
      <ul style="margin-bottom:24px;padding-left:20px;">
        <li style="margin-bottom:8px">Entrar em contato para agendar a sua conversa/diagnóstico inicial;</li>
        <li style="margin-bottom:8px">Entender preliminarmente o seu momento patrimonial para otimizar o atendimento;</li>
        <li style="margin-bottom:8px">Envio pontual de comunicações institucionais de Leonardo Arruda ou da Portfel (apenas se houver consentimento expresso).</li>
      </ul>

      <h2 style="font-family:var(--d);font-size:24px;color:var(--txt);margin:40px 0 16px;font-weight:400">3. Compartilhamento de Dados</h2>
      <p style="margin-bottom:24px"><strong>Seus dados não são vendidos, alugados ou cedidos a terceiros.</strong> As informações podem ser compartilhadas apenas com a Portfel e o Grupo Primo, estritamente no escopo da prestação de serviço de consultoria de investimentos, ou quando exigido por determinações legais ou regulatórias (CVM/ANBIMA).</p>

      <h2 style="font-family:var(--d);font-size:24px;color:var(--txt);margin:40px 0 16px;font-weight:400">4. Armazenamento e Segurança</h2>
      <p style="margin-bottom:24px">Adotamos práticas de segurança corporativas de alto padrão para garantir a integridade e a confidencialidade das suas informações, utilizando plataformas institucionais seguras (como o ecossistema Office 365 e ferramentas da Portfel) para o armazenamento e gestão dos dados.</p>

      <h2 style="font-family:var(--d);font-size:24px;color:var(--txt);margin:40px 0 16px;font-weight:400">5. Seus Direitos</h2>
      <p style="margin-bottom:24px">De acordo com a LGPD, você possui o direito de solicitar a qualquer momento o acesso, a correção, a anonimização ou a exclusão dos seus dados pessoais da nossa base. Para exercer esses direitos, basta entrar em contato conosco pelos canais de atendimento disponibilizados no rodapé deste site.</p>
"""

termos_html = build_page("Termos de Uso | Leonardo Arruda", termos_content)
privacidade_html = build_page("Política de Privacidade | Leonardo Arruda", privacidade_content)

with open('c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/termos.html', 'w', encoding='utf-8') as f:
    f.write(termos_html)

with open('c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/privacidade.html', 'w', encoding='utf-8') as f:
    f.write(privacidade_html)

print("Pages generated successfully.")
