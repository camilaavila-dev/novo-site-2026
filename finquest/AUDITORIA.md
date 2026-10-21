# Auditoria do repositório para o finQuest

Feita em 21/10/2026, lendo o código do branch `claude/exciting-keller-sbggvz`
(mesmo conteúdo do `master`, commit `fa6ee7b`). Uma página: o que existe, o que
já é "jogo" e o que dá para reaproveitar.

## Stack

- **HTML, CSS e JavaScript puros.** Sem framework, sem build, sem banco de
  dados, sem servidor. Qualquer hospedagem estática serve.
- Node só para o servidor local (`npm start`, `scripts/servidor.mjs`) e para os
  testes (`npm test`, com `playwright-core` dirigindo o Chrome).
- Estado do visitante só no `localStorage` do navegador (perfil escolhido e
  lugares visitados no mapa). Nada vai para servidor.
- Tamanho: ~3.300 linhas de HTML/JS de páginas e dados, ~2.600 de JS de
  comportamento, ~4.200 de CSS.

## O que já é "jogo"

| Peça | Arquivos | O que faz | Serve para o finQuest? |
|---|---|---|---|
| **Mapa da jornada** | `mapa.html`, `js/mapa.js` (217 linhas), `css/mapa.css`, `midias/mapa/` | Mundo em pixel art (1206 × 768). O viajante anda com WASD/setas ou toque, a câmera acompanha, sprites de frente/costas/lado. Ao chegar num dos 9 lugares abre uma caixa de diálogo estilo RPG. Conta lugares visitados. | **Sim, é o embrião.** Já tem loop de jogo (`requestAnimationFrame`), movimento, câmera, colisão por proximidade e diálogo. Não tem combate, inventário, XP nem progresso real. |
| **Jornada ilustrada** | `jornada.html`, `js/jornada.js`, `css/jornada*.css`, `midias/jornada/` | Nove capítulos em tela cheia (Mirante, Ponto de Partida, Guia, Névoa, Mapa, Fortaleza, Cume, Farol, Primeiro Passo). | **Sim, como narrativa e arte.** Os nove lugares já são um "mundo" com regiões temáticas. |
| **Bíblia de arte** | `docs/ARTE.md` | Paleta, ficha do viajante, ficha do guia e os prompts de cada cena em pixel art. | **Sim.** Base do estilo visual e dos prompts para gerar novos personagens. |
| **Versão "Mundo das ilhas" (Gemini)** | `versoes/2026-10-20-gemini-mundo-das-ilhas/` | Primeira tentativa com XP, níveis e WASD. Descartada no site por visual infantil, emojis e textos com recomendação de investimento. | **Só como referência do que evitar.** |

## O que dá para reaproveitar

1. **Motor de cálculo** (`js/calculos.js`): funções puras e testadas de juros
   compostos, custo de taxas, IR regressivo, renda fixa, independência
   financeira, holding. É o "motor de física" financeiro do jogo: o resultado de
   uma decisão do jogador sai daqui, com contas corretas.
2. **Premissas** (`data/premissas.js`): Selic, CDI, IPCA, custos, alíquotas,
   cada uma com fonte e data. Ponto de partida para os cenários do jogo.
3. **Diagnóstico** (`data/diagnostico.js`): cinco dimensões (custos, estrutura,
   proteção, sucessão, independência) com perguntas pontuadas de 0 a 100. É um
   sistema de atributos pronto para a ficha do personagem.
4. **Mapa** (`js/mapa.js`): movimento, câmera e diálogo. Serve de protótipo; para
   um jogo maior provavelmente vale trocar por uma engine 2D (ver
   `finquest/README.md`).
5. **Testes**: o padrão "toda conta tem teste contra exemplo feito à mão" vale
   igual para o jogo.

## Atritos

- **As regras do site dizem "não somos um jogo"** (`docs/REGRAS.md`, seção 2):
  na home e nas páginas principais não se usa XP, nível, missão, conquista nem
  "game". O mapa e a jornada ficam com `noindex`. **Resolvido [Léo]:** o jogo
  é um projeto separado, com repositório próprio; o site é só base e
  inspiração.
- **Compliance** (`docs/REGRAS.md`, seção 1): nada de recomendação, nenhum
  número sem fonte, simulação não é promessa, avisos legais em toda página.
  Tudo isso vale para o jogo também, e com mais cuidado, porque o jogo
  premia decisões.
- **Testes presos ao Windows**: os testes de navegador apontam para
  `C:/Program Files/Google/Chrome/...`. No Claude Code na nuvem e no
  Antigravity, o caminho precisa vir de variável de ambiente.
