# Fundamentação Teórica e Metodologia do Protótipo

## 1. Introdução e Contextualização do Problema
No ambiente urbano contemporâneo, a travessia de vias públicas representa uma das interações mais críticas entre o comportamento humano e os sistemas de mobilidade. Do ponto de vista científico, atravessar a rua não é um ato puramente mecânico, mas um processo complexo de coleta e processamento de informações visuais, auditivas e espaciais.

Grande parte dos atropelamentos em faixas de pedestres decorre de **atenção dividida** (como o uso de smartphones e fones de ouvido) e de **falhas na percepção de velocidade e distância** dos veículos que se aproximam. Diante desse cenário, tecnologias imersivas como a **Realidade Virtual (RV)** e a **Realidade Aumentada (RA)** emergem como ferramentas complementares para estudo comportamental e prevenção ativa de acidentes.

---

## 2. Pilares Teóricos da Pesquisa

### 2.1 Psicologia do Trânsito
Estuda os processos perceptivos, atencionais e decisórios dos usuários da via. Na travessia de pedestres, destaca-se o conceito de *gap acceptance* (aceitação de brecha): o intervalo de tempo e espaço que o indivíduo julga suficiente para cruzar a pista em segurança. A distração cognitiva compromete a varredura visual (*visual scanning*), aumentando o tempo de reação e induzindo decisões arriscadas.

### 2.2 Ergonomia Cognitiva
Investiga como a carga mental (*cognitive load*) afeta o desempenho humano em tarefas dinâmicas. Quando o pedestre está sobrecarregado por estímulos digitais (mensagens, notificações) e ambientais (ruído, múltiplos veículos), sua capacidade de processar riscos diminui. Sistemas de apoio devem, portanto, apresentar informações claras, objetivas e de baixa demanda interpretativa.

### 2.3 Engenharia de Fatores Humanos e *Nudging*
Analisa a interação entre seres humanos e interfaces tecnológicas em ambientes críticos. Aplicada à segurança viária, fundamenta o uso de **arquitetura de escolhas (*nudging*)**: intervenções visuais ou táteis sutis que orientam o usuário para a decisão mais segura no momento exato do risco, sem exigir esforço cognitivo adicional.

---

## 3. O Ciclo Integrado: RV + RA na Segurança Viária

A proposta metodológica deste trabalho articula as duas tecnologias em fases distintas e complementares:

| Dimensão | Realidade Virtual (RV) | Realidade Aumentada (RA) |
| :--- | :--- | :--- |
| **Função Principal** | Diagnóstico, estudo e treinamento | Prevenção ativa e intervenção em campo |
| **Relação com o Ambiente** | Imersão total em cenário simulado e seguro | Sobreposição de elementos digitais ao mundo real |
| **Métricas e Recursos** | Tempo de decisão, varredura visual, taxa de colisão | Alertas visuais (*HUD*), destaque da faixa, vibração háptica |
| **Aplicação Prática** | Treinamento de grupos vulneráveis e testes em laboratório | Suporte em tempo real para pedestres distraídos |

---

## 4. Arquitetura do Protótipo Desenvolvido
Para validar os conceitos apresentados sem barreiras de instalação, desenvolveu-se uma aplicação web responsiva (*WebXR / HTML5*) composta por dois módulos integrados:

1. **Simulador de Travessia em RV (A-Frame):** Expõe o usuário a uma via urbana tridimensional com fluxo vehicular contínuo. O sistema registra o tempo de observação antes da tomada de decisão e verifica matematicamente a posição do veículo no instante em que o pedestre inicia a travessia, classificando o desfecho em *Segura* ou *Risco de Colisão*.
2. **Assistente de Travessia em RA (MediaDevices API + HUD):** Aciona a câmera traseira do smartphone para capturar o ambiente real e projeta uma delimitação virtual da faixa de pedestres. Mediante a simulação de aproximação de veículo em alta velocidade, a interface altera sua codificação cromática (de verde para vermelho pulsante), exibe alerta textual imediato e aciona o motor de vibração do aparelho.

---

## 5. Considerações Finais
A integração entre Realidade Virtual e Realidade Aumentada oferece uma abordagem completa para a mitigação de atropelamentos: enquanto a RV permite compreender as falhas humanas e treinar reflexos em segurança, a RA atua diretamente no mundo físico como uma barreira cognitiva contra a desatenção. O protótipo web demonstra a viabilidade técnica de implementar tais conceitos utilizando padrões abertos e acessíveis.
