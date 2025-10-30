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
            const updatedMealSequence = userInfo.meal_sequence + 1
            
            // comparando a sequencia atual com a melhor sequencia 
            if(userInfo.best_meal_sequence < updatedMealSequence) { 
                await db('users') 
                    .where({ id: userInfo.id })
                    .update({ best_meal_sequence: updatedMealSequence })
            } 
            await db('users') 
                .where({ id: userInfo.id })
                .update({ meal_sequence: updatedMealSequence })
        } else {
            await db('users')
                .where({ id: userInfo.id })
                .update({ meal_sequence: 0 })
        }   


        await db('snacks').select().where({ user_id: userInfo.id })

        return res.status(201).send()

        } catch (error) {
            return res.status(500).send({ error: 'Erro ao criar a refeição.' })
        }


    })

    app.get('/',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, res) => {
        const sessionId = req.cookies.sessionId

        const userInfo = await db('users').where({ session_id: sessionId }).first()

        const snacks = await db('snacks').select().where({ user_id: userInfo.id })

        if (snacks .length === 0) {
            return res.status(404).send({ error: 'Nenhum lanche encontrado.' })
        }

        return res.status(200).send()
    })

    app.get('/:id',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, res) => {
        const sessionId = req.cookies.sessionId
        const getUserParamsSchema = z.object({
                id: z.string().uuid(),
            })

        const { id } = getUserParamsSchema.parse(req.params)

        const snackId = id
        
        try {
            const snackInfo = await db('snacks').where({ id: snackId }).first()
            const userId = snackInfo.user_id
            const userInfo = await db('users').where({id: userId }).first()
            if (userInfo.session_id !== sessionId) {
                return res.status(404).send({ error: 'Lanche não encontrado..' })
            }

            if (!snackInfo) {
                return res.status(404).send({ error: 'Lanche não encontrado.' })
            } else {
                return res.status(200).send()
            }
        } catch (error) {
            return res.status(404).send({ error: 'Não foi possivel encontrar o lanche.' })
        }
    })

    app.put('/edit/:id',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, res) => {
        const sessionId = req.cookies.sessionId


        const getUserParamsSchema = z.object({
                id: z.string().uuid(),
            })

        const { id } = getUserParamsSchema.parse(req.params)

        const snackId = id

        try {
            const snackInfo = await db('snacks').where({ id: snackId }).first()
            const userId = snackInfo.user_id
            const userInfo = await db('users').where({id: userId }).first()
            
            // para segurança informo que não foi encontrado o lanche
            // assim não indico se o erro é do lanche ou do usuário
            if (userInfo.session_id !== sessionId) {
                return res.status(404).send({ error: 'Lanche não encontrado..' })
            }
            
            if (!snackInfo) {
                return res.status(404).send({ error: 'Lanche não encontrado.' })
            } else {
    
                const updateSnackBodySchema = z.object({
                    name: z.string(),
                    description: z.string(),
                    date_time: z.coerce.date().max(new Date()),
                    is_healthy: z.boolean(),
                })
                const { name, description, date_time, is_healthy } = updateSnackBodySchema.parse(req.body)
                
                //validar se os dados são diferentes dos atuais antes de atualizar
                if (name === snackInfo.name && description === snackInfo.description && date_time.getTime() === new Date(snackInfo.date_time).getTime() && is_healthy === snackInfo.is_healthy) {
                    return res.status(400).send({ error: 'Nenhum dado foi alterado.' })
                }
                //validar se os dados foram preenchidos antes de atualizar
                const updateFields: any = {}
        
                if (name !== undefined) updateFields.name = name
                if (description !== undefined) updateFields.description = description
                if (date_time !== undefined) updateFields.date_time = date_time
                if (is_healthy !== undefined) updateFields.is_healthy = is_healthy
                
                updateFields.updated_at = new Date().toISOString()
        
                await db('snacks')
                    .where({ id: snackId })
                    .update({ ...updateFields })
        
                return res.status(200).send()
                
            }  
        } catch (error) {
            return res.status(404).send({ error: 'Não foi possivel encontrar o lanche.' })
        }

    })

    app.delete('/:id',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, res) => {
        const sessionId = req.cookies.sessionId
        const getUserParamsSchema = z.object({
                id: z.string().uuid(),
            })

        const { id } = getUserParamsSchema.parse(req.params)
        const snackId = id
        
        try {
            const snackInfo = await db('snacks').where({ id: snackId }).first()
            const userId = snackInfo.user_id
            const userInfo = await db('users').where({id: userId }).first()

            // para segurança informo que não foi encontrado o lanche
            // assim não indico se o erro é do lanche ou do usuário
            if (userInfo.session_id !== sessionId) {
                return res.status(404).send({ error: 'Lanche não encontrado..' })
            }
            if (!snackInfo) {
                return res.status(404).send({ error: 'Lanche não encontrado.' })
            } else {
                await db('snacks')
                    .where({ id: snackId })
                    .delete()
                return res.status(201).send()
            }
        } catch (error) {
            return res.status(404).send({ error: 'Não foi possivel encontrar o lanche.' })
        }
    })

}