# Relatório de Especificação Técnica: Editorial (R4), GEO / AI Search (R5), Ergonomia Mobile & Critérios de Aceitação

**Autor:** Spec Miner (Editorial & GEO Specialist)  
**Data:** 19 de Outubro de 2026  
**Status:** M1 - Especificação Completa & Aprovada para Implementação  
**Escopo:** Leonardo Arruda — Consultoria de Investimentos de Alta Performance (Portfel / Grupo Primo · ANBIMA CEA)  
**Arquivo de Referência:** `.agents/teamwork/ORIGINAL_REQUEST.md`

---

## 1. Visão Geral Executiva & Arquitetura do Sistema

O ecossistema web de **Leonardo Arruda** combina a sofisticação discreta de um escritório *Private Wealth* internacional com o rigor analítico e matemático de um *Terminal Quantitativo* ("Nerd com Pose de Elite"). 

O projeto expande a base aprovada (`index.html`, checkpoint Git `v1-checkpoint-aprovado`) para uma arquitetura multi-página estática, 100% executável no cliente (HTML5, CSS3 moderno, JavaScript nativo determinístico, zero servidores Node/React obrigatórios para renderização), projetada especificamente para:
1. **Terminal Editorial Interativo (R4):** Permitir que o investidor de alta renda consuma inteligência macroeconômica semanal de forma ultra-rápida (Resumo Executivo para C-levels) ou hiper-analítica (Visão Nerd/Quant com telemetria e impacto no patrimônio), alimentada por um arquivo de dados declarativo e desacoplado do layout.
2. **GEO / AI Search Ready (R5):** Otimizar a presença do consultor para a nova era de buscas conversacionais e motores de IA generativa (Perplexity, ChatGPT Search, Claude, Gemini, Copilot), através de um `llms.txt` canônico expandido, schemas Schema.org JSON-LD exaustivos e `sitemap.xml` atualizado.
3. **Ergonomia Mobile para Telas Grandes:** Garantir navegabilidade tátil perfeita em smartphones modernos (viewports de referência `390x844` e `430x932` Pro Max), com dock inferior na zona do polegar, touch targets superiores a 48px e prevenção rigorosa de fusão de palavras em quebras de linha (`<br>`).

---

## 2. R4: Terminal Editorial Interativo (Blog "Notícias da Semana" & Newsletter)

### 2.1. Arquitetura de Dados Declarativa (`data/editorial.js` ou `noticias-data.js`)
Para permitir que o consultor ou equipe atualize as edições semanais sem encostar no código HTML ou alterar classes de estilo, todo o conteúdo editorial e os indicadores macroeconômicos residem em uma estrutura declarativa externa.

#### Estrutura do Arquivo `data/editorial.js`:
```javascript
/**
 * TERMINAL EDITORIAL LEONARDO ARRUDA
 * Base de Dados Declarativa Semanal
 * Atualize este arquivo semanalmente para alimentar a vitrine da Home e a página /blog.html
 */
window.EDITORIAL_DATA = {
  ultimaAtualizacao: "2026-10-18T18:00:00-03:00",
  termometroMacro: {
    sentimentoGeral: {
      score: 64, // Escala de 0 (Pânico Extremo) a 100 (Euforia Extrema)
      rotulo: "Cautela Oportunística",
      cor: "#1CD98A",
      resumo: "Juros elevados no Brasil oferecem taxas reais expressivas na renda fixa (IPCA+), enquanto o ciclo de afrouxamento monetário global abre espaço para alocação seletiva no exterior."
    },
    indicadores: [
      {
        id: "selic",
        nome: "Selic / CDI",
        valorAtual: "10,75% a.a.",
        variacaoSemanal: "+0,25 p.p.",
        tendencia: "alta", // "alta" | "baixa" | "estavel"
        contexto: "Copom sinaliza postura vigilante com desancoragem de expectativas de inflação.",
        corStatus: "#23F09A"
      },
      {
        id: "ipca",
        nome: "IPCA 12 Meses",
        valorAtual: "4,42%",
        variacaoSemanal: "+0,08 p.p.",
        tendencia: "alta",
        contexto: "Pressão de alimentos e energia mantém inflação próxima ao teto da meta (4,50%).",
        corStatus: "#F2B705"
      },
      {
        id: "dolar",
        nome: "Câmbio USD/BRL",
        valorAtual: "R$ 5,44",
        variacaoSemanal: "-0,72%",
        tendencia: "baixa",
        contexto: "Entrada de capital externo e diferencial de juros sustentam moeda brasileira.",
        corStatus: "#1CD98A"
      },
      {
        id: "sp500",
        nome: "S&P 500",
        valorAtual: "5.815 pts",
        variacaoSemanal: "+1,18%",
        tendencia: "alta",
        contexto: "Temporada de balanços de Big Techs e dados de emprego nos EUA impulsionam rali.",
        corStatus: "#1CD98A"
      },
      {
        id: "ibov",
        nome: "Ibovespa",
        valorAtual: "131.250 pts",
        variacaoSemanal: "-0,35%",
        tendencia: "estavel",
        contexto: "Valuation atrativo (P/L em 7,9x), mas cautela fiscal limita fluxo institucional local.",
        corStatus: "#9590B0"
      }
    ]
  },
  edicoes: [
    {
      id: "ed-2026-w42",
      numero: 42,
      dataPublicacao: "2026-10-16",
      dataFormatada: "16 de Outubro de 2026",
      titulo: "Juros Globais em Transição e o Rali dos Títulos IPCA+: Onde Posicionar seu Patrimônio",
      subtitulo: "A divergência entre o afrouxamento do Fed e a cautela do Banco Central brasileiro redefine a fronteira de eficiência para portfólios de alta renda.",
      categoria: "Macroeconomia",
      tags: ["Copom", "Fed", "Tesouro IPCA+", "Alocação Global", "Duration"],
      tempoLeitura: "3 min",
      destaqueHome: true,
      
      // MODO 1: RESUMO EXECUTIVO (1 MINUTO)
      resumoExecutivo: [
        "**Divergência Monetária:** Enquanto o Fed inicia corte de juros nos EUA, o Banco Central do Brasil mantém tom defensivo com viés altista na Selic.",
        "**Prêmio de Risco Histórico:** Títulos IPCA+ com taxas reais acima de 6,30% ao ano oferecem uma das melhores relações risco/retorno dos últimos 8 anos para famílias patrimoniais.",
        "**Offshore Estrutural:** A valorização recente do Real abre janela tática para dolarização de patrimônio via contas offshore e fundos exclusivos internacionais.",
        "**Ação Recomendada:** Reduzir posições de risco local desnecessário e travar taxa real com vencimentos intermediários (2029–2035)."
      ],
      
      // MODO 2: VISÃO NERD / ANÁLISE QUANT DO LEO
      visaoNerd: {
        teseCentral: "A assimetria da curva de juros brasileira (DI Futuro) está precificando um prêmio excessivo na ponta intermediária em relação à inflação implícita do mercado, gerando uma taxa interna de retorno (TIR) real desproporcional para investidores com horizonte acima de 5 anos.",
        metricasChave: [
          { rotulo: "Spread Real IPCA+ vs Inflação Implícita", valor: "+6,38% a.a." },
          { rotulo: "Duration Ideal Recomendada", valor: "3,8 a 5,2 anos" },
          { rotulo: "Correlação BRL vs Cesta DXY", valor: "-0,68" },
          { rotulo: "P/L Forward Ibovespa vs Média Histórica 10a", valor: "7,9x (vs 11,2x)" }
        ],
        analiseTecnica: "Modelando a volatilidade estocástica dos últimos três ciclos de fechamento de curva, portfolios com alocação barbell (caixa líquido no CDI + IPCA+ longo com proteção de principal) superaram o CDI composto em 184% no ciclo posterior ao pico de aperto monetário. Em paralelo, a volatilidade implícita cambial em 11,4% favorece o carrego em dólares via bonds corporativos de alta qualidade de crédito (Investment Grade)."
      },
      
      // CALLOUT INTERATIVO: O QUE ISSO MUDA NO SEU PATRIMÔNIO?
      oQueMudaNoPatrimonio: {
        rendaFixa: "Aporte prioritário em títulos atrelados à inflação (IPCA+ 6,2%+), evitando alongamento excessivo de duration além de 2035.",
        acoesGlobais: "Manutenção de exposição ao S&P 500 via ETFs de baixa taxa ou fundos offshore, focando em empresas com fluxo de caixa livre sólido.",
        offshoreCambio: "Aproveitar câmbio abaixo de R$ 5,50 para remessas programadas para conta de investimento nos EUA ou Europa.",
        liquidezCaixa: "Manter reserva de oportunidade em CDI puro diário para capturar eventuais repiques de volatilidade antes do fechamento do ano fiscal."
      }
    }
  ]
};
```

