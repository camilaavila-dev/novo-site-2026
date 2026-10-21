# Relatório de Engenharia Quantitativa & Diagnóstico Patrimonial (R2 & R3)
**Ecossistema Web Leonardo Arruda 2026+**
**Agente Responsável:** Explorer 2 (Quantitative & Diagnostic Explorer)
**Data:** 19 de Outubro de 2026
**Status:** Especificação Completa & Determinística (Client-Side)

---

## 1. Resumo Executivo

O presente documento estabelece a modelagem quantitativa determinística, a arquitetura algorítmica e a especificação de experiência tátil dos requisitos **R2 (Laboratório de Calculadoras & Simulador de Aposentadoria / Liberdade Financeira)** e **R3 (Jornada Gamificada Raio-X & Arquétipo Patrimonial)** para o novo site de Leonardo Arruda (Consultor de Investimentos Portfel / Grupo Primo · ANBIMA CEA).

A premissa central é unir o rigor matemático de um **Terminal Quantitativo** (*Quartr / Fey / Linear*) com a elegância aristocrática de um serviço de *Private Wealth*, operando com **100% de execução client-side** no navegador (HTML5/CSS3/Vanilla JS), sem latência, sem dependência de APIs externas de IA ou backend proprietário, e alinhado aos tokens visuais obsidian/violet/emerald do ecossistema já aprovado.

---

## 2. Requisito R2: Simulador Avançado de Aposentadoria & Liberdade Financeira

### 2.1. Arquitetura de Variáveis & Limites de Entrada

O simulador é alimentado por 6 variáveis de entrada primárias controladas por sliders táteis de alta precisão com display numérico em `JetBrains Mono`:

| Variável | Símbolo | Valor Mínimo | Valor Máximo | Passo (Step) | Padrão (Default) | Unidade |
|---|---|---|---|---|---|---|
| **Patrimônio Atual** | $P_0$ | R$ 0 | R$ 50.000.000 | R$ 50.000 (R$ 10k até 500k) | R$ 500.000 | R$ (BRL) |
| **Aporte Mensal** | $PMT$ | R$ 0 | R$ 200.000 | R$ 500 (R$ 1k acima 10k) | R$ 10.000 | R$ / mês |
| **Prazo de Acumulação** | $T$ | 1 | 40 | 1 | 15 | Anos |
| **Rentabilidade Nominal Esperada** | $r_{nom}$ | 6,0% | 18,0% | 0,25% | 11,5% | % a.a. |
| **Inflação Projetada (IPCA)** | $i_{inf}$ | 2,5% | 9,0% | 0,25% | 4,5% | % a.a. |
| **Custo Oculto Comissionado** | $c_{trad}$ | 1,0% | 3,5% | 0,1% | 2,0% | % a.a. |
| **Custo Fee-Based (Portfel)** | $c_{fee}$ | 0,4% | 1,2% | 0,05% | 0,7% | % a.a. |
| **Taxa Segura de Retirada (SWR)** | $SWR$ | 2,5% | 5,0% | 0,1% | 3,5% | % a.a. |
| **Despesa Mensal Meta na Aposentadoria** | $D_{meta}$ | R$ 5.000 | R$ 150.000 | R$ 1.000 | R$ 25.000 | R$ / mês |

---

### 2.2. Equações Matemáticas Determinísticas

#### A. Relação de Fisher (Taxa Real Contínua vs. Discreta)
Para isolar a ilusão monetária da inflação, todo o cálculo patrimonial deve operar em termos de **Poder de Compra Real Constante** (moeda de hoje).
A taxa real anual exata é calculada pela Equação de Fisher:
$$r_{real} = \frac{1 + r_{nom}}{1 + i_{inf}} - 1$$

A taxa real mensal equivalente ($r_m$) é derivada por capitalização composta:
$$r_m = (1 + r_{real})^{\frac{1}{12}} - 1$$

*Exemplo com valores padrão ($r_{nom} = 11,5\%$, $i_{inf} = 4,5\%$):*
$$r_{real} = \frac{1 + 0,115}{1 + 0,045} - 1 = \frac{1,115}{1,045} - 1 \approx 0,066986 \ (6,70\% \text{ a.a. real})$$
$$r_m = (1 + 0,066986)^{\frac{1}{12}} - 1 \approx 0,005419 \ (0,542\% \text{ a.m. real})$$

---

#### B. Modelo de Acumulação Mês a Mês
Para $N = T \times 12$ meses de fase de acumulação:
A fórmula analítica fechada para o valor futuro real acumulado $P(N)$ com aportes postecipados é:
$$P(N) = P_0 \cdot (1 + r_m)^N + PMT \cdot \left[ \frac{(1 + r_m)^N - 1}{r_m} \right]$$

Em paralelo, a série histórica discreta mês a mês $m \in \{1, 2, \dots, N\}$ é gerada para renderização no gráfico:
$$P(m) = P(m-1) \cdot (1 + r_m) + PMT$$
$$TotalAportado(m) = P_0 + (PMT \times m)$$
$$JurosReaisCompostos(m) = P(m) - TotalAportado(m)$$

---

#### C. O "Ano da Soberania Financeira" (Crossover Point)
O Ponto de Soberania Financeira ocorre no primeiro mês $m^*$ em que o rendimento real mensal gerado pelo patrimônio acumulado se iguala ou ultrapassa a despesa mensal desejada $D_{meta}$.

