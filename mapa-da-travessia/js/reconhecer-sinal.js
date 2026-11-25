const SEM_LUZ = 0;
const VERMELHO = 1;
const VERDE = 2;

// separa os pixels pela cor da luz
function corDaLuz(r, g, b) {
  if (r > 110 && g < r * 0.67 && b < r * 0.75) return VERMELHO;
  if (g > 90 && g - r > 32 && g + 24 >= b) return VERDE;
  return SEM_LUZ;
}

function mapearCores(imagem) {
  const { width, height, data } = imagem;
  const cores = new Uint8Array(width * height);

  for (let i = 0; i < cores.length; i++) {
    const pixel = i * 4;
    cores[i] = corDaLuz(data[pixel], data[pixel + 1], data[pixel + 2]);
  }

  return cores;
}

// junta os vizinhos da mesma cor e marca os pixels que ja foram lidos
function agruparPixels(cores, fila, inicio, largura, altura) {
  const cor = cores[inicio];
  let total = 0;
  let esquerda = largura;
  let direita = 0;
  let topo = altura;
  let base = 0;

  function incluir(indice) {
    if (cores[indice] !== cor) return;
    cores[indice] = SEM_LUZ;
    fila[total] = indice;
    total++;
  }

  incluir(inicio);
  for (let posicao = 0; posicao < total; posicao++) {
    const indice = fila[posicao];
    const x = indice % largura;
    const y = Math.floor(indice / largura);
    esquerda = Math.min(esquerda, x);
    direita = Math.max(direita, x);
    topo = Math.min(topo, y);
    base = Math.max(base, y);

    if (x > 0) incluir(indice - 1);
    if (x + 1 < largura) incluir(indice + 1);
    if (y > 0) incluir(indice - largura);
    if (y + 1 < altura) incluir(indice + largura);
  }

  return {
    x: esquerda,
    y: topo,
    w: direita - esquerda + 1,
    h: base - topo + 1,
    total
  };
}

// procura a moldura escura em volta da luz
function temMolduraEscura(imagem, regiao) {
  const { width, height, data } = imagem;
  const { x, y, w, h } = regiao;
  const margem = Math.min(10, Math.max(2, Math.round(Math.min(w, h) * 0.28)));
  const lados = [
    [x - margem, y, x, y + h],
    [x + w, y, x + w + margem, y + h],
    [x, y - margem, x + w, y],
    [x, y + h, x + w, y + h + margem]
  ];

  let ladosEscuros = 0;
  for (const [esquerda, topo, direita, base] of lados) {
    let lidos = 0;
    let escuros = 0;
    for (let py = Math.max(0, topo); py < Math.min(height, base); py++) {
      for (let px = Math.max(0, esquerda); px < Math.min(width, direita); px++) {
        const i = 4 * (py * width + px);
        const maior = Math.max(data[i], data[i + 1], data[i + 2]);
        const menor = Math.min(data[i], data[i + 1], data[i + 2]);
        lidos++;
        if (maior <= 115 && maior - menor <= 42) escuros++;
      }
    }
    if (lidos > 0 && escuros / lidos >= 0.45) ladosEscuros++;
  }

  return ladosEscuros >= 3;
}

// decide entre as cores quando aparecem duas luzes
function escolherSinal(vermelho, verde) {
  if (!vermelho && !verde) return null;

  const notaVermelho = vermelho?.nota ?? 0;
  const notaVerde = verde?.nota ?? 0;
  const maiorNota = Math.max(notaVermelho, notaVerde);
  const menorNota = Math.min(notaVermelho, notaVerde);
  if (maiorNota < 1.5 * menorNota) return null;

  if (notaVermelho > notaVerde) {
    return { ...vermelho, estado: 'Vermelho' };
  }
  return { ...verde, estado: 'Verde' };
}

function reconhecerSinal(imagem) {
  const { width: largura, height: altura } = imagem;
  const cores = mapearCores(imagem);
  const fila = new Int32Array(cores.length);
  const melhores = [null, null, null];

  for (let inicio = 0; inicio < cores.length; inicio++) {
    const cor = cores[inicio];
    if (cor === SEM_LUZ) continue;

    const regiao = agruparPixels(cores, fila, inicio, largura, altura);
    const { x, y, w, h, total } = regiao;
    const pequenaDemais = total < 8 || w < 2 || h < 2;
    const grandeDemais = total > cores.length * 0.55;
    if (pequenaDemais || grandeDemais || !temMolduraEscura(imagem, regiao)) continue;

    const dx = (x + w / 2) / largura - 0.5;
    const dy = (y + h / 2) / altura - 0.5;
    const distanciaAoCentro = Math.hypot(dx, dy);
    const nota = total / (1 + 5 * distanciaAoCentro);
    if (nota > (melhores[cor]?.nota ?? 0)) {
      melhores[cor] = { x, y, w, h, nota };
    }
  }

  return escolherSinal(melhores[VERMELHO], melhores[VERDE]);
}
