const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. SERVICES
const descMap = {
  'Carteira de Investimentos': 'Gestão ativa e alocação estruturada.',
  'Fundo Exclusivo': 'Eficiência tributária e sucessória.',
  'Fundo Exclusivo de Previdência': 'Benefícios fiscais focados no longo prazo.',
  'Financiamento Imobiliário': 'Acesso a capital com taxas otimizadas.',
  
  'Previdência Privada': 'Planejamento de aposentadoria blindado.',
  'Pan American Seguros': 'Proteção internacional de alto padrão.',
  'Seguros de Vida': 'Liquidez imediata na sucessão.',
  // one duplicate, skip replacing specifically if handled generically
  
  'Holding Patrimonial': 'Blindagem e sucessão em vida.',
  'Holding Offshore': 'Proteção e diversificação global.',
  'Unit Linked': 'Investimento no exterior com seguro.',
  'Proteção p/ Exportações e Importações': 'Hedge cambial e mitigação de riscos.',
  
  'Private Banking': 'Acesso a mesas exclusivas.',
  'Concierge': 'Gestão de estilo de vida e facilitadores.',
  'M&A - Fusões e Aquisições': 'Assessoria ponta a ponta para negócios.',
  'Estruturação de Recebíveis': 'Otimização do fluxo de caixa empresarial.'
};

for (const [name, desc] of Object.entries(descMap)) {
  const regex = new RegExp((<div class="svc-item-name">\\s*\\s*<\\/div>), 'gi');
  html = html.replace(regex, \\\n              <div style="font-family:var(--s);font-size:12.5px;color:var(--sub);margin-top:2px;font-weight:300"></div>);
}

// 2. MARQUEE INSTITUICOES
const oldInst = <div data-reveal data-reveal-delay=".1" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:56px;opacity:.5">
      <img src="midias/bancos parceiros/btg-pactual-nome-.svg" alt="BTG Pactual" style="height:28px;filter:brightness(0) invert(1);object-fit:contain">
      <img src="midias/bancos parceiros/xp-investimentos-logo.svg" alt="XP Investimentos" style="height:32px;filter:brightness(0) invert(1);object-fit:contain">
      <img src="midias/bancos parceiros/logo-safra.svg" alt="Safra" style="height:26px;filter:brightness(0) invert(1);object-fit:contain">
      <img src="midias/bancos parceiros/morganstanley.webp" alt="Morgan Stanley" style="height:24px;filter:brightness(0) invert(1);object-fit:contain">
      <img src="midias/bancos parceiros/inter.svg" alt="Inter" style="height:26px;filter:brightness(0) invert(1);object-fit:contain">
      <img src="midias/bancos parceiros/logo-new-avenue.svg" alt="Avenue" style="height:24px;filter:brightness(0) invert(1);object-fit:contain">
      <img src="midias/bancos parceiros/nomad.webp" alt="Nomad" style="height:24px;filter:brightness(0) invert(1);object-fit:contain">
    </div>;

const newInst = <style>
@keyframes scrollMarquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-wrapper {
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  position: relative;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  margin-top: 40px;
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: scrollMarquee 30s linear infinite;
  gap: 100px;
  align-items: center;
  padding: 20px 0;
}
.marquee-track img {
  height: 44px;
  filter: brightness(0) invert(1);
  object-fit: contain;
  opacity: 0.5;
  transition: opacity 0.3s;
}
.marquee-track img:hover {
  opacity: 1;
}
</style>
    <div class="marquee-wrapper">
      <div class="marquee-track">
        <!-- Conjunto 1 -->
        <img src="midias/bancos parceiros/btg-pactual-nome-.svg" alt="BTG Pactual">
        <img src="midias/bancos parceiros/xp-investimentos-logo.svg" alt="XP Investimentos" style="height:48px">
        <img src="midias/bancos parceiros/logo-safra.svg" alt="Safra" style="height:36px">
        <img src="midias/bancos parceiros/morganstanley.webp" alt="Morgan Stanley" style="height:36px">
        <img src="midias/bancos parceiros/inter.svg" alt="Inter" style="height:36px">
        <img src="midias/bancos parceiros/logo-new-avenue.svg" alt="Avenue" style="height:36px">
        <img src="midias/bancos parceiros/nomad.webp" alt="Nomad" style="height:36px">
        <!-- Conjunto 2 (Cópia exata) -->
        <img src="midias/bancos parceiros/btg-pactual-nome-.svg" alt="BTG Pactual">
        <img src="midias/bancos parceiros/xp-investimentos-logo.svg" alt="XP Investimentos" style="height:48px">
        <img src="midias/bancos parceiros/logo-safra.svg" alt="Safra" style="height:36px">
        <img src="midias/bancos parceiros/morganstanley.webp" alt="Morgan Stanley" style="height:36px">
        <img src="midias/bancos parceiros/inter.svg" alt="Inter" style="height:36px">
        <img src="midias/bancos parceiros/logo-new-avenue.svg" alt="Avenue" style="height:36px">
        <img src="midias/bancos parceiros/nomad.webp" alt="Nomad" style="height:36px">
      </div>
    </div>;

