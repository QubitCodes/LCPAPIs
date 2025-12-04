import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import District from './disctricts.js'

export default class State extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare stateCode: string
  @hasMany(() => District)
  declare districts: HasMany<typeof District>
}
