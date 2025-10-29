import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../database.js'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists.js'

export async function snackRoutes(app: FastifyInstance) {

    app.post('/',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, res) => {
        const sessionId = req.cookies.sessionId
        const userInfo = await db('users').where({ session_id: sessionId }).first()
        const createSnackBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            date_time: z.coerce.date().max(new Date()),
            is_healthy: z.boolean(),
        }) 

        console.log(userInfo)

        const { name, description, date_time, is_healthy } = createSnackBodySchema.parse(req.body)

        try {
            await db('snacks').insert({
            id: randomUUID(),
            name,
            description,
            date_time,
            is_healthy,
            user_id: userInfo.id,
        })


        if (is_healthy) {
            const updatedBestMealSequence = userInfo.best_meal_sequence + 1

            await db('users') 
                .where({ id: userInfo.id })
                .update({ best_meal_sequence: updatedBestMealSequence })
        } else {
            await db('users')
                .where({ id: userInfo.id })
                .update({ best_meal_sequence: 0 })
        }   
        const refeição = await db('snacks').select().where({ user_id: userInfo.id })
        console.log(refeição)
        return res.status(201).send()

        } catch (error) {
            return res.status(500).send({ error: 'Erro ao criar a refeição.' })
        }


    })
}