html = html.replace(oldInst, newInst);

// 3. METODO (ACCORDION)
const metodoRegex = /<div data-reveal id="met-section" style="position:relative">[\s\S]*?<\/div>\s*<\/div>\s*<!-- BOTTOM STRIP/g;

const newMetodo = <style>
.met-accordion {
  display: flex;
  height: 440px;
  gap: 16px;
  width: 100%;
}
.met-card {
  flex: 1;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
}
.met-card:hover {
  flex: 4;
}

.met-card-closed {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-rl;
  transform: scale(-1);
  padding: 30px;
  font-family: var(--d);
  font-size: 24px;
  color: #04020C;
  white-space: nowrap;
  transition: opacity 0.4s;
}
.met-card:hover .met-card-closed {
  opacity: 0;
  pointer-events: none;
}

.met-card-open {
  position: absolute;
  inset: 0;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  background: #fff;
  min-width: 400px;
}
.met-card:hover .met-card-open {
  opacity: 1;
  pointer-events: auto;
  transition-delay: 0.2s;
}
.met-card-open h3 {
  font-family: var(--d);
  font-size: 42px;
  color: #04020C;
  margin-bottom: 20px;
  line-height: 1.0;
  font-weight: 400;
}
.met-card-open p {
  font-family: var(--s);
  font-size: 16px;
  line-height: 1.7;
  color: #444;
  font-weight: 300;
}
.met-card-num {
  font-family: var(--m);
  font-size: 12px;
  letter-spacing: .2em;
  color: var(--vio2);
  margin-bottom: 20px;
  text-transform: uppercase;
}
@media(max-width: 900px) {
  .met-accordion { flex-direction: column; height: 700px; }
  .met-card-closed { writing-mode: horizontal-tb; transform: none; font-size: 20px; }
  .met-card-open { padding: 30px; min-width: 0; }
}
</style>
    <div data-reveal class="met-accordion">
      
      <!-- CARD 1 -->
      <div class="met-card">
        <div class="met-card-closed">01 · Diagnóstico</div>
        <div class="met-card-open">
          <div class="met-card-num">01 · Diagnóstico</div>
          <h3>Entender antes<br>de agir.</h3>
          <p>Levantamento completo do patrimônio atual, objetivos de vida, perfil de risco e horizonte de tempo. Sem achismos. Com perguntas certas. A maioria das carteiras erradas começa aqui — no diagnóstico que nunca aconteceu.</p>
        </div>
      </div>

      <!-- CARD 2 -->
      <div class="met-card">
        <div class="met-card-closed">02 · Estratégia</div>
        <div class="met-card-open">
          <div class="met-card-num">02 · Estratégia</div>
          <h3>Estruturar com<br>inteligência.</h3>
          <p>Alocação personalizada alinhada aos seus objetivos reais — não aos produtos do banco. Acesso ao ecossistema completo da Portfel: fundos exclusivos, estruturas offshore e soluções que as agências não oferecem.</p>
        </div>
      </div>

      <!-- CARD 3 -->
      <div class="met-card">
        <div class="met-card-closed">03 · Acompanhamento</div>
        <div class="met-card-open">
          <div class="met-card-num">03 · Acompanhamento</div>
          <h3>Presença contínua.<br>Sem interrupção.</h3>
          <p>Revisões periódicas, ajustes conforme o cenário econômico e acesso direto ao consultor quando você precisar. Uma parceria construída para durar décadas — não uma venda pontual com meta de trimestre.</p>
        </div>
      </div>

    </div>

    <!-- BOTTOM STRIP;

html = html.replace(metodoRegex, newMetodo);

// Remove the obsolete script for the timeline connector
const scriptRegex = /<script>\s*\(\s*function\(\)\{\s*\/\/\s*Animar linha conectora[\s\S]*?\}\)\(\);\s*<\/script>/g;
html = html.replace(scriptRegex, '');

fs.writeFileSync('index.html', html);
console.log("Done");
