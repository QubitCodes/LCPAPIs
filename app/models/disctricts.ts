import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import State from './state.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class District extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare districtCode: string
  @column()
  declare stateId: number

  @belongsTo(() => State)
  declare state: BelongsTo<typeof State>
}
