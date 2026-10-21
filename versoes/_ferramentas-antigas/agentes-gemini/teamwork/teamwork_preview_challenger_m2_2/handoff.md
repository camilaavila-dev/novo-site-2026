# Handoff Report — Challenger 2: Milestone M2 (Visual, Scrubbing & Responsividade)

**Data:** 2026-10-20T00:21:00Z  
**Autor:** Empirical Challenger 2 (Critic / Specialist)  
**Destinatário:** Project Orchestrator (`971a465a-16b6-43b8-a7b3-fb44ff80c9f4`)  
**Veredito Formal:** `REQUEST_CHANGES` (Revisão Necessária antes de Gate M2)  
**Alvo da Auditoria:** `simulador.html`, `js/simulador-core.js`, `css/simulador.css`  

---

## 1. Observation (Observações Objetivas & Evidências Empíricas)

Todas as verificações foram executadas em ambiente real de renderização utilizando **Google Chrome Headless via Chrome DevTools Protocol (CDP)** sob diferentes densidades de pixels e viewports.

### 1.1 Redimensionamento (Resize) e Retina Scaling do Canvas
- **DPR 1:** Buffer interno = $879 \times 380\text{px}$, CSS = $879 \times 380\text{px}$ (`match: true`, `hasPixels: true`).
- **DPR 2:** Buffer interno = $1758 \times 760\text{px}$, CSS = $879 \times 380\text{px}$ (`match: true`, `hasPixels: true`).
- **DPR 3:** Buffer interno = $2637 \times 1140\text{px}$, CSS = $879 \times 380\text{px}$ (`match: true`, `hasPixels: true`).
- **Série de Redimensionamento Sequencial Dinâmico:**
  - $1440\text{px} \to \text{CSS: } 694\text{px}$, Buffer: $1388\text{px}$ (Ratio: 2.00)
  - $390\text{px} \to \text{CSS: } 300\text{px}$, Buffer: $600\text{px}$ (Ratio: 2.00)
  - $768\text{px} \to \text{CSS: } 678\text{px}$, Buffer: $1356\text{px}$ (Ratio: 2.00)
  - $1440\text{px} \to \text{CSS: } 694\text{px}$, Buffer: $1388\text{px}$ (Ratio: 2.00)
- **Resultado:** O Canvas escala com precisão subpixel ao DPR e responde ao evento `window.resize` sem distorção.

---

### 1.2 Interação de Scrubbing e Tooltip (Mouse e Touch)
- **Mousemove & Touchmove:** O scrubbing desenha a linha pontilhada vertical, os pontos destacados nas curvas Fee-Based e Tradicional, e posiciona o tooltip flutuante com dados exatos de patrimônio, tempo e delta fiduciário (verificado empiricamente e registrado em `screenshot_scrubbing_desktop.png` e `screenshot_scrubbing_mobile.png`).
- **Bounds em Tela Estreita (320px):**
  - Tooltip width: $220\text{px}$, Card bounds: left $20\text{px}$, right $300\text{px}$.
  - Em 15%, 50% e 85% do gráfico: `overflowsLeft: false`, `overflowsRight: false`.
- **ACHADO 1 (Interação Mobile):**
  Em `js/simulador-core.js` (linhas 362–385):
  ```javascript
  canvas.addEventListener('mousemove', function (e) { handlePointer(e.clientX, e.clientY); });
  canvas.addEventListener('mouseleave', function () { ... });
  canvas.addEventListener('touchmove', function (e) { ... });
  canvas.addEventListener('touchend', function () { ... });
  ```
  **Não existe listener de `touchstart`**. Quando o usuário apenas toca a tela (tap) ou inicia o toque sem deslocar o dedo, o gráfico não atualiza a telemetria nem abre o tooltip (`eventsLog[0].tooltipHtml === ""`, `tooltipOpacity === "0"`).
- **ACHADO 2 (Discrepância de Coordenadas):**
  - Em `handlePointer` (linha 310): `var paddingLeft = 65;`
  - Em `render` (linha 414): `var paddingLeft = 70;`
  Há um deslocamento de 5 pixels entre o cálculo da posição do cursor/toque e a posição de desenho dos eixos e curvas no canvas.

---

### 1.3 Layout Responsivo e Overflow Horizontal (320px a 1440px)
- **Medições Formais de `scrollWidth <= clientWidth`:**
  - $320\text{px}$: `winW = 320, clientW = 320, scrollW = 320, hasScrollX = false`
  - $375\text{px}$: `winW = 375, clientW = 375, scrollW = 375, hasScrollX = false`
  - $390\text{px}$: `winW = 390, clientW = 390, scrollW = 390, hasScrollX = false`
  - $430\text{px}$: `winW = 430, clientW = 430, scrollW = 430, hasScrollX = false`
  - $1440\text{px}$: `winW = 1440, clientW = 1425, scrollW = 1425, hasScrollX = false`
- **ACHADO CRÍTICO (Colisão Visual e Vazamento no Topo Mobile):**
  Embora o `body { overflow-x: hidden }` evite o aparecimento da scrollbar horizontal no documento, a barra de navegação superior `#site-nav` em `simulador.html` (linhas 65–79) possui estilos inline com largura fixa implícita:
  `padding: 0 56px;` e links `#nav-links` + botão `.nav-cta` que somam **$672\text{px}$** de largura.
  - Em viewports mobile ($320\text{px}$, $375\text{px}$, $390\text{px}$, $430\text{px}$), os links de desktop NÃO são ocultados (`display: none` ausente).
  - Como consequência objetiva, **o texto "Home Simulador" colide diretamente por cima do logotipo "LEONARDO ARRUDA PORTFEL"**, e os demais links ("Raio-X", "Radar", "Sobre" e botão "Agendar conversa") vazam para fora da tela pela direita.
  - **Evidência Visual Direta:** Vide imagem capturada pelo Chrome Headless em `.agents/teamwork/teamwork_preview_challenger_m2_2/screenshot_375px_mobile.png`.

