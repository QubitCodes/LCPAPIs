import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_type').notNullable()
      table.string('name', 50).notNullable()
      table.string('email', 50).notNullable()
      table.string('password', 200).nullable()
      table.boolean('first_login').defaultTo(true).notNullable()
      table.boolean('is_email_verified').defaultTo(false).notNullable()
      table.string('otp_code', 6).nullable()
      table.timestamp('otp_expires_at').nullable()
      table.timestamp('last_login').nullable()
      table.integer('record_status').defaultTo(3).notNullable()
      table.text('uid').nullable()
      table.text('avatar').nullable()
      table.text('phone').nullable()
      table.boolean('is_active').defaultTo(true).notNullable()

      table.timestamp('created_at').defaultTo(this.now()).notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['role_type', 'email'])
      table.unique(['uid'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
