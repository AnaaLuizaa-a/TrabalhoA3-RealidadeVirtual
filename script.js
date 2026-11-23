document.addEventListener('DOMContentLoaded', () => {
  const screenMenu = document.getElementById('screen-menu');
  const screenVr = document.getElementById('screen-vr');
  const screenAr = document.getElementById('screen-ar');

  const btnStartVr = document.getElementById('btn-start-vr');
  const btnStartAr = document.getElementById('btn-start-ar');
  const btnBackVr = document.getElementById('btn-back-vr');
  const btnBackAr = document.getElementById('btn-back-ar');

  // Variáveis RV
  const vrCar = document.getElementById('vr-car');
  const vrPedestrian = document.getElementById('vr-pedestrian');
  const vrTimerEl = document.getElementById('vr-timer');
  const btnCross = document.getElementById('btn-cross');
  const vrModal = document.getElementById('vr-result-modal');
  const btnRetryVr = document.getElementById('btn-retry-vr');

  let vrRunning = false;
  let vrStartTime = 0;
  let carPos = -80;
  let animId = null;
  let isCrossing = false;

  // Variáveis RA
  const arVideo = document.getElementById('ar-video');
  const arFallback = document.getElementById('ar-fallback-bg');
  const arOverlay = document.getElementById('ar-overlay');
  const arLane = document.getElementById('ar-lane');
  const arBanner = document.getElementById('ar-banner');
  const arIcon = document.getElementById('ar-icon');
  const arTitle = document.getElementById('ar-title');
  const arDesc = document.getElementById('ar-desc');
  const btnSimSafe = document.getElementById('btn-sim-safe');
  const btnSimDanger = document.getElementById('btn-sim-danger');
  let cameraStream = null;

  function showScreen(target) {
    [screenMenu, screenVr, screenAr].forEach(s => s.classList.remove('active'));
    target.classList.add('active');
  }

  // ==========================================
  // MÓDULO 1: SIMULADOR RV NA TELA DO CELULAR
  // ==========================================
  function startVr() {
    showScreen(screenVr);
    vrModal.classList.add('hidden');
    vrPedestrian.classList.remove('crossing');
    carPos = -80;
    isCrossing = false;
    vrRunning = true;
    vrStartTime = performance.now();
    loopVr();
  }

  function stopVr() {
    vrRunning = false;
    if (animId) cancelAnimationFrame(animId);
  }

  function loopVr() {
    if (!vrRunning) return;

    const elapsed = ((performance.now() - vrStartTime) / 1000).toFixed(1);
    vrTimerEl.textContent = `Observação: ${elapsed}s`;

    const screenWidth = window.innerWidth;
    carPos += 4.2; // Velocidade do carro na tela
    if (carPos > screenWidth + 80) {
      carPos = -80;
    }
    vrCar.style.left = `${carPos}px`;

    animId = requestAnimationFrame(loopVr);
  }

  btnCross.addEventListener('click', () => {
    if (!vrRunning || isCrossing) return;
    isCrossing = true;
    vrRunning = false;

    const reactionTime = ((performance.now() - vrStartTime) / 1000).toFixed(2);
    const center = window.innerWidth / 2;
    // Zona crítica ao redor da faixa central
    const isDanger = carPos > (center - 135) && carPos < (center + 95);

    vrPedestrian.classList.add('crossing');

    setTimeout(() => {
      const titleEl = document.getElementById('vr-result-title');
      const descEl = document.getElementById('vr-result-desc');
      const metricTimeEl = document.getElementById('metric-time');
      const metricStatusEl = document.getElementById('metric-status');

      metricTimeEl.textContent = `${reactionTime}s`;

      if (isDanger) {
        titleEl.textContent = '⚠️ Risco de Colisão!';
        titleEl.style.color = '#ef4444';
        descEl.textContent = 'O veículo estava muito próximo da faixa no momento em que você iniciou a travessia.';
        metricStatusEl.textContent = 'Insegura';
        metricStatusEl.style.color = '#ef4444';
      } else {
        titleEl.textContent = '✅ Travessia Segura!';
        titleEl.style.color = '#10b981';
        descEl.textContent = 'Você aguardou uma brecha segura no trânsito antes de atravessar.';
        metricStatusEl.textContent = 'Segura';
        metricStatusEl.style.color = '#10b981';
      }

      vrModal.classList.remove('hidden');
    }, 1150);
  });

  btnStartVr.addEventListener('click', startVr);
  btnRetryVr.addEventListener('click', startVr);
  btnBackVr.addEventListener('click', () => {
    stopVr();
    showScreen(screenMenu);
  });

  // ==========================================
  // MÓDULO 2: ASSISTENTE RA COM CÂMERA DO CLL
  // ==========================================
  async function startAr() {
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
      arFallback.classList.remove('hidden');
    }
  }

  function stopAr() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
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
      arTitle.textContent = 'PARE! CARRO EM ALTA VELOCIDADE';
      arDesc.textContent = 'Alerta visual e tátil ativo: aguarde na calçada.';
      if (navigator.vibrate) navigator.vibrate([250, 100, 250]);
    } else {
      btnSimSafe.classList.add('active');
      btnSimDanger.classList.remove('active');
      arOverlay.classList.remove('danger-pulse');
      arLane.classList.remove('danger');
      arBanner.classList.remove('danger');
      arIcon.textContent = '✅';
      arTitle.textContent = 'TRAVESSIA SEGURA';
      arDesc.textContent = 'Via monitorada. Nenhum veículo em risco.';
    }
  }

  btnSimSafe.addEventListener('click', () => setArState('safe'));
  btnSimDanger.addEventListener('click', () => setArState('danger'));

  btnStartAr.addEventListener('click', startAr);
  btnBackAr.addEventListener('click', () => {
    stopAr();
    showScreen(screenMenu);
  });
});
