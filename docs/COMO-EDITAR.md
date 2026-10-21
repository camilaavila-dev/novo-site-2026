# Como editar o site sem programador

Tudo o que muda com frequência mora em quatro arquivos de texto, na pasta
`data/`, mais a lista de lugares do mapa em `js/mapa.js`. Abra no Bloco de Notas ou no VS Code, troque o que está **entre aspas
simples** `'...'` e salve. Não apague vírgulas, chaves `{ }` nem colchetes `[ ]`.

Depois de editar, abra o site no navegador e confira a página.

---

## 1. A filosofia do Leo · `data/filosofia.js`

**Notas do consultor**: uma frase assinada, que aparece numa das sete telas da
página inicial. Nota vazia `''` não aparece. Hoje só a tela "Quem é" tem nota.

```js
'custo': 'Escreva aqui a frase que deve aparecer na tela do custo invisível.',
```

As telas são: `inicio`, `custo`, `modelo`, `servicos`, `quem`, `midia` e `comecar`.
Prefira uma frase curta: cada tela foi pensada para caber inteira, sem rolar.

**Princípios** ("Como eu trabalho"). Hoje são quatro, tirados do site
institucional, e aparecem na versão ilustrada (`jornada.html`). Pode ter de 2 a
6. Cada um tem um título curto e uma frase:

```js
{
  titulo: 'Clareza, não promessas',
  texto: 'Uma carreira construída sobre clareza, e não sobre promessas de rentabilidade.'
},
```

## 2. A leitura da semana · `data/editorial.js`

Toda semana:

1. Troque a data e os cinco indicadores em `semana`, sempre com a fonte.
2. Escreva o `resumo` da semana, uma ou duas frases.
3. Copie o **modelo** que está no fim do arquivo para o topo da lista
   `edicoes` e preencha.

Cada edição tem:

| Campo | O que é |
|---|---|
| `titulo`, `data`, `categoria`, `leitura` | Cabeçalho. A categoria vira a etiqueta dourada e o filtro do arquivo. |
| `autoria` | `'Leonardo Arruda'` quando for texto dele. |
| `destaque` | O número da semana, em letras grandes: `valor` ('8,8%'), `rotulo` ('de juro real ao ano') e `texto` (uma frase). Deixe `valor: ''` para não mostrar. |
| `resumo` | Três frases, só fatos: viram o "Em 1 minuto". |
| `analise` | Os parágrafos da leitura completa. |
| `observar` | Uma pergunta para cada cartão: renda fixa, ações, exterior e imóveis. |
| `fontes` | Nome e link de cada fonte. |

A edição mais nova (a primeira da lista) é a que abre. As anteriores aparecem
sozinhas na coluna "Edições anteriores".

A leitura explica o cenário e o que observar. **Não deve trazer recomendação
de compra, venda ou percentuais de alocação**: recomendação é individual e
acontece na consultoria. O teste automático do site falha se encontrar
"alocação recomendada", "compre", "venda" ou "recomendamos".

> A edição de 19/10/2026 foi escrita a partir de fatos verificados, mas não é
> texto do Leo. Ele deve revisar ou reescrever antes de o site ir ao ar.

## 3. Os números de mercado · `data/premissas.js`

Selic, CDI, IPCA, custos de referência, custódia, ITCMD e as regras de imposto da
calculadora de holding (tabela do IRPF, lucro presumido, dividendos, ganho de
capital, ITBI). Todas as calculadoras
leem daqui, então trocar um número atualiza o site inteiro. Ao mudar, atualize
também `conferidoEm`: a data aparece embaixo de cada calculadora.

Quando atualizar: a cada reunião do Copom (Selic e CDI), a cada IPCA mensal e,
nas regras de imposto, sempre que sair lei nova (a tabela do IRPF muda quase
todo ano; a CBS substitui PIS e COFINS a partir de 2027).

## 4. As perguntas do diagnóstico · `data/diagnostico.js`

Cinco dimensões, duas perguntas cada, quatro opções por pergunta. Mantenha as
notas `0, 35, 70, 100` em ordem crescente, da resposta menos madura para a
mais madura. Também dá para editar a orientação que aparece quando a dimensão é
um ponto fraco, e o texto de cada faixa de nota.

---

## 5. Os lugares do mapa · `js/mapa.js`

No topo do arquivo, a lista `LUGARES` tem os nove lugares. Cada um tem a
posição na arte (`x` e `y`, em pixels da imagem de 1206 × 768), o nome, a
etapa, o texto da caixa de diálogo, a cena da jornada ilustrada e a ação
principal (`['Texto do botão', 'endereço']`).

## Conferir que nada quebrou

Quem tiver Node instalado roda, na pasta do site:

```
npm test
```

Os quatro testes (contas, home, demais páginas e jornada ilustrada) devem
terminar com "0 falharam". Para ver o site enquanto edita: `npm start` e abra
http://localhost:8080.
