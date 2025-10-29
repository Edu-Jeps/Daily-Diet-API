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

describe.todo('Registrando uma refeição', () => {
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

  test('Criar refeição para um usuário existente', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        username: 'Maria',
        email: 'maria@gmail.com'
      })
    
    const cookies = createUserResponse.get('Set-Cookie')
    

    const best_meal_sequence = await request(app.server)
      .get(`/users/${createUserResponse.body.id}`)
      .set('Cookie', cookies!)
      .get('best_meal_sequence')

    const pessoa = await request(app.server)
      .get(`/users/${createUserResponse.body.id}`)
      .set('Cookie', cookies!)

    const refeicao = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies!)
      .send({
        name: 'Salada',
        description: 'Salada de alface e tomate',
        date_time: new Date().toISOString(),
        is_healthy: true,
        id_usuario: createUserResponse.body.id,
      })
      .expect(201)

      if (refeicao.body.is_healthy) {
        const updatedBestMealSequence = best_meal_sequence + 1
        
        await request(app.server)
          .patch(`/users/${createUserResponse.body.id}/best_meal_sequence`)
          .set('Cookie', cookies!)
          .send({ best_meal_sequence: updatedBestMealSequence })
      } else {
        await request(app.server)
          .patch(`/users/${createUserResponse.body.id}/best_meal_sequence`)
          .set('Cookie', cookies!)
          .send({ best_meal_sequence: 0 })
      }
  })
})