Considerando a Taxa Segura de Retirada anual $SWR$ (onde $SWR_m = \frac{SWR}{12}$):
$$P(m^*) \cdot SWR_m \ge D_{meta} \iff P(m^*) \ge P_{soberano}$$
Onde o **Patrimônio de Soberania Necessário** ($P_{soberano}$) é:
$$P_{soberano} = \frac{D_{meta} \times 12}{SWR}$$

*Exemplo com $D_{meta} = R\$\,25.000$ e $SWR = 3,5\%$:*
$$P_{soberano} = \frac{25.000 \times 12}{0,035} = \frac{300.000}{0,035} = R\$\,8.571.428,57$$

O algoritmo realiza a busca discreta pelo menor índice $m^*$ tal que $P(m^*) \ge P_{soberano}$.
O tempo em anos e meses é dado por:
$$Anos = \lfloor m^* / 12 \rfloor, \quad Meses = m^* \pmod{12}$$
A data prevista é calculada somando $m^*$ meses à data corrente (`Date.now()`), gerando frases de alto impacto como:
> *"Sua Soberania Financeira será atingida em **Novembro de 2038** (daqui a 12 anos e 1 mês)."*

Caso $m^* > N$, o sistema calcula a carência adicional necessária ou o aporte complementar para atingir a meta no prazo desejado.

---

#### D. Preservação de Legado (Renda Perpétua) vs. Consumo de Capital
O usuário pode alternar entre duas modalidades de usufruto:
1. **Renda Perpétua (Legado Familiar Intacto):**
   O principal nunca se esgota, mantendo poder de compra perpétuo corrigido pela inflação.
   $$RendaMensal_{perpétua} = P(N) \cdot r_m \quad \text{ou} \quad \frac{P(N) \cdot SWR}{12}$$
2. **Consumo de Capital (Decumulação Programada até os 95 anos):**
   Consumo do principal e juros por um horizonte de decumulação $T_{dec}$ (ex: 30 anos = 360 meses), calculado pelo coeficiente da Tabela Price em termos reais:
   $$RendaMensal_{consumo} = P(N) \cdot \left[ \frac{r_m \cdot (1 + r_m)^{N_{dec}}}{(1 + r_m)^{N_{dec}} - 1} \right]$$

---

#### E. O Impacto do Fee Drag (Comissão Tradicional vs. Fee-Based Portfel)
Este é o núcleo de convencimento da consultoria fiduciária.
- **Modelo Comissionado (Spread Oculto Tradicional):**
  Taxa anual líquida real reduzida pelo custo de comissão/rebates bancários:
  $$r_{real, trad} = \frac{1 + (r_{nom} - c_{trad})}{1 + i_{inf}} - 1$$
- **Modelo Fee-Based (Portfel - 100% Cashback de Comissões):**
  Taxa anual líquida real otimizada pela consultoria com cashback integral:
  $$r_{real, fee} = \frac{1 + (r_{nom} - c_{fee})}{1 + i_{inf}} - 1$$

A diferença percentual líquida típica é de $\Delta = c_{trad} - c_{fee} \approx 1,3\% \text{ a } 1,8\% \text{ a.a.}$.

Calculando o patrimônio final acumulado nas duas modalidades:
$$\Delta Patrimônio = P_{fee}(N) - P_{trad}(N)$$

**Tradução em "Anos de Liberdade Ganhos":**
O simulador calcula o mês $m_{trad}^*$ em que o modelo tradicional atingiria o mesmo patrimônio que o modelo Fee-Based atinge em $m_{fee}^*$:
$$\Delta Tempo = m_{trad}^* - m_{fee}^* \quad \text{(em anos)}$$
Em simulações típicas com $P_0 = \text{R\$\,500.000}$ e aportes de R$ 10.000/mês ao longo de 20 a 25 anos, o cliente Fee-Based acumula entre **R$ 924.808 e R$ 1.662.138 a mais** (ou entre **R$ 2,18M e R$ 3,87M a mais** para clientes High Net Worth com $P_0 = \text{R\$\,1,5M}$ e $PMT = \text{R\$\,20k/mês}$), o que representa **entre 2,4 e 3,6 anos a menos de trabalho** apenas pela eliminação do intermediário.

---

### 2.3. Especificação do Gráfico Interativo Vivo (Canvas 2D / SVG Nativo)

Para manter 100% de autonomia e zero dependência de bibliotecas pesadas de terceiros (como Chart.js de 200kb), o gráfico é renderizado através de um componente **Canvas HTML5 ou SVG Nativo** responsivo com as seguintes camadas:

1. **Grid de Fundo & Eixos:**
   - Linhas horizontais pontilhadas em `rgba(255, 255, 255, 0.05)`.
   - Rótulos verticais formatados em `JetBrains Mono` com sufixo monetário compacto (`R$ 1M`, `R$ 2.5M`, `R$ 5M`, `R$ 10M`).
   - Rótulos horizontais marcando os anos ($0, 5, 10, 15 \dots T$).
2. **Área Sombreada de Aportes Brutos:**
   - Preenchimento gradiente suave entre `rgba(82, 78, 106, 0.2)` e `transparent`.
3. **Curva 1: Modelo Comissionado Tradicional:**
   - Traço contínuo de 2px em violeta atenuado (`#6B66E8` com opacidade 0.6).
4. **Curva 2: Modelo Fee-Based Portfel (Soberania):**
   - Traço de 3px em esmeralda vibrante (`#1CD98A`) com filtro de brilho/glow `drop-shadow(0 0 8px rgba(28, 217, 138, 0.4))`.
