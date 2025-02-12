import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Activity extends BaseModel {
    public static table = 'CMS_MASTER_ACTIVITY'

    @column({ isPrimary: true, columnName: 'ACTIVITY_ID' })
    declare activityId: number

    @column({columnName: 'ACTIVITY_NAME'})
    declare activityName: string
}
