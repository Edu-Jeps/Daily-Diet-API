// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      session_id?: string
      usarname: string
      email: string
      meal_sequence: number
      best_meal_sequence: number
      updated_at: string
      created_at: string
    },
    snack: {
      id: string
      name: string
      description: string
      date_time: string
      is_healthy: boolean
      user_id: string
      created_at: string
      updated_at: string

    }
  }
}