5. **Linha Horizontal do Patrimônio de Soberania ($P_{soberano}$):**
   - Linha tracejada dourada/âmbar (`#F2B705`) indicando a linha de chegada da liberdade.
6. **Marcador de Crossover Point:**
   - Ponto pulsante verde esmeralda no ponto exato $(x^*, y^*)$ onde a curva corta a linha de soberania, com badge magnético flutuante: `"Ano da Soberania: 2038"`.
7. **Cursor Magnético (Scrubbing Tátil):**
   - Ao arrastar o dedo ou mouse sobre o gráfico, uma linha vertical segue o ponteiro interpolando os valores exatos de ambos os cenários em um card flutuante em tempo real.

---

### 2.4. Design dos Componentes Táteis de Controle

- **Trilho do Slider:** Altura de 6px, fundo `#130E28`, com preenchimento dinâmico via gradiente CSS `linear-gradient(90deg, var(--vio), var(--grn))` proporcional ao valor selecionado.
- **Thumb (Alça de Arrastar):** Círculo de 24px com borda de 2px `#1CD98A`, centro `#04020C`, sombra de elevação `0 4px 12px rgba(0,0,0,0.5)`, expandindo suavemente para 28px no toque mobile.
- **Display Numérico:** Tipografia `JetBrains Mono`, tamanho `1.3rem`, cor `#EDE8D5`, com animação de contagem rápida ao saltar valores.
- **Quick-Pills (Saltos Rápidos):** Botões táteis abaixo do slider para inserção rápida de marcos patrimoniais:
  - *Patrimônio:* `[R$ 100k]` `[R$ 500k]` `[R$ 1M]` `[R$ 3M]` `[R$ 5M]`
  - *Aporte:* `[R$ 2k/mês]` `[R$ 5k/mês]` `[R$ 10k/mês]` `[R$ 25k/mês]`

---

## 3. Requisito R3: Jornada Gamificada "Raio-X & Arquétipo Patrimonial"

### 3.1. As 5 Dimensões de Blindagem Patrimonial

O diagnóstico analisa a saúde patrimonial sob 5 pilares independentes, normalizados de 0 a 100 pontos:

1. **D1: Alocação Global & Offshore (Peso 20%)**
   - Mitigação do Risco-País Brasil (risco fiscal, cambial e institucional).
   - Preservação do poder de compra global em moeda forte (USD/EUR) com custódia em jurisdições estáveis.
2. **D2: Eficiência Tributária & Estruturação (Peso 20%)**
   - Blindagem contra come-cotas semestral, uso estratégico de Previdência Regressiva (VGBL 10% / PGBL abatimento de 12%), compensação de perdas e isenções legais.
3. **D3: Planejamento Sucessório & Holding (Peso 20%)**
   - Eliminação ou mitigação drástica de inventário judicial (que consome de 10% a 20% do espólio), doação com reserva de usufruto, holding familiar e governança de herdeiros.
4. **D4: Liquidez Tática & Gestão de Cauda (Peso 20%)**
   - Proporção adequada de caixa para estilo de vida (6 a 24 meses), reserva de oportunidade para janelas de compra em crises e proteção contra iliquidez excessiva.
5. **D5: Alinhamento Fiduciário & Modelo de Remuneração (Peso 20%)**
   - Relação com consultor/assessor: eliminação do conflito de interesse de corretagem tradicional (churning, empurrão de COE e produtos de alta margem de banco) via modelo Fee-Based com devolução integral de rebates.

---

### 3.2. Estrutura do Quiz Executivo (5 Etapas / Cards Táteis)

O quiz não possui formulários burocráticos. Cada etapa apresenta um cartão imersivo com 4 alternativas ricas e botões táteis:

#### Etapa 1 / 5: Internacionalização & Moeda
> *"Qual porcentagem do seu patrimônio está investida diretamente fora do Brasil e em moeda forte?"*

| Opção | Título da Alternativa | Descrição Detalhada | Pontuação ($D_1$) |
|---|---|---|---|
| **A** | **100% Brasil / Reais** | Todo meu capital está em bancos e corretoras locais, em moeda brasileira. | 0 pts |
| **B** | **Exposição Sintética Local** | Invisto apenas em BDRs, ETFs brasileiros (como IVVB11) ou fundos cambiais locais. | 35 pts |
| **C** | **Offshore em Formação** | Possuo conta internacional (ex: Avenue, Nomad, Interactive Brokers) com 5% a 20% do capital. | 75 pts |
| **D** | **Alocação Global Madura** | Mais de 20% do patrimônio custodiado em jurisdição de grau de investimento (EUA/Europa/Suíça). | 100 pts |

---

#### Etapa 2 / 5: Eficiência Fiscal & Come-Cotas
> *"Como os impostos sobre seus investimentos são administrados ao longo dos anos?"*

| Opção | Título da Alternativa | Descrição Detalhada | Pontuação ($D_2$) |
|---|---|---|---|
| **A** | **Fricção Máxima** | Invisto em fundos DI/Multimercado convencionais (sofrendo come-cotas a cada 6 meses) sem planejamento. | 0 pts |
| **B** | **Isenções Táticas** | Concentro quase tudo em títulos isentos (LCI, LCA, CRI, CRA) para não pagar IR, mas sem visão ampla. | 40 pts |
| **C** | **Previdência Regressiva Ativa** | Utilizo VGBL na alíquota mínima de 10% ou PGBL para abater até 12% da renda tributável anual. | 75 pts |
| **D** | **Engenharia Fiscal Completa** | Combinação de previdência de alta performance, diferimento perpétuo, fundos exclusivos ou carteira administrada. | 100 pts |

