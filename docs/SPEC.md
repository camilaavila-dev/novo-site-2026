# Especificação do site

O que cada parte faz e como deve se comportar. Quando o comportamento mudar,
atualize este arquivo junto com o código.

---

## 1. Objetivo e público

**Objetivo:** fazer o possível cliente entender, em poucos minutos, por que uma
consultoria fee-based protege o patrimônio dele, confiar no Leo e agendar a
primeira conversa.

**Público:** três perfis, em ordem de prioridade:

1. Investidor em crescimento: já investe, falta estratégia e alguém que veja o todo.
2. Empresário e C-level: renda alta, pouco tempo, decisões que não esperam.
3. Família patrimonial: pensa em décadas, sucessão e proteção.

Atende no Brasil e na Europa, remoto e presencial.

**Ação principal:** agendar a primeira conversa, pelo formulário da Microsoft
(o endereço está em todos os botões verdes). Ações secundárias: diagnóstico,
calculadoras e leitura semanal.

---

## 2. Página inicial · `index.html`

Sete telas, uma ideia por tela, **sem rolagem da página**. Só uma tela aparece
por vez.

| # | id | Tela | Conteúdo |
|---|---|---|---|
| 1 | `inicio` | Abertura | "Patrimônio pede plano. Não produto.", foto do Leo, agendar e "entender em 1 minuto". |
| 2 | `custo` | O custo invisível | Número grande (R$ 1,3 milhão em R$ 1 milhão por 20 anos), gráfico de duas curvas (custo de 0,7% e de 2% a.a.) e quatro botões de patrimônio. |
| 3 | `modelo` | Do seu lado da mesa | Tabela comissionado x fee-based. |
| 4 | `servicos` | O que a consultoria cobre | Quatro frentes com os 16 serviços. |
| 5 | `quem` | Quem é | Foto na B3, credenciais, números e logo da Portfel, frase do Leo. |
| 6 | `midia` | Na mídia | Logos dos veículos. |
| 7 | `comecar` | O primeiro passo | Cartão verde de agendar (com os três passos), três caminhos secundários, links e avisos legais. |

**Navegação:** setas do teclado, Page Up/Down, Home/End, roda do mouse (uma
tela por gesto), deslizar o dedo, as marcas da barra inferior e os botões.
O endereço acompanha a tela (`index.html#custo`) e abre direto nela.

**Regras:** cada tela cabe inteira de 360 × 640 a 1440 × 900; telas ocultas
ficam fora do foco (`inert`); sem JavaScript, as telas aparecem empilhadas.

Arquivos: `index.html`, `css/home.css`, `js/home.js`, `data/filosofia.js`.

---

## 3. Calculadoras · `instrumentos.html`

Uma tela de ícones, como a tela inicial de um celular. Cada ícone abre uma
janela (`<dialog>`) com controles à esquerda e resultado à direita; no celular
a janela ocupa a tela e o resultado fica em cima.

| Ícone | id na URL | Pergunta | Visual |
|---|---|---|---|
| Custo das taxas | `#taxas` | O que o meu extrato não mostra? | Duas curvas e a área perdida. |
| Renda fixa | `#renda-fixa` | Qual rende mais no meu prazo? | Barras de ganho líquido de CDB, LCI/LCA e Tesouro Selic. |
| Sucessão | `#sucessao` | Quanto a família pagaria para receber? | Barra de para onde vai o patrimônio e custo x liquidez disponível. |
| Independência | `#independencia` | Quando o patrimônio me sustenta? | Curva até a meta, com o ano marcado. |
| Imóvel | `#imovel` | Alugar ou comprar? | Duas curvas de patrimônio. |
| Holding | `#holding` | Vale colocar os imóveis numa empresa? | Modo aluguel: imposto acumulado PF x holding e o ano de retorno. Modo venda: barras e composição do custo. |
| Diagnóstico | (link) | | Leva a `raiox.html`. |

**Comportamento:** cada controle tem barra e campo de digitação; mexer em
qualquer controle muda o resultado; "Como calculamos" troca o resultado pela
fórmula, o método, as referências de mercado e o que a calculadora faz de
diferente; Esc fecha e devolve o foco ao ícone; `instrumentos.html#sucessao`
abre direto a janela.

Arquivos: `instrumentos.html`, `css/apps.css`, `js/apps.js` (janela e
gráficos), `js/instrumentos.js` (campos e textos de cada calculadora),
`js/calculos.js` (contas), `data/premissas.js` (números).

