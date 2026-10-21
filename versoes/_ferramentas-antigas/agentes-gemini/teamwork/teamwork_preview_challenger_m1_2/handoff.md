# Handoff Report — Challenger 2 (Milestone M1)

**Agente:** Challenger 2 — Shared CSS & Mobile Responsiveness (`teamwork_preview_challenger_m1_2`)  
**Data:** 19 de Outubro de 2026  
**Alvo:** Milestone M1 (F02, F03, F04, F05, F29)  
**Veredito Formal:** **APPROVE**  

---

## 1. Observation

Durante a auditoria empírica adversarial executada diretamente com instâncias reais de Chrome Headless via Chrome DevTools Protocol (CDP) e inspeção estática da base de código, foram verificados os seguintes fatos mensuráveis:

1. **Responsividade e Ausência de Overflow Horizontal:**
   - Foram testados empiricamente 6 viewports críticos (320px, 375px, 390px, 430px, 768px, 1440px) em todas as páginas do ecossistema (`index.html`, `termos.html`, `privacidade.html`, `linktree.html`).
   - Resultados de `scrollWidth` vs `clientWidth`:
     - `index.html`: 320px (`scrollW=320`, `clientW=320`), 375px (`375/375`), 390px (`390/390`), 430px (`430/430`), 768px (`768/768`), 1440px (`1425/1425`). Zero scroll horizontal detectado (`hasScrollX: false`).
     - `termos.html`: Zero scroll horizontal em todas as 6 viewports (`scrollW <= clientW`).
     - `privacidade.html`: Zero scroll horizontal em todas as 6 viewports (`scrollW <= clientW`).
     - `linktree.html`: Zero scroll horizontal em todas as 6 viewports (`scrollW <= clientW`).
   - Elementos com conteúdo largo (`.marquee-track` com largura de até 4.134px em animação linear contínua) estão devidamente contidos sob containers com `overflow: hidden`, sem vazamento para o documento global.

2. **Mobile Bottom Floating Dock & Não-Sobreposição com Rodapé:**
   - Medição com scroll máximo até o final da página em Chrome Headless:
     - Viewport 320x568: Dock Top em 490px | Fim do Rodapé em 452px | **Folga limpa de 38px** (`clearanceGap: +38px`).
     - Viewport 375x667: Dock Top em 589px | Fim do Rodapé em 551px | **Folga limpa de 38px** (`clearanceGap: +38px`).
     - Viewport 390x844: Dock Top em 766px | Fim do Rodapé em 728px | **Folga limpa de 38px** (`clearanceGap: +38px`).
     - Viewport 430x932: Dock Top em 854px | Fim do Rodapé em 816px | **Folga limpa de 38px** (`clearanceGap: +38px`).
   - A folga de 38px é constante e decorre da soma de `padding-bottom: 40px` no elemento `footer` + `padding-bottom: calc(76px + safe-area) !important` no `body`, contra a altura da dock de 64px posicionada em `bottom: calc(14px + safe-area)`:
     $$\text{Folga} = (40\text{px} + 76\text{px}) - (64\text{px} + 14\text{px}) = 116\text{px} - 78\text{px} = 38\text{px}$$
   - Não há sobreposição de links essenciais, disclaimer regulatório da CVM, CNPJ ou botão "Voltar ao Topo".

3. **Comportamento do Botão CTA Flutuante (`#float-cta`):**
   - Em viewports móveis ($\le 900\text{px}$), a regra `@media (max-width: 900px) { #float-cta { display: none !important; } }` em `css/shared-outlier.css` desativa com sucesso o botão antigo do desktop, eliminando qualquer risco de colisão com a dock móvel.
   - Em desktop ($> 900\text{px}$), a Mobile Dock assume `display: none` e o `#float-cta` opera perfeitamente via scroll listener a partir de $400\text{px}$ de rolagem.

4. **Touch Targets da Dock Móvel:**
   - Em 375px a 768px: Os itens possuem dimensões entre 59.4px e 94px de largura e 50px de altura, superando com folga o piso de 48px estipulado pelas diretrizes WCAG AAA e F29.
   - Em 320px: Os itens possuem largura mínima de 50px e altura de 50px ($\ge 48\text{px}$).

5. **Regra de Espaço Antes de `<br>` (`texto <br>texto`):**
   - Em `termos.html`, `privacidade.html` e `linktree.html`: 0 violações de espaço antes de `<br>` em títulos `h1-h3`.
   - Em `css/shared-outlier.css`: O Worker M1 adicionou a classe utilitária `.safe-br { margin-right: 0.28em; }`.
   - Em `index.html`: Foram detectadas 3 ocorrências pré-existentes da baseline (`v1-checkpoint-aprovado`) onde não há espaço antes de `<br>`:
     - Linha 525: `<h2>Quatro pilares.<br>Um patrimônio completo.</h2>`
     - Linha 755: `<h2>Três decisões.<br><em style="font-style:italic;color:var(--vio2)">A escolha do modelo</em>...</h2>`
     - Linha 887: `<h3>Presença contínua.<br>Sem interrupção.</h3>`
   - O teste automatizado oficial `tests/tier1-features/f29-mobile-ergonomics.test.js` documenta explicitamente que este item pertence ao escopo do **Milestone M5** (`"Marco M5 pendente: index.html ainda possui 3 quebras <br> em h2 pendentes de correção pelo Worker M5"`), de modo que o Worker M1 agiu corretamente ao não alterar indevidamente o corpo textual das seções da Home.

