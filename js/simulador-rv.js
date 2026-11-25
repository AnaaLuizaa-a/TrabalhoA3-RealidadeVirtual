const telaRV = document.querySelector('#screen-vr');
const carro = document.querySelector('#vr-car');
const pedestre = document.querySelector('#vr-pedestrian');
const cronometro = document.querySelector('#vr-timer');
const janelaResultado = document.querySelector('#vr-result-modal');
const tituloResultado = document.querySelector('#vr-result-title');
const descricaoResultado = document.querySelector('#vr-result-desc');
const tempoResultado = document.querySelector('#metric-time');
const statusResultado = document.querySelector('#metric-status');

const inicioDoCarro = -80;
const passoDoCarro = 4.2;
const duracaoDaTravessia = 1150;

let inicioDaObservacao;
let posicaoDoCarro;
let quadroDaAnimacao = null;
let atrasoDoResultado;

// movimento do carro e tempo na tela
function segundosDeObservacao() {
  return (performance.now() - inicioDaObservacao) / 1000;
}

function atualizarSimulador() {
  cronometro.textContent = `Observação: ${segundosDeObservacao().toFixed(1)}s`;

  posicaoDoCarro += passoDoCarro;
  if (posicaoDoCarro > window.innerWidth + 80) {
    posicaoDoCarro = inicioDoCarro;
  }
  carro.style.left = `${posicaoDoCarro}px`;
  quadroDaAnimacao = requestAnimationFrame(atualizarSimulador);
}

function pararSimulador() {
  cancelAnimationFrame(quadroDaAnimacao);
  clearTimeout(atrasoDoResultado);
  quadroDaAnimacao = null;
}

function iniciarSimulador() {
  pararSimulador();
  mostrarTela(telaRV);
  janelaResultado.classList.add('hidden');
  pedestre.classList.remove('crossing');
  posicaoDoCarro = inicioDoCarro;
  inicioDaObservacao = performance.now();
  atualizarSimulador();
}

// clique para atravessar e resultado
function mostrarResultado(tempo, risco) {
  tempoResultado.textContent = `${tempo}s`;
  tituloResultado.textContent = risco ? '⚠️ Risco de Colisão!' : '✅ Travessia Segura!';
  descricaoResultado.textContent = risco
    ? 'O veículo estava muito próximo da faixa no momento em que você iniciou a travessia.'
    : 'Você aguardou uma brecha segura no trânsito antes de atravessar.';
  statusResultado.textContent = risco ? 'Insegura' : 'Segura';
  janelaResultado.classList.toggle('risco', risco);
  janelaResultado.classList.remove('hidden');
}

function atravessar() {
  if (quadroDaAnimacao === null) return;
  pararSimulador();

  const tempo = segundosDeObservacao().toFixed(2);
  const centroDaFaixa = window.innerWidth / 2;
  const carroPerto = posicaoDoCarro > centroDaFaixa - 135 && posicaoDoCarro < centroDaFaixa + 95;
  pedestre.classList.add('crossing');
  atrasoDoResultado = setTimeout(() => mostrarResultado(tempo, carroPerto), duracaoDaTravessia);
}

document.querySelector('#btn-start-vr').addEventListener('click', iniciarSimulador);
document.querySelector('#btn-retry-vr').addEventListener('click', iniciarSimulador);
document.querySelector('#btn-cross').addEventListener('click', atravessar);
document.querySelector('#btn-back-vr').addEventListener('click', () => {
  pararSimulador();
  mostrarTela(telaMenu);
});
