import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare recipientId: number | null

  @column()
  declare content: string

  @column()
  declare room: string

  @column()
  declare isPrivate: boolean

  @column()
  declare isRead: boolean

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'recipientId',
  })
  declare recipient: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
