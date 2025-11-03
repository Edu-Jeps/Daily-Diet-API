import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users.js' 
import { snackRoutes } from './routes/meals.js'
import { metricsRoutes } from './routes/metrics.js'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, { prefix: '/users' })

app.register(snackRoutes, { prefix: '/meals' })

app.register(metricsRoutes, { prefix: '/metrics' })


