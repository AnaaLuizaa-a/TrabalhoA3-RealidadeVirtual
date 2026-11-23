# 🚦 Travessia Segura: Integração de Realidade Virtual (RV) e Realidade Aumentada (RA) na Segurança de Pedestres

> **Protótipo Web Mobile-First e Fundamentação Teórica** desenvolvidos para investigação acadêmica sobre comportamento de risco urbano, ergonomia cognitiva e prevenção de atropelamentos.

---

## 🎯 Sobre o Projeto

Atravessar a faixa de pedestres envolve processamento visual, espacial e tomada de decisão sob carga cognitiva. O uso de smartphones e a atenção dividida aumentam significativamente o risco de acidentes urbanos.

Este projeto propõe um **ciclo complementar de segurança viária** dividido em dois módulos funcionais executáveis diretamente no navegador (WebXR / HTML5):

1. **Módulo de Realidade Virtual (Diagnóstico e Treinamento):** Utiliza a biblioteca **A-Frame** para criar um ambiente 3D controlado e livre de risco físico. Permite medir o tempo de decisão do pedestre e avaliar sua percepção de distância e velocidade diante de um veículo em movimento.
2. **Módulo de Realidade Aumentada (Intervenção e Suporte em Tempo Real):** Utiliza a câmera do dispositivo (`MediaDevices API`) combinada a uma interface de sobreposição contextual (*HUD / Nudging*). Exibe uma guia virtual da faixa e emite alertas visuais e táteis (vibração) imediatos quando um veículo se aproxima em velocidade crítica.

---

## 📂 Estrutura de Pastas do Repositório

```text
projeto-travessia-segura-rv-ra/
├── index.html                    # Página principal com Menu, Cena RV (A-Frame) e HUD RA
├── style.css                     # Estilização responsiva (Mobile-First) e animações de alerta
├── script.js                     # Lógica de simulação, cálculo de tempo de reação e câmera RA
├── README.md                     # Documentação completa do projeto para o GitHub
└── docs/
    └── fundamentacao-teorica.md  # Texto acadêmico estruturado (Psicologia do Trânsito e Ergonomia)
```

---

## 🚀 Como Executar e Hospedar no GitHub Pages

Como o módulo de Realidade Aumentada acessa a câmera do celular, os navegadores exigem conexão segura (**HTTPS**). O **GitHub Pages** fornece isso gratuitamente:

1. Crie um novo repositório público no seu GitHub (ex: `travessia-segura-rv-ra`).
2. Faça o upload de todos os arquivos desta pasta mantendo a estrutura original.
3. No repositório, acesse **Settings** (Configurações) > **Pages** (no menu lateral esquerdo).
4. Em **Source**, selecione `Deploy from a branch`, escolha a branch `main` e a pasta `/ (root)`, depois clique em **Save**.
5. Aguarde cerca de 1 minuto e acesse o link gerado (ex: `https://seu-usuario.github.io/travessia-segura-rv-ra/`) diretamente pelo navegador do seu celular.

---

## 🧠 Pilares Teóricos Abordados

* **Psicologia do Trânsito:** Análise da atenção dividida, distração por dispositivos móveis e julgamento de brechas seguras (*gap acceptance*).
* **Ergonomia Cognitiva:** Redução da carga mental no momento da travessia por meio de sinais visuais intuitivos.
* **Engenharia de Fatores Humanos:** Uso de *nudging* (arquitetura de escolhas) e feedback multimodal (visual + háptico) para induzir comportamentos seguros sem gerar sobrecarga sensorial.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3** (Layout responsivo adaptado para smartphones)
* **JavaScript (ES6+)** (Controle de estado, métricas de tempo e API de vibração)
* **A-Frame (v1.5.0)** (Framework WebVR para renderização 3D e suporte a óculos VR)
* **WebRTC / MediaDevices API** (Captura de vídeo em tempo real para sobreposição em RA)
