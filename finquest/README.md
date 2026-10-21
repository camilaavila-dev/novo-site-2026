# finQuest

Jogo de finanças no formato MMO, inspirado em World of Warcraft, com classes
baseadas nas profissões do mercado financeiro. Nasceu do mapa em pixel art do
site do Léo (`mapa.html`).

Esta pasta guarda o contexto, as decisões e, depois, o código do jogo. Ela
**não vai para a hospedagem do site** e não segue a regra "não somos um jogo"
do site; segue todas as outras de `docs/REGRAS.md`, principalmente as de
conformidade.

Marcação: **[Léo]** é decisão dele. **[sugestão]** é proposta do assistente,
ainda não aprovada. **[aberto]** é pergunta sem resposta.

---

## 1. O que já está decidido

- [Léo] Jogo de finanças, formato MMO, inspiração em World of Warcraft.
- [Léo] Tema central: investimentos e mercado financeiro.
- [Léo] Cerca de 6 classes baseadas em profissões do mercado. Quatro definidas:
  **Analista, Gestor, Sábio e Investidor** (o Investidor é a mais importante).
- [Léo] Origem: o site `leoarruda.com.br`, feito pela Camila, que já funciona
  como um jogo (o mapa da jornada).
- [Léo] Começar no Claude Code, ligado a este repositório. Depois levar para o
  Antigravity.

## 2. O que está em aberto

- [aberto] Nome: "finQuest" ou "Ofin Quest"?
- [aberto] MMO de verdade (todos no mesmo mundo, em tempo real) ou social
  assíncrono (cada um joga no seu tempo, com ranking, guildas e trocas)?
- [aberto] Plataforma (web, celular, computador) e estilo (2D pixel art como o
  mapa, ou outro).
- [aberto] Público e modelo de negócio: educação para o público geral? Porta de
  entrada para clientes e prospects da Portfel? Pago, gratuito, patrocinado?
- [aberto] As duas classes que faltam e o que cada classe faz.
- [aberto] Papel da Camila e do resto do time; prazos.
- [aberto] Compliance: o jogo precisa passar pelo compliance da Portfel antes
  de ir ao ar? Vai citar a Portfel e o Léo, ou ser uma marca separada?

## 3. Proposta de caminho [sugestão]

### 3.1 Começar assíncrono, não MMO em tempo real

| | Social assíncrono | MMO em tempo real |
|---|---|---|
| Como é | Cada um joga no seu ritmo. Rodadas (ex.: "um ano de mercado" por dia). Ranking, guildas, mercado entre jogadores. | Todos andando no mesmo mundo ao mesmo tempo, vendo uns aos outros. |
| Servidor | Um banco de dados com login (Supabase ou Firebase). Sem servidor de jogo. | Servidor de jogo rodando 24 h, sincronizando posições e ações. |
| Custo mensal no início | Perto de zero (plano gratuito) | Centenas de reais para cima, e cresce com os jogadores |
| Complexidade | Baixa: dá para um builder autodidata tocar com IA | Alta: rede, latência, trapaça, escalabilidade |
| Combina com o tema? | Muito: investimento é decisão e tempo, não reflexo | Pouco: mercado financeiro não é sobre quem aperta mais rápido |

O assíncrono testa a ideia barato. Se pegar, o mundo compartilhado em tempo
real pode vir depois sobre a mesma base.

### 3.2 MVP: uma classe, um loop, sem multiplayer

- **Classe:** Investidor.
- **Loop:** o jogador recebe um patrimônio fictício e, a cada rodada (um "ano"),
  distribui entre classes de ativo fictícias (renda fixa, ações, exterior,
  imóveis). Sai um cenário (juros, inflação, crise ou bonança), o motor de
  `js/calculos.js` calcula o resultado, e o jogador ganha XP.
- **XP pela qualidade da decisão, não pela sorte:** diversificação, custo baixo,
  respeito ao horizonte, reserva de emergência. Quem acerta a aposta e quebra a
  regra ganha dinheiro no jogo e perde XP. Isso é o diferencial educativo e
  protege o jogo de parecer recomendação.
- **Mundo:** o mapa atual, com os nove lugares virando regiões (a Névoa das
  taxas, a Fortaleza da sucessão, o Cume da independência).
- **Validação:** 10 a 20 pessoas jogando por uma semana. Elas voltam no dia
  seguinte? Entendem melhor juros compostos e custo de taxas?

### 3.3 Classes ligadas ao que a profissão faz de verdade

| Classe | Mecânica | Status |
|---|---|---|
| Investidor | Aloca o próprio patrimônio; o atributo-chave é paciência (bônus por horizonte longo). | [Léo] classe, [sugestão] mecânica |
| Analista | Revela informação escondida dos ativos (balanço, dívida, valuation): dissipa a "névoa". | [Léo] classe, [sugestão] mecânica |
| Gestor | Administra dinheiro de outros jogadores, com regra de risco e dever fiduciário; perde cotistas se sair do mandato. | [Léo] classe, [sugestão] mecânica |
| Sábio | Lê o ciclo macro e a história dos mercados; dá "buffs" de leitura de cenário para o grupo. | [Léo] classe, [sugestão] mecânica |
| Consultor | Fee-based: guia outros jogadores e ganha quando eles vão bem, nunca por comissão. É o próprio modelo da Portfel virando mecânica. | [sugestão] |
| Trader | Curto prazo, alta variância, muito custo de operação; mostra na prática por que poucos ganham assim. | [sugestão] |

Léo, aqui é onde você deve corrigir: regras de produto, nomes e o que cada
profissão faz no dia a dia são o diferencial que nenhum outro jogo tem.

### 3.4 Técnica

- Protótipo do MVP pode continuar em JavaScript puro, reaproveitando
  `js/mapa.js` e `js/calculos.js`.
- Se o jogo crescer (mais mapas, animações, combate), trocar o mapa por uma
  engine 2D para web, como **Phaser**: feita para jogos em pixel art no
  navegador, gratuita e muito usada. O motor financeiro continua o mesmo.
- Quando entrar login e ranking: Supabase (banco + login prontos).

## 4. Conformidade no jogo

- Ativos, empresas e cenários **fictícios**. Nada de ticker real.
- Aviso fixo: conteúdo educacional e de ficção, não é recomendação de
  investimento, resultado no jogo não indica resultado real.
- Nenhuma tela do jogo diz "compre", "venda" ou "aloque X%" como conselho.
- Antes de lançar, validar com o compliance da Portfel e conferir as regras
  da CVM e da Anbima sobre conteúdo de consultor (Léo é CEA).

## 5. Próximos passos

1. [x] Auditar o repositório: `finquest/AUDITORIA.md`.
2. [ ] Léo responde a seção 2 (pelo menos: assíncrono ou tempo real, público,
   nome).
3. [ ] Léo revisa as classes da seção 3.3 e define as duas que faltam.
4. [ ] Protótipo jogável do MVP (Investidor, 10 rodadas) em `finquest/`.
5. [ ] Teste com 10 a 20 pessoas.
6. [ ] Decidir repositório e domínio próprios antes de migrar para o
   Antigravity.

## Origem do contexto

Briefing escrito em 20/10/2026 a partir das conversas do Léo com o Claude no
chat. Perfil do Léo e como trabalhar com ele: ver `CLAUDE.md` na raiz.
