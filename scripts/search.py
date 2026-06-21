with open('c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/index.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f.readlines()):
        l = line.lower()
        if 'id="parceria"' in l or 'sobre o consultor' in l or 'perguntas frequentes' in l or '—' in l or '–' in l:
            print(f"Line {i+1}: {line.strip()[:100]}")
