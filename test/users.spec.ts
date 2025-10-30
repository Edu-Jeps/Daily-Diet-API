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

  test.only('Criar refeição para um usuário existente', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        username: 'Maria',
        email: 'maria@gmail.com'
      })
    
    const cookies = createUserResponse.get('Set-Cookie')
    
    const pessoa = await request(app.server)
      .get('/users')
      .set('Cookie', cookies!)

    const usuario = pessoa.body.users[0]
    

    let  updatedBestMealSequence

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies!)
      .send({
        name: 'Salada',
        description: 'Salada de alface e tomate',
        date_time: new Date().toISOString(),
        is_healthy: true,
        id_usuario: usuario.id,
      })

    const refeicoes1 = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies!)
    
    const refeicao1 = refeicoes1.body.snacks[1]      

    console.log('AAAAAAAAAA' + JSON.stringify(refeicoes1.body.snacks[1]))
    
    if (refeicao1.is_healthy) {
      updatedBestMealSequence = usuario.meal_sequence + 1
      await request(app.server)
        .patch(`/users/${usuario.id}`)
        .send({
          meal_sequence: updatedBestMealSequence,
        })
    } else {
      await request(app.server)
        .patch(`/users/${usuario.id}`)
        .send({
          meal_sequence: 0,
        })
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies!)
      .send({
        name: 'Salada',
        description: 'Salada de alface e tomate',
        date_time: new Date().toISOString(),
        is_healthy: true,
        id_usuario: usuario.id,
      })
      
    const refeicoes2 = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies!)
    
    const refeicao2 = refeicoes2.body.snacks[1]
      
    if (refeicao2.is_healthy) {
      updatedBestMealSequence = usuario.meal_sequence + 1
      await request(app.server)
        .patch(`/users/${usuario.id}`)
        .send({
          meal_sequence: updatedBestMealSequence,
        })
    } else {
      await request(app.server)
        .patch(`/users/${usuario.id}`)
        .send({
          meal_sequence: 0,
        })
    }

    console.log('aqui pessoa: ' + JSON.stringify(usuario))



    let resultBestSequence = 0

    // comparando a sequencia atual com a melhor sequencia 
    if(usuario.best_meal_sequence < usuario.meal_sequence) {
        resultBestSequence = usuario.meal_sequence
    } else {
        resultBestSequence = usuario.best_meal_sequence
    }
    await request(app.server)
      .patch(`/users/${usuario.id}`)
      .send({
        meal_sequence: updatedBestMealSequence,
        best_meal_sequence: resultBestSequence
      })
      .expect(201)
      // console.log('apos verificar a melhor sequencia' + JSON.stringify(usuario))
  
  console.log('chegou aqui')
  console.log('apos verificar a melhor sequencia' + JSON.stringify(usuario))
  })
})
