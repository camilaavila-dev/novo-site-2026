# Relatório de Investigação da Arquitetura Baseline & Plano de Evolução Outlier 2026+
**Projeto:** Leonardo Arruda — Consultor de Investimentos (Portfel · Grupo Primo · ANBIMA CEA)  
**Agente:** Explorer 1 (Baseline Architecture Explorer)  
**Data:** 19 de Outubro de 2026  
**Status:** Concluído / Pronto para Decisão Arquitetural e Execução  

---

## 1. Sumário Executivo

Este relatório consolida a investigação profunda do ecossistema web de **Leonardo Arruda**, mapeando a arquitetura técnica atual, o Design System validado no checkpoint Git `v1-checkpoint-aprovado`, o inventário de ativos e dependências, a integração da nova referência estética **Omshiva.ai** (dark luminescente, scroll cinematográfico e telemetria quantitativa) e o plano de evolução da Home (`index.html`) e das páginas especializadas satélites.

### Principais Conclusões:
1. **Fundação Sólida e Aprovada:** A Home atual (`index.html`, 1.311 linhas, ~92 KB) possui uma narrativa completa de 15 seções em Vanilla HTML/CSS/JS puro, de altíssima velocidade de carregamento, sem necessidade de servidores Node.js/React no runtime.
2. **Identidade Visual Marcante ("Nerd com Pose de Elite"):** O design system utiliza paleta obsidiana com acentos violeta e esmeralda neon (`--bg: #04020C`, `--vio: #3B36CC`, `--grn: #1CD98A`), combinando a elegância clássica da `Cormorant Garamond` com a precisão contemporânea da `DM Sans` e a telemetria analítica da `JetBrains Mono`.
3. **Incorporação da Referência Omshiva.ai:** A estética adorada pelo consultor une direção de arte luminescente/dark, atmosfera cinematográfica de ponta a ponta, HUD de telemetria com micro-dados e micro-interações táteis de alta precisão — elevando a percepção da consultoria de uma mera apresentação institucional para um verdadeiro "terminal de inteligência patrimonial".
4. **Arquitetura Multi-Página Coesa com Dock Tátil Mobile:** A evolução preserva 100% dos blocos aprovados da Home, adicionando 3 módulos gamificados integrados diretamente à narrativa da página principal, conectados a 3 novas páginas dedicadas (Calculadoras/Simulador, Raio-X Patrimonial, Blog/Radar da Semana) e unificados por uma **Bottom Dock tátil** para polegar em celulares de tela grande.
5. **Correção de Débitos Menores Identificados:** Correção de link cruzado no rodapé (`privacidade.html` apontava para `termos.html`), unificação dos caminhos de navegação relativa para páginas secundárias (`index.html#metodo` vs. `#metodo`) e expansão do grafo JSON-LD e `llms.txt` para indexação por IA (GEO / AI Search).

---

## 2. Mapeamento Detalhado da Home Atual (`index.html`)

### 2.1 Tokens CSS e Design System (`:root`)

O design system de `index.html` opera em CSS nativo através de variáveis semânticas:

```css
:root {
  /* Cores de Fundo e Superfície */
  --bg: #04020C;       /* Obsidiana profunda / Espaço sideral */
  --s1: #080517;       /* Superfície 1 - Contraste suave */
  --s2: #0B071A;       /* Superfície 2 - Cartões e módulos */
  --s3: #130E28;       /* Superfície 3 - Fundo do CTA final */

  /* Cores Primárias e Violeta */
  --vio: #3B36CC;      /* Violeta institucional Portfel */
  --vio2: #6B66E8;     /* Violeta elétrico / Destaque de badges */
  --vio3: #1B1762;     /* Violeta profundo para a barra de métricas */
  --vio-fill: rgba(59,54,204,.12);

  /* Acentos Esmeralda / Terminal / Sucesso */
  --grn: #1CD98A;      /* Verde esmeralda neon / Telemetria */
  --grn2: #23F09A;     /* Esmeralda vibrante para gradientes */
  --grn-bg: #04120A;   /* Fundo escuro esmeralda */

  /* Tipografia e Tons de Texto */
  --txt: #EDE8D5;      /* Champagne / Areia nobre (alto contraste) */
  --mut: #9590B0;      /* Violeta-acinzentado / Texto secundário */
  --sub: #524E6A;      /* Violeta escuro / Rótulos e microcopy */

  /* Bordas e Delimitadores Táteis */
  --brd: rgba(255,255,255,.06);   /* Borda sutil de cartões */
  --brd2: rgba(255,255,255,.13);  /* Borda iluminada no hover */

  /* Famílias Tipográficas */
  --d: 'Cormorant Garamond', Georgia, serif; /* Títulos nobres e declarações */
  --s: 'DM Sans', -apple-system, sans-serif;  /* Leitura corrida e interface */
  --m: 'JetBrains Mono', ui-monospace, monospace; /* HUD, telemetria, dados */

  /* Funções de Transição */
  --ease: cubic-bezier(.22,.61,.36,1); /* Curva inercial de luxo */
}
```