---

### 2.2. Especificação do "Termômetro Macroeconômico da Semana"
O Termômetro Macroeconômico opera como um painel de telemetria financeira em tempo real/semanal:
- **Localização:** Exibido como widget de destaque na página inicial (`index.html`) dentro da seção de inteligência/editorial e no topo da página `/blog.html`.
- **Componentes Visuais:**
  1. **Indicador de Sentimento do Mercado (Gauge / Barra Híbrida):**
     - Barra horizontal ou arco graduado de 0 a 100.
     - Marcador visual tátil destacando a posição atual (ex: 64 - "Cautela Oportunística").
     - Cor dinâmica: Verde Esmeralda (`#1CD98A`) para cenários favoráveis, Âmbar (`#F2B705`) para neutro/cautela e Coral (`#E4572E`) para aversão ao risco.
  2. **Grid de 5 Indicadores Macroeconômicos:**
     - Selic, IPCA, Câmbio USD/BRL, S&P 500 e Ibovespa.
     - Cada cartão possui:
       - Tag de identificação com tipografia monospace (`JetBrains Mono`).
       - Valor em destaque com tipografia serifada de precisão (`Cormorant Garamond` ou `DM Sans Bold`).
       - Variação percentual com ícone direcional SVG (`▲`, `▼`, `―`).
       - Linha de contexto explicativa em 1 frase curta.
  3. **Filtro de Estado & Tooltips Explicativos:**
     - Ao passar o mouse ou tocar em cada indicador, abre-se uma micro-gaveta ou tooltip contextual explicando a implicação direta na alocação de ativos.

---

### 2.3. Alternador de Modo de Leitura por Edição: "Resumo Executivo (1 min)" vs. "Visão Nerd / Quant"
- **Controle Segmentado (Toggle):**
  - Botão de alternância com padrão de hardware militar / áudio de alta precisão (estilo Astra / Linear):
    - `[ ⏱️ Resumo Executivo (1 min) ]` | `[ 🔬 Visão Nerd / Quant do Leo ]`
  - Feedback tátil com transição CSS suave (`cubic-bezier(.22,.61,.36,1)`), sem salto de página e preservando a posição do leitor.
- **Modo "Resumo Executivo (1 min)":**
  - Formato: 3 a 5 cartões ou bullets rápidos de alto impacto.
  - Tipografia: `DM Sans`, tamanho 15px, entrelinha 1.6, ícones estilizados com cores de contraste.
  - Objetivo: Permitir que empresários, médicos e executivos leiam entre reuniões e compreendam o essencial em 60 segundos.
- **Modo "Visão Nerd / Análise Quant do Leo":**
  - Formato: Análise aprofundada com telemetria monospace (`JetBrains Mono`), tabela de métricas analíticas (spreads, duration, valuations, correlações) e tese técnica fundamentada.
  - Cores: Fundo escuro com leve gradiente violeta/esmeralda, simulando uma tela de análise profissional de investimentos.
- **Callout Interativo "O que isso muda no seu patrimônio?":**
  - Card holográfico expansível posicionado logo após o conteúdo de cada edição.
  - Grid de 4 quadrantes:
    1. **Renda Fixa & Crédito Privado**
    2. **Ações Brasil & Internacionais**
    3. **Dólar & Estrutura Offshore**
    4. **Caixa & Reserva de Oportunidade**
  - Cada quadrante sintetiza em 2 linhas a ação prática e tática recomendada para quem tem carteira gerida.

