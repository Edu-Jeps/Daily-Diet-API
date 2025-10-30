# 🍽️  Daily-Diet-API
API para controle de dieta diária, a Daily Diet API

Esta aplicação tem como objetivo gerenciar refeições de usuários, permitindo registrar, editar e acompanhar métricas relacionadas à dieta.

---

## 📋 Regras da Aplicação

### 🧩 Regras de Negócio

- [X] Cada refeição deve estar associada a um usuário.
- [X] O usuário só pode visualizar, editar e apagar as refeições que ele criou.
- [ ] Deve ser possível recuperar as métricas de um usuário:
  - [ ] Quantidade total de refeições registradas.
  - [ ] Quantidade total de refeições dentro da dieta.
  - [ ] Quantidade total de refeições fora da dieta.
  - [ ] Melhor sequência de refeições dentro da dieta.
- [X] Cada refeição deve indicar se está dentro ou fora da dieta.

---

### ⚙️ Regras Funcionais

- [X] Deve ser possível **criar um usuário**.
- [X] Deve ser possível **identificar o usuário entre as requisições**.
- [X] Deve ser possível **registrar uma refeição** com os seguintes campos:
  - [X] Nome
  - [X] Descrição
  - [X] Data e Hora
  - [X] Status (dentro ou fora da dieta)
- [X] Deve ser possível **editar uma refeição**, alterando qualquer campo.
- [X] Deve ser possível **apagar uma refeição**.
- [X] Deve ser possível **listar todas as refeições de um usuário**.
- [X] Deve ser possível **visualizar uma única refeição**.

---

### 🧱 Regras Não Funcionais

- [X] O sistema deve ser possível **identificar o usuário entre as requisições**.
- [X] O acesso às refeições deve ser **restrito ao usuário que criou**.


---

## 🧠 Tecnologias Utilizadas 

- **Node.js** (API)
- **TypeScript** (Linguagem tipada usada para desenvolvimento)
- **Zod** (validação e tipagem de dados)
- **Knex.js** (Query Builder / Migrations)
- **SQLite ou PostgreSQL** (Banco de dados relacional)
- **Fastify** (Servidor HTTP)
- **Vitest** + **Supertest** (Testes automatizados)


---

## 📈 Métricas do Usuário

O sistema deve fornecer as seguintes informações agregadas:

| Métrica | Descrição |
|----------|------------|
| Total de refeições | Número total de refeições registradas pelo usuário |
| Dentro da dieta | Total de refeições marcadas como dentro da dieta |
| Fora da dieta | Total de refeições marcadas como fora da dieta |
| Melhor sequência | Maior sequência contínua de refeições dentro da dieta |

---

## 🚀 Créditos

Desafio proposto pela **[Rocketseat](https://www.rocketseat.com.br/)** como parte do programa de estudos em **Node.js**.  
Projeto criado com foco em **aprendizado, boas práticas e construção de APIs sólidas**.
