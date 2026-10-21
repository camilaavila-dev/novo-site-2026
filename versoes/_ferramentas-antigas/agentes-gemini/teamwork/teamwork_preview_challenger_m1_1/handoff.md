# Handoff Report — Challenger 1 (Milestone M1)

**Agente:** Challenger 1 (`teamwork_preview_challenger_m1_1`)  
**Data:** 19 de Outubro de 2026  
**Veredito Formal:** **REQUEST_CHANGES**  
**Alvo Avaliado:** Milestone M1 — Shared Outlier Design System, Navegação Unificada e Mobile Bottom Floating Dock  
**Arquivos sob Análise:** `js/shared-navigation.js`, `css/shared-outlier.css`, `index.html`, `termos.html`, `privacidade.html`

---

## 1. Observation

Durante a execução dos testes empíricos de estresse solicitados pelo dispatch, foram realizadas inspeções estáticas e execuções no ambiente do navegador (via Chrome DevTools MCP e suite de testes `scripts/test_challenger_m1.py`). Foram observados os seguintes fatos concretos:

### Observação 1: Âncoras Quebradas no Rodapé de `termos.html` e `privacidade.html`
Em `termos.html` (linhas 326-329) e em `privacidade.html` (linhas 331-334), os links dentro do bloco `.footer-links` contêm âncoras locais puras:
```html
<a href="#sobre" style="font-family:var(--s);font-size:13.5px;color:var(--mut);text-decoration:none;font-weight:300">Leonardo Arruda</a>
<a href="#servicos" style="font-family:var(--s);font-size:13.5px;color:var(--mut);text-decoration:none;font-weight:300">Escopo de Atuação</a>
<a href="#metodo" style="font-family:var(--s);font-size:13.5px;color:var(--mut);text-decoration:none;font-weight:300">O Método</a>
<a href="#presenca" style="font-family:var(--s);font-size:13.5px;color:var(--mut);text-decoration:none;font-weight:300">Atendimento Global</a>
```
Nenhum dos IDs (`#sobre`, `#servicos`, `#metodo`, `#presenca`) existe dentro de `termos.html` ou `privacidade.html`.
Ao clicar em "Escopo de Atuação" (`#servicos`) em `termos.html` via Chrome DevTools MCP:
```json
{"beforeUrl":"http://localhost:8080/termos.html","afterUrl":"http://localhost:8080/termos.html#servicos","stayedOnTermos":true,"targetElementExistsOnPage":false}
```
O navegador permaneceu na URL `termos.html#servicos`, sem navegar para `index.html#servicos`, mantendo o usuário em um link morto.

### Observação 2: Inexistência de Tratamento Cross-Page no Click Handler de `js/shared-navigation.js`
No arquivo `js/shared-navigation.js`, as linhas 173-190 implementam a função `syncHeaderLinks()`:
```javascript
function syncHeaderLinks() {
  var isHomePage = getCurrentPageKey() === 'home';
  var navLinks = document.querySelectorAll('#site-nav a.nav-link');

  if (!isHomePage && navLinks.length > 0) {
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.setAttribute('href', 'index.html' + href);
      }
    });
...
```
Essa função reescreve exclusivamente os links do seletor `#site-nav a.nav-link`, ignorando todos os demais links da página (como `.footer-links a`).

Além disso, na função `setupAnchorNavigation()` (linhas 109-153):
```javascript
function setupAnchorNavigation() {
  var isHomePage = getCurrentPageKey() === 'home';

  document.addEventListener('click', function (e) {
    var targetLink = e.target.closest('a');
    if (!targetLink) return;
    ...
    var isLocal = basePart === '' || basePart === 'index.html' || basePart === '/' || basePart === window.location.pathname;

    if (isHomePage && isLocal) {
      var targetElem = document.getElementById(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (history.pushState) {
          history.pushState(null, null, '#' + targetId);
        }
      }
    }
  });
```
A condicional `if (isHomePage && isLocal)` garante que qualquer clique disparado quando `isHomePage === false` não sofra `preventDefault()` nem redirecionamento. Não existe nenhum bloco `else` ou `else if (!isHomePage)` para converter um clique em `#servicos` para `index.html#servicos`.

