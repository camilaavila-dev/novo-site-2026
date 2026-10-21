import re

file_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the CSS for svc-item
old_css = r'''\.svc-items\{display:grid;grid-template-columns:1fr 1fr;gap:10px;flex:1\}
\.svc-item\{display:flex;align-items:flex-start;gap:13px;padding:12px 16px;background:rgba\(255,255,255,\.03\);border:1px solid var\(--brd\);border-radius:10px;cursor:default;transition:transform \.22s cubic-bezier\(\.22,\.61,\.36,1\),border-color \.22s,background \.22s,box-shadow \.22s;opacity:0;transform:translateY\(14px\)\}
\.svc-item\.in\{opacity:1;transform:none\}
\.svc-item:hover\{transform:translateY\(-3px\);border-color:rgba\(107,102,232,\.4\);background:rgba\(59,54,204,\.07\);box-shadow:0 8px 28px rgba\(59,54,204,\.12\)\}
\.svc-item-icon\{width:34px;height:34px;border-radius:8px;background:rgba\(59,54,204,\.15\);display:flex;align-items:center;justify-content:center;flex:none;color:var\(--vio2\)\}
\.svc-item-name\{font-family:var\(--s\);font-size:14\.5px;color:var\(--txt\);font-weight:500;line-height:1\.35;margin-top:2px\}

/\* Variantes de cor por tab \*/
\.svc-tab\[data-tab="1"\]\.is-active::before\{background:var\(--grn\)\}
\.svc-tab\[data-tab="1"\]\.is-active \.svc-tab-num,
\.svc-tab\[data-tab="1"\]\.is-active \.svc-tab-count\{color:var\(--grn\)\}
\.svc-tab\[data-tab="1"\]\.is-active \.svc-tab-bar-fill\{background:linear-gradient\(90deg,var\(--grn\),var\(--grn2\)\)\}
\.svc-panel\[data-panel="1"\] \.svc-panel-label\{color:var\(--grn\)\}
\.svc-panel\[data-panel="1"\] \.svc-item:hover\{border-color:rgba\(28,217,138,\.35\);background:rgba\(28,217,138,\.06\);box-shadow:0 8px 28px rgba\(28,217,138,\.09\)\}
\.svc-panel\[data-panel="1"\] \.svc-item-icon\{background:rgba\(28,217,138,\.12\);color:var\(--grn\)\}

\.svc-tab\[data-tab="2"\]\.is-active::before\{background:#8B7FE8\}
\.svc-tab\[data-tab="2"\]\.is-active \.svc-tab-num,
\.svc-tab\[data-tab="2"\]\.is-active \.svc-tab-count\{color:#8B7FE8\}
\.svc-tab\[data-tab="2"\]\.is-active \.svc-tab-bar-fill\{background:linear-gradient\(90deg,#3B36CC,#8B7FE8\)\}
\.svc-panel\[data-panel="2"\] \.svc-panel-label\{color:#8B7FE8\}
\.svc-panel\[data-panel="2"\] \.svc-item:hover\{border-color:rgba\(139,127,232,\.35\);background:rgba\(139,127,232,\.06\);box-shadow:0 8px 28px rgba\(139,127,232,\.09\)\}
\.svc-panel\[data-panel="2"\] \.svc-item-icon\{background:rgba\(139,127,232,\.14\);color:#8B7FE8\}

\.svc-tab\[data-tab="3"\]\.is-active::before\{background:#C4A97D\}
\.svc-tab\[data-tab="3"\]\.is-active \.svc-tab-num,
\.svc-tab\[data-tab="3"\]\.is-active \.svc-tab-count\{color:#C4A97D\}
\.svc-tab\[data-tab="3"\]\.is-active \.svc-tab-bar-fill\{background:linear-gradient\(90deg,#8B7040,#C4A97D\)\}
\.svc-panel\[data-panel="3"\] \.svc-panel-label\{color:#C4A97D\}
\.svc-panel\[data-panel="3"\] \.svc-item:hover\{border-color:rgba\(196,169,125,\.35\);background:rgba\(196,169,125,\.05\);box-shadow:0 8px 28px rgba\(196,169,125,\.08\)\}
\.svc-panel\[data-panel="3"\] \.svc-item-icon\{background:rgba\(196,169,125,\.12\);color:#C4A97D\}'''

new_css = '''.svc-items{display:flex;flex-direction:column;gap:28px;flex:1;padding-top:10px}
.svc-item{display:flex;flex-direction:column;gap:6px;padding-left:24px;border-left:1px solid var(--brd2);cursor:default;transition:transform .3s ease,border-color .3s;opacity:0;transform:translateY(14px)}
.svc-item.in{opacity:1;transform:none}
.svc-item:hover{transform:translateX(5px);border-left-color:var(--vio2)}
.svc-item-name{font-family:var(--s);font-size:18px;color:#fff;font-weight:400;line-height:1.2;letter-spacing:-0.01em}
.svc-item-desc{font-family:var(--s);font-size:14px;color:rgba(255,255,255,.6);font-weight:300;line-height:1.5}

/* Variantes de cor por tab */
.svc-tab[data-tab="1"].is-active::before{background:var(--grn)}
.svc-tab[data-tab="1"].is-active .svc-tab-num,
.svc-tab[data-tab="1"].is-active .svc-tab-count{color:var(--grn)}
.svc-tab[data-tab="1"].is-active .svc-tab-bar-fill{background:linear-gradient(90deg,var(--grn),var(--grn2))}
.svc-panel[data-panel="1"] .svc-panel-label{color:var(--grn)}
.svc-panel[data-panel="1"] .svc-item:hover{border-left-color:var(--grn)}

.svc-tab[data-tab="2"].is-active::before{background:#8B7FE8}
.svc-tab[data-tab="2"].is-active .svc-tab-num,
.svc-tab[data-tab="2"].is-active .svc-tab-count{color:#8B7FE8}
.svc-tab[data-tab="2"].is-active .svc-tab-bar-fill{background:linear-gradient(90deg,#3B36CC,#8B7FE8)}
.svc-panel[data-panel="2"] .svc-panel-label{color:#8B7FE8}
.svc-panel[data-panel="2"] .svc-item:hover{border-left-color:#8B7FE8}

.svc-tab[data-tab="3"].is-active::before{background:#C4A97D}
.svc-tab[data-tab="3"].is-active .svc-tab-num,
.svc-tab[data-tab="3"].is-active .svc-tab-count{color:#C4A97D}
.svc-tab[data-tab="3"].is-active .svc-tab-bar-fill{background:linear-gradient(90deg,#8B7040,#C4A97D)}
.svc-panel[data-panel="3"] .svc-panel-label{color:#C4A97D}
.svc-panel[data-panel="3"] .svc-item:hover{border-left-color:#C4A97D}'''

content = re.sub(old_css, new_css, content, flags=re.MULTILINE)

# 2. Remove icons from HTML
icon_regex = r'<div class="svc-item-icon">.*?</div>\s*'
content = re.sub(icon_regex, '', content, flags=re.DOTALL)

# 3. Replace inline styles for descriptions with .svc-item-desc
desc_regex = r'<div style="font-family:var\(--s\);font-size:13px;color:rgba\(255,255,255,\.7\);line-height:1\.4;margin-top:2px;font-weight:300">(.*?)</div>'
content = re.sub(desc_regex, r'<div class="svc-item-desc">\1</div>', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Escopo de Atuacao updated.")
