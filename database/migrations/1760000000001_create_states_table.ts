import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'states'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('state_code').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
