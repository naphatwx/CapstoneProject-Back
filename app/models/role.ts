import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Role extends BaseModel {
    public static table = 'CMS_ROLE'

    @column({ isPrimary: true, columnName: 'ROLE_ID' })
    declare roleId: number

    @column({ columnName: 'ROLE_NAME' })
    declare roleName: string

    @column({ columnName: 'APPROVE' })
    declare approve: boolean

    @column({ columnName: 'CREATED' })
    declare createdUser: boolean

    @column({ columnName: 'UPDATED' })
    declare updatedUser: boolean

    @column({ columnName: 'EXPORT' })
    declare export: boolean

    @column({ columnName: 'ACTIVITY_ID' })
    declare activityId: number
}
