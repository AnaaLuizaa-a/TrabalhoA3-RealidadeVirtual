# 🚦 Travessia Segura: Integração de Realidade Virtual (RV) e Realidade Aumentada (RA) na Segurança de Pedestres

> **Protótipo Web Mobile-First e Fundamentação Teórica** desenvolvidos para investigação acadêmica sobre comportamento de risco urbano, ergonomia cognitiva e prevenção de atropelamentos.

| Protótipo | O que dá para demonstrar |
| --- | --- |
| [Travessia Segura](https://anaaluizaa-a.github.io/TrabalhoA3-RealidadeVirtual/) | Cena de travessia, tempo de decisão e alertas acionados por botões sobre a câmera. |
| [Mapa da travessia](https://anaaluizaa-a.github.io/TrabalhoA3-RealidadeVirtual/mapa-da-travessia/) | Percurso com sete fotos 360° e leitura da luz do semáforo pela câmera ou pelo semáforo de teste. |

---

## 🎯 Sobre o Projeto

Atravessar a faixa de pedestres envolve processamento visual, espacial e tomada de decisão sob carga cognitiva. O uso de smartphones e a atenção dividida aumentam significativamente o risco de acidentes urbanos.

Este projeto propõe um **ciclo complementar de segurança viária** dividido em dois módulos executáveis diretamente no navegador:

1. **Realidade virtual.** Na Travessia Segura, o cenário é desenhado com HTML e CSS. O JavaScript move o carro e avalia a posição dele quando a pessoa decide atravessar. No Mapa, o A-Frame exibe as fotos 360° e o minimapa acompanha o ponto escolhido.
2. **Realidade aumentada.** A câmera do dispositivo fornece a imagem. A Travessia Segura sobrepõe a faixa e oferece botões para simular os alertas. O Mapa lê a cor do semáforo e desenha a indicação sobre a imagem.

---

## 📂 Estrutura de Pastas do Repositório

```text
├── README.md
├── index.html
├── docs/
│   └── fundamentacao-teorica.md
├── travessia-segura/
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── navegacao.js
│       ├── simulador-rv.js
│       └── assistente-ra.js
└── mapa-da-travessia/
    ├── index.html
    ├── sinal-teste.html
    ├── css/estilo.css
    ├── js/
    ├── assets/
    └── vendor/
```

O [`index.html` da raiz](index.html) abre a Travessia Segura. O [HTML do protótipo](travessia-segura/index.html) contém o menu e as duas telas. O [CSS](travessia-segura/css/style.css) dá forma à cena e aos alertas. [Navegação](travessia-segura/js/navegacao.js) troca a tela, [simulador](travessia-segura/js/simulador-rv.js) move o carro e calcula o resultado, e [assistente](travessia-segura/js/assistente-ra.js) abre a câmera e alterna os alertas.

O [README do Mapa](mapa-da-travessia/README.md) indica os arquivos do percurso, da câmera, do reconhecimento e do semáforo de teste. `assets/` guarda os dados das fotos e `vendor/` guarda a biblioteca A-Frame e sua licença.

A [fundamentação teórica](docs/fundamentacao-teorica.md) fica em `docs/`.

## Como abrir

Os links no início do README abrem as versões publicadas no GitHub Pages a partir da `main`. Para testar o código baixado, mantenha as pastas juntas e abra o `index.html` do protótipo no navegador. Para usar a câmera pelo link público, permita o acesso quando o navegador pedir.

---

## 🧠 Pilares Teóricos Abordados

* **Psicologia do Trânsito:** Análise da atenção dividida, distração por dispositivos móveis e julgamento de brechas seguras (*gap acceptance*).
* **Ergonomia Cognitiva:** Redução da carga mental no momento da travessia por meio de sinais visuais intuitivos.
* **Engenharia de Fatores Humanos:** Uso de *nudging* (arquitetura de escolhas) e feedback multimodal (visual + háptico) para induzir comportamentos seguros sem gerar sobrecarga sensorial.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3** (Layout responsivo adaptado para smartphones)
* **JavaScript (ES6+)** (Controle de estado, métricas de tempo e API de vibração)
* **A-Frame 1.6.0** (Visualização das fotos 360° no Mapa da travessia)
* **WebRTC / MediaDevices API** (Captura de vídeo em tempo real para sobreposição em RA)