---

### 1.4 Auditoria da Mobile Dock e Possível Sobreposição
- A Mobile Dock está ativa abaixo de $900\text{px}$ (`display: flex`, centralizada, `bottom: 12px`, `z-index: 998`).
- O `body.has-bottom-dock` possui `padding-bottom: calc(76px + env(safe-area-inset-bottom, 0px)) !important;`.
- No final absoluto do scroll (`window.scrollTo(0, document.documentElement.scrollHeight)`):
  `atBottomOverlaps: []` (0 elementos sobrepostos).
- O CTA principal da simulação (`#cta-simulador`) possui scroll desobstruído (`ctaVisibleUnobstructed: true`).
- A Mobile Dock não bloqueia a usabilidade final de nenhum controle, estando aprovada neste aspecto.

---

## 2. Logic Chain (Cadeia de Raciocínio Lógico)

1. **Premissa 1:** O projeto visa a um padrão de qualidade visual de premiação internacional ("Awwwards / Astra / Omshiva.ai") com ergonomia mobile de elite (`PROJECT.md` § Acceptance Criteria & Ergonomia Mobile).
2. **Premissa 2:** Um cabeçalho fixo no topo que sobrepõe links de texto em cima do logotipo principal da marca em todos os celulares viola os padrões mais básicos de UI/UX e desqualifica a entrega visual.
   - *Evidência (Obs 1.3):* Medição CDP constatou elementos com `right: 672px` em tela de 375px, e `screenshot_375px_mobile.png` comprova a colisão ilegível do menu superior no mobile.
3. **Premissa 3:** A experiência tátil em smartphones requer que o gráfico responda ao toque imediato do usuário.
   - *Evidência (Obs 1.2):* A ausência de listener para `touchstart` obriga o usuário a deslocar o dedo para ver o tooltip, tornando o primeiro toque inerte.
4. **Premissa 4:** O motor quantitativo deve primar por exatidão visual geométrica.
   - *Evidência (Obs 1.2):* O offset de 5px entre `paddingLeft` de 65px e 70px gera uma discrepância geométrica evitável no scrubbing.
5. **Conclusão Lógica:** O marco M2 possui excelência analítica matemática no backend e beleza no desktop, mas requer correções cirúrgicas de interface mobile antes de ser aprovado como pronto para homologação.

---

## 3. Caveats (Ressalvas & Limites)

- A matemática financeira (Fisher, SWR Bengen 3,5%, Fee Drag Portfel) e a suíte de testes de unidade já foram rigorosamente validadas e permanecem 100% corretas.
- O layout desktop ($1440\text{px}$) está impecável e atende integralmente ao briefing estético.
- As correções necessárias estão estritamente circunscritas a `css/simulador.css` (regras responsivas de `#site-nav`) e `js/simulador-core.js` (adição de listener `touchstart` e sincronização de `paddingLeft`).

---

## 4. Conclusion & Veredito Formal

### **VEREDITO: REQUEST_CHANGES**

O Milestone M2 deve receber as seguintes correções cirúrgicas pelo Worker M2:

1. **Correção de Cabeçalho Responsivo em `simulador.html` / `css/simulador.css`:**
   - Adicionar regra em `@media (max-width: 900px)` para ocultar os links de texto e CTA da barra superior:
     ```css
     @media (max-width: 900px) {
       #nav-links,
       .nav-cta {
         display: none !important;
       }
       #site-nav {
         padding: 0 20px !important;
         height: 70px !important;
       }
       #nav-logo {
         height: 36px !important;
       }
     }
     ```
   - Isso garante que em celulares apenas o logotipo limpo permaneça no topo, enquanto toda a navegação fica a cargo da Mobile Bottom Floating Dock na zona do polegar.

2. **Adição de Listener `touchstart` no Canvas em `js/simulador-core.js`:**
   - No método `InteractiveSimulationChart.prototype.initEvents`:
     ```javascript
     canvas.addEventListener('touchstart', function (e) {
       if (e.touches && e.touches[0]) {
         handlePointer(e.touches[0].clientX, e.touches[0].clientY);
       }
     }, { passive: true });
     ```

3. **Harmonização do Padding do Gráfico em `js/simulador-core.js`:**
   - Equalizar `paddingLeft` em `handlePointer` (linha 310) para **$70$**, idêntico ao `paddingLeft` de `render` (linha 414).

---

## 5. Verification Method (Método de Verificação Independente)

Para auditar e verificar as correções propostas:

1. **Executar a suíte de estresse de viewports:**
   ```powershell
   node tests/helpers/verify_all_viewports.js
   ```
   *Critério de aprovação:* `overflowElements: 0` em todos os viewports mobile ($320\text{px}$, $375\text{px}$, $390\text{px}$, $430\text{px}$).

2. **Regerar e inspecionar o screenshot mobile:**
   ```powershell
   node tests/helpers/capture_screenshots.js
   ```
   *Critério de aprovação:* Inspecionar `screenshot_375px_mobile.png` e confirmar que o logotipo está limpo e centralizado/alinhado no topo, sem nenhum texto "Home Simulador" sobreposto.

3. **Executar a suíte completa de testes:**
   ```powershell
   node tests/run-all.js
   ```
   *Critério:* 82 testes aprovados, 0 falhas.
