import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Role from './role.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class UserRole extends BaseModel {
    public static table = 'CMS_USER_ROLE'

    @column({ isPrimary: true, columnName: 'USER_ID' })
    declare userId: string

    @column({ isPrimary: true, columnName: 'ROLE_ID' })
    declare roleId: number

    @hasOne(() => Role, {
        foreignKey: 'roleId',
        localKey: 'roleId'
    })
    declare role: HasOne<typeof Role>
}
