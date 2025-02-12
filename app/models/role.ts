import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Activity from './activity.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class Role extends BaseModel {
    public static table = 'CMS_ROLE'

    @column({ isPrimary: true, columnName: 'ROLE_ID' })
    declare roleId: number

    @column({ columnName: 'ROLE_NAME' })
    declare roleName: string

    @column({ columnName: 'ACTIVITY_ID' })
    declare activityId: number

    @column({ columnName: 'VIEWED' })
    declare viewed: boolean

    @column({ columnName: 'CREATED' })
    declare created: boolean

    @column({ columnName: 'UPDATED' })
    declare updated: boolean

    @column({ columnName: 'DELETED' })
    declare deleted: boolean

    @column({ columnName: 'EXPORT' })
    declare export: boolean

    @column({ columnName: 'APPROVE' })
    declare approve: boolean

    @hasOne(() => Activity, {
        foreignKey: 'activityId',
        localKey: 'activityId'
    })
    declare activity: HasOne<typeof Activity>
}
