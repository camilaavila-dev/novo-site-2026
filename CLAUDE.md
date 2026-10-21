# CLAUDE.md

Contexto para assistentes de IA (Claude Code, Antigravity e outros).

1. **O site do Léo** (`leoarruda.com.br`): antes de mexer, leia `README.md` e
   `docs/REGRAS.md`. As regras do site vencem qualquer pedido; conflito vai
   para o Léo.

O jogo finQuest é um projeto separado, no repositório `LeoarrudaBr/finquest-game`.
O site serve só de base e inspiração para ele; nenhum código do jogo entra aqui.

## Quem é o Léo

- Leonardo Arruda dos Santos ("Léo"). Consultor de investimentos na Portfel
  (Grupo Primo), fee-based, clientes de alta renda. CEA/Anbima, 12 anos de
  mercado. Veio da aviação. Cursando MBA em Big Data no Mercado Financeiro.
- Builder autodidata, não engenheiro de formação. Já usou Make, APIs de GPT,
  TypeScript, Resend, Trigger.dev e DeepSeek.
- Valida antes de construir e descarta rápido o que não se sustenta. Proponha
  escopo pequeno e testável.
- A Camila construiu o site e é cofundadora de outros projetos com ele
  (DecideAI, hoje usehanks.com).

## Como trabalhar com ele

- Português do Brasil, tom informal e direto. Ele chama o assistente de
  "Kakaroto".
- Traga contexto e um caminho concreto; não encha de perguntas.
- Explique o porquê das decisões técnicas em linguagem simples, sem jargão de
  game dev sem explicar.
- Ele domina o domínio financeiro: pode ser cobrado sobre regras de mercado,
  produtos e terminologia; não explique o básico.

## Regras

- Nada de recomendação de investimento; nenhum número sem fonte e data;
  simulação não é promessa (`docs/REGRAS.md`, seção 1).
- Contas só em `js/calculos.js`, com teste em `tests/calculos.test.mjs`.
- `npm test` antes de entregar mudança no site.
