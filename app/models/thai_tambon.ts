import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import ThaiAmphure from './thai_amphure.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class ThaiTambon extends BaseModel {
    public static table = 'THAI_TAMBONS'

    @column({ isPrimary: true, columnName: 'ID' })
    declare id: number

    @column({ columnName: 'NAME_TH' })
    declare nameTh: string

    @column({ columnName: 'NAME_EN' })
    declare nameEn: string

    @column({ columnName: 'ZIP_CODE' })
    declare zipcode: string

    @column({ columnName: 'AMPHURE_ID' })
    declare amphureId: number

    @column({ columnName: 'CREATED_AT' })
    declare createdAt: DateTime

    @column({ columnName: 'UPDATED_AT' })
    declare updatedAt: DateTime

    @column({ columnName: 'DELETED_AT' })
    declare deletedAt: DateTime

    @hasOne(() => ThaiAmphure, {
        foreignKey: 'id',
        localKey: 'amphureId'
    })
    declare amphure: HasOne<typeof ThaiAmphure>
}