---

#### Etapa 3 / 5: Sucessão & Proteção Jurídica Familiar
> *"Se você faltar inesperadamente amanhã, o que acontece com a transmissão dos seus bens para sua família?"*

| Opção | Título da Alternativa | Descrição Detalhada | Pontuação ($D_3$) |
|---|---|---|---|
| **A** | **Inventário Tradicional** | Todos os bens e contas entram em processo judicial de inventário (custo de 10% a 18% e contas congeladas). | 0 pts |
| **B** | **Instrumentos Básicos** | Possuo seguro de vida simples ou testamento, mas os investimentos e imóveis principais ainda vão a inventário. | 35 pts |
| **C** | **Sucessão por Previdência** | Grande parte do capital líquido está em VGBL (liquidação extrajudicial direta aos beneficiários em até 30 dias). | 70 pts |
| **D** | **Holding & Governança Blindada** | Estrutura de holding familiar, doação com reserva de usufruto, cláusulas de incomunicabilidade e inventário quase zero. | 100 pts |

---

#### Etapa 4 / 5: Liquidez, Imóveis & Reserva de Cauda
> *"Qual o grau de liquidez e flexibilidade do seu patrimônio diante de uma crise ou oportunidade súbita?"*

| Opção | Título da Alternativa | Descrição Detalhada | Pontuação ($D_4$) |
|---|---|---|---|
| **A** | **Iliquidez Excessiva** | Mais de 70% do patrimônio está imobilizado em empresas próprias, terrenos ou imóveis físicos difíceis de vender. | 10 pts |
| **B** | **Reserva Misturada** | Tenho dinheiro em conta ou poupança, mas misturo capital pessoal com capital de giro dos negócios. | 45 pts |
| **C** | **Reserva de Conforto** | Possuo de 6 a 12 meses do custo de vida familiar alocados em liquidez diária soberana (LFT/Tesouro Selic). | 80 pts |
| **D** | **Estratégia Antifrágil (Barbell)** | Liquidez de emergência intacta + Caixa Tático de Oportunidade para compras em crises + Ativos líquidos descorrelacionados. | 100 pts |

---

#### Etapa 5 / 5: Alinhamento de Interesses & Modelo de Assessoria
> *"Quem orienta suas decisões patrimoniais hoje e como esse profissional é remunerado?"*

| Opção | Título da Alternativa | Descrição Detalhada | Pontuação ($D_5$) |
|---|---|---|---|
| **A** | **Varejo / Conflito Direto** | Decido sozinho sem tempo para acompanhar, ou sigo orientações do gerente do meu banco tradicional. | 0 pts |
| **B** | **Assessor Comissionado (AAI)** | Sou atendido por assessor de corretora que ganha comissão sobre os produtos que me recomenda (spreads embutidos). | 30 pts |
| **C** | **Consultor Independente Híbrido** | Pago um valor fixo ou percentual, mas não tenho certeza se recebo de volta todos os rebates das plataformas. | 65 pts |
| **D** | **100% Fee-Based Fiduciário** | Remunero meu consultor diretamente via taxa transparente acordada, com 100% de cashback de qualquer rebate de produto. | 100 pts |

---

### 3.3. Algoritmo do Score Global de Blindagem

O **Score de Blindagem Patrimonial** ($S_{global}$) varia de 0 a 100 pontos e é calculado pela média ponderada das 5 dimensões:

$$S_{global} = \sum_{k=1}^5 w_k \cdot D_k \quad \text{onde } w_1 = w_2 = w_3 = w_4 = w_5 = 0,20$$
$$S_{global} = \frac{D_1 + D_2 + D_3 + D_4 + D_5}{5}$$

#### Faixas de Maturidade Patrimonial:
- **0 a 39 pontos: Nível 1 — Patrimônio Vulnerável**
  *Diagnóstico:* Exposição crítica ao risco Brasil, inventário oneroso e alto fee drag invisível.
- **40 a 64 pontos: Nível 2 — Blindagem Básica / Em Construção**
  *Diagnóstico:* Patrimônio já em fase de acumulação relevante, mas sofrendo vazamentos tributários e ausência de estratégia sucessória.
- **65 a 84 pontos: Nível 3 — Blindagem Avançada**
  *Diagnóstico:* Boa diversificação e preservação, necessitando apenas de refinamento offshore e sofisticação de governança familiar.
- **85 a 100 pontos: Nível 4 — Patrimônio Soberano de Elite**
  *Diagnóstico:* Estrutura comparável a Family Offices internacionais, com máxima eficiência fiduciária, fiscal e sucessória.

---

### 3.4. Mapeamento dos 5 Arquétipos de Investidor de Elite

O arquétipo do investidor não é gerado por uma classificação genérica, mas pelo perfil das assimetrias entre suas 5 dimensões:

```
                  [Score Global e Assimetrias Dimensionais]
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
  D4 < 40 e D1 < 40           D3 < 40 e D2 < 50           D5 <= 30 e D2 < 60
[O Construtor Exposto]    [O Patriarca Tradicionalista]  [O Acumulador Ineficiente]
          │                           │                           │
          └───────────────────────────┼───────────────────────────┘
                                      │
                         D1 >= 75 e D5 >= 65 e S >= 65
                                      ▼
                        [O Estrategista em Transição]
                                      │
                                 S >= 85
                                      ▼
                             [O Soberano Blindado]
```

