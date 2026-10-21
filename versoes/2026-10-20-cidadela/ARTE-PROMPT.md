# O que gerar: a arte da Cidadela

Você precisa gerar **uma única imagem**. É a arte de fundo do mapa interativo
que abre a home — a peça que leva o site ao nível do omshiva.ai.

Todo o resto (marcadores, câmera, spotlight, painéis, progresso) já está
construído e funcionando. A imagem entra e o mapa ganha vida.

- **Salvar em:** `midias/cidadela-patrimonio.jpg`
- **Proporção:** 16:9
- **Resolução:** mínimo 2560x1440, ideal 3840x2160
- **Onde gerar:** Midjourney, Nano Banana, Sora, Freepik ou similar

Enquanto o arquivo não existir, o site usa `midias/mundo-jornada-ilhas.jpg`
dessaturado como reserva, então nada quebra: dá para ver o mapa funcionando
desde já.

---

## Prompt principal

```
Aerial isometric view of a majestic coastal citadel built on golden ochre stone
cliffs, rendered as high-end cinematic concept art. Ancient Mediterranean
architecture: weathered limestone, bronze domes with verdigris patina, terracotta
roofs, carved stone archways, colonnaded plazas, aqueducts and grand staircases
cut into the rock.

Six distinct districts spread across the promontory, connected by stone bridges
and winding paved paths: a tall observatory tower with a bronze dome; a circular
colonnaded forum with a mosaic floor; a walled fortress with square watchtowers;
a working harbour with tall-masted merchant ships at stone piers; a library
pavilion beneath an enormous ancient fig tree; a temple of polished stone at the
highest point with a golden finial catching the light.

Deep turquoise ocean wrapping the promontory, white surf breaking on rocks,
terraced olive groves and cypress trees on the slopes. Tiny human figures
throughout giving monumental scale: merchants, scholars, stonemasons, dockworkers.
Chimney smoke, market awnings, stacked amphorae, moored boats.

Golden hour light raking from the upper right, long dramatic shadows, warm sunlit
stone against cool blue shadow, soft atmospheric haze over distant water, god rays.
Photorealistic rendering, intricate architectural detail, 8k, cinematic composition,
muted sophisticated palette of ochre, sandstone, bronze, deep teal and warm gold.
No text, no logos, no UI elements, no modern buildings, no fantasy creatures.

--ar 16:9 --style raw --v 6.1
```

## Alternativa noturna

Se a versão dourada ficar clara demais e brigar com os painéis de vidro escuro:

```
Aerial isometric view of a coastal stone citadel at blue hour, warm amber window
light glowing from every building against deep indigo sky and dark teal sea.
Ancient stonework, bronze domes, lit harbour with moored ships, lanterns lining
the bridges and staircases, terraced slopes. Golden interior light spilling from
arched windows, atmospheric mist over the water, distant stars. Photorealistic
concept art, cinematic, intricate detail, 8k, palette of deep indigo, obsidian,
warm amber and antique bronze. No text, no logos, no UI.

--ar 16:9 --style raw --v 6.1
```

---

## Como escolher entre as imagens geradas

Gere umas quatro e escolha pelos critérios abaixo, nessa ordem:

1. **Espaço livre nas laterais.** Os painéis de vidro ocupam ~350px à esquerda e
   ~300px à direita. Nessas faixas a imagem deve ter céu, mar ou encosta lisa —
   não o detalhe mais importante da composição.
2. **Seis distritos distinguíveis.** Se virarem uma massa contínua de telhados,
   os marcadores numerados não têm onde pousar.
3. **Luz vinda de cima à direita.** As sombras longas para a esquerda são o que
   dá volume e impede o aspecto chapado.
4. **Nada escrito.** Texto gerado por IA sai borrado e entrega o truque.
5. **Densidade humana.** As figurinhas minúsculas são o que cria a escala
   monumental — é o detalhe que faz o omshiva.ai funcionar.

---

## Depois de salvar o arquivo

O mapa provavelmente vai precisar de um ajuste fino: os seis marcadores estão
posicionados em coordenadas que eu estimei, e cada imagem gerada coloca os
distritos em lugares um pouco diferentes.

A calibragem está em `js/world-map.js`, logo no início, na constante
`TERRITORIES`:

```js
const TERRITORIES = [
  { id: 1, num: '01', rx: 0.285, ry: 0.620, depth: 0.5 },
  ...
];
```

- `rx` é a posição horizontal, de 0 (esquerda) a 1 (direita)
- `ry` é a vertical, de 0 (topo) a 1 (base)
- `depth` controla o tamanho do marcador: 0 é mais ao fundo, 1 mais à frente

Me mande a imagem quando tiver gerado e eu calibro os seis marcadores para
pousarem exatamente sobre os distritos certos.
