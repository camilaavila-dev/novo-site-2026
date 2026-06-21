# Handoff de Pesquisa Visual e Experiência do Usuário (UX) — Leonardo Arruda Elite

Este documento apresenta a análise de UX, semiótica de marca e diretrizes de design/animação para a reconstrução do site do consultor de investimentos Leonardo Arruda.

---

## 1. Observation (Observações Diretas)

Com base no exame técnico do repositório e dos materiais de marca, observou-se:
1. **Arquitetura e Código Atual**:
   - `index.html`: Estrutura simples de uma única página contendo as seções: Hero (`#home`), Trust & Stats (`.trust-stats`), Sobre (`#sobre`), Metodologia (`#metodologia`), Banner de Performance (`.banner-grafico`) e Rodapé (`.footer`).
   - `styles.css`: Estilização básica utilizando variáveis de cores escuras e douradas (`--ink: #0A0A0B`, `--cream: #EDEAE3`, `--gold: #C6A062`). A tipografia é definida como `Fraunces` (serif) para títulos e `Inter` (sans-serif) para o corpo. Há um overlay de grão sutil SVG estático em `.grain-overlay` com opacidade de `0.035`.
   - `script.js`: Implementa o efeito de vidro na navegação no scroll (`.navbar.scrolled`), uma animação simples de revelação em scroll via adição de classe `.active` em elementos `.reveal`, e um contador numérico rudimentar com `setTimeout` para a seção de estatísticas.
2. **Cérebro da Marca (`cerebro_da_marca_leo_consultor_de_investimento.md`)**:
   - **Posicionamento**: "Consultoria de investimentos voltada para clareza, estratégia e crescimento patrimonial com acompanhamento próximo e linguagem simples" (Linha 324-325).
   - **Público-Alvo**: Investidores em crescimento, empresários/profissionais liberais e famílias de alto patrimônio preocupadas com preservação (Linhas 211-320).
   - **Valores e Tom**: A marca deve soar técnica mas acessível, humana, estratégica, direta e altamente confiável. Deve afastar-se totalmente de tons de "guru de finanças", "ostentação exagerada", ou "promessas de enriquecimento rápido" (Linhas 41-49, 348-355).
   - **Estilo Visual**: Cores sóbrias, sensação de organização e clareza, fugindo de "excesso de luxo ostensivo" ou "estética de guru" (Linha 611-625).

---

## 2. Logic Chain (Cadeia de Raciocínio)

A partir das observações do site atual e do cérebro da marca, estabelecemos a seguinte linha de raciocínio estratégico:

1. **Da Persona ao Design Semiótico**:
   - *Observação*: O público principal inclui empresários focados em eficiência e famílias focadas em segurança de longo prazo. Ambos rejeitam o amadorismo e o tom de ganho fácil.
   - *Raciocínio*: A estética visual precisa evocar sobriedade institucional e prestígio, semelhante a um banco de investimento boutique internacional. Isso é alcançado pela união de um fundo quase vácuo (*Obsidian Black*) com tons orgânicos e quentes de suporte (*Creme Luxo*) e contrastes sutis em *Dourado Champagne Fosco*. O dourado espelhado ou excessivamente amarelo é evitado para não evocar a semiótica de "riqueza rápida" (guru).
2. **Da Tradição Familiar à Tipografia e Textura**:
   - *Observação*: A proteção ao legado familiar exige confiança duradoura, perenidade e cuidado intergeracional.
   - *Raciocínio*: A fonte serifada `Fraunces` é perfeita por seu desenho editorial clássico e refinado, remetendo a livros de registro históricos e acordos tradicionais. Usar variações em itálico e espessuras finas (`font-weight: 300`) traz leveza poética em meio à precisão matemática dos números. A adição de um grão sutil animado simula papel nobre físico, eliminando a "frieza digital" e dando densidade material ao site.
3. **Do Modelo Fiduciário (Transparência) ao Efeito Glassmorphism**:
   - *Observação*: O grande diferencial do Leo é atuar sem conflito de interesse (alinhado 100% com o cliente).
   - *Raciocínio*: A transparência ética deve se traduzir visualmente. Cartões e seções em vidro fosco (*glassmorphism*) permitem que as cores do plano de fundo e feixes de luz passem por eles, simbolizando que nada está oculto na gestão patrimonial do cliente.
4. **Da Retenção de Alta Renda à Arquitetura One-Page**:
   - *Observação*: O público-alvo tem agendas sobrecarregadas e tempo escasso. Navegar por links internos causa fricção e aumenta a taxa de abandono.
   - *Raciocínio*: Uma arquitetura One-page com transições e pins com GSAP permite reter o usuário em uma jornada cinemática controlada, apresentando sucessivamente o Problema $\rightarrow$ Autoridade/Provas $\rightarrow$ Solução/História $\rightarrow$ Metodologia $\rightarrow$ Chamada de Ação sem tempo de carregamento ou quebras na atenção.

---

## 3. Caveats (Ressalvas)

