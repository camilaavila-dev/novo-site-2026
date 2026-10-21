# A Jornada do Investimento: plano do site

Documento de decisão. Define **o que** o site diz, **em que ordem**, **com que
palavras** e **como** cada parte funciona, antes de qualquer linha de código.

---

## 1. Por que as versões anteriores não funcionaram

| Problema | Causa | Decisão agora |
|---|---|---|
| Parecia brinquedo | XP, níveis, moedas, WASD, personagem andando | Nenhuma mecânica de jogo. A *estética* é de jornada épica; o *conteúdo* é de consultoria. |
| Nada funcionava direito | Câmera, zoom, canvas e física: muitas peças frágeis | Rolagem nativa do navegador. Tudo funciona mesmo se o JavaScript falhar. |
| Difícil de navegar | Mapa sem ordem: o visitante não sabia por onde começar | Um caminho com começo, meio e fim. Um índice sempre visível. |
| Informação solta | Ilhas sem arco narrativo, conteúdo repetido em três lugares | Cada capítulo responde **uma** pergunta do cliente, na ordem em que ele a faz. |
| Gráficos pobres | Desenho feito em código (retângulos e círculos) | Ilustração de verdade, gerada sob uma bíblia de arte única (ver `PROMPTS-ARTE.md`). |
| Voltava para o rosa | O agente do Gemini regenera o `index.html` sozinho | A jornada vive em `jornada.html`. Vira a home quando o Gemini for parado. |

---

## 2. Princípios

1. **Autoridade antes de encantamento.** A ilustração atrai; o texto convence.
   Nenhuma frase pode soar como entretenimento.
2. **Uma pergunta por capítulo.** O visitante nunca precisa procurar a
   próxima informação: ela é o próximo capítulo.
3. **Rolar é a única mecânica.** Sem teclas especiais, sem cliques obrigatórios.
   Quem só rola a página lê a história inteira.
4. **Toda interação dá uma resposta útil.** As duas calculadoras devolvem um
   número sobre a vida do visitante, não um efeito visual.
5. **Rigor visível.** Fórmulas explicadas, premissas declaradas, aviso
   regulatório onde há simulação.

---

## 3. Vocabulário

O termo guarda-chuva é **Jornada do Investimento**. As distinções importam:

| Usar | Nunca usar | Por quê |
|---|---|---|
| Jornada do investimento | Jogo, game, fase, level | É um serviço de consultoria regulado |
| Capítulo | Missão, quest, ilha | Capítulo é narrativa; missão é tarefa de jogo |
| O visitante, você | Jogador, player, personagem | O cliente não está brincando com o dinheiro dele |
| O guia, o consultor | Mestre, mentor místico, NPC | Leonardo é um profissional certificado |
| Diagnóstico | Raio-X mágico, scanner | "Raio-X" fica só como nome da ferramenta |
| Proteção patrimonial | Blindagem total, invulnerável | Promessa absoluta não existe em finanças |
| Simulação, projeção | Previsão, garantia, resultado | Projeção depende de premissas |
| Independência financeira | Ficar rico, enriquecer | Foco em tempo e escolha, não em ostentação |
| Fee-based (remuneração pelo cliente) | Grátis, sem custo | A consultoria é remunerada; o que não existe é comissão escondida |

**Tom:** frases curtas, verbos concretos, nenhum ponto de exclamação, nenhum
emoji. A voz é a de alguém que já viu muitos patrimônios e fala com calma.

---

## 4. O arco narrativo

A estrutura segue a jornada clássica do herói, mapeada exatamente sobre o
método de trabalho do Leonardo (Diagnóstico → Estratégia → Acompanhamento).
O visitante é o viajante; o Leonardo é o guia que aparece quando o caminho fica
difícil.

```
 PRÓLOGO      I            II         III         IV         V            VI         VII         EPÍLOGO
 O Mirante → O Ponto de → O Guia  →  A Névoa → O Mapa  →  A Fortaleza → O Cume  →  O Farol  →  O Primeiro
             Partida                                                                            Passo
 ─────────── chamado ─────────────── provação ──────────── conquista ─────────────── retorno ─────────────
 "onde       "quem sou   "com quem   "o que eu   "qual o    "como          "quando     "e depois?"  "como
  estou?"     eu aqui?"   vou?"      não vejo?"  plano?"    protejo?"      chego?"                 começo?"
```

