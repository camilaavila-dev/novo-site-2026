import os
import re
import sys

BASE_DIR = r"c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026"

def test_css_shared():
    css_path = os.path.join(BASE_DIR, "css", "shared-outlier.css")
    assert os.path.exists(css_path), f"Arquivo {css_path} não existe!"
    with open(css_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Checagem de chaves balanceadas
    open_braces = content.count("{")
    close_braces = content.count("}")
    assert open_braces == close_braces, f"CSS chaves desbalanceadas: {open_braces} vs {close_braces}"

    # Checagem de tokens
    tokens = ["--bg", "--vio", "--grn", "--txt", "--mut", "--sub", "--d", "--s", "--m"]
    for t in tokens:
        assert t in content, f"Token {t} ausente no CSS"

    # Checagem de tipografia
    fonts = ["Cormorant Garamond", "DM Sans", "JetBrains Mono"]
    for font in fonts:
        assert font in content, f"Fonte {font} ausente no CSS"

    # Checagem da dock móvel
    assert "mobile-bottom-dock" in content or "bottom-dock" in content, "Mobile bottom dock ausente no CSS"
    assert "backdrop-filter" in content, "Backdrop-filter ausente no CSS"
    assert "900px" in content, "Media query 900px ausente no CSS"
    print("PASS: css/shared-outlier.css verificado com sucesso.")

def test_js_shared():
    js_path = os.path.join(BASE_DIR, "js", "shared-navigation.js")
    assert os.path.exists(js_path), f"Arquivo {js_path} não existe!"
    with open(js_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "window.initOutlierNavigation" in content, "window.initOutlierNavigation não exportado"
    assert "mobile-bottom-dock" in content, "Classe mobile-bottom-dock ausente no JS"
    assert "simulador.html" in content, "Link para simulador.html ausente no JS"
    assert "raiox.html" in content, "Link para raiox.html ausente no JS"
    assert "blog.html" in content, "Link para blog.html ausente no JS"
    assert "is-active" in content, "Gerenciamento de active state ausente no JS"
    print("PASS: js/shared-navigation.js verificado com sucesso.")

def test_index_html():
    html_path = os.path.join(BASE_DIR, "index.html")
    assert os.path.exists(html_path), f"Arquivo {html_path} não existe!"
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert 'href="css/shared-outlier.css"' in content, "Link para shared-outlier.css ausente em index.html"
    assert 'src="js/shared-navigation.js"' in content, "Script shared-navigation.js ausente em index.html"

    # Checagem do rodapé
    assert 'href="privacidade.html"' in content, "Link privacidade.html ausente no rodapé de index.html"
    assert 'href="termos.html"' in content, "Link termos.html ausente no rodapé de index.html"

    # Garantir que "Política de Privacidade" aponta para privacidade.html
    priv_match = re.search(r'<a\s+href="([^"]+)"[^>]*>Política de Privacidade</a>', content)
    assert priv_match, "Link 'Política de Privacidade' não encontrado"
    assert priv_match.group(1) == "privacidade.html", f"Link Política de Privacidade aponta para {priv_match.group(1)} em vez de privacidade.html"

    term_match = re.search(r'<a\s+href="([^"]+)"[^>]*>Termos de Uso</a>', content)
    assert term_match, "Link 'Termos de Uso' não encontrado"
    assert term_match.group(1) == "termos.html", f"Link Termos de Uso aponta para {term_match.group(1)} em vez de termos.html"

    # Checagem de seções essenciais preservadas
    expected_ids = ["sobre", "servicos", "metodo", "presenca", "parceria", "cta"]
    for sid in expected_ids:
        assert f'id="{sid}"' in content or f'id=\'{sid}\'' in content, f"Seção #{sid} ausente em index.html"

    print("PASS: index.html verificado com sucesso.")

def test_termos_e_privacidade():
    for page in ["termos.html", "privacidade.html"]:
        path = os.path.join(BASE_DIR, page)
        assert os.path.exists(path), f"Arquivo {path} não existe!"
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        assert 'href="css/shared-outlier.css"' in content, f"shared-outlier.css ausente em {page}"
        assert 'src="js/shared-navigation.js"' in content, f"shared-navigation.js ausente em {page}"

        # Checagem de links cruzados
        for target in ["index.html#sobre", "index.html#servicos", "index.html#metodo", "index.html#presenca", "index.html#parceria"]:
            assert f'href="{target}"' in content, f"Link {target} ausente em {page}"

        # Checagem do rodapé
        priv_match = re.search(r'<a\s+href="([^"]+)"[^>]*>Política de Privacidade</a>', content)
        assert priv_match and priv_match.group(1) == "privacidade.html", f"Erro no link privacidade em {page}"

        term_match = re.search(r'<a\s+href="([^"]+)"[^>]*>Termos de Uso</a>', content)
        assert term_match and term_match.group(1) == "termos.html", f"Erro no link termos em {page}"

        print(f"PASS: {page} verificado com sucesso.")

if __name__ == "__main__":
    try:
        test_css_shared()
        test_js_shared()
        test_index_html()
        test_termos_e_privacidade()
        print("\n TODOS OS TESTES M1 PASSARAM COM SUCESSO!")
        sys.exit(0)
    except AssertionError as e:
        print(f"\n FALHA NA VERIFICAÇÃO: {e}")
        sys.exit(1)
