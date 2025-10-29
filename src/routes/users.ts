import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../database.js'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists.js'

export async function usersRoutes(app: FastifyInstance) {

    app.get(
        '/',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, res) => {
            const sessionId = req.cookies.sessionId

            const users = await db('users')
                .where('session_id', sessionId)
                .select()
            return res.send({ users })
        }
    )

    app.get(
        '/:id',
        {
            preHandler: [checkSessionIdExists],
        },
        async (req, res) => {
            const getUserParamsSchema = z.object({
                id: z.string().uuid(),
            })
            const { id } = getUserParamsSchema.parse(req.params)
            const sessionId = req.cookies.sessionId
            const user = await db('users')
                .where({
                    session_id: sessionId,
                    id,
                })
                .first()
            if (!user) {
                return res.status(404).send({ message: 'Não encontrado.' })
            }
            return { user }
        }
    )

    app.post('/', async (req, res) => {
        const createUserBodySchema = z.object({
            username: z.string(),
            email: z.string(),
        })

        const { username, email } = createUserBodySchema.parse(req.body)
        
        let sessionId = req.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            res.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                httpOnly: true,
            })
        }
        
        const usuario = await db('users').insert({
            id: randomUUID(),
            session_id: sessionId,
            username,
            email,
        })
        
        console.log('User created successfully', usuario)
        return res.status(201).send()

    })


}

