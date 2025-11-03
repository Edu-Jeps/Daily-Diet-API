import type { FastifyInstance } from 'fastify'
import { number, z } from 'zod'
import { db } from '../database.js'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists.js'

export async function metricsRoutes(app: FastifyInstance) {
    //Quantidade total de refeições registradas.
    app.get('/',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, res) => {
        const sessionId = req.cookies.sessionId

        const userInfo = await db('users').where({ session_id: sessionId }).first()

        const snack = await db('snacks')
        .where({ user_id: userInfo.id })
        // .select('*')
        .count('id as count')


        return res.status(200).send(snack[0])
    })
    // Quantidade total de refeições dentro da dieta.
    app.get('/inside',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, res) => {
        const sessionId = req.cookies.sessionId

        const userInfo = await db('users').where({ session_id: sessionId }).first()

        const snack = await db('snacks')
        .where({ user_id: userInfo.id })
        .where({
            is_healthy: 1
        })
        .count('id as snackHealthy')
        


        return res.status(200).send(snack)
    })
    
    // Quantidade total de refeições fora da dieta.
    app.get('/outside',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, res) => {
        const sessionId = req.cookies.sessionId

        const userInfo = await db('users').where({ session_id: sessionId }).first()

        const snack = await db('snacks')
        .where({ user_id: userInfo.id })
        .where({
            is_healthy: 0
        })
        .count('id as snackHealthy')
        


        return res.status(200).send(snack)
    })
    // Melhor sequência de refeições dentro da dieta.
    app.get('/best-meal-sequence',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, res) => {
        const sessionId = req.cookies.sessionId

        const userInfo = await db('users')
        .where({ session_id: sessionId })
        .select('best_meal_sequence')

        return res.status(200).send(userInfo[0])
    })
}