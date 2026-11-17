# Arquitetura — Simulador de Fogueira

## 1. Objetivo

Criar uma aplicação web interativa que simula uma chama de fogueira. Enquanto o usuário mantém o botão do mouse pressionado, a chama aumenta de intensidade; ao soltar, ela diminui gradualmente até voltar ao estado de repouso.

## 2. Proposta de arquitetura

Para a primeira versão, recomenda-se uma aplicação web cliente, sem backend. A interação e a animação acontecem diretamente no navegador, o que mantém a solução simples, rápida e sem dependência de rede durante o uso.

A chama deve ser desenhada em um elemento **HTML Canvas 2D**. A interface em HTML e CSS apresenta o canvas, uma instrução curta e, opcionalmente, um indicador de intensidade. O código JavaScript controla a entrada do usuário, atualiza o estado da chama e redesenha a animação.

Se for necessário hospedar a aplicação no projeto atual em .NET, o console existente poderá ser substituído por um projeto **ASP.NET Core** para servir os arquivos estáticos. A simulação continuará no navegador; uma API não é necessária para o escopo inicial.

## 3. Estrutura sugerida

```text
Senac.Negociosmd/
├── Senac.Negociosmd.slnx
├── Senac.Negociosmd/
│   ├── Senac.Negociosmd.csproj
│   └── wwwroot/                 # Arquivos publicados pelo ASP.NET Core, se usado
│       ├── index.html
│       ├── css/
│       │   └── site.css
│       ├── js/
│       │   ├── app.js           # Inicialização e eventos da interface
│       │   ├── fire-simulation.js # Estado e regras da simulação
│       │   └── fire-renderer.js # Desenho e animação no Canvas
│       └── assets/              # Recursos visuais opcionais
└── Achitecture.md
```

Para uma versão somente estática, `index.html`, `css/`, `js/` e `assets/` podem ficar em uma pasta de frontend, sem o projeto ASP.NET Core.

## 4. Responsabilidades dos componentes

- **Interface (`index.html` e `site.css`)**: organiza a tela, as instruções e o canvas; adapta-se a telas menores.
- **Entrada (`app.js`)**: inicia a simulação e trata mouse, toque e teclado. A ação deve terminar também quando o ponteiro sai da área ou a janela perde o foco.
- **Simulação (`fire-simulation.js`)**: mantém a intensidade atual e aplica o aumento enquanto a ação está ativa e a redução gradual após sua interrupção.
- **Renderização (`fire-renderer.js`)**: desenha a chama no canvas a cada quadro de animação, usando `requestAnimationFrame`. A aparência pode variar de forma controlada para evitar uma chama estática.
- **Hospedagem (opcional)**: ASP.NET Core entrega os arquivos estáticos; não processa a simulação nem armazena dados na primeira versão.

## 5. Requisitos de interação e acessibilidade

- Suportar mouse e toque, com eventos de ponteiro quando possível.
- Oferecer um controle equivalente por teclado, como manter **Espaço** pressionado.
- Não depender apenas de cor para comunicar a intensidade; exibir um texto ou indicador acessível quando isso for útil.
- Respeitar a preferência de movimento reduzido, diminuindo ou simplificando a animação.
- Garantir que a ação seja encerrada corretamente em `pointerup`, `pointercancel`, perda de foco e saída da janela.

## 6. Requisitos não funcionais

- Manter a renderização fluida sem bloquear a interface.
- Limitar a intensidade e o custo de desenho para evitar uso desnecessário de CPU.
- Ajustar o canvas ao tamanho da tela e à densidade de pixels do dispositivo.
- Não carregar bibliotecas externas ou recursos de terceiros sem necessidade.
- A aplicação deve funcionar sem persistir informações pessoais ou exigir conexão após ser carregada.

## 7. Testes e validação

- Verificar aumento progressivo da chama enquanto o botão permanece pressionado.
- Verificar redução gradual ao soltar o botão e retorno ao repouso.
- Verificar limite máximo de intensidade e comportamento em cliques rápidos.
- Validar mouse, toque, teclado, redimensionamento da janela e perda de foco.
- Conferir fluidez e funcionamento em navegadores modernos de desktop e dispositivos móveis.

## 8. Evolução futura

Persistência de recordes, perfis, compartilhamento ou métricas só deve ser adicionada se surgir essa necessidade. Esses recursos poderiam justificar uma API e armazenamento no backend; não fazem parte da arquitetura mínima da simulação.