#### Catálogo Detalhado dos Arquétipos:

#### 1. O Construtor Exposto
- **Perfil do Investidor:** Empresário, empreendedor ou profissional liberal de alta renda com foco total na geração de caixa operacional. Reinveste quase todo o capital na própria empresa ou em ativos imobilizados locais.
- **Assinatura Quantitativa:** $D_1 \le 35$, $D_4 \le 45$, $D_3 \le 35$.
- **Gargalo Oculto:** O patrimônio familiar e o patrimônio empresarial estão siamesamente unidos. Se a empresa sofrer uma execução fiscal, trabalhista ou crise setorial brasileira, todo o legado da família é ameaçado.
- **Frase de Impacto no Diagnóstico:** *"Você é um mestre em gerar riqueza, mas deixa a porta dos fundos aberta para o risco Brasil e a instabilidade jurídica."*
- **Ação Recomendada:** Desacoplamento imediato de patrimônio líquido via Holding Patrimonial + Internacionalização de 15% a 25% do capital.

---

#### 2. O Patriarca Tradicionalista
- **Perfil do Investidor:** Famílias com patrimônio consolidado ao longo de décadas, predominantemente em imóveis físicos urbanos/rurais e títulos de renda fixa de bancos tradicionais.
- **Assinatura Quantitativa:** $D_3 \le 35$, $D_1 \le 35$, $D_2 \le 40$.
- **Gargalo Oculto:** Risco de congelamento e dilapidação do patrimônio no inventário futuro (ITCMD progressivo que pode chegar a 16%-20% na nova reforma + taxas advocatícias), além de baixa rentabilidade real após inflação e impostos sobre aluguéis.
- **Frase de Impacto no Diagnóstico:** *"Seu patrimônio é sólido, mas sua estrutura sucessória é uma bomba-relógio fiscal para a próxima geração."*
- **Ação Recomendada:** Estruturação de Holding Familiar com doação de cotas em vida com reserva de usufruto e alocação de liquidez em Previdência VGBL.

---

#### 3. O Acumulador Ineficiente
- **Perfil do Investidor:** Investidor com R$ 500k a R$ 5M alocados em grandes corretoras ou private banks, porém orientado por assessores comissionados (AAI) ou gerentes de banco.
- **Assinatura Quantitativa:** $D_5 \le 30$, $D_2 \le 40$.
- **Gargalo Oculto:** O "Fee Drag" invisível. Está exposto a fundos com come-cotas frequentes, COEs com prêmios embutidos para o assessor e giro de carteira desnecessário. Perde entre R$ 20.000 e R$ 100.000 por ano apenas em comissões ocultas.
- **Frase de Impacto no Diagnóstico:** *"Você tem disciplina exemplar de poupança, mas seu patrimônio é drenado silenciosamente por taxas e comissões que você nem sabe que paga."*
- **Ação Recomendada:** Migração para o modelo 100% Fee-Based com auditoria de carteira e recuperação de 100% dos rebates pagos pelas corretoras.

---

#### 4. O Estrategista em Transição
- **Perfil do Investidor:** Investidor sofisticado, leitor de relatórios econômicos, já possui conta no exterior e ativos descorrelacionados, mas sofre com a falta de tempo para consolidar e rebalancear suas posições.
- **Assinatura Quantitativa:** $60 \le S_{global} \le 84$, $D_1 \ge 70$.
- **Gargalo Oculto:** Carteira fragmentada em 3 ou 4 instituições diferentes, sem metodologia unificada de controle de risco, duration e rebalanceamento sistemático.
- **Frase de Impacto no Diagnóstico:** *"Você já tem a visão correta de diversificação, mas a falta de uma gestão patrimonial unificada impede seu patrimônio de atingir o rendimento máximo."*
- **Ação Recomendada:** Consolidação patrimonial holística sob gestão fiduciária única com rebalanceamento trimestral disciplinado.

---

#### 5. O Soberano Blindado
- **Perfil do Investidor:** Investidor com estrutura patrimonial madura, alocação global acima de 25%, holding operacionalizada e alinhamento fiduciário pleno.
- **Assinatura Quantitativa:** $S_{global} \ge 85$ e todos os $D_k \ge 70$.
- **Gargalo Oculto:** Risco de cauda regulatório (novas regras de tributação de offshores e fundos fechados da Lei 14.754/23) e necessidade de monitoramento contínuo de assimetrias macroeconômicas globais.
- **Frase de Impacto no Diagnóstico:** *"Sua governança patrimonial está no topo 1% do Brasil. O desafio agora é a gestão tática de cauda e otimização dinâmica diante de mudanças legislativas."*
- **Ação Recomendada:** Consultoria estratégica contínua de Family Office para preservação intergeracional e proteção cambial.

---

### 3.5. Geometria Analítica & Renderização do Gráfico de Radar de 5 Eixos (SVG Nativo)

O radar de 5 eixos é renderizado diretamente como um elemento `<svg viewBox="0 0 400 400">` leve, vetorial e escalável, sem dependências.

