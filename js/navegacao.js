const telas = document.querySelectorAll('.screen');
const telaMenu = document.querySelector('#screen-menu');

function mostrarTela(tela) {
  for (const item of telas) {
    item.classList.toggle('active', item === tela);
  }
}