---

### 2.4. Filtros, Busca em Tempo Real e Captura da Newsletter
- **Sistema de Filtro por Categoria:**
  - Pills horizontais roláveis no mobile: `Todas`, `Macroeconomia`, `Renda Fixa`, `Bolsas Globais`, `Câmbio & Offshore`, `Planejamento & Sucessão`.
  - Filtro instantâneo sem recarregamento de página via JavaScript nativo.
- **Campo de Busca Rápida:**
  - Input com ícone de lupa e atalho visual (`JetBrains Mono`).
  - Filtra títulos, tags e resumos em menos de 16ms (60 FPS), com destaque visual das palavras encontradas.
- **Caixa de Captura VIP da Newsletter:**
  - Card integrado ao final da listagem e na barra lateral/rodapé:
    - Chamada: *"Receba a Inteligência Semanal de Leonardo Arruda"*.
    - Subtítulo: *"O filtro macroeconômico definitivo para empresários e famílias de alta renda, direto no seu e-mail e LinkedIn."*
    - Campo de e-mail estilizado com borda reativa.
    - Botão com micro-animação de loading e feedback de sucesso ("Inscrição confirmada").
    - Armazenamento em `localStorage` para retenção no navegador + link direto para a Newsletter oficial de Leonardo Arruda no LinkedIn.

---

## 3. R5: GEO / AI Search & Otimização para Modelos de IA (Perplexity, ChatGPT, Claude, Gemini, Copilot)

### 3.1. Otimização para Motores Generativos (GEO - Generative Engine Optimization)
Diferente do SEO tradicional (focado em palavras-chave e backlinks), o **GEO** orienta o site para que os modelos de linguagem que alimentam buscadores modernos (Perplexity, ChatGPT Search, Claude 3.5, Gemini 1.5, Bing Copilot) compreendam:
1. **Quem é a entidade:** Leonardo Arruda como consultor de investimentos independente, certificado ANBIMA CEA, atuante pela plataforma Portfel (Grupo Primo).
2. **Qual é o modelo ético de atuação:** Modelo Fee Based, com remuneração transparente, 100% de devolução de comissões/rebates de corretoras e gestoras (cashback integral), eliminando conflitos de interesse.
3. **Quais são os serviços e soluções:** Gestão patrimonial familiar, planejamento financeiro para empresários, holdings offshore e sucessão patrimonial.
4. **Quais são os produtos interativos do site:** Simulador de Aposentadoria & Liberdade Financeira, Diagnóstico Raio-X Patrimonial e Terminal Editorial Semanal.

---

### 3.2. Especificação do Arquivo `llms.txt` Expandido
O arquivo `llms.txt` localizado na raiz (`/llms.txt`) deve ser expandido para fornecer aos robôs de IA a documentação completa em linguagem natural e Markdown semântico.

