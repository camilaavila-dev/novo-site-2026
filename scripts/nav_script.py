import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make the nav logo dynamic
old_nav = r'<nav id="site-nav" style="position:fixed;top:0;left:0;right:0;z-index:200;height:70px;display:flex;align-items:center;justify-content:space-between;padding:0 56px;background:rgba\(4,2,12,\.72\);backdrop-filter:blur\(22px\);border-bottom:1px solid var\(--brd\);transition:background \.4s">'
new_nav = '<nav id="site-nav" style="position:fixed;top:0;left:0;right:0;z-index:200;height:100px;display:flex;align-items:center;justify-content:space-between;padding:0 56px;background:transparent;backdrop-filter:blur(0px);border-bottom:1px solid transparent;transition:height 0.4s ease, background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease">'

content = re.sub(old_nav, new_nav, content)

# Change the logo img inside the nav to have an ID and initial large size
old_logo = r'<img src="midias/logo-leo.webp" alt="Leonardo Arruda" style="height:36px;filter:invert\(1\);mix-blend-mode:screen;object-fit:contain">'
# Note: Since I will edit the image itself, I don't need mix-blend-mode anymore.
# We will point to logo-leo-white.png which will be pure white text on transparent BG.
new_logo = '<img id="nav-logo" src="midias/logo-leo-white.png" alt="Leonardo Arruda" style="height:54px;object-fit:contain;transition:height 0.4s ease">'

content = re.sub(old_logo, new_logo, content)

# Also update the footer logo to the new transparent one!
old_footer_logo = r'<img src="midias/logo-leo.webp" alt="Leonardo Arruda" style="height:34px;filter:invert\(1\);mix-blend-mode:screen;object-fit:contain">'
new_footer_logo = '<img src="midias/logo-leo-white.png" alt="Leonardo Arruda" style="height:34px;object-fit:contain">'
content = re.sub(old_footer_logo, new_footer_logo, content)


# Inject JS for scrolling effect
js_scroll = '''
  // NAV SCROLL EFFECT
  const siteNav = document.getElementById('site-nav');
  const navLogo = document.getElementById('nav-logo');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 50) {
      siteNav.style.height = '70px';
      siteNav.style.background = 'rgba(4,2,12,.85)';
      siteNav.style.backdropFilter = 'blur(22px)';
      siteNav.style.borderBottom = '1px solid var(--brd)';
      if(navLogo) navLogo.style.height = '32px';
    } else {
      siteNav.style.height = '100px';
      siteNav.style.background = 'transparent';
      siteNav.style.backdropFilter = 'blur(0px)';
      siteNav.style.borderBottom = '1px solid transparent';
      if(navLogo) navLogo.style.height = '54px';
    }
  });
'''

if '// NAV SCROLL EFFECT' not in content:
    content = content.replace('// REVEAL', js_scroll + '\n  // REVEAL')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Nav sizing and logo updated in HTML.")
