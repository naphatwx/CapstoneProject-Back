import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Advertisement from './advertisement.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Plant from './plant.js'

export default class Registration extends BaseModel {
    public static table = 'CMS_REGISTER_ADS'

    @column({ isPrimary: true, columnName: 'COM_CODE' })
    declare comCode: string

    @column({ isPrimary: true, columnName: 'PLANT_CODE' })
    declare plantCode: string

    @column({ isPrimary: true, columnName: 'REGIS_NO' })
    declare regisNo: string

    @column({ columnName: 'MAX_CARD' })
    declare maxCard: string

    @column({ columnName: 'ADS_ID' })
    declare adsId: number

    @column({ columnName: 'REGIS_DATE' })
    declare regisDate: DateTime

    @column({ columnName: 'ADS_EXPIRE_DATE' })
    declare adsExpireDate: DateTime

    @column({ columnName: 'DRIVE_LICENSE' })
    declare driveLicense: string

    @column({ columnName: 'DRIVE_LICENSE_EXP' })
    declare driveLicenseExp: DateTime

    @column({ columnName: 'CAR_LICENSE' })
    declare carLicense: string

    @column({ columnName: 'CONSENT_CF' })
    declare consentCf: boolean

    @column({ columnName: 'CREATED_USER' })
    declare createdUser: string

    @column({ columnName: 'CREATED_DATE' })
    declare createdDate: DateTime

    @column({ columnName: 'CITIZEN_ID' })
    declare citizenId: string

    @column({ columnName: 'ADS_START_DATE' })
    declare adsStartDate: DateTime

    @hasOne(() => Advertisement, {
        foreignKey: 'adsId',
        localKey: 'adsId',
    })
    declare advertisement: HasOne<typeof Advertisement>

    @hasOne(() => Plant, {
        foreignKey: 'plantCode',
        localKey: 'plantCode',
    })
    declare plant: HasOne<typeof Plant>
}