- **Performance do GSAP**: Efeitos avançados de animação de scroll requerem bibliotecas adicionais (`gsap.min.js`, `ScrollTrigger.min.js`, `Lenis` para smooth scroll). O implementador precisará garantir que esses scripts externos sejam carregados de maneira assíncrona ou otimizada para evitar atrasos na interatividade do site (FID/INP).
- **Acessibilidade e Contraste**: Tons de creme sobre dourado ou cinza sobre preto precisam ser cuidadosamente checados sob as diretrizes da WCAG 2.1 AA para garantir legibilidade para pessoas com limitações visuais.
- **Grão de Alta Performance**: O grão SVG animado pode apresentar gargalos em telas de retina (HiDPI) e GPUs de dispositivos móveis de baixo desempenho se implementado com SVG dinâmico contínuo. Propomos uma técnica alternativa baseada em imagem de grão repetida com translações de GPU discretas.

---

## 4. Conclusion (Diretrizes e Recomendações de Design)

Propõe-se a seguinte estrutura conceitual, estética e interativa para o novo site elite de Leonardo Arruda:

### A. Paleta de Cores e Estética Visual
A paleta de cores deve ser reconfigurada no arquivo `styles.css` para aprimorar o luxo e a clareza visual:

| Variável CSS | Valor Hex/RGBA | Função Visual |
| :--- | :--- | :--- |
| `--bg-obsidian` | `#080809` | Fundo principal absoluto. Passa seriedade extrema e silêncio. |
| `--bg-obsidian-card`| `#111113` | Fundo de cartões de metodologia e blocos de depoimentos. |
| `--text-cream-luxo`| `#F5F2EB` | Texto principal. Um off-white aconchegante que evita o cansaço visual do branco puro. |
| `--text-dim-gold` | `#9D9A93` | Texto de apoio e descrições secundárias. |
| `--accent-champagne`| `#C5A880` | Dourado champagne fosco, discreto e polido. Usado em ênfases e bordas nobres. |
| `--accent-gold-soft`| `#E6D5BC` | Champagne claro para highlights, gradientes e estados de hover ativos. |
| `--glass-border` | `rgba(197, 168, 128, 0.08)`| Borda ultra fina de cartões de vidro para refletir a luz de fundo. |

#### Efeito Grain (Grão) de Alta Performance
Substituir o SVG dinâmico custoso por um arquivo de textura PNG de ruído de alta densidade (`50x50` ou `100x100px`) repetido, animando sua translação com aceleração de hardware:
```css
.grain-overlay {
  position: fixed;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200%;
  background: url('caminho-para-imagem-noise.png') repeat;
  opacity: 0.025; /* ultra sutil */
  pointer-events: none;
  z-index: 9999;
  animation: grain-dance 8s steps(10) infinite;
  will-change: transform;
}

@keyframes grain-dance {
  0%, 100% { transform:translate(0, 0); }
  10% { transform:translate(-5%, -10%); }
  20% { transform:translate(-15%, 5%); }
  30% { transform:translate(7%, -25%); }
  40% { transform:translate(-5%, 25%); }
  50% { transform:translate(-15%, 10%); }
  60% { transform:translate(15%, 0%); }
  70% { transform:translate(0%, 15%); }
  80% { transform:translate(3%, 35%); }
  90% { transform:translate(-10%, 10%); }
}
```

### B. Tipografia e Hierarquia de Texto
- **Títulos Importantes (H1, H2, H3)**: Usar `Fraunces` com pesos leves (`300` e `400`). Recomenda-se estilizar palavras-chave com `em` em itálico e peso ultra leve para conferir ritmo editorial premium:
  - *Exemplo*: "Construa o seu *legado* patrimonial com *estratégia fiduciária*."
- **Texto Corrido, Botões e Eyebrows**: Usar `Inter` com pesos `300` (texto geral) e `500` (botões e menus). Eyebrows devem ser escritos em caixa alta com `letter-spacing: 0.15em` a `0.2em`.

### C. Blueprint de Interações Complexas (GSAP + Lenis)
O implementador deverá reescrever o comportamento dinâmico do site substituindo as classes de reveal nativas pelo ecossistema **GSAP**:

1. **Smooth Scroll (Rolagem Suave)**:
   Implementar a biblioteca **Lenis** (leve e robusta) para suavizar a inércia do scroll físico em navegadores desktop.
2. **Revelação de Texto por Caractere/Palavra**:
   Usar uma biblioteca de divisão de texto (como `SplitType` ou lógica manual JS) e animar com GSAP:
   ```javascript
   // Exemplo de efeito de revelação de títulos (fatiamento de linhas)
   const splitTitles = document.querySelectorAll('.split-title');
   splitTitles.forEach(title => {
       const text = new SplitType(title, { types: 'lines, words' });
       gsap.from(text.words, {
           scrollTrigger: {
               trigger: title,
               start: "top 80%",
               toggleActions: "play none none reverse"
           },
           y: 100,
           opacity: 0,
           duration: 1.2,
           ease: "power4.out",
           stagger: 0.05
       });
   });
   ```
