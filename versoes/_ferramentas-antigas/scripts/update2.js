const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const items = [
  ['Carteira de Investimentos', 'Gestão ativa e alocação estruturada.'],
  ['Fundo Exclusivo', 'Eficiência tributária e sucessória.'],
  ['Fundo Exclusivo de Previdência', 'Benefícios fiscais focados no longo prazo.'],
  ['Financiamento Imobiliário', 'Acesso a capital com taxas otimizadas.'],
  ['Previdência Privada', 'Planejamento de aposentadoria blindado.'],
  ['Pan American Seguros', 'Proteção internacional de alto padrão.'],
  ['Seguros de Vida', 'Liquidez imediata na sucessão.'],
  ['Holding Patrimonial', 'Blindagem e sucessão em vida.'],
  ['Holding Offshore', 'Proteção e diversificação global.'],
  ['Unit Linked', 'Investimento no exterior com seguro.'],
  ['Proteção p/ Exportações e Importações', 'Hedge cambial e mitigação de riscos.'],
  ['Private Banking', 'Acesso a mesas exclusivas.'],
  ['Concierge', 'Gestão de estilo de vida e facilitadores.'],
  ['M&A - Fusões e Aquisições', 'Assessoria ponta a ponta para negócios.'],
  ['Estruturação de Recebíveis', 'Otimização do fluxo de caixa empresarial.']
];

for (const item of items) {
  const name = item[0];
  const desc = item[1];
  const parts = html.split('<div class=\"svc-item-name\">' + name + '</div>');
  if(parts.length > 1) {
    html = parts.join('<div class=\"svc-item-name\">' + name + '</div>\n              <div style=\"font-family:var(--s);font-size:12.5px;color:var(--sub);margin-top:4px;font-weight:300\">' + desc + '</div>');
  }
}
fs.writeFileSync('index.html', html, 'utf8');
console.log('done');