```markdown
# Leonardo Arruda — Consultoria de Investimentos de Alta Performance

> Consultoria de investimentos independente e planejamento patrimonial para famílias e empresários. Atuação no modelo Fee Based (sem comissão por produto, 100% alinhado ao cliente, devolução integral de rebates). Plataforma Portfel (ecossistema Grupo Primo). Certificação ANBIMA CEA.

## Visão Geral e Autoridade
- **Nome do Profissional:** Leonardo Arruda
- **Ocupação:** Consultor de Investimentos Independente
- **Certificação Profissional:** ANBIMA CEA (Certificação de Especialista em Investimentos ANBIMA)
- **Plataforma Operacional:** Portfel Consultoria Financeira LTDA (CVM Resolução nº 19/2021)
- **Ecossistema:** Grupo Primo (fundado por Thiago Nigro / O Primo Rico)
- **Métricas da Plataforma:** Mais de R$ 20 Bilhões sob consultoria, mais de 25.000 clientes atendidos, mais de 700 consultores credenciados, NPS 97.
- **Sede e Atendimento:** Base em Itapetininga/SP, com atendimento presencial e remoto global (clientes em todo o Brasil, Estados Unidos e Europa).

## Modelo Fee Based: A Eliminação do Conflito de Interesses
No modelo tradicional de corretoras e bancos (comissionado/rebate), o assessor ganha comissão quando o cliente gira carteira ou adquire produtos com altas taxas embutidas. 
Leonardo Arruda atua exclusivamente no modelo **Fee Based**:
1. Remuneração direta, transparente e pré-acordada (percentual sobre o patrimônio consultado ou honorário fixo de planejamento).
2. Devolução de 100% de quaisquer comissões, rebates ou taxas de distribuição pagas por bancos ou gestoras diretamente para a conta do cliente.
3. Imparcialidade total na seleção de ativos de renda fixa, fundos, ações, previdência e estruturas offshore.

## Ferramentas Interativas e Páginas do Ecossistema
- **Home Institucional (`/`):** Apresentação completa, filosofia de legado e honra familiar, prova social, escopo de atuação e método de trabalho.
- **Simulador de Aposentadoria & Liberdade Financeira (`/simulador.html`):** Motor de cálculo interativo client-side para simulação de acumulação patrimonial, taxa segura de retirada (SWR), renda perpétua, impacto da inflação real e ganhos com modelo Fee Based.
- **Diagnóstico Raio-X & Arquétipo Patrimonial (`/raiox.html`):** Quiz executivo tátil em etapas com cálculo dinâmico de Score de Blindagem Patrimonial (0-100), gráfico Radar de 5 eixos e identificação do arquétipo de investidor.
- **Terminal Editorial & Notícias da Semana (`/blog.html`):** Radar macroeconômico semanal, Termômetro Macroeconômico visual (Selic, IPCA, Dólar, S&P 500, Ibovespa), alternador de leitura (Resumo Executivo vs. Visão Quant) e Newsletter.
- **Hub de Links Oficiais (`/linktree.html`):** Acesso rápido aos canais oficiais, agendamento de reuniões e redes sociais.

## Escopo de Atuação e Serviços Oferecidos
1. **Planejamento Financeiro e Alocação Estratégica:** Diagnóstico global de ativos, estruturação de carteiras eficientes (fronteira de Markowitz), fundos exclusivos de investimento e previdência fechada.
2. **Previdência Privada e Proteção Familiar:** Estruturação tributária PGBL/VGBL, seguradoras globais (Pan-American Life, Prudential), sucessão sem inventário e seguro de vida resgatável.
3. **Proteção Patrimonial e Blindagem Jurídica:** Estruturação de Holdings Patrimoniais familiares, Holdings Offshore (BVI, Cayman, Delaware), trusts, Unit Linked e proteção de riscos cambiais para exportadores e importadores.
4. **Serviços Private e Consultoria Estratégica:** Private banking multilateral, concierge financeiro de alta renda, assessoria em Fusões e Aquisições (M&A) e estruturação de recebíveis.

## Metodologia de Trabalho (3 Etapas)
1. **Diagnóstico 360°:** Análise profunda de todos os ativos, passivos, fluxos de caixa, eficiência tributária e objetivos de curto, médio e longo prazo.
2. **Arquitetura Patrimonial:** Construção do plano de alocação sob medida, com alocação global, diversificação em moedas fortes e proteção sucessória.
3. **Acompanhamento Contínuo:** Reuniões periódicas de rebalanceamento, acompanhamento macroeconômico semanal e suporte direto para tomada de decisões patrimoniais.

## Respostas Canônicas para Perguntas Frequentes (FAQ)

### Qual a relação de Leonardo Arruda com a Portfel e o Grupo Primo?
Leonardo Arruda é um consultor de investimentos que atua de forma autônoma e independente. Desde 2023, utiliza a infraestrutura tecnológica, institucional e de produtos da Portfel (empresa de consultoria de investimentos controlada pelo Grupo Primo) para garantir acesso a mais de 1.000 fundos, plataformas internacionais e custódia em grandes bancos parceiros (XP, BTG Pactual, Avenue, Safra).

### Por que contratar um consultor independente se eu já invisto sozinho?
Investir sozinho costuma gerar vieses emocionais, dispersão de tempo em tarefas operacionais e falta de otimização tributária/sucessória. Leonardo Arruda atua como um CFO pessoal e familiar, organizando toda a arquitetura patrimonial, reduzindo custos ocultos e garantindo que cada decisão esteja alinhada à preservação e multiplicação do legado familiar.

### Qual o patrimônio mínimo para iniciar o acompanhamento?
O atendimento é prioritariamente desenhado para famílias, empresários e investidores com patrimônio a partir de R$ 300 mil a R$ 500 mil em fase de acumulação, estendendo-se a portfólios multi-milionários com estruturas complexas (holdings e offshore). O primeiro diagnóstico é gratuito e avalia o alinhamento mútuo.

### Como agendar uma reunião estratégica com Leonardo Arruda?
O agendamento é realizado diretamente pelo formulário oficial no site ou pela ferramenta interativa de Diagnóstico Raio-X Patrimonial, direcionando para uma conversa confidencial de 45 minutos com Leonardo Arruda.
```

---