3. **Section Pinning (Painel Deslizante na Metodologia)**:
   Na transição entre a seção "Sobre" (`#sobre`) e a "Metodologia" (`#metodologia`), travar a seção anterior enquanto a Metodologia desliza verticalmente sobre ela com uma sombra projetada e borda iluminada por trás.
4. **Efeito de Paralaxe Fiduciário**:
   A imagem profissional de Leonardo Arruda e os painéis de estatísticas devem possuir intensidades diferentes de scroll (`data-speed="0.8"` e `data-speed="1.2"`), gerando profundidade tridimensional física.

### D. Layout Conceitual e Arquitetura Ideal
Propõe-se uma arquitetura de **One-pager Imersivo Principal** com páginas de apoio ocultas ou em arquivos estáticos isolados (ex: página de links e formulário de obrigado).

#### Estrutura Visual da One-page:

1. **Header/Navbar**:
   - Logo nobre em Dourado Champagne no canto esquerdo.
   - Navegação minimalista (Quem sou, Como Funciona).
   - Botão de Ação "Agendar Diagnóstico" com efeito magnético de hover (GSAP).
2. **Hero Section (O Impacto)**:
   - *Fundo*: Preto Profundo (`#080809`) com um gradiente radial de luz champagne suave atrás do texto.
   - *Conteúdo*: Frase conceitual de impacto dividida em linhas com a tipografia refinada Fraunces (`A vida dos seus sonhos começa aqui.`). Textos de apoio explicando o modelo fiduciário sob medida.
   - *Visual*: Foto profissional de alta qualidade de Leonardo à direita, integrada ao fundo escuro com máscara de transparência inferior (fade out).
3. **Trust & Stats (A Credibilidade Física)**:
   - Três painéis com efeito de vidro fosco (`backdrop-filter`).
   - Contadores numéricos que disparam e sobem suavemente com easing via GSAP ScrollTrigger (ex: "R$ 20Bi+ sob consultoria", "25k+ Clientes", "97 NPS").
   - Selo ANBIMA CEA integrado elegantemente com opacidade equilibrada.
4. **Sobre (A Conexão Humana)**:
   - Layout de duas colunas assimétrico.
   - Foto em reunião (à esquerda) com sombra champagne sutil e borda arredondada nobre.
   - Texto de história pessoal e experiência de mercado (à direita) detalhando sua atuação fiduciária na Portfel desde 2012.
5. **Metodologia (A Engenharia Prática)**:
   - Título centralizado: "Como funciona a consultoria?".
   - Em vez do gráfico horizontal estático gigante, a metodologia é revelada em **3 Passos Interativos**:
     - *Passo 1: Diagnóstico Profundo* (Card 1 em glassmorphism).
     - *Passo 2: Estratégia e Alocação* (Card 2 em glassmorphism).
     - *Passo 3: Acompanhamento Tático* (Card 3 em glassmorphism).
     - Cada passo é iluminado por um gradiente dourado sutil na borda conforme o usuário rola a tela (ScrollTrigger).
6. **Banner de Performance / Fechamento Comercial**:
   - Um layout amplo, simulando um gráfico de crescimento patrimonial dinâmico que se desenha na tela (animação SVG stroke do gráfico conforme o scroll).
   - Frase forte: "Alcance novos patamares de performance." acompanhado do botão principal "Solicitar Diagnóstico Financeiro".
7. **Footer**:
   - Seção clássica com logo minimalista, declaração fiduciária, links rápidos e conformidade jurídica / legal disclaimer.

---

## 5. Verification Method (Método de Verificação)

Para validar a implementação técnica feita pelo time de desenvolvimento com base neste relatório:

1. **Validação da Paleta de Cores e Estilos**:
   - Inspecionar a página no navegador (Chrome DevTools).
   - Verificar no painel de computados se as variáveis CSS de cores (`--bg-obsidian`, `--bg-obsidian-card`, `--text-cream-luxo`, `--accent-champagne`) correspondem aos valores hexadecimais propostos.
2. **Validação de Performance de Animações**:
   - Executar uma auditoria do **Lighthouse** no painel do navegador.
   - Garantir que as animações GSAP não reduzam o índice de performance para abaixo de 90 pontos.
   - Verificar se a métrica *Interaction to Next Paint (INP)* e *Cumulative Layout Shift (CLS)* permanecem na zona verde (estável), garantindo que as quebras de linha com `SplitType` não causem saltos de layout na renderização inicial.
3. **Validação da Inércia do Scroll**:
   - Rolar a página no trackpad ou roda do mouse para checar se a rolagem suave cinemática do Lenis/GSAP Smoother está ativa, eliminando o comportamento de parada brusca padrão do navegador.
4. **Validação de Responsividade Visual**:
   - Redimensionar a tela para dimensões mobile (`320px` a `768px`) e assegurar que as seções assimétricas e cartões com glassmorphism colapsem de forma harmoniosa, com tipografia legível e tamanhos escalados via `clamp()` no CSS.
