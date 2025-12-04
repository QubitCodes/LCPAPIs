import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Address from './Address.js'
import Skill from './skill.js'
export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uid: string

  @column()
  declare avatar: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role_type: number | null

  @column()
  declare first_login: boolean

  @column()
  declare is_email_verified: boolean

  @column()
  declare is_active: boolean

  @hasMany(() => Address, {
    foreignKey: 'userId',
    localKey: 'id',
  })
  declare addresses: HasMany<typeof Address>

  @manyToMany(() => Skill, {
    pivotTable: 'skill_user',
  })
  declare skills: ManyToMany<typeof Skill>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
