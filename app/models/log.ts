import { DateTime } from 'luxon'
import { BaseModel, hasOne, column } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Log extends BaseModel {
    public static table = 'CMS_LOG_MASTER'

    @column({ isPrimary: true, columnName: 'ITEM_NO' })
    declare itemNo: number

    @column({ columnName: 'LOG_HEADER' })
    declare logHeader: string

    @column({ columnName: 'UPDATED_USER' })
    declare updatedUser: string

    @column.dateTime({ columnName: 'UPDATED_DATE' })
    declare updatedDate: DateTime

    @column({ columnName: 'ADS_ID', serializeAs: null })
    declare adsId: number

    @hasOne(() => User, {
        foreignKey: 'userId',
        localKey: 'updatedUser'
    })
    declare user: HasOne<typeof User>
}