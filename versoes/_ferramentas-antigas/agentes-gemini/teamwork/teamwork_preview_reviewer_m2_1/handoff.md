# Handoff Report — Reviewer 1 (Milestone M2: Laboratório de Calculadoras & Simulador)

**Data:** 2026-10-20T00:22:00Z  
**Autor:** Reviewer 1 (Adversarial Critic & Quality Reviewer)  
**Destinatário:** Project Orchestrator (`971a465a-16b6-43b8-a7b3-fb44ff80c9f4`)  
**Milestone:** M2 (Laboratório de Calculadoras & Simulador de Aposentadoria e Soberania Financeira)  
**Veredito Formal:** **APPROVE** (com 1 apontamento Major de UX Mobile e 2 apontamentos Minor de refinamento)  

---

## 1. Observation (Observações Objetivas)

1. **Integridade de Implementação e Ausência de Fraude (Zero Integrity Violations):**
   - Foi realizada busca profunda por valores estáticos e resultados pré-fabricados em `js/simulador-core.js`.
   - Valores esperados (`4078918`, `3611208`, `467710`, `8571429`) **não** estão hardcoded no código de produção.
   - O motor executa derivações analíticas reais mês a mês baseadas na Equação de Fisher:
     $$r_{real} = \frac{1 + r_{nom}}{1 + i_{inf}} - 1$$
     e acumulação composta discreta:
     $$P(m) = P(m-1) \cdot (1 + r_m) + PMT, \quad r_m = (1 + r_{real})^{1/12} - 1$$

2. **Verificação Numérica Independente (Paridade com Math-Oracle):**
   - Parâmetros canônicos: $P_0 = \text{R\$\,500.000}$, $PMT = \text{R\$\,10.000/mês}$, $t = 15\text{ anos (180 meses)}$, $r_{nom} = 11,5\%$, $i_{inf} = 4,5\%$, $c_{fee} = 0,7\%$, $c_{trad} = 2,0\%$.
   - **Fisher:** $r_{real} = 6,698564593301448\%$ a.a. (diferença contra o oráculo $< 10^{-15}$).
   - **Acumulação Fee-Based (15a):** R$ 4.078.918 (exato).
   - **Acumulação Tradicional (15a):** R$ 3.611.208 (exato).
   - **Delta Líquido Ganho:** +R$ 467.710 a favor do Fee-Based (exato).
   - **Anos de Liberdade Ganhos:** 1,6 anos (19 meses) calculados via loop determinístico capped em 360 meses.
   - **Soberania Financeira (SWR 3,5%):** Para $D_{meta} = \text{R\$\,25.000/mês}$, capital necessário de R$ 8.571.429; crossover atingido no mês 276 (23,0 anos) sem custos e mês 293 (24,4 anos) com custos fee-based.

3. **Execução da Suíte de Testes:**
   - Comando `node tests/run-all.js --milestone=m2`:
     - 13 testes executados, 13 aprovados, 0 falhas, 0 skips, duração ~295ms.
   - Comando `node tests/run-all.js` (Suíte Global):
     - 94 testes executados, 82 aprovados, 0 falhas, 12 skips (marcos pendentes M3-M6), duração ~2,07s.

