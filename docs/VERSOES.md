# Histórico de versões

Cada versão anterior está guardada em `versoes/`, com a data no nome da
pasta. Para ver uma delas, rode `npm start` e abra o endereço indicado.
Algumas usam arquivos antigos de `versoes/_legado/` e podem aparecer com
detalhes quebrados: servem para consulta, não para publicar.

| Data | Versão | Onde está | Por que mudou |
|---|---|---|---|
| jun/2026 | Primeiros testes de layout (site-teste-1 a 6, linktree, "luxury") | `versoes/2026-06-testes-iniciais/` | Rascunhos de direção visual. |
| 19/10/2026 | **Site clássico**: o site institucional aprovado, de rolagem, antes da fase "gamificada" (commit `ce76adb`) | `versoes/2026-10-19-site-classico/` · http://localhost:8080/versoes/2026-10-19-site-classico/ | Era longo e genérico. Pediu-se algo mais marcante. |
| 20/10/2026 | **Mundo das ilhas (Gemini)**: ilhas rosa, WASD, XP, níveis, emojis | `versoes/2026-10-20-gemini-mundo-das-ilhas/` | Visual infantil, emojis, números desatualizados e recomendações de investimento no texto. |
| 20/10/2026 | Páginas de apoio do Gemini (blog, raio-x, simulador, linktree) | `versoes/2026-10-20-gemini-paginas/` | Mesmo motivo; calculadoras com contas erradas (ver CALCULADORAS.md). |
| 20/10/2026 | **Cidadela do patrimônio**: mapa com zoom sobre uma ilustração | `versoes/2026-10-20-cidadela/` | Zoom estranho, faltava o personagem, coisas não funcionavam. |
| 20/10/2026 | **Jornada com rolagem**: nove capítulos ilustrados numa página longa, calculadoras em lista | `versoes/2026-10-20-jornada-com-rolagem/` | "Muito confuso, muito longo." |
| 20/10/2026 | **Jornada em telas**: um capítulo por tela, ilustrações em pixel art | Publicada como `jornada.html` | Virou extra: o tom de RPG não serve como apresentação de um consultor. |
| 20/10/2026 | **Versão atual**: home em sete telas com números e gráficos, calculadoras como aplicativos, newsletter, links, mapa em pixel art | Raiz do projeto | |

## Mudanças da versão atual, em ordem

1. Home trocada pela narrativa direta: uma ideia por tela, um número grande, um gráfico.
2. Tela "O que a consultoria cobre" com os 16 serviços; logo da Portfel; tela "Na mídia".
3. Calculadoras em tela única de ícones, cada uma numa janela, cada uma com um gráfico próprio; texto de método atrás de "Como calculamos".
4. Nova calculadora: holding patrimonial (aluguéis e venda), com as regras de 2026.
5. Leitura semanal em formato de newsletter; número da semana.
6. Última tela da home com o agendamento em destaque e três caminhos secundários.
7. Linktree refeito para o celular.
8. Mapa da jornada em pixel art, com o viajante andando entre as nove etapas.
9. Projeto organizado: `docs/`, `versoes/`, README, regras e especificação.

## Ainda no visual anterior

- `raiox.html` (Diagnóstico), `termos.html` e `privacidade.html` usam `css/jornada.css`.
  Funcionam e estão corretos, mas ainda não têm a cara da versão atual.