### Observação 3: Vazamento de Event Listeners por Ausência de Idempotência em `window.initOutlierNavigation()`
Em `js/shared-navigation.js` (linhas 195-200):
```javascript
function initOutlierNavigation(options) {
  options = options || {};
  ensureBottomDock(options);
  setupAnchorNavigation();
  syncHeaderLinks();
}
```
A função `ensureBottomDock()` possui checagem de existência (`if (!existingDock)`), garantindo que nós DOM não sejam duplicados. No entanto, `setupAnchorNavigation()` não possui nenhuma trava ou flag de idempotência: a cada chamada a `window.initOutlierNavigation()`, uma nova função anônima é adicionada ao `document` via `document.addEventListener('click', ...)`.
Ao executar o teste empírico no Chrome DevTools MCP, chamando `initOutlierNavigation()` 5 vezes e efetuando um clique em um link âncora:
```json
{"pushStateCount":16,"hasMultipleListenerLeak":true}
```
O método `history.pushState` e o scroll foram acionados 16 vezes para um único clique, comprovando o acúmulo de listeners.

### Observação 4: Resultado da Execução do Script de Teste Automatizado
Ao rodar a suíte `python scripts\test_challenger_m1.py`:
```
=================================================================
EMPIRICAL CHALLENGER TEST SUITE — MILESTONE M1
=================================================================

--- [TEST] Verificação de Âncoras Cross-Page nos Rodapés ---
--> FAIL [BUG ENCONTRADO]: Âncoras de seções da Home não resolvidas nas páginas secundárias:
  termos.html: link '#sobre' aponta para âncora inexistente no arquivo local (deveria ser 'index.html#sobre')
  termos.html: link '#servicos' aponta para âncora inexistente no arquivo local (deveria ser 'index.html#servicos')
  termos.html: link '#metodo' aponta para âncora inexistente no arquivo local (deveria ser 'index.html#metodo')
  termos.html: link '#presenca' aponta para âncora inexistente no arquivo local (deveria ser 'index.html#presenca')
  privacidade.html: link '#sobre' aponta para âncora inexistente no arquivo local (deveria ser 'index.html#sobre')
  privacidade.html: link '#servicos' aponta para âncora inexistente no arquivo local (deveria ser 'index.html#servicos')
  privacidade.html: link '#metodo' aponta para âncora inexistente no arquivo local (deveria ser 'index.html#metodo')
  privacidade.html: link '#presenca' aponta para âncora inexistente no arquivo local (deveria ser 'index.html#presenca')

--- [TEST] Guarda de Idempotência em initOutlierNavigation ---
--> FAIL [BUG ENCONTRADO]: js/shared-navigation.js não possui flag/guarda de idempotência para initOutlierNavigation(). Múltiplas chamadas acumulam event listeners anônimos no document.

--- [TEST] Tratamento de Cliques Cross-Page no JS ---
--> FAIL [BUG ENCONTRADO]: setupAnchorNavigation() em js/shared-navigation.js só trata cliques se 'isHomePage && isLocal' for true. Não existe nenhum fallback para páginas secundárias (!isHomePage): ao clicar em âncora '#servicos' em termos.html ou privacidade.html, o navegador simplesmente navega para 'termos.html#servicos' (quebrado/morto).

--- [TEST] Touch Target e Safe Area na Dock Mobile ---
--> PASS: Touch Target e Safe Area na Dock Mobile

=================================================================
RESUMO DOS TESTES DE ESTRESSE:
Total: 4 | Passou: 1 | Falhas: 3
=================================================================

>>> VEREDITO DO CHALLENGER: REQUEST_CHANGES <<<
```

---

## 2. Logic Chain

1. **A partir da Observação 1:**
   - O Worker M1 assumiu que todos os débitos de links cruzados estavam resolvidos porque o script `scripts/verify_m1.py` utilizou apenas um `assert f'href="{target}"' in content`, o qual encontrou as ocorrências no `#site-nav`.
   - Contudo, as seções de rodapé de `termos.html` e `privacidade.html` continuam contendo tags `<a href="#servicos">` etc. Como não há elementos com esses IDs nessas páginas secundárias, o clique do usuário resulta em falha de navegação.

