import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Sobre image
content = content.replace('.sobre-img-box[data-reveal] { position: absolute; top: 0; bottom: 0; left: 0; width: 45%;', '.sobre-img-box[data-reveal] { position: absolute; top: 0; bottom: 0; left: 0; width: 38%;')

# 2. Marquee
old_marquee_imgs = r'''<img src="midias/bancos parceiros/btg-pactual-nome-\.svg" alt="BTG Pactual">
        <img src="midias/bancos parceiros/xp-investimentos-logo\.svg" alt="XP Investimentos" style="height:58px">
        <img src="midias/bancos parceiros/logo-safra\.svg" alt="Safra" style="height:44px">
        <img src="midias/bancos parceiros/morganstanley\.webp" alt="Morgan Stanley" style="height:44px">
        <img src="midias/bancos parceiros/inter\.svg" alt="Inter" style="height:44px">
        <img src="midias/bancos parceiros/logo-new-avenue\.svg" alt="Avenue" style="height:44px">
        <img src="midias/bancos parceiros/nomad\.webp" alt="Nomad" style="height:44px">
        <img src="midias/bancos parceiros/agora\.webp" alt="Agora" style="height:44px">'''

new_marquee_imgs = '''<img src="midias/bancos parceiros/btg-pactual-nome-.svg" alt="BTG Pactual" style="height:50px">
        <img src="midias/bancos parceiros/xp-investimentos-logo.svg" alt="XP Investimentos" style="height:58px">
        <img src="midias/bancos parceiros/logo-safra.svg" alt="Safra" style="height:54px">
        <img src="midias/bancos parceiros/morganstanley.webp" alt="Morgan Stanley" style="height:54px">
        <img src="midias/bancos parceiros/inter.svg" alt="Inter" style="height:44px">
        <img src="midias/bancos parceiros/logo-new-avenue.svg" alt="Avenue" style="height:44px">
        <img src="midias/bancos parceiros/nomad.webp" alt="Nomad" style="height:50px">
        <img src="midias/bancos parceiros/agora.webp" alt="Agora" style="height:54px;object-fit:contain">'''

content = content.replace(old_marquee_imgs, new_marquee_imgs)

# Allow images to grow by removing the global limit if it exists, or just use CSS
content = content.replace('.marquee-track img {\n  height: 38px;', '.marquee-track img {\n  height: 48px;')


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Sobre and Marquee updated.")