As fórmulas e as referências estão em [CALCULADORAS.md](CALCULADORAS.md).

---

## 4. Diagnóstico · `raiox.html`

Dez perguntas em cinco dimensões (custos, diversificação, liquidez,
tributação, sucessão), duas por dimensão, quatro opções valendo 0, 35, 70 e
100. Resultado: nota média de 0 a 100, a faixa e as duas dimensões mais
frágeis, cada uma com orientação e link para a calculadora ou tela da home
correspondente. Nada é enviado: tudo acontece no navegador.

Arquivos: `raiox.html`, `js/diagnostico.js`, `data/diagnostico.js`.
Visual ainda no estilo anterior (`css/jornada.css`).

---

## 5. Leitura semanal · `blog.html`

Formato de newsletter. A página rola (é texto para ler).

- Faixa de indicadores no topo (5 indicadores, cada um com nota e fonte).
- Edição: tema, data, tempo de leitura, título, autoria; número da semana
  (opcional); "Em 1 minuto" com três fatos; leitura completa; "O que observar
  no seu patrimônio" em quatro cartões; fontes numeradas.
- Coluna lateral: seguir no LinkedIn, edições anteriores (aparece com 2 ou
  mais edições, com filtro por tema quando houver mais de um) e agendar.
- `blog.html#ed-AAAA-MM-DD` abre uma edição específica.

Arquivos: `blog.html`, `css/leitura.css`, `js/leitura.js`, `data/editorial.js`.

---

## 6. Links · `linktree.html`

Para a bio das redes. Foto, nome, credenciais, botão de agendar (visível sem
rolar em qualquer celular), quatro atalhos do site, números da Portfel,
LinkedIn e Instagram, aviso legal curto.

Arquivos: `linktree.html`, `css/links.css`.

---

## 7. Extras visuais (fora do Google)

**Jornada ilustrada · `jornada.html`:** a narrativa em nove capítulos
(Mirante, Ponto de Partida, Guia, Névoa, Mapa, Fortaleza, Cume, Farol,
Primeiro Passo), uma tela por capítulo, com as ilustrações de
`midias/jornada/`. Cada capítulo abre um painel com o conteúdo completo.
Arquivos: `jornada.html`, `css/jornada.css`, `css/jornada-tela.css`, `js/jornada.js`.

**Mapa da jornada · `mapa.html`:** o mundo em pixel art
(`midias/mapa/mundo.jpg`, 1206 × 768) com o viajante (`midias/mapa/viajante-*.png`).
Anda com setas/WASD ou tocando no mapa; ao chegar num dos nove lugares, abre
uma caixa de diálogo com o resumo, a ferramenta do site correspondente e "Ver a
cena" (na jornada ilustrada). Lembra os lugares visitados no navegador.
`mapa.html#fortaleza` começa no lugar. Arquivos: `mapa.html`, `css/mapa.css`, `js/mapa.js`.

---

## 8. Sistema visual

| Item | Valor |
|---|---|
| Fundo | `#07061A`, com brilho violeta e grade fina |
| Texto | `#EFEBDD` (principal), 74% e 50% de opacidade (secundário, terciário) |
| Ação principal | Verde `#1CD98A`, texto escuro `#04130C` |
| Destaque | Dourado `#F2C14E` (itálico dos títulos, número da semana) |
| Alerta | `#F06F5E` (perdas, custo) |
| Títulos | EB Garamond 400/500, itálico dourado na segunda metade da frase |
| Texto | DM Sans 300–500 |
| Números | JetBrains Mono 500, `tabular-nums` |
| Rótulos | JetBrains Mono 11–12px, caixa alta, espaçamento 0,12–0,14em |
| Cantos | 999px (botões), 16–24px (cartões) |
| Barra superior | Logo, navegação (some abaixo de 1080px), botão "Agendar conversa" |

---

## 9. Requisitos gerais

- Navegadores: Chrome, Safari, Edge e Firefox atuais; iPhone e Android.
- Acessibilidade: navegação por teclado, foco visível, `aria-live` nos
  resultados, textos alternativos nas fotos, contraste do texto principal
  acima de 7:1.
- Desempenho: sem framework; imagens com `width`/`height` para não pular;
  fotos fora da primeira tela com `loading="lazy"`.
- Privacidade: nenhum dado do visitante sai do navegador. O único dado
  guardado é local (`localStorage`): perfil escolhido na jornada e lugares
  visitados no mapa.
- SEO: `sitemap.xml`, `robots.txt`, `llms.txt` e dados estruturados
  (Person e FinancialService) na home.
