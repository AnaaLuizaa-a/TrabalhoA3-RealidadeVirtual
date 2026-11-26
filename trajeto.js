const pontos = [
  { id: 'inicio', nome: 'Calçada antes da faixa', rotacao: -125 },
  { id: 'entrada', nome: 'Entrada na faixa', rotacao: -82 },
  { id: 'ilha', nome: 'Ilha no meio da travessia', rotacao: -95 },
  { id: 'travessia', nome: 'Sobre a faixa de pedestres', rotacao: -90 },
  { id: 'saida', nome: 'Fim da faixa de pedestres', rotacao: -91 },
  { id: 'chegada', nome: 'Chegada à calçada', rotacao: -98 },
  { id: 'destino', nome: 'Calçada do outro lado', rotacao: -90 }
];

const cena = document.querySelector('a-scene');
const panorama = document.querySelector('#panorama');
const statusDoPonto = document.querySelector('#nome-do-ponto');
const mensagemCena = document.querySelector('#mensagem-cena');
const mapa = document.querySelector('.mapa');
const botoesMapa = [];
const voltarNaFoto = document.querySelector('#voltar-na-foto');
const avancarNaFoto = document.querySelector('#avancar-na-foto');
const controlesDaFoto = document.querySelector('#controles-da-foto');
const numeroDaFoto = document.querySelector('#numero-da-foto');
let fotoAtual = 0;

function mostrarFoto(indice) {
  const ponto = pontos[indice];
  if (!ponto) return;
  botoesMapa[fotoAtual].removeAttribute('aria-current');
  fotoAtual = indice;

  // A câmera fica no centro da esfera. Trocar a textura muda a vista do local.
  panorama.setAttribute('src', `#foto-${ponto.id}`);
  panorama.setAttribute('rotation', `0 ${ponto.rotacao} 0`);
  statusDoPonto.textContent = ponto.nome;
  numeroDaFoto.textContent = `${indice + 1} de ${pontos.length}`;
  voltarNaFoto.disabled = indice === 0;
  avancarNaFoto.disabled = indice === pontos.length - 1;

  botoesMapa[indice].setAttribute('aria-current', 'step');
  mapa.style.setProperty('--progresso', `${100 * indice / (pontos.length - 1)}%`);
}

function mostrarControlesDaFoto() {
  mensagemCena.hidden = true;
  controlesDaFoto.hidden = false;
}

if (window.AFRAME) {
  for (const [indice, ponto] of pontos.entries()) {
    const imagem = document.createElement('img');
    imagem.id = `foto-${ponto.id}`;
    imagem.alt = '';
    imagem.hidden = true;
    imagem.src = fotos[ponto.id];
    document.body.append(imagem);

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'ponto-mapa';
    botao.title = ponto.nome;
    botao.setAttribute('aria-label', `Ponto ${indice + 1}. ${ponto.nome}`);
    botao.addEventListener('click', () => mostrarFoto(indice));
    mapa.append(botao);
    botoesMapa.push(botao);
  }
  voltarNaFoto.addEventListener('click', () => mostrarFoto(fotoAtual - 1));
  avancarNaFoto.addEventListener('click', () => mostrarFoto(fotoAtual + 1));
  mostrarFoto(0);

  if (cena.renderStarted) mostrarControlesDaFoto();
  else cena.addEventListener('renderstart', mostrarControlesDaFoto, { once: true });

  window.setTimeout(() => {
    if (!cena.renderStarted) mensagemCena.textContent = 'Não foi possível carregar a visualização 360°.';
  }, 8000);
} else {
  mensagemCena.textContent = 'A biblioteca A-Frame não carregou.';
}
