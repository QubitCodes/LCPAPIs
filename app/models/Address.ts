import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user' // Assuming you have a User model
import State from '#models/state'
import District from '#models/disctricts'

export default class Address extends BaseModel {
  static table = 'addresses' // Explicitly define the table name

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' }) // Map to user_id in the database
  declare userId: number

  @column({ columnName: 'address_line_1' })
  declare addressLine1: string

  @column()
  declare city: string

  @column({ columnName: 'district_id' })
  declare districtId: number | null

  @column({ columnName: 'state_id' })
  declare stateId: number | null

  @column()
  declare pincode: string

  @column()
  declare phone: string | null

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @column({ columnName: 'created_by' })
  declare createdBy: number | null

  @column({ columnName: 'updated_by' })
  declare updatedBy: number | null

  @column({ columnName: 'deleted_by' })
  declare deletedBy: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => User, {
    foreignKey: 'userId',
    localKey: 'id',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => State, {
    foreignKey: 'stateId',
    localKey: 'id',
  })
  declare state: BelongsTo<typeof State>

  @belongsTo(() => District, {
    foreignKey: 'districtId',
    localKey: 'id',
  })
  declare district: BelongsTo<typeof District>
}
