# Instruções para execução
- Instale o Node.js seguindo as instruções nesse [link](https://www.alura.com.br/artigos/como-instalar-node-js-windows-linux-macos?srsltid=AfmBOooYKqIZ5-tYgWK3ZGySw4fhS2IhnbMTBKf7MgDmCxFJAlFdJ3f7).
- Baixe o código fonte e abraum terminal na pasta raiz.
- Para executar o back:
  1. Execute os seguintes comandos para instalar as dependências:
  ```
  cd ./back/
  ```
  ```
  npm install
  ```
  2. Crie um arquivo com o nome ".env" na pasta "back" com o seguinte conteúdo para configurar a conexão com o banco de dados:
  ```
  DATABASE_URL="postgresql://postgres:QBxKSnumxVPYItLvIvtPzNhfFNUBrjwH@junction.proxy.rlwy.net:51950/railway"
  JWT_SECRET="SuperSecretkey"
  ```
  3. Execute este comando para rodar o código:
  ```
  nest start --env-file .env
  ```
- Para executar o front:
  1. Execute os seguintes comandos para instalar as dependências:
  ```
  cd ./front/
  ```
  ```
  npm install
  ```
  2. Crie um arquivo com o nome ".env" na pasta "front" com o seguinte conteúdo para configurar a conexão com o banco de dados:
  ```
  VITE_API_URL="http://localhost:3000"
  ```
  3. Execute este comando para rodar o código:
  ```
  npm run dev
  ```
  4. Use ``` Ctrl+click ``` sobre o link que aparece no terminal para abrir uma guia com o sistema
