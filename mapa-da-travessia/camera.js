(() => {
  const painelRV = document.querySelector('#modo-rv');
  const painelRA = document.querySelector('#modo-ra');
  const verPercurso = document.querySelector('#ver-percurso');
  const verCamera = document.querySelector('#ver-camera');
  const abrirWebcam = document.querySelector('#abrir-webcam');
  const video = document.querySelector('#video-da-webcam');
  const quadro = document.querySelector('#quadro-ra');
  const contexto = quadro.getContext('2d');
  const status = document.querySelector('#status-ra');
  const controleSinal = document.querySelector('#controle-do-sinal');
  const luzSimulada = document.querySelector('#luz-simulada');

  const recorte = { x: 120, y: 76, w: 400, h: 328 };
  const amostra = document.createElement('canvas');
  amostra.width = 200;
  amostra.height = 164;
  const pixels = amostra.getContext('2d', { willReadFrequently: true });

  let fluxo;
  let temporizador;
  let sessao = 0;
  let ultimaLeitura = null;

  function informar(mensagem) {
    if (status.textContent !== mensagem) status.textContent = mensagem;
  }

  function pararCamera() {
    sessao++;
    window.clearInterval(temporizador);
    fluxo?.getTracks().forEach(track => track.stop());
    fluxo = null;
    video.srcObject = null;
    ultimaLeitura = null;
    delete document.body.dataset.sinal;
    quadro.hidden = true;
    controleSinal.hidden = true;
    abrirWebcam.textContent = 'Abrir webcam';
    informar('Escolha a fonte de imagem.');
  }

  function trocarModo(modoRA) {
    painelRV.hidden = modoRA;
    painelRA.hidden = !modoRA;
    verPercurso.setAttribute('aria-pressed', String(!modoRA));
    verCamera.setAttribute('aria-pressed', String(modoRA));

    if (!modoRA) {
      pararCamera();
      const cenaRV = painelRV.querySelector('a-scene');
      if (cenaRV.renderStarted) cenaRV.resize();
    }
  }

  function desenharResultado(sinal) {
    const escalaX = recorte.w / amostra.width;
    const escalaY = recorte.h / amostra.height;
    const x = recorte.x + sinal.x * escalaX;
    const y = recorte.y + sinal.y * escalaY;
    const w = sinal.w * escalaX;
    const h = sinal.h * escalaY;

    contexto.font = 'bold 18px Arial';
    const largura = contexto.measureText(sinal.estado).width + 20;
    const legendaX = Math.max(0, Math.min(quadro.width - largura, x + (w - largura) / 2));
    const legendaY = Math.max(0, y - 34);
    contexto.lineWidth = 2;
    contexto.strokeStyle = '#fff';
    contexto.strokeRect(x - 3, y - 3, w + 6, h + 6);
    contexto.fillStyle = sinal.estado === 'Vermelho' ? '#a41f2b' : '#17623c';
    contexto.fillRect(legendaX, legendaY, largura, 28);
    contexto.fillStyle = '#fff';
    contexto.fillText(sinal.estado, legendaX + 10, legendaY + 20);
  }

  function desenharWebcam() {
    const escala = Math.max(quadro.width / video.videoWidth, quadro.height / video.videoHeight);
    const largura = video.videoWidth * escala;
    const altura = video.videoHeight * escala;
    contexto.drawImage(video, (quadro.width - largura) / 2, (quadro.height - altura) / 2, largura, altura);
  }

  function desenharSimulacao() {
    contexto.fillStyle = '#bbb';
    contexto.fillRect(0, 0, quadro.width, quadro.height);
    contexto.save();
    contexto.translate(100 + 30 * Math.sin(performance.now() / 1500), 135);
    desenharSinalTeste(contexto, luzSimulada.value);
    contexto.restore();
  }

  function confirmarLeitura(sinal) {
    const anterior = ultimaLeitura;
    ultimaLeitura = sinal;
    if (!sinal || !anterior || sinal.estado !== anterior.estado) return null;

    const distancia = Math.hypot(sinal.x - anterior.x, sinal.y - anterior.y);
    const tolerancia = Math.max(6, Math.max(sinal.w, sinal.h) / 2);
    return distancia <= tolerancia ? sinal : null;
  }

  function analisarQuadro(origem) {
    if (origem === 'webcam' && video.readyState < 2) return;
    if (origem === 'webcam') desenharWebcam();
    else desenharSimulacao();

    // Lê os pixels antes de desenhar a sobreposição, para a legenda não virar entrada da análise.
    const { x, y, w, h } = recorte;
    pixels.drawImage(quadro, x, y, w, h, 0, 0, amostra.width, amostra.height);
    const imagem = pixels.getImageData(0, 0, amostra.width, amostra.height);
    const sinal = confirmarLeitura(reconhecerSinal(imagem));
    if (sinal) {
      document.body.dataset.sinal = sinal.estado.toLowerCase();
      contexto.fillStyle = sinal.estado === 'Vermelho'
        ? 'rgba(170, 23, 41, 0.66)'
        : 'rgba(23, 98, 60, 0.66)';
      contexto.fillRect(0, 0, quadro.width, quadro.height);
    } else {
      delete document.body.dataset.sinal;
    }

    contexto.save();
    contexto.strokeStyle = '#fff';
    contexto.lineWidth = 2;
    contexto.setLineDash([8, 5]);
    contexto.strokeRect(x, y, w, h);
    contexto.restore();

    if (sinal) {
      desenharResultado(sinal);
      informar(sinal.estado === 'Vermelho' ? 'Vermelho. Aguarde.' : 'Verde.');
    } else {
      informar('Inconclusivo. Enquadre a luz e a moldura do semáforo.');
    }
  }

  async function iniciar(origem) {
    pararCamera();
    const tentativa = sessao;
    informar(origem === 'webcam' ? 'Aguardando a webcam…' : 'Iniciando a simulação…');

    try {
      if (origem === 'webcam') {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('A webcam precisa de uma página segura e de permissão.');
        }
        const capturado = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        if (tentativa !== sessao) {
          capturado.getTracks().forEach(track => track.stop());
          return;
        }
        fluxo = capturado;
        video.srcObject = fluxo;
        await video.play();
      }

      if (tentativa !== sessao) return;
      quadro.hidden = false;
      controleSinal.hidden = origem !== 'simulacao';
      if (origem === 'webcam') abrirWebcam.textContent = 'Fechar webcam';
      analisarQuadro(origem);
      temporizador = window.setInterval(() => analisarQuadro(origem), 100);
    } catch (erro) {
      if (tentativa !== sessao) return;
      pararCamera();
      informar(erro.name === 'NotAllowedError'
        ? 'Permita o acesso à webcam no navegador para fazer o teste.'
        : erro.message || 'Não foi possível abrir a câmera.');
    }
  }

  verPercurso.addEventListener('click', () => trocarModo(false));
  verCamera.addEventListener('click', () => trocarModo(true));
  abrirWebcam.addEventListener('click', () => {
    if (fluxo) pararCamera();
    else iniciar('webcam');
  });
  document.querySelector('#simular-camera').addEventListener('click', () => iniciar('simulacao'));
  window.addEventListener('pagehide', pararCamera);
})();