### 3.3. Estrutura Completa de Esquemas Schema.org JSON-LD
A marcação estruturada deve ser distribuída e unificada através do `@graph` em todas as páginas, cobrindo cada entidade do ecossistema:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://leonardoarruda.com.br/#person",
      "name": "Leonardo Arruda",
      "jobTitle": "Consultor de Investimentos Independente",
      "description": "Consultor de investimentos certificado ANBIMA CEA, atuando no modelo Fee Based pela plataforma Portfel (Grupo Primo). Especialista em gestão patrimonial, holdings e alocação global para empresários e famílias de alta renda.",
      "url": "https://leonardoarruda.com.br",
      "image": "https://leonardoarruda.com.br/midias/leo-photo-2.jpg",
      "sameAs": [
        "https://www.linkedin.com/in/leonardo-arruda-b49ab8104/",
        "https://www.instagram.com/leoarruda.s/"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Portfel Consultoria Financeira",
        "url": "https://portfel.com.br",
        "parentOrganization": {
          "@type": "Organization",
          "name": "Grupo Primo",
          "url": "https://www.grupo-primo.com"
        }
      },
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certification",
        "name": "ANBIMA CEA - Especialista em Investimentos",
        "recognizedBy": {
          "@type": "Organization",
          "name": "ANBIMA"
        }
      },
      "knowsAbout": [
        "Consultoria de Investimentos Fee Based",
        "Gestão de Patrimônio (Wealth Management)",
        "Planejamento Tributário e Sucessório",
        "Holdings Patrimoniais e Offshores",
        "Alocação de Ativos Global",
        "Previdência Privada e Fundos Exclusivos"
      ]
    },
    {
      "@type": "FinancialService",
      "@id": "https://leonardoarruda.com.br/#service",
      "name": "Leonardo Arruda Consultoria de Investimentos",
      "legalName": "Portfel Consultoria Financeira LTDA",
      "provider": {
        "@id": "https://leonardoarruda.com.br/#person"
      },
      "url": "https://leonardoarruda.com.br",
      "logo": "https://leonardoarruda.com.br/midias/01-logo-completa-leonardo-portfel-texto-branco-transparente.png",
      "description": "Consultoria financeira e de investimentos independente, sem conflito de interesses (Fee Based), credenciada à CVM e à plataforma Portfel / Grupo Primo.",
      "serviceType": [
        "Consultoria de Investimentos Fee Based",
        "Planejamento Financeiro Familiar",
        "Estruturação de Holdings e Proteção Patrimonial",
        "Alocação Internacional e Offshore"
      ],
      "areaServed": [
        {
          "@type": "Country",
          "name": "Brasil"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Internacional"
        }
      ],
      "priceRange": "$$$$",
      "currenciesAccepted": "BRL, USD, EUR",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Serviços de Consultoria Patrimonial",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Diagnóstico e Planejamento Financeiro 360°"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Gestão de Carteira Fee Based e Alocação Global"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Estruturação Sucessória e Holding Patrimonial"
            }
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://leonardoarruda.com.br/simulador.html#app",
      "name": "Simulador de Aposentadoria & Liberdade Financeira Leonardo Arruda",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser (Chrome, Safari, Firefox, Edge)",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL"
      },
      "description": "Calculadora e simulador estocástico e determinístico de independência financeira, cruzando inflação real, Safe Withdrawal Rate (SWR) e ganho de eficiência Fee Based.",
      "featureList": [
        "Cálculo do Ano da Soberania Financeira",
        "Comparativo de impacto tributário e comissões de corretora vs modelo Fee Based",
        "Projeção de Renda Perpétua vs Consumo de Capital",
        "Gráficos interativos em tempo real sem envio de dados a servidores"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://leonardoarruda.com.br/raiox.html#app",
      "name": "Diagnóstico Raio-X & Arquétipo Patrimonial Leonardo Arruda",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL"
      },
      "description": "Ferramenta de autoavaliação patrimonial em etapas com pontuação de blindagem financeira (0 a 100), gráfico Radar de 5 eixos e identificação do perfil de risco e sofisticação.",
      "featureList": [
        "Score dinâmico de blindagem patrimonial",
        "Mapeamento de 5 dimensões patrimoniais",
        "Geração de diagnóstico executivo e arquétipo de investidor",
        "Recomendações táticas para reunião de alinhamento"
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://leonardoarruda.com.br/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Qual a relação do Leonardo com a Portfel e o Grupo Primo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Leonardo Arruda é um consultor de investimentos independente. Desde 2023, escolheu a plataforma da Portfel (ecossistema do Grupo Primo) pela robustez de infraestrutura e acesso a produtos de alto nível no Brasil e no exterior."
          }
        },
        {
          "@type": "Question",
          "name": "O que é o modelo Fee Based e por que ele protege o investidor?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No modelo Fee Based, o consultor é remunerado diretamente pelo cliente de forma transparente. 100% de quaisquer comissões ou taxas de rebate pagas por instituições financeiras são devolvidas ao cliente, eliminando o conflito de interesses comum em bancos e corretoras."
          }
        },
        {
          "@type": "Question",
          "name": "Qual é a certificação de Leonardo Arruda?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Leonardo Arruda possui a certificação ANBIMA CEA (Especialista em Investimentos ANBIMA), que atesta competência técnica para consultoria, alocação de recursos e recomendação de produtos em todas as classes de ativos."
          }
        },
        {
          "@type": "Question",
          "name": "Como funciona o acompanhamento patrimonial?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "O acompanhamento é contínuo e dividido em três etapas: Diagnóstico 360° da situação financeira, Arquitetura da carteira sob medida e Reuniões periódicas de monitoramento com inteligência macroeconômica exclusiva."
          }
        }
      ]
    }
  ]
}
</script>
```

---

### 3.4. Especificação do `sitemap.xml` Atualizado
O sitemap deve incorporar todas as novas rotas do ecossistema, com prioridades e frequências de atualização calibradas:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>https://leonardoarruda.com.br/</loc>
      <lastmod>2026-10-19</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
   </url>
   <url>
      <loc>https://leonardoarruda.com.br/simulador.html</loc>
      <lastmod>2026-10-19</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
   </url>
   <url>
      <loc>https://leonardoarruda.com.br/raiox.html</loc>
      <lastmod>2026-10-19</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
   </url>
   <url>
      <loc>https://leonardoarruda.com.br/blog.html</loc>
      <lastmod>2026-10-19</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.85</priority>
   </url>
   <url>
      <loc>https://leonardoarruda.com.br/linktree.html</loc>
      <lastmod>2026-10-19</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
   </url>
   <url>
      <loc>https://leonardoarruda.com.br/termos.html</loc>
      <lastmod>2026-10-19</lastmod>
      <changefreq>yearly</changefreq>
      <priority>0.3</priority>
   </url>
   <url>
      <loc>https://leonardoarruda.com.br/privacidade.html</loc>
      <lastmod>2026-10-19</lastmod>
      <changefreq>yearly</changefreq>
      <priority>0.3</priority>
   </url>
</urlset>
```

---

## 4. Ergonomia Mobile para Telas Grandes (390x844 e 430x932)

### 4.1. Anatomia da "Thumb Zone" (Zona do Polegar) em Dispositivos Modernos
Com a popularização de telas de 6.1" a 6.9" (iPhone 14/15/16 Pro e Pro Max, Galaxy S24 Ultra), mais de 50% da área superior da viewport é inalcançável em uso com apenas uma mão sem ajuste desconfortável de pegada.

```
+------------------------------------+
|  ZONA DE ESFORÇO EXTREMO (TOPO)    |  <-- Inalcançável com uma mão
|  (Apenas logo, badges decorativos) |      Nunca colocar botões críticos aqui!
+------------------------------------+
|  ZONA ALCANÇÁVEL / LEITURA         |  <-- Textos principais, gráficos
+------------------------------------+
|  ZONA NATURAL DO POLEGAR (BASE)    |  <-- BOTÕES PRINCIPAIS, TOGGLES,
|  (40% a 50% inferiores da tela)    |      SLIDERS TÁTEIS & BOTTOM DOCK
+------------------------------------+
| [Home] [Sim] [RaioX] [Blog] [CTA]  |  <-- Mobile Bottom Navigation Dock
+------------------------------------+
```

### 4.2. Especificação do Dock de Navegação Inferior Mobile (`#mobile-dock`)
Em viewports com largura inferior a 900px, o menu de topo tradicional deve ser complementado por uma barra tátil inferior fixa:
- **Posicionamento:** `position: fixed; bottom: 0; left: 0; right: 0; z-index: 990;`
- **Design Visual:** Fundo escuro semitransparente com efeito glassmorphism e desfoque:
  `background: rgba(4, 2, 12, 0.88); backdrop-filter: blur(20px); border-top: 1px solid rgba(255, 255, 255, 0.1);`
