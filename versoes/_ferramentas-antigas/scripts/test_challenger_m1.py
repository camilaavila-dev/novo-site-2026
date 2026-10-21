"""
Empirical Challenger Test Suite — Milestone M1
Autor: Challenger 1 (teamwork_preview_challenger_m1_1)
Objetivo: Stress-testing empírico e validação de invariantes para navegação unificada e dock mobile.
"""

import os
import re
import sys
import urllib.request

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def run_test(name, fn):
    print(f"\n--- [TEST] {name} ---")
    try:
        fn()
        print(f"--> PASS: {name}")
        return True, None
    except AssertionError as err:
        print(f"--> FAIL [BUG ENCONTRADO]: {err}")
        return False, str(err)
    except Exception as exc:
        print(f"--> ERROR: {exc}")
        return False, str(exc)

def test_footer_cross_page_links():
    """
    Verifica se existem links com âncoras locais quebradas nas páginas secundárias
    (termos.html e privacidade.html), como #sobre, #servicos, #metodo, #presenca.
    Em páginas secundárias, esses links DEVEM apontar para index.html#...
    """
    pages = ["termos.html", "privacidade.html"]
    home_sections = ["sobre", "servicos", "metodo", "presenca", "parceria", "cta"]
    failures = []

    for page in pages:
        path = os.path.join(BASE_DIR, page)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        # Extrai todos os hrefs em <a>
        hrefs = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', content, re.IGNORECASE)
        for h in hrefs:
            if h.startswith("#") and h not in ["#", "#top"]:
                target_id = h[1:]
                # Verifica se o ID existe na página atual
                has_id = (f'id="{target_id}"' in content) or (f"id='{target_id}'" in content)
                if not has_id and target_id in home_sections:
                    failures.append(f"{page}: link '{h}' aponta para âncora inexistente no arquivo local (deveria ser 'index.html{h}')")

    assert not failures, "Âncoras de seções da Home não resolvidas nas páginas secundárias:\n  " + "\n  ".join(failures)

def test_shared_navigation_idempotency_guard():
    """
    Verifica se js/shared-navigation.js possui proteção de idempotência contra
    múltiplas invocações de window.initOutlierNavigation().
    Sem guarda de idempotência, múltiplos listeners 'click' são anexados ao document.
    """
    js_path = os.path.join(BASE_DIR, "js", "shared-navigation.js")
    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()

    # Checa se existe guarda de idempotência global no script ou na função initOutlierNavigation
    has_guard = bool(
        "__outlierNav" in js_content or
        "__navInitialized" in js_content or
        "initialized" in js_content.lower() and "return" in js_content
    )
    # Verifica se document.addEventListener('click') é adicionado sem checagem de re-execução
    click_listener_count = js_content.count("document.addEventListener('click'")

    assert has_guard, (
        "js/shared-navigation.js não possui flag/guarda de idempotência para initOutlierNavigation(). "
        "Múltiplas chamadas acumulam event listeners anônimos no document."
    )

def test_shared_navigation_cross_page_click_handler():
    """
    Verifica se setupAnchorNavigation() intercepta cliques em âncoras locais quando o usuário
    está em uma página secundária (!isHomePage) e redireciona para index.html#secao.
    """
    js_path = os.path.join(BASE_DIR, "js", "shared-navigation.js")
    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()

    # Extrai o corpo da função setupAnchorNavigation
    match = re.search(r'function\s+setupAnchorNavigation\s*\(\)\s*\{([\s\S]*?)\n\s*(?:\/\*\*|function\s+syncHeaderLinks)', js_content)
    assert match, "Função setupAnchorNavigation não encontrada no JS"
    body = match.group(1)


    # Verifica se dentro de setupAnchorNavigation existe tratamento para páginas não-home
    # No código atual só existe: if (isHomePage && isLocal) { ... } sem nenhum branch para !isHomePage
    handles_non_home = (
        ("!isHomePage" in body) or
        ("else if" in body and "index.html" in body) or
        ("window.location.href" in body and "index.html" in body)
    )

    assert handles_non_home, (
        "setupAnchorNavigation() em js/shared-navigation.js só trata cliques se 'isHomePage && isLocal' for true. "
        "Não existe nenhum fallback para páginas secundárias (!isHomePage): ao clicar em âncora '#servicos' "
        "em termos.html ou privacidade.html, o navegador simplesmente navega para 'termos.html#servicos' (quebrado/morto)."
    )


def test_dock_touch_targets_and_viewport():
    """
    Verifica se css/shared-outlier.css assegura touch targets >= 48px para conformidade WCAG AAA
    e suporte à safe area do iOS.
    """
    css_path = os.path.join(BASE_DIR, "css", "shared-outlier.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()

    assert "min-height: 48px" in css or "min-height: 50px" in css or "height: 50px" in css or "min-height: 52px" in css, (
        "Dock mobile deve garantir altura/touch target >= 48px"
    )
    assert "safe-area-inset-bottom" in css, "Dock mobile deve considerar env(safe-area-inset-bottom)"

def main():
    print("=" * 65)
    print("EMPIRICAL CHALLENGER TEST SUITE — MILESTONE M1")
    print("=" * 65)

    results = []
    results.append(("Footer Cross-Page Links", run_test("Verificação de Âncoras Cross-Page nos Rodapés", test_footer_cross_page_links)))
    results.append(("Idempotency Guard", run_test("Guarda de Idempotência em initOutlierNavigation", test_shared_navigation_idempotency_guard)))
    results.append(("Cross-Page Click Handler", run_test("Tratamento de Cliques Cross-Page no JS", test_shared_navigation_cross_page_click_handler)))
    results.append(("Dock Touch Target & Safe Area", run_test("Touch Target e Safe Area na Dock Mobile", test_dock_touch_targets_and_viewport)))

    print("\n" + "=" * 65)
    print("RESUMO DOS TESTES DE ESTRESSE:")
    passed = sum(1 for _, (p, _) in results if p)
    total = len(results)
    print(f"Total: {total} | Passou: {passed} | Falhas: {total - passed}")

    for name, (p, err) in results:
        status = "PASS" if p else "FAIL"
        print(f"[{status}] {name}{f': {err}' if err else ''}")
    print("=" * 65)

    if passed < total:
        print("\n>>> VEREDITO DO CHALLENGER: REQUEST_CHANGES <<<")
        return 1
    else:
        print("\n>>> VEREDITO DO CHALLENGER: APPROVE <<<")
        return 0

if __name__ == "__main__":
    sys.exit(main())
