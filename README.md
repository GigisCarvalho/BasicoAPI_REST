# API de Usuários

API REST desenvolvida com **Node.js**, **Express** e **MySQL** para gerenciamento de usuários.

O projeto permite criar, listar, consultar, pesquisar, atualizar e excluir usuários. A listagem principal possui paginação, com quantidade de registros por página configurável pela URL.

## Funcionalidades

* Criar um novo usuário
* Listar usuários com paginação
* Definir a quantidade de registros por página
* Filtrar usuários pelo status ativo
* Pesquisar usuários por nome ou e-mail
* Consultar um usuário pelo ID
* Atualizar nome e e-mail de um usuário
* Excluir um usuário

## Tecnologias utilizadas

* Node.js
* Express
* MySQL
* mysql2
* CORS
* dotenv

## Estrutura básica do projeto

```text
ProjetoBack_end
├── src
│   ├── db.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── dev_db.txt
├── package.json
├── package-lock.json
└── README.md
```

> O arquivo `.env` e a pasta `node_modules` não devem ser enviados ao GitHub.

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Node.js
* npm
* MySQL
* Uma ferramenta para testar APIs, como Postman

## Instalação

Clone o repositório:

```bash
git clone https://github.com/GigisCarvalho/ProjetoBack_end.git
```

Entre na pasta do projeto:

```bash
cd ProjetoBack_end
```

Instale as dependências:

```bash
npm install
```

## Configuração das variáveis de ambiente

Crie um arquivo chamado `.env` na raiz do projeto:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=crud_usuarios
```

Substitua os valores pelos dados do seu ambiente MySQL.

## Execução

Para iniciar o servidor em modo de observação:

```bash
npm run watch
```

Se o projeto tiver um script `start`, também poderá ser executado com:

```bash
npm start
```

Quando iniciado corretamente, o terminal exibirá uma mensagem semelhante a:

```text
Servidor MySQL rodando em http://localhost:3000
```

> Nos exemplos abaixo, a porta `3000` deve ser substituída pela porta configurada no arquivo `.env`.

## Modelo de usuário

A API utiliza os seguintes campos:

```json
{
  "id": 1,
  "nome": "Usuário de Exemplo",
  "email": "usuario@example.com",
  "telefone": "11999999999",
  "data_nascimento": "1995-08-29",
  "cidade": "São Paulo",
  "estado": "SP",
  "cargo": "Analista de sistemas",
  "ativo": true
}
```

## Endpoints

### Criar usuário

```http
POST /
```

Exemplo de corpo da requisição:

```json
{
  "nome": "Usuário de Exemplo",
  "email": "usuario@example.com",
  "telefone": "11999999999",
  "data_nascimento": "1995-08-29",
  "cidade": "São Paulo",
  "estado": "SP",
  "cargo": "Analista de sistemas",
  "ativo": true
}
```

Exemplo de resposta com status `201 Created`:

```json
{
  "id": 51,
  "nome": "Usuário de Exemplo",
  "email": "usuario@example.com"
}
```

### Listar usuários com paginação

```http
GET /
```

Parâmetros opcionais da consulta:

* `page`: número da página. O valor padrão é `1`.
* `limit`: quantidade de usuários por página. O valor padrão é `10`.

Exemplo:

```http
GET /?page=2&limit=5
```

Exemplo de resposta:

```json
{
  "users": [],
  "pagination": {
    "paginaAtual": 2,
    "ultimaPagina": 10,
    "paginaAnterior": 1,
    "proximaPagina": 3,
    "totalUsuarios": 50
  }
}
```

O deslocamento dos registros é calculado com:

```javascript
(page * limit) - limit
```

### Filtrar usuários por status

```http
GET /usuarios?ativo=1
```

Para usuários ativos:

```http
GET /usuarios?ativo=1
```

Para usuários inativos:

```http
GET /usuarios?ativo=0
```

### Pesquisar por nome ou e-mail

```http
GET /usuarios/search?nome=Ana
```

```http
GET /usuarios/search?email=ana@example.com
```

Também é possível enviar os dois parâmetros:

```http
GET /usuarios/search?nome=Ana&email=ana@example.com
```

A pesquisa atual procura registros cujo nome ou e-mail comece com o valor informado.

### Consultar usuário por ID

```http
GET /:id
```

Exemplo:

```http
GET /1
```

Exemplo de resposta:

```json
{
  "id": 1,
  "nome": "Usuário de Exemplo",
  "email": "usuario@example.com",
  "telefone": "11999999999",
  "data_nascimento": "1995-03-12T03:00:00.000Z",
  "cidade": "São Paulo",
  "estado": "SP",
  "cargo": "Analista de sistemas",
  "ativo": true,
  "criado_em": "2026-10-10T21:04:10.000Z",
  "atualizado_em": "2026-10-11T00:47:07.000Z"
}
```

### Atualizar usuário

```http
PUT /:id
```

Exemplo:

```http
PUT /1
```

Corpo da requisição:

```json
{
  "nome": "Nome atualizado",
  "email": "email.atualizado@example.com"
}
```

Resposta esperada:

```json
{
  "mensagem": "Atualizado com sucesso"
}
```

### Excluir usuário

```http
DELETE /:id
```

Exemplo:

```http
DELETE /1
```

Resposta esperada:

```json
{
  "mensagem": "Deletado com sucesso"
}
```

## Códigos HTTP utilizados

* `200 OK`: operação realizada com sucesso
* `201 Created`: usuário criado com sucesso
* `404 Not Found`: usuário ou registros não encontrados
* `500 Internal Server Error`: falha durante a operação

## Segurança

Nunca envie ao GitHub:

* Arquivo `.env`
* Senhas do banco de dados
* Tokens de acesso
* Strings de conexão com credenciais
* Pasta `node_modules`

Exemplo de `.gitignore`:

```gitignore
node_modules/
.env
```

## Autoria

Desenvolvido por Giovanna Barbosa de Carvalho para estudo e prática de desenvolvimento de APIs REST com Node.js, Express e MySQL.