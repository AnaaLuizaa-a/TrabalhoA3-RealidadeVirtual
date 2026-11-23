// Elementos de Navegação
const screenMenu = document.getElementById('screen-menu');
const screenVr = document.getElementById('screen-vr');
const screenAr = document.getElementById('screen-ar');

const btnStartVr = document.getElementById('btn-start-vr');
const btnStartAr = document.getElementById('btn-start-ar');
const btnBackVr = document.getElementById('btn-back-vr');
const btnBackAr = document.getElementById('btn-back-ar');

// Variáveis do Módulo RV
const carEntity = document.getElementById('car-entity');
const pedestrianRig = document.getElementById('pedestrian-rig');
const vrTimerEl = document.getElementById('vr-timer');
const btnCross = document.getElementById('btn-cross');
const vrModal = document.getElementById('vr-result-modal');
const btnRetryVr = document.getElementById('btn-retry-vr');

let vrRunning = false;
let vrStartTime = 0;
let carX = -12;
let carSpeed = 0.14; // Velocidade do veículo na cena
let animationFrameId = null;
let isCrossing = false;

// Variáveis do Módulo RA
const arVideo = document.getElementById('ar-video');
const arFallback = document.getElementById('ar-fallback-bg');
const arOverlay = document.getElementById('ar-overlay');
const arLane = document.getElementById('ar-guide').querySelector('.ar-lane');
const arBanner = document.getElementById('ar-banner');
const arIcon = document.getElementById('ar-icon');
const arTitle = document.getElementById('ar-title');
const arDesc = document.getElementById('ar-desc');
const btnSimSafe = document.getElementById('btn-sim-safe');
const btnSimDanger = document.getElementById('btn-sim-danger');
let cameraStream = null;

// Função para alternar telas
function showScreen(screen) {
  [screenMenu, screenVr, screenAr].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

// ==========================================
// MÓDULO 1: REALIDADE VIRTUAL (DIAGNÓSTICO)
// ==========================================
function startVrSimulation() {
  showScreen(screenVr);
  vrModal.classList.add('hidden');
  carX = -12;
  isCrossing = false;
  vrRunning = true;
  vrStartTime = performance.now();
  pedestrianRig.setAttribute('position', '0 1.6 3.2');
  loopVr();
}

function stopVrSimulation() {
  vrRunning = false;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
}

function loopVr() {
  if (!vrRunning) return;

  // Atualiza cronômetro de decisão cognitiva
  const elapsed = ((performance.now() - vrStartTime) / 1000).toFixed(1);
  vrTimerEl.textContent = `Tempo de observação: ${elapsed}s`;

  // Move o carro da esquerda (-12) para a direita (+12)
  carX += carSpeed;
  if (carX > 12) {
    carX = -12;
  }
  carEntity.setAttribute('position', `${carX} 0.6 -1`);

  animationFrameId = requestAnimationFrame(loopVr);
}

btnCross.addEventListener('click', () => {
  if (!vrRunning || isCrossing) return;
  isCrossing = true;
  vrRunning = false;

  const reactionTime = ((performance.now() - vrStartTime) / 1000).toFixed(2);
  // Verifica se o carro está na zona crítica da faixa (entre -4.5 e +3.5 no eixo X)
  const isDanger = carX > -4.5 && carX < 3.5;

  // Animação simples do pedestre avançando até o outro lado da rua
  pedestrianRig.setAttribute('animation', {
    property: 'position',
    to: '0 1.6 -4.5',
    dur: 1200,
    easing: 'easeInOutQuad'
  });

  setTimeout(() => {
    const titleEl = document.getElementById('vr-result-title');
    const descEl = document.getElementById('vr-result-desc');
    const metricTimeEl = document.getElementById('metric-time');
    const metricStatusEl = document.getElementById('metric-status');

    metricTimeEl.textContent = `${reactionTime}s`;

    if (isDanger) {
      titleEl.textContent = '⚠️ Risco de Colisão!';
      titleEl.style.color = '#ef4444';
      descEl.textContent = 'Você iniciou a travessia enquanto o veículo estava na zona crítica de aproximação. Falha na percepção de distância/velocidade.';
      metricStatusEl.textContent = 'Insegura';
      metricStatusEl.style.color = '#ef4444';
    } else {
      titleEl.textContent = '✅ Travessia Segura!';
      titleEl.style.color = '#10b981';
      descEl.textContent = 'Excelente varredura visual! Você aguardou uma brecha segura no fluxo de veículos antes de pisar na faixa.';
      metricStatusEl.textContent = 'Segura';
      metricStatusEl.style.color = '#10b981';
    }

    vrModal.classList.remove('hidden');
  }, 1250);
});

btnStartVr.addEventListener('click', startVrSimulation);
btnRetryVr.addEventListener('click', startVrSimulation);
btnBackVr.addEventListener('click', () => {
  stopVrSimulation();
  showScreen(screenMenu);
});

// ==========================================
// MÓDULO 2: REALIDADE AUMENTADA (INTERVENÇÃO)
// ==========================================
async function startArMode() {
  showScreen(screenAr);
  setArState('safe');

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });
    arVideo.srcObject = cameraStream;
    arFallback.classList.add('hidden');
  } catch (err) {
    // Caso abra no PC sem webcam ou negue permissão, ativa fundo simulado
    arFallback.classList.remove('hidden');
  }
}

function stopArMode() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
}

function setArState(state) {
  if (state === 'danger') {
    btnSimDanger.classList.add('active');
    btnSimSafe.classList.remove('active');
    arOverlay.classList.add('danger-pulse');
    arLane.classList.add('danger');
    arBanner.classList.add('danger');
    arIcon.textContent = '🚨';
    arTitle.textContent = 'PARE! VEÍCULO EM ALTA VELOCIDADE';
    arDesc.textContent = 'Alerta cognitivo ativo: aguarde a passagem do carro.';
    // Vibração háptica no celular (se suportado)
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  } else {
    btnSimSafe.classList.add('active');
    btnSimDanger.classList.remove('active');
    arOverlay.classList.remove('danger-pulse');
    arLane.classList.remove('danger');
    arBanner.classList.remove('danger');
    arIcon.textContent = '✅';
    arTitle.textContent = 'TRAVESSIA SEGURA';
    arDesc.textContent = 'Nenhum veículo em alta velocidade detectado.';
  }
}

btnSimSafe.addEventListener('click', () => setArState('safe'));
btnSimDanger.addEventListener('click', () => setArState('danger'));

btnStartAr.addEventListener('click', startArMode);
btnBackAr.addEventListener('click', () => {
  stopArMode();
  showScreen(screenMenu);
});