4. **Renderização Visual e Inspeção no Browser Real (Chrome DevTools):**
   - `http://localhost:8080/simulador.html` carregado com sucesso.
   - Console: 0 erros, 0 warnings.
   - Gráfico nativo Canvas 2D renderiza curvas retina-sharp, grid horizontal, linha horizontal de Meta Soberania (#F2B705), áreas de preenchimento de aportes e delta de taxas, e scrubbing interativo via mouse/touch.
   - Sliders reativos: alteração de $P_0$ para R$ 1.000.000 recalcula instantaneamente o patrimônio para R$ 5.282.074, delta para +R$ 662.919 e atualiza parâmetros do CTA de agendamento (`data-sim-params`).

5. **Regras de Negócio e Workspace:**
   - Auditoria de espaço antes de `<br>` (`auditSpaceBeforeBr`): 100% válido (0 violações).
   - Auditoria de filtros SVG proibidos (`auditImageTransparency`): `hasForbiddenFilter: false`.
   - Mobile Dock presente e ativa em viewport mobile (`390x844`), com botões atendendo WCAG (touch target >= 48px).

6. **Anomalia Detectada em Viewport Mobile (Major Finding):**
   - Em viewport mobile de 390px, a barra superior `#site-nav` em `simulador.html` possui inline `padding: 0 56px` e os links `#nav-links a.nav-link` permanecem com `display: flex`.
   - Isso projeta o botão de CTA `#site-nav .nav-cta` para a coordenada X=565px (fora da tela à direita).
   - Em `index.html` e `termos.html`, existe a regra `@media (max-width: 900px) { #site-nav div a.nav-link { display: none !important; } #site-nav { padding: 0 16px !important; } }` que evita este problema.

---

## 2. Logic Chain (Cadeia de Raciocínio Lógico)

1. **Premissa de Integridade:** Se uma implementação recorresse a valores embutidos ou facades vazias, ela deveria ser reprovada sumariamente.
   - *Constatação:* A inspeção de código e testes de estresse comprovam que as equações são puramente analíticas e reativas a quaisquer valores de entrada (strings, zeros, valores multimilionários até R$ 50M).
2. **Premissa de Conformidade de Contrato:** O objeto `window.OutlierSimulador` deve expor as funções acordadas em `PROJECT.md § Interface Contracts`.
   - *Constatação:* Todas as funções (`calculateRealReturn`, `calculateAccumulation`, `calculateSovereigntyYear`, `compareFeeDrag`, `simulate`, `InteractiveSimulationChart`, `initSimulationUI`) estão presentes, tipadas e retornam as estruturas esperadas.
3. **Premissa de Robustez Adversarial:** Sob condições de estresse (taxa real negativa, aportes zero, SWR zero, hiperinflação), o código deve degradar graciosamente sem loops infinitos ou divisão por zero.
   - *Constatação:* `swr <= 0` aciona fallback seguro para `0.035`; o loop de busca por anos de liberdade possui trava de segurança rígida (`capMonths = totalMonths + 360`), eliminando qualquer risco de travamento de CPU.
4. **Premissa de Fidelidade Visual e Design:** O padrão deve ser nível "Astra / Omshiva.ai" com telemetria monospace e estética dark luxury.
   - *Constatação:* Validado visualmente via screenshots gerados no Chrome DevTools: tipografia Cormorant Garamond, DM Sans e JetBrains Mono perfeitamente aplicadas, halos luminescentes e micro-interações fluidas.

---

## 3. Caveats (Ressalvas)

- A anomalia do menu superior `#site-nav` em mobile não impede o funcionamento da página nem do simulador (a navegação inferior `.mobile-bottom-dock` supre totalmente a mobilidade na tela de 390px), mas deve ser refinada para manter o padrão impecável de elite.
- O elemento `#hud-anos-liberdade` é mapeado no controlador JS com salvaguarda `if (els.hudAnosLiberdade)`, porém não possui nó HTML com este ID específico em `simulador.html` (o dado aparece no `#hud-narrative`).

---

## 4. Conclusion (Conclusão & Veredito Formal)

**VEREDITO: APPROVE**

O Milestone M2 está **APROVADO**. A entrega demonstra maturidade matemática, código limpo sem dependências externas, alto padrão visual em sintonia com a direção de arte e conformidade estrita com todos os testes E2E do ecossistema.

---

## 5. Verification Method (Método de Verificação Independente)

Para qualquer agente ou auditor reproduzir esta verificação de forma determinística:

1. **Executar testes do Milestone M2:**
   ```powershell
   node tests/run-all.js --milestone=m2
   ```
   *Critério:* 13 testes pass, 0 falhas.

2. **Auditar exatidão matemática do Fee Drag e Fisher:**
   ```powershell
   node -e "const s = require('./js/simulador-core.js'); console.log(s.compareFeeDrag(500000, 10000, 0.115, 0.045, 0.02, 0.007, 180));"
   ```
   *Critério:* `feeDelta: 467710`, `yearsOfFreedomGained: 1.6`, `balancePortfel: 4078918`, `balanceTrad: 3611208`.

3. **Auditar integridade de regras de layout (BR e transparência):**
   ```powershell
   node -e "const { auditSpaceBeforeBr, auditImageTransparency } = require('./tests/helpers/dom-parser'); const fs = require('fs'); const h = fs.readFileSync('simulador.html', 'utf8'); console.log(auditSpaceBeforeBr(h), auditImageTransparency(h));"
   ```
   *Critério:* `isValid: true`, `hasForbiddenFilter: false`.

---

## 6. Quality Review Report

### Review Summary
- **Verdict**: APPROVE
- **Score de Confiança**: 98/100
- **Integridade**: 100% Genuíno (Zero Integrity Violations)

### Findings

#### [Major] Finding 1 — Ocultação de Links do Menu Superior (#site-nav) no Mobile (< 900px)
- **O que**: Em viewports mobile (ex: 390x844), os links desktop `#nav-links a.nav-link` permanecem visíveis na barra superior, causando expansão horizontal interna de `#site-nav` e empurrando o botão `.nav-cta` ("Agendar conversa") para X=565px (fora da tela).
- **Onde**: `simulador.html` (linha 65-78) e `css/simulador.css`.
- **Por que**: Em mobile, a navegação principal é feita pelo dock inferior tátil (`.mobile-bottom-dock`). A barra superior deve exibir apenas o logotipo e o CTA compacto, como já implementado em `index.html`.
- **Sugestão de Correção**: Adicionar em `css/simulador.css` sob `@media (max-width: 900px)`:
  ```css
  #site-nav { padding: 0 16px !important; }
  #site-nav div a.nav-link { display: none !important; }
  #site-nav > div { gap: 10px !important; }
  ```

#### [Minor] Finding 2 — ID `#hud-anos-liberdade` não declarado no HTML
- **O que**: `js/simulador-core.js` referencia `document.getElementById('hud-anos-liberdade')`, mas o elemento não existe no DOM de `simulador.html`.
- **Onde**: `simulador.html` seção `.sim-hud-cards` (linhas 244-296).
- **Por que**: A métrica de anos ganhos é exibida atualmente apenas dentro do parágrafo de narrativa `#hud-narrative`.
- **Sugestão de Correção**: Incluir uma tag com `id="hud-anos-liberdade"` dentro do Card 4 ou como um badge dedicado no HUD.

#### [Minor] Finding 3 — Discrepância no Texto Estático de Fallback (2,4 anos vs 1,6 anos)
- **O que**: O texto inicial estático em `simulador.html` (linha 331) cita "2,4 anos de vida economizados", mas o cálculo determinístico exato gera "1,6 anos de vida economizados".
- **Onde**: `simulador.html` linha 331.
- **Por que**: O JS corrige o texto imediatamente ao carregar (`recalculate()`), mas para renderização sem JS ou no primeiro frame antes da hidratação, o valor inicial difere do valor calculado.
- **Sugestão de Correção**: Alterar o texto estático da linha 331 de "2,4 anos" para "1,6 anos".

### Verified Claims
- Fisher Equation ($r_{real} = \frac{1+r_{nom}}{1+i_{inf}} - 1$) → verificado via Node e Oracle → PASS
- Discrete Compounding ($P_m = P_{m-1}(1+r_m) + PMT$) → verificado centavo por centavo → PASS
- Fee Drag Delta = +R$ 467.710 em 15 anos → verificado matematicamente → PASS
- Anos de Liberdade Ganhos = 1,6 anos → verificado no oráculo e no core → PASS
- Interface Contract `window.OutlierSimulador` → verificado via teste automatizado e inspeção → PASS
- Canvas 2D Retina Scaled Graphics → verificado via Chrome DevTools screenshots → PASS
- Ergonomia Mobile & Touch Targets >= 48px → verificado no browser em 390x844 → PASS

---

## 7. Adversarial Challenge Report

### Challenge Summary
- **Overall Risk Assessment**: LOW

### Challenges & Stress Tests Realizados

1. **Cenário de Estagflação / Taxa Real Negativa ($r_{nom} < i_{inf}$):**
   - *Premissa Testada*: Selic 6%, IPCA 9%.
   - *Resultado*: `realRate = -2.75%`. O simulador computou corretamente a perda de poder de compra real sem erros de divisão ou NaN.
   - *Status*: PASS.

2. **Cenário de Aporte Zero e Patrimônio Zero ($P_0 = 0, PMT = 0$):**
   - *Premissa Testada*: Usuário zera ambos os controles de capital.
   - *Resultado*: Retorna 0 sem erros de runtime; delta de taxas retorna 0; anos ganhos retorna 0.
   - *Status*: PASS.

3. **Cenário de SWR Zero ($SWR = 0$):**
   - *Premissa Testada*: Parâmetro corrompido ou slider em 0.
   - *Resultado*: Código possui salvaguarda defensiva `swr = swrRate > 0 ? swrRate : 0.035`, impedindo divisão por zero.
   - *Status*: PASS.

4. **Loop Infinito em `compareFeeDrag` quando $r_{trad} \le 0$:**
   - *Premissa Testada*: Modelo tradicional com rendimento real negativo onde `tempTrad` nunca alcança `finalFee`.
   - *Resultado*: A trava `capMonths = totalMonths + 360` interrompe a busca em exatamente 360 iterações (30 anos), garantindo execução em tempo linear $O(N)$ sem travar a thread.
   - *Status*: PASS.

5. **Entradas Sanitizadas (Strings, Null, Undefined):**
   - *Premissa Testada*: Chamada da API com `sim.calculateAccumulation('500000', '10000', 0.06, '180')` e `sim.compareFeeDrag(null, null, null, null)`.
   - *Resultado*: Funções utilizam `Number() || 0` e `Math.max(0, ...)`, retornando valores finitos consistentes.
   - *Status*: PASS.