### Prólogo · O Mirante
- **Pergunta do visitante:** isso é para mim?
- **Mensagem:** você construiu muito; agora precisa enxergar o caminho inteiro.
- **Título:** *Você levou anos construindo. Agora, enxergue o caminho inteiro.*
- **Conteúdo:** credenciais em uma linha (ANBIMA CEA · Portfel · Grupo Primo · fee-based).
- **Ações:** "Começar a jornada" (rola para o capítulo I) e "Agendar conversa".
- **Cena:** o viajante de costas, à beira de um penhasco ao amanhecer,
  olhando um vale vasto com uma estrada que serpenteia até uma cidadela distante.

### Capítulo I · O Ponto de Partida
- **Pergunta:** quem costuma fazer esta jornada?
- **Mensagem:** três perfis, três pontos de partida diferentes.
- **Conteúdo:** os três perfis reais (Investidor em crescimento, Empresário e
  C-level, Família patrimonial), com a dor de cada um.
- **Interação:** o visitante escolhe o seu perfil. A escolha ajusta a frase do
  epílogo e o assunto pré-sugerido no agendamento. Não é obrigatória.
- **Cena:** uma encruzilhada com placa de pedra antiga apontando três trilhas.

### Capítulo II · O Guia
- **Pergunta:** com quem eu caminho, e por que confiar?
- **Mensagem:** um consultor certificado, do seu lado da mesa, por contrato.
- **Conteúdo:** bio do Leonardo; ANBIMA CEA; fee-based explicado em duas
  frases; números da Portfel (atribuídos à Portfel, não ao Leonardo); veículos
  de imprensa; foto real.
- **Cena:** um posto de descanso de pedra iluminado por lanternas, ao
  entardecer, com o guia diante de uma mesa de mapas.

### Capítulo III · A Névoa
- **Pergunta:** o que o meu extrato não mostra?
- **Mensagem:** a maior parte do custo de um patrimônio é invisível: taxas,
  conflito de interesse, ineficiência tributária.
- **Interação:** **O custo da névoa.** Patrimônio, prazo e taxa total atual →
  quanto a diferença de custo representa ao fim do prazo.
- **Saída para ferramenta:** Diagnóstico Raio-X completo (`raiox.html`).
- **Cena:** floresta antiga envolta em névoa; a lanterna do viajante abre um
  círculo de luz que revela o caminho.

### Capítulo IV · O Mapa
- **Pergunta:** qual é o plano?
- **Mensagem:** estratégia é coordenar quatro frentes ao mesmo tempo.
- **Conteúdo:** os 4 pilares × 4 serviços (dados reais da Portfel), em abas.
  Etapa 2 do método.
- **Cena:** um mirante elevado de onde se veem quatro regiões distintas da
  mesma terra: campos cultivados, rio e porto, floresta, montanha fortificada.

### Capítulo V · A Fortaleza
- **Pergunta:** como protejo o que construí, e quem vem depois de mim?
- **Mensagem:** proteção e sucessão se planejam em vida, com calma.
- **Conteúdo:** holding patrimonial, estruturas offshore, previdência e seguros
  de vida como liquidez na sucessão, planejamento tributário.
- **Cena:** a cidadela costeira à hora dourada (a arte que você já gerou serve
  aqui como base).

### Capítulo VI · O Cume
- **Pergunta:** quando eu chego?
- **Mensagem:** independência financeira é uma data que se calcula.
- **Interação:** **O ano da independência.** Patrimônio atual, aporte mensal e
  renda desejada → ano estimado, com e sem a diferença de custo.
- **Saída para ferramenta:** Simulador completo (`simulador.html`).
- **Cena:** prado alto no topo de uma colina, vento nas flores, nuvens
  monumentais: o viajante descansa e olha o caminho percorrido.