#### Equações Trigonométricas de Renderização:
- Centro do Radar: $(x_c, y_c) = (200, 200)$
- Raio Máximo: $R_{max} = 135\text{px}$
- Para 5 eixos regulares, o espaçamento angular é $\Delta \theta = \frac{2\pi}{5} = 72^\circ = 1,256637\text{ rad}$.
- Alinhando o Eixo 1 (Offshore) no topo vertical: $\theta_0 = -\frac{\pi}{2} = -90^\circ$.
- Para cada dimensão $k \in \{0, 1, 2, 3, 4\}$:
  $$\theta_k = -\frac{\pi}{2} + k \cdot \frac{2\pi}{5}$$
  - $k=0$ (Offshore): $\theta_0 = -90^\circ$
  - $k=1$ (Eficiência Tributária): $\theta_1 = -18^\circ$
  - $k=2$ (Planejamento Sucessório): $\theta_2 = 54^\circ$
  - $k=3$ (Liquidez & Cauda): $\theta_3 = 126^\circ$
  - $k=4$ (Alinhamento Fiduciário): $\theta_4 = 198^\circ$

Para um valor $D_k \in [0, 100]$, as coordenadas cartesianas do ponto no plano SVG são:
$$r_k = R_{max} \cdot \left(\frac{D_k}{100}\right)$$
$$x_k = x_c + r_k \cdot \cos(\theta_k) = 200 + r_k \cdot \cos(\theta_k)$$
$$y_k = y_c + r_k \cdot \sin(\theta_k) = 200 + r_k \cdot \sin(\theta_k)$$

#### Estrutura Visual SVG:
1. **Grade Pentagonal Consecutiva:**
   Cálculo das teias de fundo para os níveis concêntricos de $20\%$, $40\%$, $60\%$, $80\%$ e $100\%$ do raio máximo:
   `<polygon points="..." fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`
2. **Eixos Radiais:**
   5 retas partindo do centro $(200, 200)$ até o raio máximo de cada vértice com traço sutil `stroke="rgba(255,255,255,0.12)"`.
3. **Polígono de Dados (Área do Investidor):**
   - `<polygon id="radar-data-poly" points="..." fill="url(#radar-gradient)" stroke="#1CD98A" stroke-width="2.5" />`
   - Gradiente de preenchimento `rgba(28, 217, 138, 0.25)` até `rgba(59, 54, 204, 0.15)`.
   - Vértices destacados com círculos pulsantes `<circle cx="..." cy="..." r="4" fill="#1CD98A" />`.
4. **Animação de Interpolação:**
   Transição CSS direta no atributo de coordenadas ou interpolação linear (`requestAnimationFrame`) com duração de 600ms e curva `cubic-bezier(0.22, 1, 0.36, 1)`.

---

### 3.6. Diagnóstico Dinâmico de Gargalos & CTA Contextualizado

Ao concluir o quiz:
1. O algoritmo identifica os **2 menores scores dimensionais**:
   $$\text{Gargalo } 1 = \arg\min_{k} (D_k), \quad \text{Gargalo } 2 = \arg\min_{k \neq \text{Gargalo } 1} (D_k)$$
2. São geradas tags de alerta e diagnósticos objetivos correspondentes:
   - *Se D1 baixo:* `⚠️ Vulnerabilidade Crítica: 100% de Exposição ao Risco Soberano Brasileiro`
   - *Se D2 baixo:* `⚠️ Ineficiência Fiscal: Erosão Patrimonial Severa por Come-Cotas e Bitributação`
   - *Se D3 baixo:* `⚠️ Risco Familiar: Perda de até 18% do Patrimônio em Futuro Processo de Inventário`
   - *Se D4 baixo:* `⚠️ Armadilha de Iliquidez: Imobilização Excessiva sem Caixa Tático de Oportunidade`
   - *Se D5 baixo:* `⚠️ Conflito de Interesses: Estimativa de Fee Drag de 1,5% a 2,5% a.a. drenando seu futuro`

3. **CTA com Preservação de Estado para a Reunião Estratégica:**
   O botão principal de conversão direciona o usuário para agendamento com Leonardo Arruda, embutindo os resultados codificados na URL:
   ```
   https://leonardoarruda.com.br/#contato?score=62&arq=acumulador&d1=35&d2=40&d3=70&d4=80&d5=30&swr=3.5
   ```
   Caso o formulário esteja na própria página ou em modal de agendamento, o JavaScript lê os parâmetros em tempo real e pré-alimenta os campos ocultos do envio (ou exibe no topo do formulário: *"Diagnóstico anexado: O Acumulador Ineficiente · Score 62/100"*).

---

## 4. Implementação de Referência (Vanilla JS Puro)

Abaixo está o motor matemático completo em JavaScript puro, pronto para ser integrado diretamente nos scripts do projeto sem qualquer build step ou biblioteca externa:

