const telaRA = document.querySelector('#screen-ar');
const videoRA = document.querySelector('#ar-video');
const avisoDaCamera = document.querySelector('#ar-fallback-bg');
const sobreposicao = document.querySelector('#ar-overlay');
const faixaVirtual = document.querySelector('#ar-lane');
const caixaDoAlerta = document.querySelector('#ar-banner');
const iconeDoAlerta = document.querySelector('#ar-icon');
const tituloDoAlerta = document.querySelector('#ar-title');
const descricaoDoAlerta = document.querySelector('#ar-desc');
const botaoViaLivre = document.querySelector('#btn-sim-safe');
const botaoDePerigo = document.querySelector('#btn-sim-danger');

let fluxoDaCamera;
let pedidoDeCamera = 0;

// alertas acionados pelos botoes da demonstracao
function mostrarAlerta(perigo) {
  botaoViaLivre.classList.toggle('active', !perigo);
  botaoDePerigo.classList.toggle('active', perigo);
  sobreposicao.classList.toggle('danger-pulse', perigo);
  faixaVirtual.classList.toggle('danger', perigo);
  caixaDoAlerta.classList.toggle('danger', perigo);

  iconeDoAlerta.textContent = perigo ? '🚨' : '✅';
  tituloDoAlerta.textContent = perigo ? 'PARE! CARRO EM ALTA VELOCIDADE' : 'TRAVESSIA SEGURA';
  descricaoDoAlerta.textContent = perigo
    ? 'Alerta visual e tátil ativo: aguarde na calçada.'
    : 'Simulação de via livre.';

  if (perigo && navigator.vibrate) navigator.vibrate([250, 100, 250]);
}

// abertura e fechamento da camera
async function abrirAssistente() {
  mostrarTela(telaRA);
  mostrarAlerta(false);
  avisoDaCamera.classList.add('hidden');
  const pedidoAtual = ++pedidoDeCamera;

  try {
    const fluxo = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });

    if (pedidoAtual !== pedidoDeCamera) {
      fluxo.getTracks().forEach(faixa => faixa.stop());
      return;
    }

    fluxoDaCamera = fluxo;
    videoRA.srcObject = fluxoDaCamera;
  } catch {
    if (pedidoAtual === pedidoDeCamera) avisoDaCamera.classList.remove('hidden');
  }
}

function pararCameraDaDemonstracao() {
  pedidoDeCamera++;
  fluxoDaCamera?.getTracks().forEach(faixa => faixa.stop());
  fluxoDaCamera = null;
  videoRA.srcObject = null;
}

botaoViaLivre.addEventListener('click', () => mostrarAlerta(false));
botaoDePerigo.addEventListener('click', () => mostrarAlerta(true));
document.querySelector('#btn-start-ar').addEventListener('click', abrirAssistente);
document.querySelector('#btn-back-ar').addEventListener('click', () => {
  pararCameraDaDemonstracao();
  mostrarTela(telaMenu);
});
window.addEventListener('pagehide', pararCameraDaDemonstracao);
