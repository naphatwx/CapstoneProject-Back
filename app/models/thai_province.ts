import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import ThaiGeography from './thai_geography.js'
import ThaiAmphure from './thai_amphure.js'

export default class ThaiProvince extends BaseModel {
    public static table = 'THAI_PROVINCES'

    @column({ isPrimary: true, columnName: 'ID' })
    declare id: number

    @column({ columnName: 'NAME_TH' })
    declare nameTh: string

    @column({ columnName: 'NAME_EN' })
    declare nameEn: string

    @column({ columnName: 'GEOGRAPHY_ID' })
    declare geographyId: number

    @column({ columnName: 'CREATED_AT' })
    declare createdAt: DateTime

    @column({ columnName: 'UPDATED_AT' })
    declare updatedAt: DateTime

    @column({ columnName: 'DELETED_AT' })
    declare deletedAt: DateTime

    @hasOne(() => ThaiGeography, {
        foreignKey: 'id',
        localKey: 'geographyId'
    })
    declare geography: HasOne<typeof ThaiGeography>

    @hasMany(() => ThaiAmphure, {
        foreignKey: 'provinceId',
        localKey: 'id'
    })
    declare amphures: HasMany<typeof ThaiAmphure>
}