### 2.2 Componentes Globais de Infraestrutura Visual
- **Barra de Progresso Superior (`#prog`):** Elemento fixo no topo com preenchimento em gradiente linear (`--vio` para `--vio2`), atualizado pelo evento passivo de scroll.
- **Cursor Dinâmico Duplo (`#c-dot` e `#c-ring`):** Ponto verde esmeralda com anel magnético violeta que expande de 38px para 56px ao passar sobre links, botões e cartões interativos.
- **Camada Tátil de Grão Analógico (`#grain`):** Overlay fixo com textura de grão SVG inline base64 com opacidade 0.042, eliminando a frieza digital e conferindo acabamento cinematográfico.
- **Barra de Navegação Topo (`#site-nav`):** Header responsivo com transição de altura de 100px para 70px, fundo translúcido `rgba(4,2,12,.85)` e `backdrop-filter: blur(22px)`. No mobile oculta links de texto e exibe botão de menu tátil.
- **Botão Flutuante de Agendamento (`#float-cta`):** Surge suavemente no canto inferior direito após 80vh de rolagem com link direto para o formulário oficial.

### 2.3 Mapeamento Seção por Seção (15 Seções Existentes)

| # | Seção | Identificador / Classe | Conteúdo e Função na Jornada | Estilo / Efeitos |
|---|---|---|---|---|
| **1** | **Hero** | `<section>` (Topo) | Headline de autoridade: *"Você levou anos construindo. Cuide como merece."* + Badge ANBIMA CEA + Botão de Agendamento. | Vídeo Pexels fullscreen loop com máscara em gradiente escuro e parallax sutil no scroll. |
| **2** | **Ticker Marquee** | Marquee Contínuo | Faixa violeta animada em loop contínuo com lema institucional e credenciais. | Animação CSS pura `animation: marq 36s linear infinite`. |
| **3** | **Portfel Stats Bar** | `section` / `.stats-grid` | 4 grandes números institucionais: `+R$20Bi sob consultoria`, `+25k clientes`, `+700 consultores`, `97 NPS`. | Fundo `--vio3`, bordas verticais finas, tipografia serifada de alta escala. |
| **4** | **Reconhecimento / Mídia** | `section` / `.media-logos` | 7 veículos de imprensa nacional (InfoMoney, Estadão, Gazeta do Povo, Jovem Pan, BP Money, Dinheiro, Valores RS). | Grid flex centralizado com logos em alto contraste monocromático e opacidade de 50% a 100% no hover. |
| **5** | **Filosofia** | `section` / `.filo-flex` | Frase manifesto: *"O objetivo não é fazer mais barulho. É tomar decisões melhores com o patrimônio que você construiu."* | Tipografia display editorial com itálico em destaque esmeralda. |
| **6** | **Sobre Leonardo** | `#sobre` / `.sobre-section` | Foto executiva do Leonardo segurando crachá CEA, biografia, 4 pills de posicionamento e tooltip interativo para "Fee Based". | Split screen desktop com slide-in suave via IntersectionObserver (`.in`). |
| **7** | **Para Quem** | `section` / `.para-quem-grid` | Segmentação em 3 perfis: 01 Investidor em crescimento, 02 Empresário e C-level, 03 Família patrimonial. | Cartões lado a lado com números monospace e fundos alternados `--s1` e `--s2`. |
| **8** | **Escopo de Atuação** | `#servicos` / `.svc-wrap` | 4 abas interativas laterais: Planejamento Financeiro, Previdência e Seguros, Proteção e Riscos, Serviços Especiais (16 serviços). | Tabs verticais com barras de progresso ativas e reveal escalonado (stagger) dos itens no painel. |
| **9** | **Método de Atuação** | `#metodo` / `.met-accordion` | 3 etapas cardinais: 01 Diagnóstico, 02 Estratégia, 03 Acompanhamento + 3 garantias (Respostas rápidas, Sem conflito, 1ª conversa grátis). | Accordion horizontal desktop com expansão `flex: 4` e textura fotográfica `card_texture.png`. |
| **10** | **Independência / Bancos** | `section` / `.marquee-wrapper` | Marquee contínuo de instituições: BTG Pactual, XP, Safra, Morgan Stanley, Inter, Avenue, Nomad, Agora. | Carrossel infinito em escala de cinza com iluminação ao hover. |
| **11** | **Parceria Portfel** | `#parceria` / `.parceria-grid` | Explicação da retaguarda do Grupo Primo, foto de Leonardo com troféu, 3 cards em glassmorphism (Fee Based, Produtos exclusivos, Plataforma nacional). | Layout assimétrico com imagem de fundo mascarada e cards com borda iluminada. |
| **12** | **Atendimento Global** | `#presenca` | Mapa mundi escuro com pontos de atendimento (Brasil e Europa), foto de perfil do Leonardo e CTA de agendamento. | Mapa em alta definição com fade gradiente e visual de comando global. |
| **13** | **Perguntas Frequentes** | `section` / `[data-faq-item]` | 5 perguntas cruciais respondidas com clareza (relação Portfel, por que consultoria, Fee Based, conflito de interesse, mínimo). | Accordion vertical nativo em JS com animação de `max-height` e rotação do ícone `+`. |
| **14** | **CTA Final de Conversão** | `#cta` | Chamada decisiva: *"Organize o patrimônio que você construiu"* + Agendamento sem custo + Garantia de retorno em 24h. | Imagem de fundo imersiva do Leonardo com duplo gradiente escuro e botão champagne iluminado. |
| **15** | **Rodapé Institucional** | `footer` | Logotipo completo, CNPJ 54.475.818/0001-90, newsletter LinkedIn, redes sociais, links para Portfel e Investimentos.com.br, termos legais CVM e botão Topo. | Layout corporativo austero com divisor sutil e disclaimer de conformidade legal. |

