# Project: Leonardo Arruda Elite Website

## Architecture
O projeto é um website de altíssimo padrão (nível "Awwwards" / Outlier) para Leonardo Arruda, consultor de investimentos de alta performance. Ele deve ser desenvolvido em HTML5 vanilla otimizado, CSS3 moderno (com variáveis CSS, micro-animações, layout flexbox/grid e efeitos de vidro/grain avançados) e JavaScript com animações imersivas (GSAP - GreenSock Animation Platform).

O fluxo de dados e controle consiste em:
- **Estrutura Visual (HTML5)**: Marcação semântica impecável e acessível.
- **Folha de Estilos (CSS)**: Efeitos de luxo, paleta de cores institucional premium e responsividade avançada.
- **Motor de Animações (JavaScript + GSAP)**: Efeitos de scroll, transições suaves, efeitos de revelação (reveal) dinâmicos e scroll de alta performance.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M1 | Visual & UX Research | Pesquisa de design financeiro outlier e análise semiótica de confiança, honra, legado familiar e meritocracia. | None | DONE: .agents/explorer_1/handoff.md |
| M2 | Information Architecture & Copywriting | Definição da arquitetura de informações ideal e redação focada em investidores de R$500k+ (ICP), prova social e CTAs. | M1 | DONE: .agents/copywriter_1/handoff.md |
| M3 | Frontend Development (Elite Interface) | Implementação técnica da interface com animações fluidas GSAP, efeitos de vidro (glassmorphism), texturas e layout luxuoso. | M2 | DONE: .agents/frontend_worker_1/handoff.md |
| M4 | Performance & Optimization | Otimização para atingir pontuação do Lighthouse > 90 em Performance e Acessibilidade. | M3 | DONE: .agents/frontend_optimizer_1/handoff.md |
| M5 | Independent Evaluation & Audit | Avaliação por subagente juiz (tom e design) e Auditoria Forense final de integridade. | M4 | DONE: .agents/judge_reviewer_1/handoff.md & .agents/forensic_auditor_1/handoff.md |

## Interface Contracts
Como se trata de um site institucional de página única de altíssimo nível, os contratos de interface se resumem às interações e APIs do frontend:
- **GSAP ScrollTrigger**: Controle preciso de animações vinculadas ao scroll.
- **Formulário de Captação (CTA)**: Redirecionamento e rastreamento para o formulário oficial do Microsoft Forms.
- **Performance de Carregamento**: Lazy loading de imagens WebP e otimização de renderização de fontes.

## Code Layout
- `/index.html` - Estrutura principal da página única.
- `/styles.css` - Estilos e animações base de luxo.
- `/script.js` - Lógica de interações, contadores numéricos e inicialização do GSAP.
- `/.agents/` - Diretório reservado para metadados de coordenação de agentes (planos, handoffs e progresso).