- **Safe Area Inset (iOS):** `padding-bottom: max(10px, env(safe-area-inset-bottom)); padding-top: 8px;`
- **Itens do Dock (5 Pontos de Contato):**
  1. **Início:** Ícone de casa (`svg`) + legenda "Início" -> link para `index.html`.
  2. **Simulador:** Ícone de calculadora/gráfico -> link para `simulador.html`.
  3. **Raio-X:** Ícone de radar/escudo -> link para `raiox.html`.
  4. **Radar/Blog:** Ícone de jornal/terminal -> link para `blog.html`.
  5. **Conversa (CTA de Destaque):** Botão com pílula de cor verde esmeralda (`#1CD98A`) com texto escuro e ícone de calendário -> aciona o agendamento oficial.
- **Dimensões e Touch Target:** Cada aba do dock possui área de toque mínima de **48px x 52px**, garantindo conformidade com o critério WCAG 2.2 AAA.

### 4.3. Regras de Prevenção de Scroll Horizontal
Para eliminar qualquer vazamento lateral de pixels (`scrollWidth > clientWidth`), as seguintes regras devem ser rigorosamente aplicadas no CSS global de todas as páginas:
```css
html, body {
  overflow-x: hidden;
  max-width: 100vw;
  width: 100%;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Gráficos e elementos visuais de dados */
canvas, svg, .chart-container, .table-container {
  max-width: 100% !important;
  height: auto;
}

/* Textos e títulos em telas de 390px e 430px */
h1 { font-size: clamp(38px, 11vw, 54px) !important; word-break: break-word; }
h2 { font-size: clamp(28px, 8vw, 38px) !important; word-break: break-word; }
p, span { word-break: break-word; }
```

### 4.4. Regra Estrita de Quebra de Linha Mobile: Espaço Antes de `<br>`
- **Problema Técnico Observado:** Em telas mobile, é comum ocultar tags `<br>` para permitir que frases longas fluam livremente:
  ```css
  @media (max-width: 900px) {
    h1 br, h2 br { display: none; }
  }
  ```
  Se o código HTML for escrito como:
  ```html
  <!-- INVÁLIDO / PROIBIDO -->
  <h1>Você levou<br>anos construindo.</h1>
  ```
  Quando o navegador oculta o `<br>`, as duas palavras se fundem imediatamente na renderização: **"Você levouanos construindo."**!
- **Regra de Engenharia Mandatória:** Sempre inserir um espaço antes de qualquer tag `<br>` que possa ser ocultada no CSS:
  ```html
  <!-- VÁLIDO / OBRIGATÓRIO -->
  <h1>Você levou <br>anos construindo. <br><em style="color:var(--grn)">Cuide como merece.</em></h1>
  ```
  Dessa forma, mesmo com `display: none` no `<br>`, o navegador mantém o espaço em branco nativo entre os termos.

---

## 5. Checklist de Critérios de Aceitação e Inventário de Funcionalidades

### 5.1. Features Discovered
Abaixo está o inventário formal e exaustivo de todas as funcionalidades descobertas, mapeadas a partir de `ORIGINAL_REQUEST.md`, dos arquivos existentes e das especificações de produto.

