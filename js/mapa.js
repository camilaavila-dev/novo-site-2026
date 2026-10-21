/* ==========================================================================
   MAPA DA JORNADA · o viajante anda pelo mundo e visita cada etapa
   --------------------------------------------------------------------------
   Teclado (WASD ou setas), toque ou clique para ir até um ponto, Enter para
   entrar no lugar. Cada lugar abre uma caixa de diálogo com o resumo da
   etapa e dois caminhos: a cena na versão ilustrada e a ferramenta do site.

   Para mover um lugar, ajuste x e y: são pixels da arte (1206 × 768).
   ========================================================================== */
(function () {
  'use strict';

  var FORM = 'https://forms.office.com/Pages/ResponsePage.aspx?id=6ez5YgM1m0G2Yyy_xOsD25muVoj4MslItAJalz086_lURDhJV1Y0QlVaUTZFV0RORUZMMUg2S1NKTi4u';
  var W = 1206, H = 768;

  var LUGARES = [
    { id: 'mirante', x: 1000, y: 650, nome: 'O Mirante', etapa: 'Prólogo',
      texto: 'Daqui se vê o caminho inteiro. Cada lugar do mapa é uma etapa da consultoria, do diagnóstico ao acompanhamento.',
      cena: 'jornada.html#mirante', acao: ['Como funciona a consultoria', 'index.html'] },
    { id: 'partida', x: 135, y: 222, nome: 'O Ponto de Partida', etapa: 'Capítulo I',
      texto: 'Investidor em crescimento, empresário ou família patrimonial: o caminho começa entendendo onde você está.',
      cena: 'jornada.html#partida', acao: ['Fazer o diagnóstico', 'raiox.html'] },
    { id: 'guia', x: 228, y: 338, nome: 'O Guia', etapa: 'Capítulo II',
      texto: 'Leonardo Arruda, consultor ANBIMA CEA desde 2012, pela Portfel. Remunerado por você, nunca por comissão.',
      cena: 'jornada.html#guia', acao: ['Conhecer o Leonardo', 'index.html#quem'] },
    { id: 'nevoa', x: 600, y: 245, nome: 'A Névoa', etapa: 'Capítulo III · Diagnóstico',
      texto: 'Taxas somadas e produtos escolhidos por meta comercial. Num ano parecem pequenos; em vinte, viram uma fortuna.',
      cena: 'jornada.html#nevoa', acao: ['Calcular o custo das taxas', 'instrumentos.html#taxas'] },
    { id: 'mapa', x: 540, y: 348, nome: 'O Mapa', etapa: 'Capítulo IV · Estratégia',
      texto: 'Investimentos, previdência, proteção e serviços especiais coordenados num só plano.',
      cena: 'jornada.html#mapa', acao: ['Comparar renda fixa', 'instrumentos.html#renda-fixa'] },
    { id: 'fortaleza', x: 1055, y: 300, nome: 'A Fortaleza', etapa: 'Capítulo V · Proteção e legado',
      texto: 'Sucessão se planeja em vida: separar o pessoal do empresarial, ter liquidez e não depender de uma só moeda.',
      cena: 'jornada.html#fortaleza', acao: ['Simular a holding', 'instrumentos.html#holding'] },
    { id: 'cume', x: 945, y: 92, nome: 'O Cume', etapa: 'Capítulo VI · Independência',
      texto: 'Independência financeira não é um sentimento, é uma data: o ano em que o patrimônio sustenta a sua vida.',
      cena: 'jornada.html#cume', acao: ['Calcular o meu ano', 'instrumentos.html#independencia'] },
    { id: 'farol', x: 720, y: 470, nome: 'O Farol', etapa: 'Capítulo VII · Acompanhamento',
      texto: 'O mercado muda várias vezes numa vida. O acompanhamento não para: revisões, ajustes e leitura semanal.',
      cena: 'jornada.html#farol', acao: ['Ler a leitura semanal', 'blog.html'] },
    { id: 'primeiro-passo', x: 268, y: 548, nome: 'O Primeiro Passo', etapa: 'Epílogo',
      texto: 'Com uma conversa, sem compromisso, para entender o seu cenário e ver se faz sentido caminharmos juntos.',
      cena: 'jornada.html#primeiro-passo', acao: ['Agendar a conversa', FORM, true] }
  ];

  var view = document.getElementById('mp-view');
  var world = document.getElementById('mp-world');
  var player = document.getElementById('mp-player');
  var sprite = document.getElementById('mp-sprite');
  var placesEl = document.getElementById('mp-places');
  var box = document.getElementById('mp-box');
  var count = document.getElementById('mp-count');

  var SPRITES = { frente: 'midias/mapa/viajante-frente.png', costas: 'midias/mapa/viajante-costas.png', lado: 'midias/mapa/viajante-lado.png' };
  Object.keys(SPRITES).forEach(function (k) { new Image().src = SPRITES[k]; });

  var pos = { x: LUGARES[0].x, y: LUGARES[0].y + 6 };
  var alvo = null, teclas = {}, escala = 1, perto = null, aberto = null;
  var vistos = {};
  try { vistos = JSON.parse(localStorage.getItem('mapa-vistos') || '{}'); } catch (e) { vistos = {}; }

  /* ---------- Lugares ---------- */
  LUGARES.forEach(function (l) {
    var el = document.createElement('div');
    el.className = 'mp-place' + (vistos[l.id] ? ' is-seen' : '');
    el.style.left = l.x + 'px';
    el.style.top = l.y + 'px';
    el.innerHTML = '<span class="mp-flag"></span><span class="mp-pin"></span><span class="mp-ring"></span>';
    el.querySelector('.mp-flag').textContent = l.nome;
    placesEl.appendChild(el);
    l.el = el;
  });

  function contar() {
    var n = LUGARES.filter(function (l) { return vistos[l.id]; }).length;
    count.textContent = 'Lugares visitados: ' + n + ' de ' + LUGARES.length;
  }
  contar();

  /* ---------- Caixa de diálogo ---------- */
  function abrir(l) {
    aberto = l;
    document.getElementById('mp-box-kicker').textContent = l.etapa;
    document.getElementById('mp-box-title').textContent = l.nome;
    document.getElementById('mp-box-text').textContent = l.texto;
    var acoes = document.getElementById('mp-box-actions');
    acoes.innerHTML = '';
    var principal = document.createElement('a');
    principal.className = 'mp-btn mp-btn-main';
    principal.href = l.acao[1];
    principal.textContent = l.acao[0];
    if (l.acao[2]) { principal.target = '_blank'; principal.rel = 'noopener'; }
    var cena = document.createElement('a');
    cena.className = 'mp-btn';
    cena.href = l.cena;
    cena.textContent = 'Ver a cena';
    var seguir = document.createElement('button');
    seguir.type = 'button';
    seguir.className = 'mp-btn';
    seguir.innerHTML = 'Continuar andando <kbd>Esc</kbd>';
    seguir.addEventListener('click', fechar);
    acoes.appendChild(principal);
    acoes.appendChild(cena);
    acoes.appendChild(seguir);
    box.hidden = false;
    document.body.classList.add('has-box');
    if (!vistos[l.id]) {
      vistos[l.id] = 1;
      l.el.classList.add('is-seen');
      try { localStorage.setItem('mapa-vistos', JSON.stringify(vistos)); } catch (e) { /* sem armazenamento: tudo bem */ }
      contar();
    }
  }
  function fechar() {
    box.hidden = true;
    document.body.classList.remove('has-box');
    aberto = null;
  }

  /* ---------- Câmera ---------- */
  function medir() {
    // O mundo fica sempre maior que a tela, para a câmera ter por onde andar.
    escala = Math.max(innerHeight / H * 1.3, innerWidth / W * 1.05);
    world.style.width = W + 'px';
    world.style.height = H + 'px';
  }
  function camera() {
    var vw = innerWidth, vh = innerHeight;
    var cx = Math.min(0, Math.max(vw - W * escala, vw / 2 - pos.x * escala));
    var cy = Math.min(0, Math.max(vh - H * escala, vh / 2 - pos.y * escala));
    world.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) scale(' + escala + ')';
    return { x: cx, y: cy };
  }

  /* ---------- Movimento ---------- */
  var VEL = 150; // pixels da arte por segundo
  var antes = performance.now();
  var direcao = 'frente';

  function quadro(agora) {
    var dt = Math.min(0.05, (agora - antes) / 1000);
    antes = agora;
    var dx = 0, dy = 0;
    if (teclas.ArrowLeft || teclas.a) dx -= 1;
    if (teclas.ArrowRight || teclas.d) dx += 1;
    if (teclas.ArrowUp || teclas.w) dy -= 1;
    if (teclas.ArrowDown || teclas.s) dy += 1;
    if (dx || dy) alvo = null;
    else if (alvo) {
      var ax = alvo.x - pos.x, ay = alvo.y - pos.y, d = Math.hypot(ax, ay);
      if (d < 3) alvo = null;
      else { dx = ax / d; dy = ay / d; }
    }
    var andando = !!(dx || dy);
    if (andando) {
      var len = Math.hypot(dx, dy);
      pos.x = Math.max(16, Math.min(W - 16, pos.x + dx / len * VEL * dt));
      pos.y = Math.max(40, Math.min(H - 8, pos.y + dy / len * VEL * dt));
      var nova = Math.abs(dx) > Math.abs(dy) ? 'lado' : (dy < 0 ? 'costas' : 'frente');
      if (nova !== direcao) { direcao = nova; sprite.src = SPRITES[nova]; }
      player.classList.toggle('is-left', direcao === 'lado' && dx < 0);
    }
    player.classList.toggle('is-walking', andando);
    player.style.left = pos.x + 'px';
    player.style.top = pos.y + 'px';

    // Lugar mais próximo: ao chegar, a caixa abre sozinha uma vez.
    var maisPerto = null, menor = 46;
    LUGARES.forEach(function (l) {
      var d = Math.hypot(l.x - pos.x, l.y - pos.y);
      if (d < menor) { menor = d; maisPerto = l; }
    });
    if (maisPerto !== perto) {
      if (perto) perto.el.classList.remove('is-near');
      perto = maisPerto;
      // Chegou num lugar: abre a caixa. Saiu dele: fecha.
      if (perto) { perto.el.classList.add('is-near'); abrir(perto); }
      else if (aberto) fechar();
    }
    camera();
    requestAnimationFrame(quadro);
  }

  /* ---------- Controles ---------- */
  var MOVE = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's'];
  addEventListener('keydown', function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (e.target.closest && e.target.closest('input, textarea')) return;
    if (MOVE.indexOf(k) > -1) { teclas[k] = true; e.preventDefault(); }
    else if (k === 'Escape' && aberto) fechar();
    else if (k === 'Enter' && perto && !aberto) { abrir(perto); e.preventDefault(); }
  });
  addEventListener('keyup', function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    teclas[k] = false;
  });
  addEventListener('blur', function () { teclas = {}; });

  view.addEventListener('pointerdown', function (e) {
    var c = camera();
    alvo = { x: (e.clientX - c.x) / escala, y: (e.clientY - c.y) / escala };
    // Tocar perto de um lugar leva direto até ele.
    LUGARES.forEach(function (l) {
      if (Math.hypot(l.x - alvo.x, l.y - alvo.y) < 40) alvo = { x: l.x, y: l.y + 6 };
    });
  });

  addEventListener('resize', function () { medir(); camera(); });
  medir();

  // Abre direto num lugar com #nome (ex.: mapa.html#fortaleza).
  var inicio = LUGARES.filter(function (l) { return '#' + l.id === location.hash; })[0];
  if (inicio) pos = { x: inicio.x, y: inicio.y + 6 };

  requestAnimationFrame(quadro);
  window.Mapa = { lugares: LUGARES, posicao: function () { return { x: pos.x, y: pos.y }; }, aberto: function () { return aberto && aberto.id; } };
})();