---

## 3. Inventário Completo de Páginas, Assets e Scripts

### 3.1 Páginas do Ecossistema
- **`index.html` (92.058 bytes):** Home institucional de alta conversão.
- **`linktree.html` (13.602 bytes):** Hub mobile-first refinado, contendo foto em moldura circular com glow violeta, badges CEA/Portfel/Grupo Primo, barra de 4 estatísticas e links táteis verticais.
- **`termos.html` (32.835 bytes):** Termos de uso completos cobrindo modelo de consultoria, natureza informativa e conformidade com resoluções CVM.
- **`privacidade.html` (33.255 bytes):** Política de privacidade estruturada conforme a LGPD (Lei 13.709/2018).

### 3.2 Ativos Visuais em `midias/`
1. **Identidade Visual e Marcas:**
   - `01-logo-completa-leonardo-portfel-texto-branco-transparente.png` (Principal do Header e Rodapé)
   - `02-logo-portfel-texto-branco-transparente.png`
   - `03-logo-leonardo-texto-branco-transparente.png`
   - `04-logo-simbolo-leonardo-texto-branco-transparente.png` (Favicon e marca d'água)
   - *Observação:* Todos os 4 arquivos foram processados via Pillow nativo com canal alfa limpo, sem resíduos de fundo branco e sem uso de filtros SVG de runtime.
2. **Fotografia Institucional de Leonardo Arruda:**
   - `midias/fotos novas do leonardo/leonardo-arruda-consultor-de-investimentos-portfel (1).jpeg`: Foto em estúdio com troféu/premiação (utilizada na seção Parceria).
   - `midias/fotos novas do leonardo/leonardo-arruda-consultor-de-investimentos-portfel (2).jpeg`: Foto no CTA final.
   - `midias/fotos novas do leonardo/leonardo-arruda-consultor-de-investimentos-portfel (4).jpeg`: Foto executiva em fundo arquitetônico (utilizada na seção Sobre).
   - `midias/leo-photo-2.jpg`: Retrato de close-up (utilizado na seção Presença e no Linktree).
3. **Logos de Bancos e Corretoras (`midias/bancos parceiros/`):**
   - BTG Pactual (`btg-pactual-nome-.svg`)
   - XP Investimentos (`xp-investimentos-logo.svg`)
   - Safra (`logo-safra.svg`)
   - Morgan Stanley (`morganstanley.webp`)
   - Inter (`inter.svg`)
   - Avenue (`logo-new-avenue.svg`)
   - Nomad (`nomad.webp`)
   - Ágora (`agora.webp`)
4. **Logos de Imprensa e Mídia (`midias/fotos da midia/`):**
   - InfoMoney, Estadão, Gazeta do Povo, Jovem Pan, BP Money, Dinheiro, Valores RS (todos em WebP otimizado).
5. **Mapas, Certificações e Texturas:**
   - `selo-anbima.webp`: Selo oficial de certificação.
   - `Mapa de Atendimento.jpeg`: Mapa de dispersão geográfica de clientes.
   - `card_texture.png`: Textura analógica de alta definição para os cartões de Método.
   - `servicos-conceito.png`: Pano de fundo conceitual do painel de serviços.

### 3.3 Arquivos de Indexação e Descoberta por IA (GEO / LLMO)
- **`llms.txt`:** Sumário estruturado em markdown para assistentes virtuais e navegadores baseados em LLM (Perplexity, ChatGPT, Claude, Gemini).
- **`sitemap.xml`:** Mapeamento de URLs do domínio.
- **`robots.txt`:** Liberação explícita para os user-agents de IA (`GPTBot`, `ClaudeBot`, `PerplexityBot`, etc.).
- **JSON-LD Schema.org em `index.html`:** Entidades `Person` (Leonardo Arruda), `FinancialService` (Leonardo Arruda Consultoria) e `FAQPage` (5 perguntas).

---

## 4. Decomposição da Referência Estética Omshiva.ai & Aplicação ao Universo Leonardo Arruda

O consultor Leonardo Arruda expressou admiração explícita pelo projeto **Omshiva.ai**. A análise dos elementos estéticos e da arquitetura de interação desse site revela uma sinergia direta com o posicionamento do Leonardo:

### 4.1 Pilares da Referência Omshiva.ai

```
┌────────────────────────────────────────────────────────────────────────┐
│                          REFERÊNCIA OMSHIVA.AI                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. DARK LUMINESCENTE   │ Fundo obsidiana com halos de luz calculados   │
│ 2. HUD & TELEMETRIA    │ Coordenadas, carimbos temporais, dados quant  │
│ 3. NARRATIVA IMERSIVA  │ Experiência de jornada e não formulário frio  │
│ 4. SCROLL CINEMÁTICO   │ Transições fluidas, máscaras suaves, alta DPI │
│ 5. COPY SUBVERSIVO     │ Autenticidade, honestidade crua, anticlichê   │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Direção de Arte Dark Luminescente:**
   - Não se trata de uma tela preta opaca genérica, mas de uma tela profunda preenchida com iluminação volumétrica, pontos de luz atmosféricos e reflexos sutis nas bordas (`box-shadow: 0 0 32px rgba(...)`, gradientes de malha e halos radiais).
   - *Aplicação para o Leo:* Combinar o fundo `--bg: #04020C` com halos sutis de luz violeta (`--vio`) e esmeralda neon (`--grn`) nos pontos focais de decisão e nos novos blocos interativos.

2. **HUD / Telemetria Quantitativa com Micro-dados:**
   - Utilização extensiva de micro-tipografia monoespaçada (`JetBrains Mono`, 9–11px, tracking 0.18em a 0.24em, uppercase), coordenadas de status, carimbos de data/hora, indicadores de versão e telemetria de performance.
   - *Aplicação para o Leo:* Transmitir o lado "Nerd/Quant" do consultor. Criar marcadores como `[LAT/LONG: SP/GLOBAL]`, `[METRIC: FEE_BASED_ALPHA]`, `[ENGINE: RETIREMENT_SIM_v2.6]`, `[TERMINAL: RADAR_MACRO_LIVE]`. Isso comunica rigor técnico, seriedade e precisão de engenharia patrimonial.

3. **Scroll Cinematográfico e Máscaras de Gradiente:**
   - As imagens não terminam em bordas secas e retangulares. Elas fundem-se no escuro com `mask-image: linear-gradient(...)` e `-webkit-mask-image`, criando a sensação de um ambiente contínuo e tridimensional.
   - *Aplicação para o Leo:* Utilizar essa mesma técnica de máscara nos novos blocos e estender a sensação fluida em todas as transições de scroll.

4. **Micro-interações de Alta Sensação Tátil:**
   - Sliders de cálculo financeiro que respondem instantaneamente com feedback visual em tempo real, gráficos dinâmicos de radar e telemetria viva ao toque.
   - *Aplicação para o Leo:* Toda a computação dos simuladores e do Raio-X deve rodar 100% no cliente (JavaScript determinístico nativo, 60fps), oferecendo sensação tátil imediata tanto no desktop quanto na tela de toque do celular.

5. **Copywriting Editorial Autêntico e Desafiador:**
   - No Omshiva.ai, a comunicação abre com declarações ousadas e afiadas.
   - *Aplicação para o Leo:* Rejeitar fórmulas batidas de marketing financeiro bancário ("Venha investir com a gente"). Adotar textos que valorizam a inteligência do cliente: *"Seu banco lucra quando você erra. Nós só lucramos quando seu patrimônio cresce."*, *"Engenharia patrimonial de precisão para quem construiu riqueza real."*

---

## 5. Estratégia de Evolução da Home (`index.html`) & Encaixe dos Novos Blocos

A evolução da Home respeita integralmente o que já foi aprovado no Git (`v1-checkpoint-aprovado`). Nenhuma seção existente será removida. Os três novos blocos interativos entram como pontes naturais na narrativa já existente:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   MAPA DE EVOLUÇÃO DA HOME (index.html)                          │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [SEÇÕES 1 a 7 APROVADAS]                                                         │
│   1. Hero (Vídeo Fullscreen + Prova Social ANBIMA CEA)                           │
│   2. Ticker Marquee Institucional (+R$20Bi, 97 NPS)                              │
│   3. Portfel Stats Bar (4 Números Fundamentais)                                  │
│   4. Mídia & Press (InfoMoney, Estadão, Jovem Pan, etc.)                         │
│   5. Filosofia ("O objetivo não é fazer mais barulho...")                        │
│   6. Sobre Leonardo Arruda (Boutique de Elite + Tooltip Fee Based)               │
│   7. Para Quem (Investidor, Empresário, Família)                                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ⚡ NOVO BLOCO A: PREVIEW GAMIFICADO DO RAIO-X PATRIMONIAL                         │
│   - Chamada: "Em qual quadrante de blindagem está seu patrimônio hoje?"           │
│   - 1 pergunta interativa tátil direta na Home + Radar mini-visual                │
│   - CTA: "Fazer Diagnóstico Completo (Score 0-100)" → direciona para raio-x.html │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [SEÇÕES 8 e 9 APROVADAS]                                                         │
│   8. Serviços Interativo (4 Abas e 16 Serviços)                                  │
│   9. O Método (Diagnóstico, Estratégia, Acompanhamento + Garantias)              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ⚡ NOVO BLOCO B: VITRINE INTERATIVA DO SIMULADOR DE LIBERDADE FINANCEIRA          │
│   - Chamada: "Laboratório Quantitativo: O Custo Oculto dos Conflitos Bancários"  │
│   - 2 sliders táteis vivos (Patrimônio Atual e Aporte Mensal)                    │
│   - Indicador de "Anos de Vida / Legado Ganhos" com Fee-Based                    │
│   - CTA: "Abrir Simulador Avançado de Aposentadoria" → simulador.html            │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [SEÇÕES 10 a 12 APROVADAS]                                                       │
│   10. Marquee de Instituições Parceiras (BTG, XP, Safra, Avenue, etc.)           │
│   11. Parceria Portfel & Grupo Primo (Escala Institucional)                      │
│   12. Atendimento Global (Presença Brasil e Europa)                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ⚡ NOVO BLOCO C: TERMINAL EDITORIAL: RADAR DA SEMANA & NEWSLETTER                 │
│   - Termômetro Macroeconômico da Semana (Selic, IPCA, Dólar, S&P 500)            │
│   - Alternador de Leitura: "Resumo Executivo (1 min)" vs "Visão Nerd/Quant"      │
│   - Notícia em Destaque: "O que isso muda no seu bolso?"                         │
│   - CTA: "Ver Todas as Edições & Assinar Newsletter" → blog.html                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [SEÇÕES 13 a 15 APROVADAS]                                                       │
│   13. FAQ (Perguntas Frequentes)                                                 │
│   14. CTA Final ("Organize o patrimônio que você construiu")                     │
│   15. Rodapé Institucional (Links Jurídicos, CVM, Portfel)                       │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 📱 COMPONENTE GLOBAL: BOTTOM FLOATING DOCK (MOBILE THUMB NAVIGATION)             │
│   - Fixa na parte inferior da viewport em smartphones (zona de conforto tátil)   │
│   - 5 botões: Home · Simulador · Raio-X · Radar · Agendar                        │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Arquitetura da Barra / Dock Tátil Inferior (Mobile Thumb Navigation)

### 6.1 Problema de Ergonomia em Smartphones Modernos
Em smartphones modernos (telas de 6.1" a 6.9"+ como iPhone 15/16 Pro Max e Samsung Galaxy S24 Ultra), o topo da tela encontra-se na chamada "zona de esforço" do polegar. Obrigá-lo a subir até o menu superior gera atrito e reduz o engajamento.

### 6.2 Especificação da Bottom Floating Dock

A dock tátil inferior deve ser implementada como um componente persistente e de alta fidelidade visual:

```css
/* BOTTOM FLOATING DOCK — ZONA DO POLEGAR */
.bottom-dock {
  position: fixed;
  bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 998;
  display: none; /* Ativada apenas em @media (max-width: 900px) */
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: rgba(8, 5, 23, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 40px;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(107, 102, 232, 0.2);
  max-width: 94vw;
  width: max-content;
}

@media (max-width: 900px) {
  .bottom-dock { display: flex; }
  /* Ajuste no botão float-cta para não colidir com a dock */
  #float-cta { display: none !important; }
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 8px 12px;
  color: var(--mut);
  text-decoration: none;
  font-family: var(--m);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 20px;
  transition: all 0.25s ease;
  min-width: 54px;
  -webkit-tap-highlight-color: transparent;
}

.dock-item svg {
  width: 18px;
  height: 18px;
  stroke-width: 1.8;
  stroke: currentColor;
  transition: transform 0.2s ease;
}

.dock-item:active {
  transform: scale(0.92);
}

.dock-item.is-active,
.dock-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.dock-item.is-active svg {
  stroke: var(--grn);
}

/* Botão de Destaque CTA na Dock */
.dock-cta {
  background: var(--grn) !important;
  color: #04120A !important;
  font-weight: 600;
  padding: 8px 16px !important;
  border-radius: 24px;
}
.dock-cta svg {
  stroke: #04120A !important;
}
```

### 6.3 Estrutura de Itens da Dock:
1. **Home / Início:** Ícone de bússola/casa → `index.html`
2. **Simulador:** Ícone de gráfico/fórmula quant → `simulador.html`
3. **Raio-X:** Ícone de radar/escudo de blindagem → `raio-x.html`
4. **Radar / Blog:** Ícone de pulso/terminal de notícias → `blog.html`
5. **Agendar (CTA):** Botão esmeralda em destaque → Microsoft Forms oficial

---

## 7. Diretrizes Técnicas de Frontend & Resolução de Débitos

### 7.1 Quebras de Linha Seguras no Mobile (`texto <br>texto`)
- **Regra:** Nunca utilizar tags `<br>` sem um espaço imediatamente anterior quando o estilo mobile aplicar `display: none` nas tags `<br>`.
- **Justificativa:** Se o HTML contiver `Você levou<br>anos`, no mobile onde `<br>` é ocultado para acomodar o fluxo de tela estreita, o navegador funde as duas palavras em `Você levouanos`.
- **Padrão Obrigatório:** Sempre escrever com espaço precedente: `Você levou <br>anos`.
- **Auditoria do Código:** Na `index.html` atual, os títulos principais já possuem os espaços (`Você levou <br>anos construindo. <br><em...`), mas a regra deve ser estritamente mantida em todos os novos componentes e novas páginas.

### 7.2 Tratamento de Transparência Sem Filtros SVG de Runtime
- **Regra:** Proibido utilizar `<filter id="..."><feColorMatrix.../></filter>` diretamente em tags `<img>` ou no CSS para limpar fundos brancos de logotipos.
- **Justificativa:** Filtros SVG aplicados via CSS geram artefatos gráficos, contornos serrilhados em telas Retina e lentidão no repaint de dispositivos móveis.
- **Padrão Obrigatório:** Utilizar imagens com transparência real em formato `.png` geradas por script Python (Pillow) com cálculo de luminância em canal alfa, como as já geradas na pasta `midias/`.

### 7.3 Arquitetura de Navegação Relativa Unificada
- **Problema Observado:** Em `termos.html` e `privacidade.html`, os links do menu apontam para IDs locais (`#sobre`, `#servicos`) que não existem nessas páginas, resultando em links inoperantes. Além disso, o rodapé de `index.html` apontava o texto "Política de Privacidade" incorretamente para `termos.html`.
- **Solução Padronizada:**
  - Na Home (`index.html`): Âncoras internas diretas (`#sobre`, `#servicos`, `#metodo`) e links para as novas páginas (`simulador.html`, `raio-x.html`, `blog.html`, `termos.html`, `privacidade.html`).
  - Nas Páginas Secundárias: Links para as âncoras da Home usando caminho relativo completo (`index.html#sobre`, `index.html#servicos`, etc.).
  - Correção no rodapé de todas as páginas:
    ```html
    <a href="privacidade.html">Política de Privacidade</a>
    <a href="termos.html">Termos de Uso</a>
    ```

### 7.4 Zero Dependência de Servidores Node/React (HTML/CSS/JS Estático Puro)
- Todas as novas experiências (Simulador de Aposentadoria, Diagnóstico Raio-X com Gráfico Radar e Blog Notícias da Semana) devem ser codificadas em Vanilla JavaScript modular, utilizando a API Canvas nativa ou SVG procedural dinâmico para os gráficos.
- Os dados do Blog e das notícias da semana devem ser carregados de uma constante ou estrutura JSON editável e determinística (`noticias-data.js` ou embutida no próprio arquivo), permitindo publicação simples sem requerer banco de dados ou backend complexo.

---

## 8. Estratégia de Indexação e Descoberta por IA (GEO / AI Search)

Com a evolução dos mecanismos de busca alimentados por IA (SearchGPT, Google AI Overviews, Perplexity e Claude Artifacts), o ecossistema deve estar estruturado semanticamente para ser citado como referência autoritativa:

1. **Atualização do `llms.txt`:**
   - Adicionar detalhamento dos novos recursos: Simulador de Aposentadoria & Liberdade Financeira, Diagnóstico Raio-X de Blindagem Patrimonial e Radar Macroeconômico Semanal.
   - Fornecer respostas diretas e dados numéricos para perguntas frequentes sobre a taxa segura de retirada (SWR), eficiência tributária de fundos exclusivos e modelo Fee-Based.

2. **Expansão do Grafo Schema.org (JSON-LD):**
   - Incorporar novos tipos semânticos:
     - `SoftwareApplication` para o Simulador de Aposentadoria e o Raio-X Patrimonial (com `applicationCategory: FinanceApplication`).
     - `BlogPosting` e `NewsArticle` para as edições do Radar Macroeconômico Semanal.
     - `FinancialProduct` para os pilares de Fundos Exclusivos, Previdência e Holding Offshore.

3. **Atualização do `sitemap.xml`:**
   - Incluir as novas URLs: `/simulador.html`, `/raio-x.html` e `/blog.html`, com prioridades escalonadas e frequências de atualização semanais.

---

## 9. Próximos Passos Recomendados para os Especialistas

| Frente Especialista | Próximas Ações Imediatas |
|---|---|
| **Especialista Visual / UI** | Detalhar a paleta luminescente inspirada no Omshiva.ai, especificando os efeitos de halo glow e os gráficos em Canvas/SVG do Radar e do Simulador. |
| **UX & Copywriter** | Redigir os textos do Raio-X (perguntas do quiz, arquétipos e gargalos), do Simulador de Liberdade Financeira e da edição de estreia das Notícias da Semana (com alternador Resumo Executivo vs. Visão Nerd). |
| **Engenheiro Frontend** | Implementar os três blocos na `index.html`, desenvolver as novas páginas estáticas puras (`simulador.html`, `raio-x.html`, `blog.html`), construir a Bottom Floating Dock para polegar e testar no navegador. |
| **Auditor / Juiz** | Validar pontuação do Lighthouse (>90), verificar ausência de overflow horizontal e ausência de erros de console em todas as resoluções. |
