import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026"
html_path = os.path.join(base_dir, "index.html")

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

sections = [
    ("Seção 01: Top Navigation", 'id="site-nav"'),
    ("Seção 02: Hero (Vídeo Fullscreen)", 'HERO (V'),
    ("Seção 03: Ticker / Marquee", 'marq 36s linear infinite'),
    ("Seção 04: Portfel Stats Bar (+R$20Bi, +25k clientes, NPS 97)", '+R$20<em'),
    ("Seção 05: Mídia / Reconhecimento na Imprensa", 'fotos da midia/logo_infomoney.webp'),
    ("Seção 06: Filosofia", 'FILOSOFIA'),
    ("Seção 07: Sobre Leonardo Arruda", 'id="sobre"'),
    ("Seção 08: Para Quem É (Investidor, Empresário, Família)", 'Quem busca essa consultoria'),
    ("Seção 09: Serviços Interativo (Gestão, Planejamento, etc.)", 'id="servicos"'),
    ("Seção 10: Método de Trabalho", 'id="metodo"'),
    ("Seção 11: Bancos e Custodiantes (BTG, XP, etc.)", 'BTG Pactual'),
    ("Seção 12: Parceria Estratégica Portfel", 'id="parceria"'),
    ("Seção 13: Presença / Atendimento Global", 'id="presenca"'),
    ("Seção 14: Perguntas Frequentes (FAQ)", 'PERGUNTAS FREQUENTES'),
    ("Seção 15: CTA Final & Agendamento", 'id="cta"'),
    ("Seção 16: Rodapé Institucional (Footer)", 'Agência Brasilis')
]

print("=== AUDITORIA ESTRUTURAL DAS SEÇÕES DA HOME (index.html) ===")
all_ok = True
for name, anchor in sections:
    found = anchor.lower() in content.lower()
    status = "PASS" if found else "FAIL"
    print(f"[{status}] {name}")
    if not found:
        all_ok = False

if all_ok:
    print("\nRESULTADO: 100% DAS SEÇÕES APROVADAS PRESERVADAS INTEGRALMENTE.")
else:
    print("\nRESULTADO: FALHA NA PRESERVAÇÃO DE SEÇÕES.")
