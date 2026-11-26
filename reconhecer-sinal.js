function corDaLuz(r, g, b) {
  if (r > 110 && g < r * 0.67 && b < r * 0.75) return 1;
  if (g > 90 && g - r > 32 && g + 24 >= b) return 2;
  return 0;
}

function temMolduraEscura(imagem, x, y, w, h) {
  const { width, height, data } = imagem;
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

  // A luz precisa ter fundo de semáforo em pelo menos três lados.
  return ladosEscuros >= 3;
}

function reconhecerSinal(imagem) {
  const { width: largura, height: altura, data: pixels } = imagem;
  const cores = new Uint8Array(largura * altura);
  const fila = new Int32Array(cores.length);
  const melhores = [null, null, null];

  for (let i = 0; i < cores.length; i++) {
    const offset = i * 4;
    cores[i] = corDaLuz(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
  }

  // Agrupa pixels vizinhos da mesma cor para localizar a luz no quadro.
  for (let inicio = 0; inicio < cores.length; inicio++) {
    const cor = cores[inicio];
    if (!cor) continue;

    let total = 0;
    let esquerda = largura, direita = 0, topo = altura, base = 0;

    function incluir(indice) {
      if (cores[indice] !== cor) return;
      cores[indice] = 0;
      fila[total++] = indice;
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

    const w = direita - esquerda + 1;
    const h = base - topo + 1;
    if (total < 8 || total > cores.length * 0.55 || w < 2 || h < 2) continue;
    if (!temMolduraEscura(imagem, esquerda, topo, w, h)) continue;

    const dx = (esquerda + w / 2) / largura - 0.5;
    const dy = (topo + h / 2) / altura - 0.5;
    const nota = total / (1 + 5 * Math.hypot(dx, dy));
    if (nota > (melhores[cor]?.nota ?? 0)) {
      melhores[cor] = { x: esquerda, y: topo, w, h, nota };
    }
  }

  const [, vermelho, verde] = melhores;
  if (!vermelho && !verde) return null;
  if (vermelho && verde && Math.max(vermelho.nota, verde.nota) < 1.5 * Math.min(vermelho.nota, verde.nota)) {
    return null;
  }
  if ((vermelho?.nota ?? 0) > (verde?.nota ?? 0)) return { ...vermelho, estado: 'Vermelho' };
  return { ...verde, estado: 'Verde' };
}
