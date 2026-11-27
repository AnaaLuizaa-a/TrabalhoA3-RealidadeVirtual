# A3 — Mapa da travessia

Abra [site]([https://anaaluizaa-a.github.io/TrabalhoA3-RealidadeVirtual/]) no Chrome e escolha **Percurso 360°** ou **Câmera (RA)**. As duas partes funcionam localmente.

- **Percurso 360°.** Arraste para olhar ao redor. Use **Voltar** e **Avançar** na própria foto. O ponto azul do minimapa indica a posição atual. Os sete pontos são clicáveis.
- **Câmera (RA).** Clique em **Abrir webcam** e autorize o acesso. Enquadre a luz acesa e a caixa escura do semáforo no retângulo central. O aplicativo desenha o resultado ao lado da luz encontrada. Para testar com outra tela, abra o [semáforo de teste](sinal-teste.html) e alterne a luz. **Simular câmera** usa um semáforo desenhado na própria página e passa seus quadros pelo mesmo reconhecimento. **Fechar webcam** e **Percurso 360°** encerram a captura.

## Como funciona

- `trajeto.js` aplica, na esfera `<a-sky>` do A-Frame, a foto selecionada e sincroniza o minimapa. `assets/panorama.js` incorpora os JPEGs para a página abrir sem servidor.
- `camera.js` captura os quadros e desenha a sobreposição quando a cor aparece na mesma região em dois quadros seguidos. `reconhecer-sinal.js` agrupa pixels vermelhos ou verdes vizinhos e confere se há fundo escuro ao redor. Se a leitura ficar ambígua, o resultado é inconclusivo. O código de RA do professor serviu de referência para o fluxo de captura, reconhecimento e integração com a RV.

## Créditos das fotos

Fotos de **Carto'Cité**, capturadas em **17/10/2023**, via Panoramax (OpenStreetMap France), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). A sequência é classificada na fonte como percurso a pé. As panorâmicas foram redimensionadas para 4096 × 2048.

| Ponto | Foto original |
| --- | --- |
| Início | [Registro 23](https://api.panoramax.xyz/?focus=pic&nav=seq&pic=ff49dc6f-c5ef-4aaa-bb76-78ffcb1c2662) |
| Entrada na faixa | [Registro 24](https://api.panoramax.xyz/?focus=pic&nav=seq&pic=f1df5900-e002-45a0-8e3b-6750257699bf) |
| Ilha central | [Registro 25](https://api.panoramax.xyz/?focus=pic&nav=seq&pic=a3579eda-0ed2-4a03-9ac1-2b9de313f48b) |
| Travessia | [Registro 26](https://api.panoramax.xyz/?focus=pic&nav=seq&pic=0c60626e-aea8-43f2-af77-bee157d036a5) |
| Fim da faixa | [Registro 27](https://api.panoramax.xyz/?focus=pic&nav=seq&pic=d0e4c609-0a9f-4566-8d5d-82f490b8c573) |
| Chegada à calçada | [Registro 28](https://api.panoramax.xyz/?focus=pic&nav=seq&pic=9bb7790b-207d-4ca3-8374-721cb38cb15a) |
| Destino | [Registro 29](https://api.panoramax.xyz/?focus=pic&nav=seq&pic=6f925bec-6ac3-4a9c-87e8-f893e3fc9a95) |

## Integrantes do Grupo

- Ana Luiza Mattos de Carvalho - 124114111
- Camila Ferreira dos Santos - 124117665
- Julia Starling Negrini Fudoli - 124222027
- Samuel Zappalá Batista - 12411504

## Referências

- [Enunciado da A3](../PDFs/Trabalho_A3_20261115155746.pdf)
- [Ambiente 360° do professor](https://github.com/otavianommonteiro/RealidadeVirtual/blob/main/ambiente360.html)
- [Exemplo do professor que integra RA e RV](https://github.com/otavianommonteiro/RealidadeAumentada/blob/main/index.html)
- [A-Frame 1.6.0](https://aframe.io/docs/1.6.0/introduction/), [licença MIT](vendor/aframe-LICENSE.txt)
