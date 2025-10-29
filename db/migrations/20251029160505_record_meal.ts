import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('snacks', (table) => {
        table.uuid('id').primary()
        table.text('name').notNullable()
        table.text('description').notNullable()
        table.timestamp('date_time').notNullable()
        table.boolean('is_healthy').notNullable()
        table.uuid('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE').onUpdate('CASCADE')    
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('snacks')
}