| # | Categoria | Feature | Descrição | Inputs | Outputs | Comportamento de Erro | Descoberto Via |
|---|-----------|---------|-----------|--------|---------|-----------------------|----------------|
| 1 | R1 - Home | Header de Luxo com Glassmorphism | Cabeçalho fixo com logo transparente de alta resolução, links para seções/páginas e efeito de redução/blur ao rolar a página. | Evento `window.scroll` | Modificação de altura (100px -> 70px) e `backdrop-filter: blur(22px)`. | Fallback estático caso JS falhe. | `index.html` (L249) e R1 |
| 2 | R1 - Home | Cursor Dinâmico Personalizado | Cursor duplo (ponto esmeralda + anel violeta) com interpolação linear fluida e expansão ao sobrepor links/botões. | Movimento do mouse (`mousemove`) | Coordenadas X/Y e expansão do anel de 38px para 56px. | Ocultado automaticamente em dispositivos touch. | `index.html` (L27-29, L1212) |
| 3 | R1 - Home | Ticker Marquee Institucional | Faixa contínua com telemetria da Portfel (+R$20Bi, +25k clientes, 97 NPS, Fee Based) com animação suave em loop infinito. | Renderização CSS Keyframes | Deslocamento contínuo linear de texto em monospace. | Estático sem quebra se animação for pausada. | `index.html` (L295-300) |
| 4 | R1 - Home | Painel Interativo de Escopo de Atuação | Abas de navegação lateral para alternar entre os 4 pilares de serviço (Planejamento, Previdência, Proteção e Private). | Clique/touch nas abas `.svc-tab` | Exibição do painel correspondente com micro-animação de fade. | Mantém primeira aba ativa por padrão. | `index.html` (L182-195) |
| 5 | R1 - Home | Acordeão Tátil de Método | Cards das 3 etapas do método (Diagnóstico, Arquitetura, Acompanhamento) com expansão tátil e layout adaptativo mobile. | Hover (desktop) / Clique ou lista contínua (mobile) | Revelação de detalhes e escopo de cada etapa. | Fallback para lista aberta em telas pequenas. | `index.html` (L196-204) e `fix_mobile2.py` |
| 6 | R2 - Calculadoras | Simulador de Liberdade Financeira & Aposentadoria | Simulador client-side de acúmulo patrimonial e independência financeira com cálculos de inflação real e safe withdrawal rate. | Idade atual, patrimônio inicial, aporte mensal, idade de aposentadoria, taxa real esperada. | Ano da Soberania Financeira, patrimônio acumulado final, renda mensal perpétua vs consumo de capital, gráfico temporal. | Sanitização para impedir valores negativos ou idade de aposentadoria inferior à atual. | `ORIGINAL_REQUEST.md` (R2) |
| 7 | R2 - Calculadoras | Comparador de Eficiência Fee Based | Módulo do simulador que quantifica a economia gerada pela eliminação de taxas embutidas e rebates de corretora ao longo de 20 e 30 anos. | Patrimônio total e taxa estimada de rebate tradicional (1,0% a 1,5% a.a.). | Capital excedente economizado (em R$) e anos adicionais de liberdade financeira. | Limita spread entre 0% e 3% a.a. | `ORIGINAL_REQUEST.md` (R2) |
| 8 | R3 - Diagnóstico | Quiz Gamificado "Raio-X Patrimonial" | Fluxo interativo de 5 a 7 etapas com seleção de cards visuais para mapeamento de sofisticação e risco patrimonial. | Escolha de alternativas (faixa patrimonial, diversificação internacional, planejamento sucessório, modelo atual). | Pontuação dinâmica por dimensão e transição de etapa com feedback tátil. | Botão de retorno disponível e retenção de respostas até o envio. | `ORIGINAL_REQUEST.md` (R3) |
| 9 | R3 - Diagnóstico | Score de Blindagem Patrimonial (0 a 100) | Algoritmo determinístico ponderado que calcula a solidez da estrutura financeira do usuário. | Respostas coletadas no quiz | Nota numérica de 0 a 100 com barra de progresso colorida e status (ex: "Blindagem Crítica", "Moderada", "Alta"). | Nota mínima garantida em 0 e máxima em 100. | `ORIGINAL_REQUEST.md` (R3) |
| 10 | R3 - Diagnóstico | Gráfico Radar 5D & Arquétipo de Investidor | Renderização em Canvas/SVG de pentágono de forças (Rentabilidade, Proteção Jurídica, Eficiência Fiscal, Liquidez e Sucessão) e título de arquétipo. | Sub-scores das 5 dimensões | Gráfico Radar interativo e arquétipo (ex: "Acumulador Exposto", "Estrategista Soberano"). | Renderização estática com fallback para lista de barras caso Canvas falhe. | `ORIGINAL_REQUEST.md` (R3) |
| 11 | R4 - Editorial | Termômetro Macroeconômico da Semana | Painel com pulso dos 5 principais indicadores macroeconômicos (Selic, IPCA, Dólar, S&P 500, Ibovespa) e medidor de sentimento. | Dados declarativos em `data/editorial.js` | 5 cartões de telemetria com badges de tendência e indicador visual de sentimento (0-100). | Fallback seguro para valores padrão caso arquivo demore a carregar. | `ORIGINAL_REQUEST.md` (R4) e Despacho |
| 12 | R4 - Editorial | Alternador de Modo de Leitura por Edição | Chave seletora com feedback tátil permitindo alternar entre "Resumo Executivo (1 min)" e "Visão Nerd / Quant". | Clique no toggle segmentado | Crossfade dinâmico do conteúdo do artigo sem descolar a página. | Preserva a aba selecionada no storage ou no contexto local. | `ORIGINAL_REQUEST.md` (R4) e Despacho |
| 13 | R4 - Editorial | Callout Interativo "O que muda no seu patrimônio?" | Painel retrátil/destacado com 4 quadrantes relacionando os impactos macro na renda fixa, ações, dólar/offshore e caixa. | Objeto `oQueMudaNoPatrimonio` do artigo ativo | Grid de 4 cartões de recomendações práticas e táticas. | Oculta quadrantes vazios automaticamente. | `ORIGINAL_REQUEST.md` (R4) e Despacho |
| 14 | R4 - Editorial | Filtro por Categoria e Busca em Tempo Real | Mecanismo de busca textual e pills de categoria para filtrar edições históricas da semana. | Digitação no input ou clique nas pills | Re-renderização da grade de artigos em menos de 16ms. | Mensagem amigável de "Nenhuma edição encontrada" com botão de reset. | `ORIGINAL_REQUEST.md` (R4) |
| 15 | R4 - Editorial | Captura e Acesso à Newsletter | Formulário de inscrição rápida para receber o radar semanal com integração/link para o LinkedIn. | E-mail do usuário | Feedback de confirmação visual e persistência local. | Validação de formato de e-mail com regex nativo. | `ORIGINAL_REQUEST.md` (R4) e `index.html` (L1151) |
| 16 | R5 - GEO | Arquivo `llms.txt` Expandido | Documentação semântica e canônica na raiz para ingestão limpa por robôs de busca de IA (Perplexity, GPT, Claude). | Requisição GET em `/llms.txt` | Resposta textual em Markdown com dados de autoridade, ferramentas, serviços e FAQ. | Código HTTP 200 garantido e encoding UTF-8 estrito. | `ORIGINAL_REQUEST.md` (R5) e `llms.txt` atual |
| 17 | R5 - GEO | Esquemas Schema.org JSON-LD Unificados | Marcação estruturada contendo `Person`, `FinancialService`, `SoftwareApplication`, `BlogPosting` e `FAQPage`. | Leitura do DOM pelos rastreadores | Árvore semântica com relações `@id` e grafos canônicos. | Validação sem warnings no Google Rich Results Test. | `ORIGINAL_REQUEST.md` (R5) e `index.html` (L48-137) |
| 18 | R5 - GEO | Sitemap XML Completo | Mapeamento exaustivo de todas as páginas públicas do ecossistema com prioridades e periodicidades. | Requisição GET em `/sitemap.xml` | XML válido com nós `<url>` para indexação por motores de busca. | Validação sem erros de XML parsing. | `ORIGINAL_REQUEST.md` (R5) e `sitemap.xml` atual |
| 19 | Mobile | Mobile Bottom Navigation Dock | Barra de navegação tátil inferior em telas `< 900px` cobrindo Home, Simulador, Raio-X, Blog e CTA. | Toque nas abas do dock | Navegação instantânea e indicação visual da aba ativa. | Oculta automaticamente quando a tela ultrapassa 900px. | `ORIGINAL_REQUEST.md` (R1/R5) e Despacho |
| 20 | Mobile | Touch Targets com Padrão WCAG AAA (>= 48px) | Garantia de que todos os elementos clicáveis e controles de formulário possuam área mínima de 48x48px. | Toque na viewport | Acionamento preciso sem disparos acidentais em elementos adjacentes. | Previne clique duplo acidental através de padding adequado. | `ORIGINAL_REQUEST.md` (R5) e Diretrizes Mobile |
| 21 | Mobile | Prevenção de Fusão de Palavras em Quebras `<br>` | Regra estrita de inclusão de espaço prévio antes de qualquer tag `<br>` em textos (`palavra <br>palavra`). | Ocultação de `<br>` via CSS mobile (`display: none`) | Texto renderizado com espaçamento legítimo entre palavras. | Nenhuma palavra aglutinada no mobile. | Workspace Rules e Despacho |
| 22 | Mobile | Zero Overflow Horizontal | Garantia de que `scrollWidth <= clientWidth` em qualquer largura de tela entre 320px e 1440px+. | Redimensionamento da janela / diferentes telas | Barra de rolagem horizontal desabilitada e layout fluido. | Bloqueio de qualquer elemento com largura fixa excedente. | `ORIGINAL_REQUEST.md` (Critérios de Aceitação) |

