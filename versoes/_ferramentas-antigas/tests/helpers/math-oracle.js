/**
 * AUTHORITATIVE REFERENCE MATHEMATICAL ORACLE
 * Leonardo Arruda 2026+ E2E Testing Track
 * 
 * Fonte Autorizada: PROJECT.md & Survey 2 (Explorer 2 Report)
 */

/**
 * 1. Equação de Fisher para taxa real contínua/discreta:
 * r_real = (1 + r_nom) / (1 + i_inf) - 1
 */
function calculateRealRate(nominalRate, inflationRate) {
  if (inflationRate <= -1) {
    throw new Error('Inflação não pode ser <= -100%');
  }
  return ((1 + nominalRate) / (1 + inflationRate)) - 1;
}

/**
 * 2. Taxa real mensal equivalente por capitalização composta:
 * r_m = (1 + r_real)^(1/12) - 1
 */
function calculateMonthlyRate(annualRate) {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

/**
 * 3. Simulação de acumulação mês a mês:
 * P(m) = P(m-1) * (1 + rm) + PMT
 */
function calculateAccumulation(p0, pmtMonthly, realAnnualRate, months) {
  const rm = calculateMonthlyRate(realAnnualRate);
  let balance = p0;
  let totalInvested = p0;
  const timeline = [];

  for (let m = 0; m <= months; m++) {
    if (m > 0) {
      balance = (balance * (1 + rm)) + pmtMonthly;
      totalInvested += pmtMonthly;
    }
    timeline.push({
      month: m,
      balance: Math.round(balance),
      invested: Math.round(totalInvested),
      interest: Math.round(balance - totalInvested)
    });
  }

  return {
    finalBalance: Math.round(balance),
    totalInvested: Math.round(totalInvested),
    interestEarned: Math.round(balance - totalInvested),
    timeline
  };
}

/**
 * 4. Ponto de Soberania Financeira (Crossover Point):
 * P_soberano = (D_meta * 12) / SWR
 */
function calculateSovereignty(p0, pmtMonthly, realAnnualRate, targetMonthlyExpense, swrRate = 0.035, maxMonths = 600) {
  if (swrRate <= 0) throw new Error('SWR deve ser > 0');
  const rm = calculateMonthlyRate(realAnnualRate);
  const targetCapital = (targetMonthlyExpense * 12) / swrRate;

  let balance = p0;
  let sovereigntyMonth = null;

  for (let m = 0; m <= maxMonths; m++) {
    if (m > 0) {
      balance = (balance * (1 + rm)) + pmtMonthly;
    }
    if (sovereigntyMonth === null && balance >= targetCapital) {
      sovereigntyMonth = m;
      break;
    }
  }

  return {
    targetCapital: Math.round(targetCapital),
    sovereigntyMonth,
    sovereigntyYear: sovereigntyMonth !== null ? (sovereigntyMonth / 12).toFixed(1) : null,
    capitalAtSovereignty: Math.round(balance)
  };
}

/**
 * 5. Comparativo do Delta Fee-Based vs Tradicional (Fee Drag):
 * c_trad = 2.0% a.a., c_fee = 0.7% a.a.
 */
function compareFeeDrag(p0, pmtMonthly, grossNominalRate, inflationRate, feeTrad = 0.020, feePortfel = 0.007, months = 180) {
  const netNomTrad = Math.max(0, grossNominalRate - feeTrad);
  const netNomFee = Math.max(0, grossNominalRate - feePortfel);

  const realTrad = calculateRealRate(netNomTrad, inflationRate);
  const realFee = calculateRealRate(netNomFee, inflationRate);

  const accTrad = calculateAccumulation(p0, pmtMonthly, realTrad, months);
  const accFee = calculateAccumulation(p0, pmtMonthly, realFee, months);

  const finalTrad = accTrad.finalBalance;
  const finalFee = accFee.finalBalance;
  const feeDelta = finalFee - finalTrad;

  // Anos de liberdade ganhos: quantos meses o modelo tradicional precisa para atingir finalFee
  const rmTrad = calculateMonthlyRate(realTrad);
  let tempTrad = finalTrad;
  let mReach = months;
  const capMonths = months + (30 * 12);

  while (tempTrad < finalFee && mReach < capMonths) {
    mReach++;
    tempTrad = (tempTrad * (1 + rmTrad)) + pmtMonthly;
  }

  const yearsOfFreedomGained = Math.max(0, (mReach - months) / 12);

  return {
    finalTrad,
    finalFee,
    feeDelta,
    yearsOfFreedomGained: parseFloat(yearsOfFreedomGained.toFixed(1)),
    monthsDelta: mReach - months,
    realTrad,
    realFee
  };
}

/**
 * 6. Diagnóstico Raio-X: Algoritmo de Score Global (0-100)
 * S_global = round((D1 + D2 + D3 + D4 + D5) / 5)
 */
function calculateRaioXScore(d1, d2, d3, d4, d5) {
  const valid = [d1, d2, d3, d4, d5].every(v => typeof v === 'number' && v >= 0 && v <= 100);
  if (!valid) throw new Error('Scores dimensionais devem estar entre 0 e 100');
  const overall = Math.round((d1 + d2 + d3 + d4 + d5) / 5);
  return {
    d1, d2, d3, d4, d5,
    overallScore: overall
  };
}

/**
 * 7. Taxonomia dos 5 Arquétipos de Investidor:
 * - Soberano Blindado
 * - Construtor Exposto
 * - Patriarca Tradicionalista
 * - Acumulador Ineficiente
 * - Estrategista em Transição
 */
function determineArchetype(d1, d2, d3, d4, d5) {
  const { overallScore: s } = calculateRaioXScore(d1, d2, d3, d4, d5);

  if (s >= 85 && d1 >= 70 && d2 >= 70 && d3 >= 70 && d4 >= 70 && d5 >= 70) {
    return {
      id: 'soberano',
      name: 'O Soberano Blindado',
      badge: 'Top 1% de Governança',
      color: '#1CD98A'
    };
  }

  if (d4 <= 45 && d1 <= 40) {
    return {
      id: 'construtor',
      name: 'O Construtor Exposto',
      badge: 'Risco de Execução Jurídica',
      color: '#E4572E'
    };
  }

  if (d3 <= 35 && d1 <= 40) {
    return {
      id: 'patriarca',
      name: 'O Patriarca Tradicionalista',
      badge: 'Gargalo Sucessório Crítico',
      color: '#F2B705'
    };
  }

  if (d5 <= 35 && d2 <= 50) {
    return {
      id: 'acumulador',
      name: 'O Acumulador Ineficiente',
      badge: 'Erosão Silenciosa de Comissões',
      color: '#6B66E8'
    };
  }

  return {
    id: 'estrategista',
    name: 'O Estrategista em Transição',
    badge: 'Falta de Método Unificado',
    color: '#3B36CC'
  };
}

/**
 * 8. Identificação dos 2 maiores gargalos patrimoniais:
 */
function determineBottlenecks(d1, d2, d3, d4, d5) {
  const list = [
    { key: 'D1', name: 'Alocação Global & Offshore', score: d1 },
    { key: 'D2', name: 'Eficiência Tributária', score: d2 },
    { key: 'D3', name: 'Planejamento Sucessório', score: d3 },
    { key: 'D4', name: 'Liquidez & Cauda', score: d4 },
    { key: 'D5', name: 'Alinhamento Fiduciário', score: d5 }
  ];

  list.sort((a, b) => a.score - b.score);
  return list.slice(0, 2);
}

/**
 * 9. Geometria Analítica do Gráfico de Radar Pentagonal de 5 Eixos:
 * Ângulo base: -90° (topo vertical). Espaçamento: 72° (2*PI/5).
 */
function generateRadarPoints(d1, d2, d3, d4, d5, cx = 200, cy = 200, rMax = 135) {
  const scores = [d1, d2, d3, d4, d5];
  return scores.map((val, idx) => {
    const angle = -Math.PI / 2 + (idx * (2 * Math.PI / 5));
    const r = rMax * (val / 100);
    const x = cx + (r * Math.cos(angle));
    const y = cy + (r * Math.sin(angle));
    return {
      index: idx,
      score: val,
      angleRad: angle,
      x: parseFloat(x.toFixed(1)),
      y: parseFloat(y.toFixed(1)),
      svgCoord: `${x.toFixed(1)},${y.toFixed(1)}`
    };
  });
}

module.exports = {
  calculateRealRate,
  calculateMonthlyRate,
  calculateAccumulation,
  calculateSovereignty,
  compareFeeDrag,
  calculateRaioXScore,
  determineArchetype,
  determineBottlenecks,
  generateRadarPoints
};
