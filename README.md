<p align="center">
<br/>
  <img src="homefaster-logo-github.png" width="300px" align="center" alt="Homefaster logo" />
<br/>
<br/>
  <h2 align="center">Uma Api Node.js</h2>
  <p align="center">
     <a href="https://lucianocarv.tech">https://lucianocarv.tech</a>
    <br/>
    <br/>
    A API do Homefaster foi desenvolvida com base no site canadense de aluguel de imóveis Rentfaster
  </p>
</p>
<br/>
<p align="center">
<a href="https://www.linkedin.com/in/lucianocarv/" rel="nofollow"><img src="https://img.shields.io/badge/created%20by-@lucianocarv-4BBAAB.svg" alt="Created by Luciano Carvalho"></a>
<a href="" rel="nofollow"><img src="https://img.shields.io/badge/version-v0.1-blue" alt="Version"></a>
<a href="" rel="nofollow"><img src="https://img.shields.io/badge/type-personal%20project-green" alt="Type"></a>
<a href="" rel="nofollow"><img src="https://img.shields.io/badge/env-only%20dev-orange" alt="Env"></a>
  
</p>

<br/>
<br/>

### Conteúdo

- [Descrição](#descrição)
- [Documentação](#documentação)
- [Instalação](#instalação)

## Descrição

Homefaster API é um projeto pessoal baseado no site canadense Rentfaster e desenvolvida com Node.js. Com ela é possível gerenciar Províncias, Cidades, Comunidades (bairros) e Propriedades utilizando um CRUD construído com o framework Fastify.

## Tecnologias

- [`nodejs`](https://github.com/nodejs/node): runtime JavaScript para back-end.
- [`typescript`](https://github.com/microsoft/TypeScript): superset JavaScript fortemente tipado.
- [`fastify`](https://github.com/fastify/fastify): um framework nodejs rápido e eficiente.
- [`prisma`](https://github.com/prisma/prisma): um super ORM (Object-Relational Mapping) para nodejs.
- [`zod`](https://github.com/colinhacks/zod): validador de schemas para TypeScript.
- [`postgresql`](https://github.com/postgres/postgres): o banco de dados relacional de código aberto mais avançado do mundo (segundo seu próprio site).

## Documentação

## Instalação

Selecione uma pasta local e clone repositório:
```sh
  git clone https://github.com/lucianocarv/homefaster-api.git
```
Adicione o arquivo <code>.env</code> na raiz do projeto:
```sh
  touch .env
```
Instale as dependências do projeto:<br/>
```sh
  yarn ou npm install
```
Dentro do arquivo <code>.env</code> defina a variável <code>DATABASE_URL</code> que será utilizada pelo Prisma:<br/>

Para este projetos estamos usando o PostgreSQL, então definimos o valor dessa variável da seguinte maneira
```properties
 DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```
Definimos as demais variáveis:

Variáveis para a execução do servidor
```properties
PORT=                               # Porta local onde o servidor ficará escutando (ex: 3000)
HOST=                               # É o host onde será executado (ex: localhost, 127.0.0.1 ou 0.0.0.0)
```
Variáveis para a comunicação com o Google Maps<br/>

O projeto depende de duas APIs do Google Maps, a Geocode e a Validate Address<br/>
URL da API Validate Address: https://addressvalidation.googleapis.com/v1:validateAddress<br/>
URL da API Geocode: https://maps.googleapis.com/maps/api/geocode/json<br/>
```properties
GMAPS_API_KEY=                      # É a chave da API do Google Maps
GMAPS_VALIDATE_ADDRESS_API_URL=     # É o edereço para chamar a API do Validate Address
GMAPS_GEOCODE_API_URL=              # É o edereço para chamar a API do Geocode
```
Variáveis do Google Cloud
```properties
CLOUD_PROJECT_ID=
CLOUD_STORAGE_CLIENT_EMAIL=
CLOUD_STORAGE_CLIENT_PRIVATE_KEY=
CLOUD_STORAGE_BUCKET_BASE_URL=
CLOUD_BUCKET_NAME=
```
##### Building...
