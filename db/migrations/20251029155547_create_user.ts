import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.uuid('id').primary()
        table.uuid('session_id').after('id').index()
        table.text('username').notNullable()
        table.text('email').notNullable().unique()
        table.integer('best_meal_sequence').defaultTo(0).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()

    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("users")
}

