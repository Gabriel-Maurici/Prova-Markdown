# Stack tecnológico — Simulador de Fogueira

## Stack recomendado

A primeira versão deve ser uma aplicação web leve, com a simulação executada no navegador. Como a interação é pequena e concentrada em uma animação, não há necessidade de adicionar um framework de frontend ou um backend com API.

| Camada | Tecnologia | Uso |
|---|---|---|
| Linguagem da interface | HTML5 | Estrutura da página e elemento `canvas` |
| Estilos | CSS3 | Layout responsivo, cores e apresentação da interface |
| Lógica no navegador | JavaScript moderno (ES Modules) | Entrada do usuário, estado e ciclo da simulação |
| Renderização | Canvas 2D API | Desenho e animação da chama |
| Animação | `requestAnimationFrame` | Atualização fluida da chama sincronizada com o navegador |
| Entrada | Pointer Events e eventos de teclado | Suporte a mouse, toque e controle por teclado |
| Hospedagem opcional | ASP.NET Core sobre .NET 10 | Servir a aplicação estática caso ela seja hospedada pelo projeto .NET |
| Controle de versão | Git | Histórico e colaboração no código-fonte |

## Decisões

- **Sem framework JavaScript na primeira versão:** HTML, CSS e JavaScript atendem ao escopo sem adicionar complexidade ou dependências.
- **Sem API ou banco de dados:** a simulação não precisa persistir dados nem processar informações no servidor.
- **Canvas 2D:** oferece controle direto sobre o desenho da chama e permite animá-la sem depender de imagens prontas.
- **.NET 10 apenas para hospedagem, se necessário:** o projeto atual é um console .NET. Para servir os arquivos pelo ASP.NET Core, será necessário convertê-lo para um projeto Web (`Microsoft.NET.Sdk.Web`). Essa conversão não é necessária se a aplicação for publicada como arquivos estáticos em outro host.
- **Sem bibliotecas visuais ou de animação externas:** manter a implementação pequena e reduzir dependências.

## Ferramentas de desenvolvimento

- **Microsoft Visual Studio 2026:** edição e gerenciamento da solução .NET.
- **Navegadores modernos:** execução e validação da interface e do Canvas.
- **Ferramentas de desenvolvedor do navegador:** inspeção de erros, responsividade e desempenho da animação.

## Testes

Na primeira versão, validar manualmente os principais fluxos em navegadores de desktop e dispositivos móveis: pressionar e soltar, interação por toque e teclado, redimensionamento e perda de foco. Se a aplicação crescer, adicionar testes automatizados de navegador com **Playwright**; isso é opcional e não precisa ser uma dependência inicial.
