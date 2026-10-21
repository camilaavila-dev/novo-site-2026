# Regras do projeto

Valem para qualquer pessoa ou ferramenta que mexer no site, inclusive
assistentes de IA. Quando uma regra conflitar com um pedido, a regra vence e o
conflito deve ser levado ao Leo.

---

## 1. Conformidade (o que um consultor não pode publicar)

1. **Nada de recomendação de investimento.** O site explica cenários,
   mecanismos e o que observar. Nunca diz o que comprar, vender, quanto alocar
   ou "é o momento de". Recomendação é individual e acontece na consultoria.
   O teste automático procura "compre", "venda", "recomendamos" e "alocação
   recomendada" na leitura semanal.
2. **Nenhum número sem fonte e sem data.** Indicadores de mercado levam a fonte
   (Banco Central, IBGE, B3...) e a data. Premissas das calculadoras ficam em
   `data/premissas.js`, cada uma com a fonte num comentário, e a data de
   conferência aparece em toda calculadora.
3. **Nenhum número inventado.** Nada de "mais de 1.200 assinantes", "milhares de
   clientes" ou depoimentos sem origem. Os números institucionais são os
   publicados pela Portfel (+R$ 22 bi sob consultoria, +25 mil clientes, +700
   consultores, NPS 97) e aparecem como "Números da Portfel".
4. **Avisos legais em todas as páginas:** CNPJ da LA Consultoria, registro da
   Portfel na CVM (Resolução CVM nº 19/2021), que a Portfel não faz
   intermediação nem custódia, e que o conteúdo é informativo, as simulações
   são ilustrativas e rentabilidade passada não garante resultado futuro.
5. **Simulação não é promessa.** Toda calculadora diz o que não considera e
   termina com "simulação ilustrativa, não é recomendação nem promessa de
   rentabilidade".
6. **Autoria honesta.** Texto que não foi escrito pelo Leo não leva a assinatura
   dele. A leitura semanal tem o campo `autoria` para isso.

## 2. Tom e linguagem

- Voz: estratégica, direta, confiável, analítica e humana (ver
  `docs/material-do-leo/cerebro_da_marca_...md`).
- **Não somos um jogo.** O termo mais lúdico aceito é "jornada do
  investimento". Na home e nas páginas principais não se usa XP, nível,
  missão, conquista, jogador nem "game". O mapa e a jornada ilustrada são
  extras visuais, não a apresentação do serviço.
- **Sem emoji**, em nenhuma página. O teste automático falha se encontrar um.
- Frases curtas. Uma ideia por tela na home: se precisar de mais texto, a
  informação vai para uma página própria ou para o "Como calculamos".
- Português do Brasil, com acentos. Números no padrão brasileiro: R$ 1,3
  milhão, 13,75% a.a.

## 3. Visual

- Base visual: `css/home.css` (cores, fontes, botões, barra superior). Páginas
  novas reutilizam essa base e acrescentam só o que é delas.
- Fontes: EB Garamond (títulos), DM Sans (texto), JetBrains Mono (números).
  A Cormorant Garamond foi descartada: desenha os acentos descolados das letras.
  Pixelify Sans só no mapa.
- Cores principais: fundo `#07061A`, texto `#EFEBDD`, verde de ação `#1CD98A`,
  dourado de destaque `#F2C14E`, vermelho de alerta `#F06F5E`.
- O verde é reservado para a ação principal (agendar) e para o que é bom no
  gráfico. Uma tela não tem dois botões verdes competindo.
- Fotos do Leo: as da pasta `midias/fotos novas do leonardo/`. O arquivo
  `leo-arruda.png` é um diagrama de serviços, não uma foto.

## 4. Código

- HTML, CSS e JavaScript puros, sem framework e sem etapa de build. Bibliotecas
  externas só se não houver outro jeito.
- **Uma fonte de verdade para cada coisa.** Números de mercado só em
  `data/premissas.js`; contas só em `js/calculos.js` (funções puras, testadas);
  textos editáveis em `data/`. Nenhuma tela faz conta própria.
- Toda conta nova entra em `js/calculos.js` com teste em
  `tests/calculos.test.mjs`, conferido contra um exemplo feito à mão.
- O site precisa funcionar sem JavaScript (as telas aparecem empilhadas) e com
  teclado. Respeitar `prefers-reduced-motion`.
- A home não pode rolar: cada tela cabe inteira do celular pequeno (360 × 640)
  ao monitor grande. O teste `tests/home-check.mjs` mede isso.
- Antes de entregar qualquer mudança: `npm test` com 0 falhas, e conferir a
  página no celular e no computador.
- Versões antigas não se apagam: vão para `versoes/` com data e entram em
  `docs/VERSOES.md`.

## 5. O que fica de fora do ar

`docs/`, `tests/`, `scripts/`, `versoes/` e `node_modules/` nunca vão para a
hospedagem. A jornada ilustrada e o mapa ficam publicados, mas com
`noindex` (fora do Google), porque não são a apresentação principal do serviço.
