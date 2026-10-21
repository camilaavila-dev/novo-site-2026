# Site · Leonardo Arruda, Consultor de Investimentos

Site institucional do Leonardo Arruda, consultor de investimentos ANBIMA CEA
pela Portfel (Grupo Primo), no modelo fee-based. Feito em HTML, CSS e
JavaScript puros: não precisa de instalação, de banco de dados nem de
servidor especial. Qualquer hospedagem de site estático serve.

Última revisão: 20 de outubro de 2026.

---

## Abrir o site no computador

Com o [Node.js](https://nodejs.org) instalado, na pasta do projeto:

```
npm start
```

E abra **http://localhost:8080**. Para mostrar a outra pessoa no mesmo Wi-Fi:

```
npm run rede
```

O endereço passa a ser `http://SEU-IP:8080` (o IP aparece no comando
`ipconfig`). O Windows precisa estar com a rede marcada como **privada**, ou o
firewall bloqueia o acesso.

Sem Node, dá para abrir o `index.html` direto no navegador: quase tudo
funciona, mas os testes e o mapa preferem o servidor.

---

## As páginas

| Página | Arquivo | O que é |
|---|---|---|
| Início | `index.html` | Sete telas, uma ideia por tela, sem rolagem: o custo invisível das taxas, o modelo fee-based, o que a consultoria cobre, quem é o Leo, na mídia e o primeiro passo. |
| Calculadoras | `instrumentos.html` | Tela de ícones. Cada calculadora abre numa janela, como um aplicativo: taxas, renda fixa, sucessão, independência, imóvel e holding. |
| Diagnóstico | `raiox.html` | Dez perguntas, nota de 0 a 100 e os dois pontos que mais pedem atenção. |
| Leitura semanal | `blog.html` | Newsletter da semana: indicadores com fonte, número da semana, resumo em 1 minuto, leitura completa e o que observar. |
| Links | `linktree.html` | Página para a bio do Instagram e do LinkedIn. |
| Jornada ilustrada | `jornada.html` | A versão em capítulos com as ilustrações em pixel art. Fora do Google. |
| Mapa da jornada | `mapa.html` | O mundo em pixel art em que o viajante anda (setas, WASD ou toque) e visita cada etapa. Fora do Google. |
| Termos e privacidade | `termos.html`, `privacidade.html` | Textos legais. |
| `simulador.html` | | Endereço antigo: redireciona para as calculadoras. |

---

## As pastas

```
/                     as páginas do site (o que vai para a hospedagem)
├── css/              estilos (home.css é a base visual de todas as páginas novas)
├── js/               comportamento das páginas e o motor de cálculo
├── data/             TEXTOS E NÚMEROS EDITÁVEIS, sem programação
├── midias/           fotos, logos, ilustrações e o mapa
├── docs/             documentação (comece por COMO-EDITAR.md)
├── tests/            testes automáticos
├── scripts/          servidor local
└── versoes/          versões anteriores do site, guardadas para consulta
```

O que **não** vai para a hospedagem: `docs/`, `tests/`, `scripts/`,
`versoes/`, `node_modules/`, `package.json`, `package-lock.json` e este README.

### Onde fica cada coisa que muda com frequência

| Quero mudar | Arquivo |
|---|---|
| Selic, CDI, IPCA, custos, alíquotas, regras de imposto | `data/premissas.js` |
| A leitura da semana | `data/editorial.js` |
| A frase do Leo numa tela da home | `data/filosofia.js` |
| As perguntas do diagnóstico | `data/diagnostico.js` |
| Os lugares do mapa | `js/mapa.js` (lista `LUGARES` no topo) |

O passo a passo está em [docs/COMO-EDITAR.md](docs/COMO-EDITAR.md).

---

## Documentação

- [docs/COMO-EDITAR.md](docs/COMO-EDITAR.md): editar textos e números sem programador.
- [docs/REGRAS.md](docs/REGRAS.md): regras de conteúdo, de conformidade e de código. **Leia antes de mudar qualquer texto.**
- [docs/SPEC.md](docs/SPEC.md): o que cada página faz, como se comporta e o sistema visual.
- [docs/CALCULADORAS.md](docs/CALCULADORAS.md): pesquisa de mercado, as duas referências de cada calculadora e as fórmulas.
- [docs/VERSOES.md](docs/VERSOES.md): o histórico das versões e por que cada uma mudou.
- [docs/ARTE.md](docs/ARTE.md): a bíblia de arte e os prompts das ilustrações.
- [docs/material-do-leo/](docs/material-do-leo/): material original da marca (PDFs e o "cérebro da marca").

---

## Testes

```
npm test
```

Roda quatro conjuntos e todos devem terminar com "0 falharam":

| Teste | O que confere |
|---|---|
| `tests/calculos.test.mjs` | As contas das calculadoras, contra exemplos calculados à mão. |
| `tests/home-check.mjs` | A home em seis tamanhos de tela: cabe sem rolar, navegação, gráfico, sem JavaScript. |
| `tests/site-check.mjs` | Todas as páginas: links, calculadoras, diagnóstico, leitura semanal, mapa, links. |
| `tests/jornada-check.mjs` | A jornada ilustrada. |

Os testes de navegador usam o Google Chrome instalado no Windows
(`C:/Program Files/Google/Chrome/Application/chrome.exe`). Em outro sistema,
ajuste o caminho no topo de cada arquivo de teste.

---

## Antes de publicar

- [ ] O Leo revisou os textos da home, principalmente "coordenado por uma pessoa só" e "sendo notada por isso".
- [ ] O Leo revisou ou reescreveu a edição da leitura semanal (hoje é um compilado dos indicadores, com autoria declarada como tal).
- [ ] Um contador conferiu a calculadora de holding (regras de 2026, ver docs/CALCULADORAS.md).
- [ ] Os números de `data/premissas.js` e da leitura semanal estão atualizados, com a data em `conferidoEm`.
- [ ] O domínio em `sitemap.xml` e `robots.txt` é o definitivo.
- [ ] `npm test` terminou com 0 falhas.
