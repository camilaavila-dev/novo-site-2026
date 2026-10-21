"""
Deep Empirical Challenger Verification Script — Milestone M1 Recheck
Autor: Challenger (teamwork_preview_challenger_m1_recheck)
Objetivo: Auditoria empírica aprofundada dos 3 itens corrigidos e validação de regressão.
"""

import os
import re
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def check_footer_links():
    print("\n[1] Verificando Links de Rodapé em Páginas Secundárias:")
    pages = ["termos.html", "privacidade.html"]
    home_sections = ["sobre", "servicos", "metodo", "presenca", "parceria", "cta", "contato"]
    
    all_ok = True
    for page in pages:
        path = os.path.join(BASE_DIR, page)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Procura os links específicos de navegação do rodapé
        for section in ["sobre", "servicos", "metodo", "presenca"]:
            expected = f'index.html#{section}'
            # Procura href exato
            found = f'href="{expected}"' in content or f"href='{expected}'" in content
            dead = f'href="#{section}"' in content or f"href='#{section}'" in content
            
            if found and not dead:
                print(f"  [OK] {page} -> {expected} correto e âncora local morta ausente")
            else:
                print(f"  [FAIL] {page} -> esperado {expected}, encontrado dead link: {dead}")
                all_ok = False
                
    return all_ok

def check_idempotency_and_delegation():
    print("\n[2] Verificando Idempotência e Tratamento Cross-Page em js/shared-navigation.js:")
    js_path = os.path.join(BASE_DIR, "js", "shared-navigation.js")
    with open(js_path, "r", encoding="utf-8") as f:
        js = f.read()
        
    has_global_flag = "window.__outlierNavInitialized" in js
    has_closure_flag = "anchorListenerAttached" in js
    has_cross_page_handler = "!isHomePage" in js and "window.location.href" in js
    has_bottom_dock_guard = "if (!existingDock)" in js or "!existingDock" in js
    
    print(f"  - Guarda global window.__outlierNavInitialized: {'SIM' if has_global_flag else 'NÃO'}")
    print(f"  - Guarda interna closure anchorListenerAttached: {'SIM' if has_closure_flag else 'NÃO'}")
    print(f"  - Tratamento de clique !isHomePage -> index.html: {'SIM' if has_cross_page_handler else 'NÃO'}")
    print(f"  - Guarda de nó DOM duplicado na dock: {'SIM' if has_bottom_dock_guard else 'NÃO'}")
    
    return has_global_flag and has_closure_flag and has_cross_page_handler and has_bottom_dock_guard

def check_space_before_br():
    print("\n[3] Verificando Regra de Espaço antes de <br> em todos os arquivos HTML:")
    html_files = [f for f in os.listdir(BASE_DIR) if f.endswith(".html")]
    total_violations = 0
    
    # Regex para capturar caractere não-espaço e não '>' imediatamente antes de <br>
    # Ex: "palavra.<br>" viola, mas "palavra. <br>" ou "<br><br>" não violam
    pattern = re.compile(r'([^\s>])<br\s*/?>', re.IGNORECASE)
    
    for hf in html_files:
        path = os.path.join(BASE_DIR, hf)
        with open(path, "r", encoding="utf-8") as f:
            lines = f.readlines()
        
        file_violations = 0
        for idx, line in enumerate(lines, 1):
            matches = pattern.findall(line)
            if matches:
                # Filtrar falsos positivos se houver
                print(f"  [VIOLAÇÃO] {hf}:{idx} -> {line.strip()[:80]}")
                file_violations += len(matches)
                total_violations += len(matches)
                
        if file_violations == 0:
            print(f"  [OK] {hf}: 0 violações de espaço antes de <br>")
            
    return total_violations == 0

def check_touch_targets_css():
    print("\n[4] Verificando Regras CSS de Touch Target e Safe Area:")
    css_path = os.path.join(BASE_DIR, "css", "shared-outlier.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()
        
    has_min_height = "min-height: 48px" in css or "min-height: 50px" in css or "height: 50px" in css
    has_safe_area = "safe-area-inset-bottom" in css
    has_touch_cursor_hide = "@media (hover: none), (pointer: coarse)" in css and "#c-dot" in css
    
    print(f"  - Dock touch target >= 48px: {'SIM' if has_min_height else 'NÃO'}")
    print(f"  - Safe Area Inset Bottom (iOS): {'SIM' if has_safe_area else 'NÃO'}")
    print(f"  - Ocultação do cursor em touch: {'SIM' if has_touch_cursor_hide else 'NÃO'}")
    
    return has_min_height and has_safe_area and has_touch_cursor_hide

def main():
    print("=" * 70)
    print("DEEP EMPIRICAL CHALLENGER VERIFICATION — MILESTONE M1 RECHECK")
    print("=" * 70)
    
    c1 = check_footer_links()
    c2 = check_idempotency_and_delegation()
    c3 = check_space_before_br()
    c4 = check_touch_targets_css()
    
    print("\n" + "=" * 70)
    if c1 and c2 and c3 and c4:
        print("RESULTADO GERAL: TODAS AS VALIDAÇÕES PROFUNDAS PASSARAM (100%)")
        print("VEREDITO: APPROVE")
        print("=" * 70)
        return 0
    else:
        print("RESULTADO GERAL: FALHAS DETECTADAS")
        print("VEREDITO: REQUEST_CHANGES")
        print("=" * 70)
        return 1

if __name__ == "__main__":
    sys.exit(main())
