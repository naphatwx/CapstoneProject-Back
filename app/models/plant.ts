import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import ThaiTambon from './thai_tambon.js'
import Registration from './registration.js'

export default class Plant extends BaseModel {
    public static table = 'MASTER_PLANT'

    @column({ isPrimary: true, columnName: 'COM_CODE' })
    declare comCode: string

    @column({ isPrimary: true, columnName: 'PLANT_CODE' })
    declare plantCode: string

    @column({ columnName: 'PLANT_NAME_TH' })
    declare plantNameTh: string

    @column({ columnName: 'PLANT_NAME_EN' })
    declare plantNameEn: string

    @column({ columnName: 'STATUS' })
    declare status: boolean | null

    @column({ columnName: 'UPDATED_USER' })
    declare updatedUser: string | null

    @column({ columnName: 'UPDATED_DATE' })
    declare updatedDate: DateTime | string | null

    @column({ columnName: 'TAMBON_ID' })
    declare tambonId: number

    @hasOne(() => User, {
        foreignKey: 'userId',
        localKey: 'updatedUser',
    })
    declare userUpdate: HasOne<typeof User>

    @hasOne(() => Company, {
        foreignKey: 'comCode',
        localKey: 'comCode',
    })
    declare company: HasOne<typeof Company>

    @hasOne(() => ThaiTambon, {
        foreignKey: 'id',
        localKey: 'tambonId',
    })
    declare tambon: HasOne<typeof ThaiTambon>

    @hasMany(() => Registration, {
        foreignKey: 'plantCode',
        localKey: 'plantCode'
    })
    declare registration: HasMany<typeof Registration>
}