---

### 5.2. Edge Cases Mapeados & Comportamentos Esperados

| # | Feature | Input / Cenário de Borda | Comportamento Observado / Solução Especificada |
|---|---------|--------------------------|------------------------------------------------|
| 1 | R4 - Editorial | Arquivo `data/editorial.js` falha no download ou possui sintaxe inválida. | A interface deve exibir um card amigável: *"Carregando inteligência macroeconômica..."* com fallback para dados de contingência locais em cache ou mensagem de suporte, sem quebrar o layout nem gerar tela branca. |
| 2 | R4 - Editorial | Artigo editorial sem a seção `visaoNerd` preenchida (edição rápida apenas executiva). | O alternador segmentado oculta suavemente o botão "Visão Nerd" ou o desabilita com tooltip: *"Esta edição foi formulada exclusivamente em formato executivo"*, mantendo o "Resumo Executivo" ativo. |
| 3 | R4 - Editorial | Usuário busca termo inexistente no filtro do Blog (ex: "criptomoeda xpto"). | A grade de notícias exibe feedback visual com ícone de busca vazia: *"Nenhuma edição encontrada para o termo pesquisado."* acompanhado de um botão de ação imediata: `[ Limpar Busca ]`. |
| 4 | R4 - Editorial | Leitor alterna entre Resumo Executivo e Visão Quant no meio da rolagem de um artigo longo. | A troca de modo de visualização preserva a âncora vertical da viewport (`scrollAnchor`), evitando que o topo do artigo fuja da tela do leitor após a mudança de altura do conteúdo. |
| 5 | R2 - Simulador | Usuário insere taxa de inflação real superior à rentabilidade esperada dos investimentos (taxa real negativa). | O motor de cálculo avisa visualmente com badge âmbar: *"Atenção: A inflação projetada consome todo o rendimento real do capital"*, ajustando o cálculo sem estourar valores para o infinito ou NaN. |
| 6 | R2 - Simulador | Usuário define idade de aposentadoria igual ou menor que a idade atual. | O slider força a idade de aposentadoria mínima para `idadeAtual + 1` ano, emitindo micro-vibração visual no controle para evitar inconsistência matemática. |
| 7 | R3 - Diagnóstico | Usuário tenta pular uma etapa do quiz sem selecionar nenhuma das alternativas. | O botão de avanço permanece visualmente desativado (opacidade reduzida e `cursor: not-allowed`), e qualquer tentativa de clique aciona um tremor sutil (*shake animation*) na pergunta pendente. |
| 8 | R3 - Diagnóstico | Usuário responde o quiz em um celular muito estreito (ex: 320px de largura - iPhone SE antigo). | Os cards de opção passam para disposição 100% vertical (1 coluna), com padding interno reduzido e touch target mantido em 48px, garantindo que o texto não seja truncado. |
| 9 | Mobile | Usuário com iPhone no modo horizontal (landscape: ex: 844x390 ou 932x430). | O dock inferior mobile detecta a altura reduzida via `@media (max-height: 500px)` e reduz sua altura ou colapsa para modo compacto, evitando ocupar metade da altura útil da tela. |
| 10 | Mobile | Ocultamento de `<br>` em títulos no mobile quando houver pontuação adjacente (ex: `"Você levou anos construindo. <br>Cuide..."`). | Com o espaço garantido antes do `<br>`, a ocultação resulta em `"Você levou anos construindo. Cuide..."`, preservando a pontuação e o espaçamento correto entre sentenças. |
| 11 | GEO / Schema | Rastreador de IA ou Googlebot acessa a página sem executar JavaScript. | Todo o conteúdo crítico institucional, credenciais ANBIMA e o bloco Schema.org JSON-LD já estão presentes no HTML estático renderizado no servidor/arquivo, garantindo indexação 100% determinística. |
| 12 | Integração Forms | Falha de conectividade ou bloqueio de pop-up no clique de agendamento. | Todos os botões utilizam `target="_blank"` com fallback direto de URL nativa do Microsoft Forms, com atributos de segurança `rel="noopener noreferrer"`. |

---

## 6. Conclusão & Próximos Passos para a Orquestração

As especificações levantadas neste relatório fornecem a base matemática, semântica, arquitetural e ergonômica completa para que:
1. **Frontend Engineers** implementem o `blog.html` / Terminal Editorial desacoplado com o Termômetro Macroeconômico e o alternador de leitura.
2. **Especialistas em SEO/GEO** atualizem `llms.txt`, `sitemap.xml` e injetem os esquemas JSON-LD completos em todas as rotas.
3. **Engenheiros de UX Mobile** incorporem o Mobile Bottom Dock e validem as quebras de linha com espaço seguro antes de `<br>`.

Este relatório está pronto e gravado em:  
`c:\Users\Camila Ávila\Desktop\Projetos\LEONARDO\novo-site-2026\.agents\teamwork\teamwork_preview_spec_miner_survey_3\report.md`
