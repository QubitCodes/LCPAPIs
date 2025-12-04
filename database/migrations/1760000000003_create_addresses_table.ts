import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('address_line_1').notNullable()
      table.string('city').notNullable()
      table.integer('district_id').unsigned().references('id').inTable('districts').onDelete('SET NULL')
      table.integer('state_id').unsigned().references('id').inTable('states').onDelete('SET NULL')
      table.string('pincode').notNullable()
      table.string('phone').nullable()
      table.boolean('is_active').defaultTo(true)
      table.integer('created_by').nullable()
      table.integer('updated_by').nullable()
      table.integer('deleted_by').nullable()
      table.timestamp('deleted_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