```javascript
/**
 * MOTOR QUANTITATIVO DE APOSENTADORIA & LIBERDADE FINANCEIRA (R2)
 * Leonardo Arruda Private Wealth - Pure Vanilla JS
 */
class FinancialFreedomEngine {
  constructor(params = {}) {
    this.P0 = params.P0 ?? 500000;              // Patrimônio inicial (R$)
    this.PMT = params.PMT ?? 10000;             // Aporte mensal (R$)
    this.years = params.years ?? 15;            // Anos de acumulação
    this.rNom = params.rNom ?? 0.115;           // Taxa nominal anual (11.5%)
    this.iInf = params.iInf ?? 0.045;           // Inflação anual projetada (4.5%)
    this.cTrad = params.cTrad ?? 0.020;         // Custo modelo tradicional (2.0% a.a.)
    this.cFee = params.cFee ?? 0.007;           // Custo modelo Fee-Based (0.7% a.a.)
    this.swr = params.swr ?? 0.035;             // Safe Withdrawal Rate (3.5% a.a.)
    this.despesaMeta = params.despesaMeta ?? 25000; // Despesa mensal desejada (R$)
  }

  // Taxa real anual de Fisher
  calcRealRate(nomRate, infRate) {
    return ((1 + nomRate) / (1 + infRate)) - 1;
  }

  // Taxa mensal equivalente
  calcMonthlyRate(annualRate) {
    return Math.pow(1 + annualRate, 1 / 12) - 1;
  }

  // Simulação completa mês a mês
  simulate() {
    const totalMonths = this.years * 12;
    const rRealNom = this.calcRealRate(this.rNom, this.iInf);
    
    // Taxas líquidas reais nos dois modelos
    const rRealTrad = this.calcRealRate(Math.max(0, this.rNom - this.cTrad), this.iInf);
    const rRealFee = this.calcRealRate(Math.max(0, this.rNom - this.cFee), this.iInf);
    
    const rmTrad = this.calcMonthlyRate(rRealTrad);
    const rmFee = this.calcMonthlyRate(rRealFee);

    // Patrimônio necessário para soberania financeira via SWR
    const patrimonioSoberania = (this.despesaMeta * 12) / this.swr;

    let pTrad = this.P0;
    let pFee = this.P0;
    let totalAportado = this.P0;

    const timeline = [];
    let monthSoberania = null;

    for (let m = 0; m <= totalMonths; m++) {
      if (m > 0) {
        pTrad = pTrad * (1 + rmTrad) + this.PMT;
        pFee = pFee * (1 + rmFee) + this.PMT;
        totalAportado += this.PMT;
      }

      if (monthSoberania === null && pFee >= patrimonioSoberania) {
        monthSoberania = m;
      }

      timeline.push({
        month: m,
        year: (m / 12).toFixed(1),
        patrimonioTrad: Math.round(pTrad),
        patrimonioFee: Math.round(pFee),
        totalAportado: Math.round(totalAportado),
        deltaGanho: Math.round(pFee - pTrad)
      });
    }

    const finalFee = pFee;
    const finalTrad = pTrad;
    const rendaMensalSWR = (finalFee * this.swr) / 12;
    const rendaMensalPerpetua = finalFee * this.calcMonthlyRate(rRealFee);

    // Cálculo dos anos de liberdade ganhos
    // Em quantos meses o modelo tradicional atinge o valor final do modelo fee?
    let mTradReach = totalMonths;
    let tempTrad = pTrad;
    while (tempTrad < finalFee && mTradReach < totalMonths + (20 * 12)) {
      mTradReach++;
      tempTrad = tempTrad * (1 + rmTrad) + this.PMT;
    }
    const anosGanhos = Math.max(0, ((mTradReach - totalMonths) / 12)).toFixed(1);

    return {
      patrimonioFinalFee: Math.round(finalFee),
      patrimonioFinalTrad: Math.round(finalTrad),
      patrimonioSoberania: Math.round(patrimonioSoberania),
      vantagemFeeBased: Math.round(finalFee - finalTrad),
      rendaMensalSWR: Math.round(rendaMensalSWR),
      rendaMensalPerpetua: Math.round(rendaMensalPerpetua),
      anoSoberania: monthSoberania !== null ? (monthSoberania / 12).toFixed(1) : null,
      mesesAteSoberania: monthSoberania,
      anosGanhosDeVida: anosGanhos,
      timeline
    };
  }
}

/**
 * MOTOR DE DIAGNÓSTICO PATRIMONIAL & ARQUÉTIPOS (R3)
 */
class WealthDiagnosticEngine {
  constructor(scores = {}) {
    // Scores das 5 dimensões (0 a 100)
    this.D1 = scores.d1 ?? 0; // Offshore
    this.D2 = scores.d2 ?? 0; // Tributário
    this.D3 = scores.d3 ?? 0; // Sucessório
    this.D4 = scores.d4 ?? 0; // Liquidez
    this.D5 = scores.d5 ?? 0; // Fiduciário
  }

  calcGlobalScore() {
    return Math.round((this.D1 + this.D2 + this.D3 + this.D4 + this.D5) / 5);
  }

  getArchetype() {
    const s = this.calcGlobalScore();
    const { D1, D2, D3, D4, D5 } = this;

    if (s >= 85 && D1 >= 70 && D2 >= 70 && D3 >= 70 && D4 >= 70 && D5 >= 70) {
      return {
        id: 'soberano',
        title: 'O Soberano Blindado',
        subtitle: 'Estrutura de Family Office & Máxima Proteção Intergeracional',
        badge: 'Top 1% de Governança',
        icon: '👑',
        color: '#1CD98A'
      };
    }

    if (D4 <= 45 && D1 <= 40) {
      return {
        id: 'construtor',
        title: 'O Construtor Exposto',
        subtitle: 'Alta Geração de Caixa com Risco Sistêmico Concentrado no Brasil',
        badge: 'Risco de Execução Jurídica',
        icon: '🏗️',
        color: '#E4572E'
      };
    }

    if (D3 <= 35 && D1 <= 40) {
      return {
        id: 'patriarca',
        title: 'O Patriarca Tradicionalista',
        subtitle: 'Patrimônio Imobiliário e Bancário com Severo Risco de Inventário',
        badge: 'Gargalo Sucessório Crítico',
        icon: '🏛️',
        color: '#F2B705'
      };
    }

    if (D5 <= 35 && D2 <= 50) {
      return {
        id: 'acumulador',
        title: 'O Acumulador Ineficiente',
        subtitle: 'Excelente Disciplina Corrompida por Fee Drag e Conflito de Interesses',
        badge: 'Erosão Silenciosa de Comissões',
        icon: '📉',
        color: '#6B66E8'
      };
    }

    return {
      id: 'estrategista',
      title: 'O Estrategista em Transição',
      subtitle: 'Consciência Global sem Consolidação de Gestão Unificada',
      badge: 'Falta de Método Unificado',
      icon: '🧭',
      color: '#3B36CC'
    };
  }

  getBottlenecks() {
    const dims = [
      { key: 'D1', name: 'Alocação Global & Offshore', score: this.D1, alert: '100% exposto ao Risco Soberano e Cambial Brasileiro' },
      { key: 'D2', name: 'Eficiência Tributária', score: this.D2, alert: 'Erosão patrimonial por Come-Cotas e ausência de Previdência Regressiva' },
      { key: 'D3', name: 'Planejamento Sucessório', score: this.D3, alert: 'Perda de até 18% do patrimônio e contas bloqueadas em futuro inventário' },
      { key: 'D4', name: 'Liquidez & Cauda', score: this.D4, alert: 'Falta de Caixa Tático de Oportunidade e iliquidez patrimonial excessiva' },
      { key: 'D5', name: 'Alinhamento Fiduciário', score: this.D5, alert: 'Conflito de interesses na assessoria e perda de 1,5% a 2,5% a.a. em comissões' }
    ];

    dims.sort((a, b) => a.score - b.score);
    return dims.slice(0, 2); // Retorna os 2 maiores gargalos
  }

  // Gera coordenadas SVG para o Radar de 5 eixos
  generateRadarSVG(cx = 200, cy = 200, rMax = 135) {
    const scores = [this.D1, this.D2, this.D3, this.D4, this.D5];
    const points = scores.map((val, idx) => {
      const angle = -Math.PI / 2 + (idx * (2 * Math.PI / 5));
      const r = rMax * (val / 100);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return points;
  }
}
```

