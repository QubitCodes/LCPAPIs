import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare addressLine1: string

  @column()
  declare addressLine2?: string

  @column()
  declare city: string

  @column()
  declare districtId?: number

  @column()
  declare stateId?: number

  @column()
  declare pincode: string

  @column()
  declare phone?: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
