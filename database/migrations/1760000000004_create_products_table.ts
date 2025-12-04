import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('role_type').notNullable()
      table.string('email').notNullable()
      table.string('password').notNullable()
      table.integer('first_login').notNullable()
      table.string('otp_code').nullable()
      table.string('otp_expires_at').nullable()
      table.string('last_login').nullable()
      table.string('record_status').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
