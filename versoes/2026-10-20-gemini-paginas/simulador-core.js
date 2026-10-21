/**
 * ==============================================================================
 * LEONARDO ARRUDA — SIMULADOR CORE QUANTITATIVO (2026+)
 * Motor Determinístico de Soberania Financeira, Equação de Fisher & Fee Drag
 * ==============================================================================
 * Paradigma: Client-Side Determinístico de Alta Performance (Zero-deps runtime)
 * Conformidade: PROJECT.md § Interface Contracts, Explorer 2 Report, TEST_INFRA.md
 * ==============================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var instance = factory();
    root.OutlierSimulador = instance;
    if (typeof window !== 'undefined') {
      window.OutlierSimulador = instance;
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  /**
   * 1. Equação de Fisher para taxa real contínua/discreta:
   * r_real = (1 + r_nom) / (1 + i_inf) - 1
   *
   * @param {number} nominalRate - Taxa anual nominal decimal (ex: 0.115 para 11,5%)
   * @param {number} inflationRate - Taxa anual de inflação decimal (ex: 0.045 para 4,5%)
   * @returns {number} Taxa real anual decimal
   */
  function calculateRealReturn(nominalRate, inflationRate) {
    if (inflationRate <= -1) {
      throw new Error('Inflação não pode ser <= -100%');
    }
    return ((1 + nominalRate) / (1 + inflationRate)) - 1;
  }

  // Alias para paridade completa com math-oracle
  var calculateRealRate = calculateRealReturn;

  /**
   * 2. Taxa real mensal equivalente por capitalização composta:
   * r_m = (1 + r_real)^(1/12) - 1
   *
   * @param {number} annualRate - Taxa anual decimal
   * @returns {number} Taxa mensal decimal equivalente
   */
  function calculateMonthlyRate(annualRate) {
    return Math.pow(1 + annualRate, 1 / 12) - 1;
  }

  /**
   * 3. Simulação mensal discreta de acumulação composta:
   * P(m) = P(m-1) * (1 + rm) + PMT
   *
   * Retorna um Array de pontos que também possui as propriedades de resumo:
   * finalBalance, totalInvested, interestEarned, timeline (auto-referência).
   *
   * @param {number} p0 - Patrimônio inicial (R$)
   * @param {number} pmtMonthly - Aporte mensal (R$)
   * @param {number} realAnnualRate - Taxa real anual decimal
   * @param {number} months - Total de meses de acumulação
   * @returns {Array<{month: number, balance: number, invested: number, interest: number}>}
   */
  function calculateAccumulation(p0, pmtMonthly, realAnnualRate, months) {
    var p0Clean = Math.max(0, Number(p0) || 0);
    var pmtClean = Math.max(0, Number(pmtMonthly) || 0);
    var monthsClean = Math.max(0, Math.round(Number(months) || 0));

    var rm = calculateMonthlyRate(realAnnualRate);
    var balance = p0Clean;
    var totalInvested = p0Clean;
    var timeline = [];

    for (var m = 0; m <= monthsClean; m++) {
      if (m > 0) {
        balance = (balance * (1 + rm)) + pmtClean;
        totalInvested += pmtClean;
      }
      timeline.push({
        month: m,
        balance: Math.round(balance),
        invested: Math.round(totalInvested),
        interest: Math.round(balance - totalInvested)
      });
    }

    timeline.finalBalance = Math.round(balance);
    timeline.totalInvested = Math.round(totalInvested);
    timeline.interestEarned = Math.round(balance - totalInvested);
    timeline.timeline = timeline;

    return timeline;
  }

  /**
   * 4. Ponto de Crossover do Ano da Soberania Financeira via SWR (Safe Withdrawal Rate):
   * P_soberano = (D_meta * 12) / SWR
   *
   * @param {number} p0 - Patrimônio inicial (R$)
   * @param {number} pmtMonthly - Aporte mensal (R$)
   * @param {number} realAnnualRate - Taxa real anual decimal
   * @param {number} targetMonthlyExpense - Despesa mensal desejada na aposentadoria (R$)
   * @param {number} [swrRate=0.035] - Taxa segura de retirada (calibrada em 3.5%)
   * @param {number} [maxMonths=600] - Limite de busca em meses (50 anos)
   * @returns {{targetCapital: number, sovereigntyMonth: number|null, sovereigntyYear: string|null, capitalAtSovereignty: number}}
   */
  function calculateSovereigntyYear(p0, pmtMonthly, realAnnualRate, targetMonthlyExpense, swrRate, maxMonths) {
    var swr = (typeof swrRate === 'number' && swrRate > 0) ? swrRate : 0.035;
    var maxM = (typeof maxMonths === 'number' && maxMonths > 0) ? maxMonths : 600;

    var p0Clean = Math.max(0, Number(p0) || 0);
    var pmtClean = Math.max(0, Number(pmtMonthly) || 0);
    var targetExpense = Math.max(0, Number(targetMonthlyExpense) || 0);

    var rm = calculateMonthlyRate(realAnnualRate);
    var targetCapital = (targetExpense * 12) / swr;

    var balance = p0Clean;
    var sovereigntyMonth = null;

    for (var m = 0; m <= maxM; m++) {
      if (m > 0) {
        balance = (balance * (1 + rm)) + pmtClean;
      }
      if (sovereigntyMonth === null && balance >= targetCapital) {
        sovereigntyMonth = m;
        break;
      }
    }

    return {
      targetCapital: Math.round(targetCapital),
      sovereigntyMonth: sovereigntyMonth,
      sovereigntyYear: sovereigntyMonth !== null ? (sovereigntyMonth / 12).toFixed(1) : null,
      capitalAtSovereignty: Math.round(balance)
    };
  }

  var calculateSovereignty = calculateSovereigntyYear;

  /**
   * 5. Comparativo Determinístico de Fee Drag (Modelo Tradicional vs Fee-Based Portfel):
   *
   * @param {number} p0 - Patrimônio inicial (R$)
   * @param {number} pmtMonthly - Aporte mensal (R$)
   * @param {number} grossNominalRate - Taxa nominal bruta anual (ex: 0.115)
   * @param {number} inflationRate - Inflação anual IPCA (ex: 0.045)
   * @param {number} [feeTrad=0.020] - Custo modelo tradicional (ex: 2.0% a.a.)
   * @param {number} [feePortfel=0.007] - Custo consultoria Fee-Based (ex: 0.7% a.a.)
   * @param {number} [months=180] - Período de acumulação em meses (15 anos = 180)
   * @returns {{finalTrad: number, finalFee: number, balanceTrad: number, balancePortfel: number, feeDelta: number, yearsOfFreedomGained: number, monthsDelta: number, realTrad: number, realFee: number}}
   */
  function compareFeeDrag(p0, pmtMonthly, grossNominalRate, inflationRate, feeTrad, feePortfel, months) {
    var cTrad = typeof feeTrad === 'number' ? feeTrad : 0.020;
    var cFee = typeof feePortfel === 'number' ? feePortfel : 0.007;
    var totalMonths = typeof months === 'number' ? Math.round(months) : 180;

    var netNomTrad = Math.max(0, grossNominalRate - cTrad);
    var netNomFee = Math.max(0, grossNominalRate - cFee);

    var realTrad = calculateRealRate(netNomTrad, inflationRate);
    var realFee = calculateRealRate(netNomFee, inflationRate);

    var accTrad = calculateAccumulation(p0, pmtMonthly, realTrad, totalMonths);
    var accFee = calculateAccumulation(p0, pmtMonthly, realFee, totalMonths);

    var finalTrad = accTrad.finalBalance;
    var finalFee = accFee.finalBalance;
    var feeDelta = finalFee - finalTrad;

    // Anos de liberdade ganhos: quantos meses o modelo tradicional precisa para atingir finalFee
    var rmTrad = calculateMonthlyRate(realTrad);
    var tempTrad = finalTrad;
    var mReach = totalMonths;
    var capMonths = totalMonths + (30 * 12);

    while (tempTrad < finalFee && mReach < capMonths) {
      mReach++;
      tempTrad = (tempTrad * (1 + rmTrad)) + pmtMonthly;
    }

    var yearsOfFreedomGained = Math.max(0, (mReach - totalMonths) / 12);

    return {
      finalTrad: finalTrad,
      finalFee: finalFee,
      balanceTrad: finalTrad,
      balancePortfel: finalFee,
      feeDelta: feeDelta,
      yearsOfFreedomGained: parseFloat(yearsOfFreedomGained.toFixed(1)),
      monthsDelta: mReach - totalMonths,
      realTrad: realTrad,
      realFee: realFee
    };
  }

  /**
   * 6. Simulação Completa Unificada (Helper para UI e Analytics)
   */
  function simulate(params) {
    params = params || {};
    var p0 = typeof params.p0 === 'number' ? params.p0 : 500000;
    var pmt = typeof params.pmt === 'number' ? params.pmt : 10000;
    var years = typeof params.years === 'number' ? params.years : 15;
    var rNom = typeof params.rNom === 'number' ? params.rNom : 0.115;
    var iInf = typeof params.iInf === 'number' ? params.iInf : 0.045;
    var despesaMeta = typeof params.despesaMeta === 'number' ? params.despesaMeta : 25000;
    var swr = typeof params.swr === 'number' ? params.swr : 0.035;
    var cTrad = typeof params.cTrad === 'number' ? params.cTrad : 0.020;
    var cFee = typeof params.cFee === 'number' ? params.cFee : 0.007;

    var months = years * 12;

    var netNomTrad = Math.max(0, rNom - cTrad);
    var netNomFee = Math.max(0, rNom - cFee);

    var realTrad = calculateRealRate(netNomTrad, iInf);
    var realFee = calculateRealRate(netNomFee, iInf);

    var accTrad = calculateAccumulation(p0, pmt, realTrad, months);
    var accFee = calculateAccumulation(p0, pmt, realFee, months);

    var sov = calculateSovereigntyYear(p0, pmt, realFee, despesaMeta, swr, 600);
    var drag = compareFeeDrag(p0, pmt, rNom, iInf, cTrad, cFee, months);

    var rendaMensalSWR = (accFee.finalBalance * swr) / 12;
    var rmFee = calculateMonthlyRate(realFee);
    var rendaMensalPerpetua = accFee.finalBalance * rmFee;

    return {
      p0: p0,
      pmt: pmt,
      years: years,
      months: months,
      rNom: rNom,
      iInf: iInf,
      despesaMeta: despesaMeta,
      swr: swr,
      cTrad: cTrad,
      cFee: cFee,
      realFee: realFee,
      realTrad: realTrad,
      patrimonioFinalFee: accFee.finalBalance,
      patrimonioFinalTrad: accTrad.finalBalance,
      totalAportado: accFee.totalInvested,
      jurosGanhos: accFee.interestEarned,
      vantagemFeeBased: drag.feeDelta,
      anosGanhosDeVida: drag.yearsOfFreedomGained,
      patrimonioSoberania: sov.targetCapital,
      sovereigntyMonth: sov.sovereigntyMonth,
      sovereigntyYear: sov.sovereigntyYear,
      rendaMensalSWR: Math.round(rendaMensalSWR),
      rendaMensalPerpetua: Math.round(rendaMensalPerpetua),
      timelineFee: accFee,
      timelineTrad: accTrad
    };
  }

  // ==============================================================================
  // MOTOR DE RENDERIZAÇÃO GRÁFICA VIVA (CANVAS 2D ULTRA-SHARP / RETINA READY)
  // ==============================================================================

  /**
   * Componente Gráfico Interativo com Scrubbing Tátil e Animações Fluidas
   */
  function InteractiveSimulationChart(canvasElement, tooltipElement) {
    this.canvas = canvasElement;
    this.tooltip = tooltipElement;
    this.ctx = canvasElement && canvasElement.getContext ? canvasElement.getContext('2d') : null;
    this.currentData = null;
    this.hoverMonth = null;
    this.isHovering = false;

    if (this.canvas && this.ctx) {
      this.initEvents();
    }
  }

  InteractiveSimulationChart.prototype.formatCurrencyCompact = function (val) {
    if (Math.abs(val) >= 1e6) {
      return 'R$ ' + (val / 1e6).toFixed(1).replace('.0', '').replace('.', ',') + 'M';
    }
    if (Math.abs(val) >= 1e3) {
      return 'R$ ' + (val / 1e3).toFixed(0) + 'k';
    }
    return 'R$ ' + Math.round(val);
  };

  InteractiveSimulationChart.prototype.formatCurrencyFull = function (val) {
    try {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
    } catch (e) {
      return 'R$ ' + Math.round(val).toLocaleString('pt-BR');
    }
  };

  InteractiveSimulationChart.prototype.initEvents = function () {
    var self = this;
    var canvas = this.canvas;

    function handlePointer(clientX, clientY) {
      if (!self.currentData) return;
      var rect = canvas.getBoundingClientRect();
      var x = clientX - rect.left;
      var y = clientY - rect.top;

      var paddingLeft = 70;
      var paddingRight = 30;
      var chartWidth = rect.width - paddingLeft - paddingRight;

      if (x < paddingLeft || x > rect.width - paddingRight) {
        self.isHovering = false;
        self.hoverMonth = null;
        if (self.tooltip) self.tooltip.style.opacity = '0';
        self.render();
        return;
      }

      var ratio = Math.max(0, Math.min(1, (x - paddingLeft) / chartWidth));
      var totalMonths = self.currentData.months;
      var month = Math.round(ratio * totalMonths);
      self.hoverMonth = month;
      self.isHovering = true;
      self.render();

      if (self.tooltip) {
        var ptFee = self.currentData.timelineFee[month] || { balance: 0, invested: 0 };
        var ptTrad = self.currentData.timelineTrad[month] || { balance: 0 };
        var delta = ptFee.balance - ptTrad.balance;
        var anoStr = (month / 12).toFixed(1) + ' anos (mês ' + month + ')';

        self.tooltip.innerHTML = [
          '<div style="font-family:var(--m);font-size:10px;color:var(--sub);margin-bottom:6px;letter-spacing:.08em;text-transform:uppercase">Tempo: ' + anoStr + '</div>',
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:3px">',
          '  <span style="color:var(--grn);font-family:var(--m);font-size:12px;font-weight:600">● Consultoria Portfel:</span>',
          '  <span style="color:#fff;font-family:var(--m);font-size:12px;font-weight:600">' + self.formatCurrencyFull(ptFee.balance) + '</span>',
          '</div>',
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:3px">',
          '  <span style="color:var(--vio2);font-family:var(--m);font-size:11px">● Banco Comum:</span>',
          '  <span style="color:var(--mut);font-family:var(--m);font-size:11px">' + self.formatCurrencyFull(ptTrad.balance) + '</span>',
          '</div>',
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;padding-top:4px;border-top:1px solid rgba(255,255,255,.08)">',
          '  <span style="color:var(--txt);font-family:var(--m);font-size:11px">✦ Delta Ganho:</span>',
          '  <span style="color:var(--grn);font-family:var(--m);font-size:11px;font-weight:600">+' + self.formatCurrencyFull(delta) + '</span>',
          '</div>'
        ].join('\n');

        var ttWidth = 240;
        var ttX = x - (ttWidth / 2);
        if (ttX < 10) ttX = 10;
        if (ttX + ttWidth > rect.width - 10) ttX = rect.width - ttWidth - 10;

        self.tooltip.style.left = ttX + 'px';
        self.tooltip.style.top = Math.max(10, y - 110) + 'px';
        self.tooltip.style.opacity = '1';
      }
    }

    canvas.addEventListener('mousemove', function (e) {
      handlePointer(e.clientX, e.clientY);
    });

    canvas.addEventListener('mouseleave', function () {
      self.isHovering = false;
      self.hoverMonth = null;
      if (self.tooltip) self.tooltip.style.opacity = '0';
      self.render();
    });

    canvas.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    canvas.addEventListener('touchend', function () {
      self.isHovering = false;
      self.hoverMonth = null;
      if (self.tooltip) self.tooltip.style.opacity = '0';
      self.render();
    });
  };

  InteractiveSimulationChart.prototype.setData = function (simResult) {
    this.currentData = simResult;
    this.render();
  };

  InteractiveSimulationChart.prototype.render = function () {
    if (!this.canvas || !this.ctx || !this.currentData) return;

    var canvas = this.canvas;
    var ctx = this.ctx;
    var data = this.currentData;

    // Retina display scaling
    var dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    var rect = canvas.getBoundingClientRect();
    var width = rect.width || canvas.width || 700;
    var height = rect.height || canvas.height || 360;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    var paddingLeft = 70;
    var paddingRight = 30;
    var paddingTop = 36;
    var paddingBottom = 40;

    var chartW = width - paddingLeft - paddingRight;
    var chartH = height - paddingTop - paddingBottom;

    if (chartW <= 10 || chartH <= 10) {
      ctx.restore();
      return;
    }

    // Identificar valor máximo para escala Y
    var maxVal = Math.max(
      data.patrimonioFinalFee,
      data.patrimonioFinalTrad,
      data.patrimonioSoberania || 0,
      100000
    ) * 1.12;

    var months = data.months;
    var timelineFee = data.timelineFee;
    var timelineTrad = data.timelineTrad;

    function getX(m) {
      return paddingLeft + (m / months) * chartW;
    }

    function getY(val) {
      return paddingTop + chartH - (val / maxVal) * chartH;
    }

    // 1. Grid horizontal e rótulos do eixo Y
    var gridSteps = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#524E6A';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (var i = 0; i <= gridSteps; i++) {
      var stepVal = (maxVal / gridSteps) * i;
      var yPos = getY(stepVal);
      ctx.beginPath();
      ctx.moveTo(paddingLeft, yPos);
      ctx.lineTo(width - paddingRight, yPos);
      ctx.stroke();

      ctx.fillText(this.formatCurrencyCompact(stepVal), paddingLeft - 10, yPos);
    }
    ctx.setLineDash([]);

    // 2. Rótulos do eixo X (Anos)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    var yearInterval = data.years <= 10 ? 2 : (data.years <= 20 ? 5 : 10);
    for (var yr = 0; yr <= data.years; yr += yearInterval) {
      var m = yr * 12;
      if (m > months) m = months;
      var xPos = getX(m);
      ctx.fillText(yr + 'a', xPos, paddingTop + chartH + 12);
    }

    // 3. Linha Horizontal da Soberania Financeira (P_soberano)
    if (data.patrimonioSoberania && data.patrimonioSoberania <= maxVal * 1.05) {
      var sovY = getY(data.patrimonioSoberania);
      ctx.strokeStyle = '#F2B705';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(paddingLeft, sovY);
      ctx.lineTo(width - paddingRight, sovY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Badge indicador na linha de soberania
      ctx.fillStyle = 'rgba(242, 183, 5, 0.16)';
      ctx.fillRect(width - paddingRight - 150, sovY - 22, 150, 18);
      ctx.strokeStyle = 'rgba(242, 183, 5, 0.4)';
      ctx.strokeRect(width - paddingRight - 150, sovY - 22, 150, 18);
      ctx.fillStyle = '#F2B705';
      ctx.font = '9.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Meta Soberania (' + this.formatCurrencyCompact(data.patrimonioSoberania) + ')', width - paddingRight - 75, sovY - 13);
    }

    // 4. Área sombreada dos aportes brutos (Total Investido)
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(timelineFee[0].invested));
    for (var step = 1; step <= months; step++) {
      ctx.lineTo(getX(step), getY(timelineFee[step].invested));
    }
    ctx.lineTo(getX(months), paddingTop + chartH);
    ctx.lineTo(getX(0), paddingTop + chartH);
    ctx.closePath();

    var gradInvested = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH);
    gradInvested.addColorStop(0, 'rgba(82, 78, 106, 0.25)');
    gradInvested.addColorStop(1, 'rgba(82, 78, 106, 0.02)');
    ctx.fillStyle = gradInvested;
    ctx.fill();

    // 5. Curva 1: Modelo Tradicional (Comissionado / Roxo Violeta)
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(timelineTrad[0].balance));
    for (var stepT = 1; stepT <= months; stepT++) {
      ctx.lineTo(getX(stepT), getY(timelineTrad[stepT].balance));
    }
    ctx.strokeStyle = 'rgba(107, 102, 232, 0.65)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 6. Área sombreada entre Fee e Tradicional (Delta Vantagem)
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(timelineFee[0].balance));
    for (var stepF = 1; stepF <= months; stepF++) {
      ctx.lineTo(getX(stepF), getY(timelineFee[stepF].balance));
    }
    for (var stepB = months; stepB >= 0; stepB--) {
      ctx.lineTo(getX(stepB), getY(timelineTrad[stepB].balance));
    }
    ctx.closePath();
    var gradDelta = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH);
    gradDelta.addColorStop(0, 'rgba(28, 217, 138, 0.20)');
    gradDelta.addColorStop(1, 'rgba(28, 217, 138, 0.02)');
    ctx.fillStyle = gradDelta;
    ctx.fill();

    // 7. Curva 2: Modelo Fee-Based (Portfel / Esmeralda Neon Vibrante)
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(timelineFee[0].balance));
    for (var stepMain = 1; stepMain <= months; stepMain++) {
      ctx.lineTo(getX(stepMain), getY(timelineFee[stepMain].balance));
    }
    ctx.strokeStyle = '#1CD98A';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(28, 217, 138, 0.5)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset glow

    // 8. Crossover Point (Marcador de Soberania atingida)
    if (data.sovereigntyMonth !== null && data.sovereigntyMonth <= months) {
      var sovMonth = data.sovereigntyMonth;
      var sovPtX = getX(sovMonth);
      var sovPtY = getY(timelineFee[sovMonth].balance);

      // Círculo concêntrico de pulso
      ctx.beginPath();
      ctx.arc(sovPtX, sovPtY, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(28, 217, 138, 0.3)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sovPtX, sovPtY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#1CD98A';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Rótulo flutuante sobre a linha da liberdade
      ctx.fillStyle = 'rgba(4, 2, 12, 0.9)';
      ctx.fillRect(sovPtX - 52, sovPtY - 30, 104, 20);
      ctx.strokeStyle = '#1CD98A';
      ctx.lineWidth = 1;
      ctx.strokeRect(sovPtX - 52, sovPtY - 30, 104, 20);
      ctx.fillStyle = '#EDE8D5';
      ctx.font = '9.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Liberdade: ' + (sovMonth / 12).toFixed(1) + 'a', sovPtX, sovPtY - 20);
    }

    // 9. Linha de Scrubbing tátil do cursor
    if (this.isHovering && this.hoverMonth !== null && this.hoverMonth <= months) {
      var hM = this.hoverMonth;
      var hX = getX(hM);
      var hYFee = getY(timelineFee[hM].balance);
      var hYTrad = getY(timelineTrad[hM].balance);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hX, paddingTop);
      ctx.lineTo(hX, paddingTop + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ponto Fee
      ctx.beginPath();
      ctx.arc(hX, hYFee, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#1CD98A';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Ponto Tradicional
      ctx.beginPath();
      ctx.arc(hX, hYTrad, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6B66E8';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  };

  // ==============================================================================
  // UI CONTROLLER & TWO-WAY BINDING
  // ==============================================================================

  /**
   * Conecta controles HTML, sliders, pills e HUD de telemetria
   */
  function initSimulationUI(options) {
    if (typeof document === 'undefined') return;
    options = options || {};

    var els = {
      p0Slider: document.getElementById('slider-p0'),
      p0Display: document.getElementById('disp-p0'),
      pmtSlider: document.getElementById('slider-pmt'),
      pmtDisplay: document.getElementById('disp-pmt'),
      anosSlider: document.getElementById('slider-anos'),
      anosDisplay: document.getElementById('disp-anos'),
      rnomSlider: document.getElementById('slider-rnom'),
      rnomDisplay: document.getElementById('disp-rnom'),
      iinfSlider: document.getElementById('slider-iinf'),
      iinfDisplay: document.getElementById('disp-iinf'),
      despesaSlider: document.getElementById('slider-despesa'),
      despesaDisplay: document.getElementById('disp-despesa'),
      swrSlider: document.getElementById('slider-swr'),
      swrDisplay: document.getElementById('disp-swr'),

      // HUD
      hudAnoSoberania: document.getElementById('hud-ano-soberania'),
      hudPatrimonioReal: document.getElementById('hud-patrimonio-real'),
      hudRendaSWR: document.getElementById('hud-renda-swr'),
      hudDeltaFee: document.getElementById('hud-delta-fee'),
      hudAnosLiberdade: document.getElementById('hud-anos-liberdade'),
      hudNarrative: document.getElementById('hud-narrative'),
      ctaButton: document.getElementById('cta-simulador'),

      // Canvas & Tooltip
      canvas: document.getElementById('sim-chart'),
      tooltip: document.getElementById('sim-tooltip')
    };

    var chart = null;
    if (els.canvas) {
      chart = new InteractiveSimulationChart(els.canvas, els.tooltip);
    }

    function formatBRL(val) {
      try {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
      } catch (e) {
        return 'R$ ' + Math.round(val).toLocaleString('pt-BR');
      }
    }

    function updateTrackGradient(slider) {
      if (!slider) return;
      var min = parseFloat(slider.min) || 0;
      var max = parseFloat(slider.max) || 100;
      var val = parseFloat(slider.value) || 0;
      var pct = ((val - min) / (max - min)) * 100;
      slider.style.background = 'linear-gradient(90deg, var(--vio) 0%, var(--grn) ' + pct + '%, var(--s3) ' + pct + '%, var(--s3) 100%)';
    }

    function setDisplayValue(displayEl, formattedText, isCurrentlyEditing) {
      if (!displayEl) return;
      displayEl.textContent = formattedText;
      if ('value' in displayEl && !isCurrentlyEditing) {
        displayEl.value = formattedText;
      }
    }

    function recalculate(skipInputId) {
      var p0 = els.p0Slider ? parseFloat(els.p0Slider.value) : 500000;
      var pmt = els.pmtSlider ? parseFloat(els.pmtSlider.value) : 10000;
      var anos = els.anosSlider ? parseFloat(els.anosSlider.value) : 15;
      var rNom = els.rnomSlider ? parseFloat(els.rnomSlider.value) / 100 : 0.115;
      var iInf = els.iinfSlider ? parseFloat(els.iinfSlider.value) / 100 : 0.045;
      var despesa = els.despesaSlider ? parseFloat(els.despesaSlider.value) : 25000;
      var swr = els.swrSlider ? parseFloat(els.swrSlider.value) / 100 : 0.035;

      var result = simulate({
        p0: p0,
        pmt: pmt,
        years: anos,
        rNom: rNom,
        iInf: iInf,
        despesaMeta: despesa,
        swr: swr
      });

      // Atualiza displays numéricos com suporte bidirecional (evita sobrescrever enquanto o usuário digita)
      var editingP0 = skipInputId === 'disp-p0' || (typeof document !== 'undefined' && document.activeElement === els.p0Display);
      var editingPmt = skipInputId === 'disp-pmt' || (typeof document !== 'undefined' && document.activeElement === els.pmtDisplay);
      var editingAnos = skipInputId === 'disp-anos' || (typeof document !== 'undefined' && document.activeElement === els.anosDisplay);
      var editingRnom = skipInputId === 'disp-rnom' || (typeof document !== 'undefined' && document.activeElement === els.rnomDisplay);
      var editingIinf = skipInputId === 'disp-iinf' || (typeof document !== 'undefined' && document.activeElement === els.iinfDisplay);
      var editingDespesa = skipInputId === 'disp-despesa' || (typeof document !== 'undefined' && document.activeElement === els.despesaDisplay);
      var editingSwr = skipInputId === 'disp-swr' || (typeof document !== 'undefined' && document.activeElement === els.swrDisplay);

      setDisplayValue(els.p0Display, formatBRL(p0), editingP0);
      setDisplayValue(els.pmtDisplay, formatBRL(pmt) + ' / mês', editingPmt);
      setDisplayValue(els.anosDisplay, anos + (anos === 1 ? ' ano' : ' anos'), editingAnos);
      setDisplayValue(els.rnomDisplay, (rNom * 100).toFixed(2).replace('.', ',') + '% a.a.', editingRnom);
      setDisplayValue(els.iinfDisplay, (iInf * 100).toFixed(2).replace('.', ',') + '% a.a.', editingIinf);
      setDisplayValue(els.despesaDisplay, formatBRL(despesa) + ' / mês', editingDespesa);
      setDisplayValue(els.swrDisplay, (swr * 100).toFixed(1).replace('.', ',') + '% a.a.', editingSwr);

      // Atualiza HUD de telemetria
      if (els.hudPatrimonioReal) {
        els.hudPatrimonioReal.textContent = formatBRL(result.patrimonioFinalFee);
      }
      if (els.hudRendaSWR) {
        els.hudRendaSWR.textContent = formatBRL(result.rendaMensalSWR) + ' / mês';
      }
      if (els.hudDeltaFee) {
        els.hudDeltaFee.textContent = '+' + formatBRL(result.vantagemFeeBased);
      }
      if (els.hudAnosLiberdade) {
        els.hudAnosLiberdade.textContent = '+' + result.anosGanhosDeVida + ' anos';
      }
      if (els.hudAnoSoberania) {
        if (result.sovereigntyYear !== null) {
          var now = new Date();
          var futureDate = new Date(now.getFullYear(), now.getMonth() + result.sovereigntyMonth, 1);
          var monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          var dateStr = monthNames[futureDate.getMonth()] + ' de ' + futureDate.getFullYear();
          els.hudAnoSoberania.innerHTML = '<span style="color:var(--grn)">' + dateStr + '</span> <span style="font-size:0.85em;color:var(--mut)">(' + result.sovereigntyYear + ' anos)</span>';
        } else {
          els.hudAnoSoberania.innerHTML = '<span style="color:var(--amb)">Acima de 50 anos</span>';
        }
      }

      // Insight Narrativo Humano com Equivalência de Vida Real
      if (els.hudNarrative) {
        var anosText = result.anosGanhosDeVida > 0 ? (result.anosGanhosDeVida + ' anos de trabalho poupados') : 'eficiência máxima';
        els.hudNarrative.innerHTML = 'Eliminando comissões e taxas ocultas do modelo tradicional, seu patrimônio ganha <strong style="color:var(--grn)">+' + formatBRL(result.vantagemFeeBased) + '</strong> adicionais no mesmo prazo. Isso representa <strong style="color:var(--txt)">' + anosText + '</strong> que você ganha de volta — valor suficiente para bancar a <strong style="color:var(--txt)">faculdade de medicina dos filhos</strong>, anos de viagens em família ou antecipar sua aposentadoria com tranquilidade.';
      }

      // CTA com dados pré-carregados
      if (els.ctaButton) {
        var baseCta = 'https://forms.office.com/Pages/ResponsePage.aspx?id=6ez5YgM1m0G2Yyy_xOsD25muVoj4MslItAJalz086_lURDhJV1Y0QlVaUTZFV0RORUZMMUg2S1NKTi4u';
        var simParams = [
          'p0=' + p0,
          'pmt=' + pmt,
          't=' + anos,
          'delta=' + result.vantagemFeeBased,
          'anosGanhos=' + result.anosGanhosDeVida
        ].join('&');
        els.ctaButton.href = baseCta;
        els.ctaButton.setAttribute('data-sim-params', simParams);
      }

      // Atualiza trilhos dos sliders
      [els.p0Slider, els.pmtSlider, els.anosSlider, els.rnomSlider, els.iinfSlider, els.despesaSlider, els.swrSlider].forEach(updateTrackGradient);

      // Renderiza gráfico
      if (chart) {
        chart.setData(result);
      }
    }

    // Two-Way Binding: Teclado <-> Sliders
    function bindKeyboardInput(inputEl, sliderEl, parser, minVal, maxVal) {
      if (!inputEl || !sliderEl) return;

      inputEl.addEventListener('focus', function () {
        if (typeof inputEl.select === 'function') {
          setTimeout(function () { inputEl.select(); }, 50);
        }
      });

      inputEl.addEventListener('input', function () {
        var raw = inputEl.value;
        var parsed = parser(raw);
        if (!isNaN(parsed) && parsed !== null && parsed >= 0) {
          var clamped = Math.max(minVal, Math.min(maxVal, parsed));
          sliderEl.value = clamped;
          recalculate(inputEl.id);
          sliderEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      inputEl.addEventListener('change', function () {
        recalculate();
      });

      inputEl.addEventListener('blur', function () {
        recalculate();
      });

      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          inputEl.blur();
        }
      });
    }

    var parseDigits = function (v) {
      var clean = String(v).replace(/[^\d]/g, '');
      return clean.length > 0 ? parseFloat(clean) : NaN;
    };
    var parseFloatDecimal = function (v) {
      var clean = String(v).replace(',', '.').replace(/[^\d.]/g, '');
      return clean.length > 0 ? parseFloat(clean) : NaN;
    };

    bindKeyboardInput(els.p0Display, els.p0Slider, parseDigits, 0, 50000000);
    bindKeyboardInput(els.pmtDisplay, els.pmtSlider, parseDigits, 0, 200000);
    bindKeyboardInput(els.anosDisplay, els.anosSlider, parseDigits, 1, 40);
    bindKeyboardInput(els.despesaDisplay, els.despesaSlider, parseDigits, 5000, 150000);
    bindKeyboardInput(els.rnomDisplay, els.rnomSlider, parseFloatDecimal, 6.0, 18.0);
    bindKeyboardInput(els.iinfDisplay, els.iinfSlider, parseFloatDecimal, 2.5, 9.0);
    bindKeyboardInput(els.swrDisplay, els.swrSlider, parseFloatDecimal, 2.5, 5.0);

    // Attach listeners
    var sliderList = [els.p0Slider, els.pmtSlider, els.anosSlider, els.rnomSlider, els.iinfSlider, els.despesaSlider, els.swrSlider];
    sliderList.forEach(function (sl) {
      if (!sl) return;
      sl.addEventListener('input', function () { recalculate(); });
      sl.addEventListener('change', function () { recalculate(); });
    });

    // Quick pills
    document.querySelectorAll('[data-pill-target]').forEach(function (pill) {
      pill.addEventListener('click', function () {
        var targetId = pill.getAttribute('data-pill-target');
        var val = pill.getAttribute('data-pill-value');
        var targetSlider = document.getElementById(targetId);
        if (targetSlider && val !== null) {
          targetSlider.value = val;
          recalculate();
        }
      });
    });

    // Window resize handler for canvas
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', function () {
        if (chart) chart.render();
      });
    }

    // Initial run
    recalculate();

    return {
      recalculate: recalculate,
      chart: chart
    };
  }

  // ==============================================================================
  // EXPORTAÇÃO DO OBJETO DA API
  // ==============================================================================

  var OutlierSimulador = {
    calculateRealReturn: calculateRealReturn,
    calculateRealRate: calculateRealRate,
    calculateMonthlyRate: calculateMonthlyRate,
    calculateAccumulation: calculateAccumulation,
    calculateSovereigntyYear: calculateSovereigntyYear,
    calculateSovereignty: calculateSovereignty,
    compareFeeDrag: compareFeeDrag,
    simulate: simulate,
    InteractiveSimulationChart: InteractiveSimulationChart,
    initSimulationUI: initSimulationUI
  };

  // Auto-inicialização na presença de DOM
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      if (typeof document.addEventListener === 'function') {
        document.addEventListener('DOMContentLoaded', function () {
          initSimulationUI();
        });
      }
    } else {
      if (typeof window !== 'undefined' && typeof window.setTimeout === 'function') {
        window.setTimeout(function () {
          initSimulationUI();
        }, 0);
      } else {
        initSimulationUI();
      }
    }
  }

  return OutlierSimulador;
});