---

## 5. Design de Interface & Integração com o Design System

### 5.1. Paleta de Cores e Tokens Utilizados
- **Fundo Primário:** `--bg: #04020C` (Obsidiana Profunda)
- **Superfícies de Cartões:** `--s1: #080517`, `--s2: #0B071A`, `--s3: #130E28`
- **Acentos Primários:**
  - Violeta Profundo: `--vio: #3B36CC`
  - Violeta Iluminação: `--vio2: #6B66E8`
  - Esmeralda Soberana: `--grn: #1CD98A` (Acento de Sucesso, Soberania e Fee-Based)
  - Âmbar Alerta: `#F2B705` (Linha de Soberania e Alertas Moderados)
  - Coral Alerta: `#E4572E` (Gargalos Críticos e Ineficiência)
- **Tipografia:**
  - Títulos Editoriais: `Cormorant Garamond`
  - Interface & Textos: `DM Sans`
  - Dados Numéricos & Telemetria: `JetBrains Mono`

### 5.2. Regras de Ouro de Frontend Respeitadas
- **Espaço antes de `<br>` em Mobile:** Qualquer quebra de linha que possa ter `display: none` em celulares conterá rigorosamente um espaço prévio (ex: `renda real <br>garantida`).
- **Zero Filtros SVG de Transparência:** Tratamento de ícones ou imagens puramente vetorial SVG nativo ou PNG transparente pré-processado.
- **Responsividade para Telas Grandes de Celular (390px a 430px):**
  - Áreas de toque de no mínimo 48x48px para todos os seletores de opções.
  - Sliders com zona de arraste expandida verticalmente (`padding: 14px 0`).
  - Prevenção rigorosa de overflow horizontal (`max-width: 100vw; overflow-x: hidden`).

---

## 6. Critérios de Verificação & Testes Unitários

Para garantir precisão matemática absoluta nas etapas seguintes de implementação:

1. **Teste da Equação de Fisher:**
   - Com $r_{nom} = 11,5\%$ e $i_{inf} = 4,5\%$, a taxa real anual calculada DEVE ser exatamente `6,69856%` ($\pm 0,0001\%$).
2. **Teste de Acumulação:**
   - Com $P_0 = \text{R\$\,500.000}$, $PMT = \text{R\$\,10.000}$, $T = 15$ anos, $r_{nom} = 11,5\%$, $i_{inf} = 4,5\%$, o patrimônio final no modelo Fee-Based ($c_{fee} = 0,7\%$) DEVE ser exatamente **R$ 4.078.918** ($\pm \text{R\$\,100}$) e no modelo tradicional ($c_{trad} = 2,0\%$) DEVE ser **R$ 3.611.208** ($\pm \text{R\$\,100}$), gerando uma vantagem líquida determinística de **R$ 467.710**.
   - Em 20 anos, essa vantagem atinge **R$ 924.808**; em 25 anos, **R$ 1.662.138**.
3. **Teste do Radar de 5 Eixos:**
   - O polígono SVG gerado com todos os scores iguais a 100 DEVE coincidir exatamente com os vértices externos do pentágono regular de raio 135px.
4. **Teste de Estado e Payload:**
   - Ao completar o quiz, o objeto serializado em query string DEVE recompor 100% do estado e das respostas sem perdas.

---
*Relatório finalizado por Explorer 2. Pronto para consumo imediato pelos implementadores de frontend e testes E2E.*