6. **Execução da Bateria de Testes:**
   - `node --test tests/tier1-features/f01-home-baseline.test.js tests/tier1-features/f02-design-system.test.js tests/tier1-features/f03-navigation.test.js tests/tier1-features/f04-mobile-dock.test.js tests/tier1-features/f05-footer-links.test.js tests/tier1-features/f29-mobile-ergonomics.test.js`
   - Resultado: **29 testes passaram, 0 falharam, 1 skipped** (adiado programaticamente para M5 conforme especificação de progressão).

---

## 2. Logic Chain

1. **Premissa de Estabilidade de Layout:** Um layout responsivo de padrão internacional ("Awwwards / Astra") não pode apresentar barras de rolagem horizontais espúrias em nenhuma resolução comum de smartphone ou desktop. Os testes reais via Chrome Headless CDP atestaram `scrollWidth === clientWidth` em todos os 6 viewports avaliados.
2. **Premissa de Usabilidade Tátil:** Uma barra fixa inferior só é ergonômica se respeitar a zona do polegar e não obstruir o conteúdo da página ao final do scroll. A medição empírica comprovou 38px de folga positiva no fim da rolagem e touch targets $\ge 50\text{px}$, satisfazendo WCAG AAA.
3. **Premissa de Escopo e Não-Regressão:** O Milestone M1 tinha como objetivo estrito a introdução do design system compartilhado (`css/shared-outlier.css`), navegação unificada (`js/shared-navigation.js`) e correção dos links jurídicos de rodapé. As 3 quebras `<br>` sem espaço na Home são pré-existentes do checkpoint v1 e pertencem formalmente ao escopo de evolução textual do Milestone M5.

---

## 3. Caveats

1. **Rótulo "SIMULADOR" no Viewport 320px:**
   - Em smartphones ultracompactos (320px de largura, ex: iPhone SE de 1ª geração), a largura total da dock é 292px e cada botão possui 50px de largura.
   - O rótulo "SIMULADOR" possui largura de 56.4px na tipografia JetBrains Mono de 9.5px, ultrapassando a caixa do item em 3.2px de cada lado (entrando no gap de 4px).
   - *Recomendação para refinamento futuro:* Aplicar `font-size: 8.5px` ou `letter-spacing: 0.02em` em `@media (max-width: 360px)` para maior conforto visual. Não causa overflow de página, mas é um ponto de refinamento estético.
2. **Correção das 3 Tags `<br>` na Home (M5):**
   - O Worker M5 deverá se atentar para corrigir as 3 ocorrências em `index.html` (linhas 525, 755 e 887) adicionando espaço antes do `<br>` (`texto <br>texto`), destravando o teste `F29-2` no Tier 1.

---

## 4. Conclusion

O Milestone M1 é **APROVADO (APPROVE)**.

A fundação do design system compartilhado e a navegação móvel atendem com excelência técnica aos critérios de:
- Zero overflow horizontal em todas as viewports críticas (320px a 1440px).
- Não-sobreposição comprovada da Mobile Bottom Floating Dock com o rodapé (folga de 38px).
- Ocultação estrita do botão `#float-cta` no mobile para evitar sobreposições.
- Touch targets $\ge 48\text{px}$ em conformidade com WCAG AAA.
- 100% de integridade da baseline aprovada de 15 seções em `index.html`.

---

## 5. Verification Method

Para reproduzir de forma 100% independente as verificações empíricas realizadas neste relatório:

1. **Executar a Suíte Oficial de Testes Tier 1 do Marco M1:**
   ```powershell
   node --test tests/tier1-features/f01-home-baseline.test.js tests/tier1-features/f02-design-system.test.js tests/tier1-features/f03-navigation.test.js tests/tier1-features/f04-mobile-dock.test.js tests/tier1-features/f05-footer-links.test.js tests/tier1-features/f29-mobile-ergonomics.test.js
   ```
   *Critério de sucesso:* 29 passados, 0 falhas, 1 skipped.

2. **Executar o Teste Empírico de Viewports com Chrome Headless:**
   ```powershell
   node tests/helpers/stress_viewports.js
   ```
   *Critério de sucesso:* Saída confirmando `✅ ZERO OVERFLOW` em 320px, 375px, 390px, 430px, 768px e 1440px para todas as páginas.

3. **Executar a Medição de Sobreposição de Rodapé e Dock:**
   ```powershell
   node tests/helpers/test_footer_overlap.js
   ```
   *Critério de sucesso:* Saída confirmando `✅ LIMPO (folga de 38px)` em todos os viewports mobile.
