import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import ThaiProvince from './thai_province.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class ThaiGeography extends BaseModel {
    public static table = 'THAI_GEOGRAPHIES'

    @column({ isPrimary: true, columnName: 'ID' })
    declare id: number

    @column({ columnName: 'NAME' })
    declare name: string

    @hasMany(() => ThaiProvince, {
        foreignKey: 'geographyId',
        localKey: 'id'
    })
    declare provinces: HasMany<typeof ThaiProvince>
}
