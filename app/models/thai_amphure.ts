import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import ThaiProvince from './thai_province.js'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import ThaiTambon from './thai_tambon.js'

export default class ThaiAmphure extends BaseModel {
    public static table = 'THAI_AMPHURES'

    @column({ isPrimary: true, columnName: 'ID' })
    declare id: number

    @column({ columnName: 'NAME_TH' })
    declare nameTh: string

    @column({ columnName: 'NAME_EN' })
    declare nameEn: string

    @column({ columnName: 'PROVINCE_ID' })
    declare provinceId: number

    @column({ columnName: 'CREATED_AT' })
    declare createdAt: DateTime

    @column({ columnName: 'UPDATED_AT' })
    declare updatedAt: DateTime

    @column({ columnName: 'DELETED_AT' })
    declare deletedAt: DateTime

    @hasOne(() => ThaiProvince, {
        foreignKey: 'id',
        localKey: 'provinceId'
    })
    declare province: HasOne<typeof ThaiProvince>

    @hasMany(() => ThaiTambon, {
        foreignKey: 'amphureId',
        localKey: 'id'
    })
    declare tambons: HasMany<typeof ThaiTambon>
}