### Capítulo VII · O Farol
- **Pergunta:** e depois que eu chegar?
- **Mensagem:** o mercado muda; o acompanhamento não para.
- **Conteúdo:** etapa 3 do método; leitura macro da semana (dados de
  `data/editorial.js`); newsletter e LinkedIn.
- **Saída:** Observatório semanal (`blog.html`).
- **Cena:** farol de pedra num penhasco à noite, feixe quente varrendo o mar.

### Epílogo · O Primeiro Passo
- **Pergunta:** como começo?
- **Mensagem:** uma conversa, sem compromisso, para ver se faz sentido.
- **Conteúdo:** agendamento; perguntas frequentes; aviso regulatório completo.
- **Cena:** clareira na floresta com feixes de luz caindo sobre um pedestal de
  pedra com uma bússola de latão e um mapa aberto.

---

## 5. Navegação

- **Barra superior fixa:** marca, nome do capítulo atual, botão "Agendar conversa".
- **Trilha lateral (desktop):** os nove marcos da jornada numa linha vertical
  à direita. O marco atual acende; o nome aparece ao passar o mouse; clicar leva
  ao capítulo.
- **Índice (mobile):** botão "Capítulo III de VII" na barra inferior, que abre a
  lista completa.
- **Teclado:** setas, Page Down e Tab funcionam de forma nativa. Os links do
  índice têm foco visível.
- **Endereços:** cada capítulo tem âncora própria (`jornada.html#nevoa`), para
  o Leo mandar o link direto de um capítulo a um cliente.

---

## 6. Robustez técnica

- HTML estático, sem framework, sem servidor.
- **Sem JavaScript o site continua inteiro:** textos, imagens e links
  aparecem; só as calculadoras e a trilha animada dependem de script.
- Ilustração ausente não quebra nada: cada capítulo tem um fundo pintado
  em CSS na mesma paleta da cena, que aparece até a arte chegar.
- Imagens carregam sob demanda (`loading="lazy"`), exceto a do prólogo.
- Movimento reduzido respeitado (`prefers-reduced-motion`).
- Testado em Chrome real: 390, 430, 768, 1440 e 1920 px de largura, sem
  rolagem horizontal, sem erro de console, calculadoras conferidas contra
  valores calculados à mão.

---

## 7. Pendências para o Leo confirmar

Encontrei números conflitantes nas versões do site. Até a confirmação, uso os
da home institucional e marco no código onde trocar.

| Item | Versões encontradas | Usado por enquanto |
|---|---|---|
| Patrimônio sob consultoria (Portfel) | R$ 20 bi+ · R$ 7 bi+ · placa "2 bi" | **Resolvido:** +R$ 22 bi, conforme portfel.com.br (out/2026). R$ 7 bi estava errado |
| NPS | 97 · 91 | **Resolvido:** 97, conforme portfel.com.br. 91 estava errado |
| A placa "2 bi sob consultoria · Portfel 2025" | é do Leo ou da plataforma? | **Sem efeito no site:** nenhum texto cita esse número |
| Dados macro (Selic 10,75%, IPCA 4,12%) | `data/editorial.js` | lidos do arquivo; precisam de atualização semanal |
| "Clientes no Brasil e na Europa" | home institucional | mantido |
| Patrimônio mínimo | "avaliado no diagnóstico" | mantido |
| Formulário de agendamento | dois links diferentes no site antigo | **Resolvido:** o principal (`...6ez5Ygm...`) abre o formulário do Leo; o outro (`...0sB_G11v...`) dá erro de acesso e não é usado |
| Fonte dos títulos | Cormorant Garamond desenha os acentos descolados ("Você", "Névoa") | trocada por EB Garamond na jornada |

---

## 8. Ordem de execução

1. Bíblia de arte e prompts (`PROMPTS-ARTE.md`), para você gerar em paralelo.
2. Estrutura e texto final de todos os capítulos (`jornada.html`).
3. Estilo: tipografia, painéis, trilha, fundos pintados de reserva (`css/jornada.css`).
4. Comportamento: trilha, índice, perfil, duas calculadoras, radar (`js/jornada.js`).
5. Teste em navegador real, com screenshots revisados por mim antes de entregar.
6. Quando a arte chegar: encaixe e ajuste de enquadramento por capítulo.
