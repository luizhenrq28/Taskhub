# Taskhub

Um aplicativo de lista de tarefas simples e intuitivo, permitindo que os usuários gerenciem suas tarefas pessoais de forma organizada.

## Índice

- [Status do Projeto](#status-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Capturas de Tela ou Demonstração](#capturas-de-tela-ou-demonstração)
- [Instalação](#instalação)
- [Uso](#uso)

## Status do Projeto

**Em desenvolvimento**.  
Este projeto está passível de alterações, melhorias e implementação de novas features.

## Tecnologias utilizadas

 - JavaScript
 - Node.js
 - SQL
 - Express
 - Handlebars
 - Bootstrap 5

## Capturas de Tela ou Demonstração

<img src="https://github.com/luizhenrq28/Taskhub/blob/main/static/img/imagens/Captura%20de%20tela%202023-12-13.png" alt="estrutura do banco de dados" width="400px">
<img src="https://github.com/luizhenrq28/Taskhub/blob/main/static/img/imagens/Captura%20de%20tela%202023-12-14%20111140.png" alt="tela home mobile" width="400px">
<img src="https://github.com/luizhenrq28/Taskhub/blob/main/static/img/imagens/Captura%20de%20tela%202023-12-14%20111240.png" alt="tela home desktop" width="400px">
<img src="https://github.com/luizhenrq28/Taskhub/blob/main/static/img/imagens/Captura%20de%20tela%202023-12-14%20111427.png" alt="tela principal mobile" width="400px">

## Instalação

- Abra o Terminal (ou Git Bash no Windows):
   - Abra o terminal no seu sistema operacional
   - Navegue até o **repositorio git** desejado na sua máquina
   - copie o comando: git clone https://github.com/luizhenrq28/Taskhub.git
   - Navegue para a pasta taskhub
- Instale as dependências:
   - Digite o comando npm install
   - Digite npm run dev para subir o servidor

## Uso
**Caso deseja rodar esse Projeto na sua máquina será necessário:**
- Ter o banco de dados criado localmente com estrutura exibida no tópico [Capturas de Tela ou Demonstração](#capturas-de-tela-ou-demonstração)
- Crie na raiz do projeto uma arquivo .env e sete as variáveis de ambiente com suas credenciais
    - SECRET= secret do jwt
    - DB_HOST= host do banco
    - DB_USER= user do banco
    - DB_DATABASE= nome do banco
    - DB_PASSWORD= senha do banco