2. **A partir da Observação 2:**
   - A biblioteca `js/shared-navigation.js` poderia ter prevenido essa falha de duas formas:
     a) Normalizando globalmente todos os links da página (não apenas `#site-nav a.nav-link`); ou
     b) Interceptando cliques em âncoras locais quando `!isHomePage` e redirecionando para `index.html#id`.
   - No entanto, o manipulador de clique restringe a ação com `if (isHomePage && isLocal)`. Quando o usuário está em `termos.html`, essa condição avalia como `false`, permitindo que o navegador execute o comportamento padrão nativo de definir a hash local inexistente.

3. **A partir da Observação 3:**
   - A função `window.initOutlierNavigation` é exposta globalmente e auto-inicializada no carregamento do DOM. Em aplicações SPA, transições de tela ou scripts subsequentes que invoquem `window.initOutlierNavigation()` novamente (como em re-renders ou navegações dinâmicas dos próximos milestones M2-M5) registrarão novos manipuladores de clique idênticos no `document`.
   - Isso causa tempestade de eventos e múltiplas mutações no histórico do navegador (`pushState` chamado dezenas de vezes).

4. **Síntese:**
   - O Milestone M1 não cumpre com robustez a especificação de navegação unificada e resiliente entre páginas (F03/F05), possuindo 8 links quebrados nas páginas secundárias e falta de idempotência nos event listeners.

---

## 3. Caveats

- **Páginas M2, M3 e M4:** As páginas `simulador.html`, `raiox.html` e `blog.html` ainda não existem fisicamente no repositório por pertencerem a milestones posteriores. O comportamento dos links da dock que apontam para essas rotas funcionará plenamente assim que as páginas forem implementadas.
- **Dock CSS e Touch Targets:** A estilização da Bottom Floating Dock (`css/shared-outlier.css`) está plenamente aderente aos requisitos estéticos (glassmorphism, safe-area do iOS, touch target >= 48px). O problema restringe-se à lógica de roteamento/âncoras e à integridade dos links HTML.

---

## 4. Conclusion

O Milestone M1 **NÃO PODE SER APROVADO** no estado atual devido a defeitos funcionais comprovados empiricamente.

**Veredito Formal: REQUEST_CHANGES**

### Correções Necessárias para o Worker M1:
1. **Corrigir os links do rodapé em `termos.html` e `privacidade.html`:**
   Alterar em ambas as páginas:
   - `<a href="#sobre">` $\rightarrow$ `<a href="index.html#sobre">`
   - `<a href="#servicos">` $\rightarrow$ `<a href="index.html#servicos">`
   - `<a href="#metodo">` $\rightarrow$ `<a href="index.html#metodo">`
   - `<a href="#presenca">` $\rightarrow$ `<a href="index.html#presenca">`
2. **Implementar Tratamento Cross-Page em `js/shared-navigation.js`:**
   - Em `setupAnchorNavigation()`, caso `!isHomePage` e o link clicado aponte para uma âncora de seção da Home (`#sobre`, `#servicos`, `#metodo`, `#presenca`, `#parceria`, `#cta`, `#contato`), redirecionar automaticamente via `window.location.href = 'index.html' + hashPart`.
   - Em `syncHeaderLinks()`, expandir a normalização para incluir também links no footer ou unificar como `syncPageLinks()`.
3. **Adicionar Guarda de Idempotência em `window.initOutlierNavigation()`:**
   - Adicionar uma flag (ex: `if (window.__outlierNavInitialized) return; window.__outlierNavInitialized = true;`) ou desanexar/reutilizar os listeners de clique para impedir acúmulo de listeners no `document`.

---

## 5. Verification Method

Para verificar de forma independente e reproduzir integralmente estas conclusões:

1. **Executar a Suíte Automatizada do Challenger:**
   ```powershell
   python "c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\scripts\test_challenger_m1.py"
   ```
   *Condição de invalidação deste relatório:* Se o comando retornar código 0 com todos os testes passando (`PASS`). Atualmente, o comando falha com código 1 comprovando os 3 defeitos.

2. **Teste Interativo no Navegador (Chrome DevTools):**
   - Abrir `http://localhost:8080/termos.html`.
   - Rolar até o rodapé e clicar no link "Escopo de Atuação".
   - *Comportamento observado atual:* A URL torna-se `termos.html#servicos` e nada ocorre (elemento inexiste).
   - *Comportamento esperado:* Deve navegar imediatamente para `index.html#servicos`.
