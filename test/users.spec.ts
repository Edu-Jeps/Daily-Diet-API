import { expect, test, beforeAll, afterAll, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../src/app.js'
import { describe } from 'node:test'

describe('Criação de usuario', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('Criação de usuario', async () => {
    await request(app.server)
      .post('/users')
      .send({
        username: 'Eduardo',
        email: 'eduardo@gmail.com',
      })
      .expect(201)
  })

})

