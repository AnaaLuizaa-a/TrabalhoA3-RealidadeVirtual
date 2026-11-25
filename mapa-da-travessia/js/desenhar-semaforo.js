function desenharSinalTeste(contexto, luz) {
  contexto.fillStyle = '#f4f4f4';
  contexto.fillRect(0, 0, 440, 210);
  contexto.fillStyle = '#202020';
  contexto.fillRect(175, 20, 90, 157);

  const lampadas = [
    { y: 61, estado: 'vermelho', cor: '#e02b38' },
    { y: 137, estado: 'verde', cor: '#16ba65' }
  ];
  for (const lampada of lampadas) {
    contexto.fillStyle = luz === lampada.estado ? lampada.cor : '#454545';
    contexto.beginPath();
    contexto.arc(220, lampada.y, 28, 0, Math.PI * 2);
    contexto.fill();
  }

  contexto.fillStyle = '#222';
  contexto.font = '16px Arial';
  contexto.textAlign = 'center';
  contexto.fillText('Semáforo de teste', 220, 200);
}
