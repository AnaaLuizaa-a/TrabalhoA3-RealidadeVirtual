const cartao = document.querySelector('#cartao-teste');
const contexto = cartao.getContext('2d');
const luz = document.querySelector('#luz-do-cartao');
const salvar = document.querySelector('#salvar-cartao');

function atualizarCartao() {
  desenharSinalTeste(contexto, luz.value);
  salvar.href = cartao.toDataURL('image/png');
}

luz.addEventListener('change', atualizarCartao);
atualizarCartao();
