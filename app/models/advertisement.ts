import { DateTime } from 'luxon'
import { BaseModel, column, computed, hasMany, hasOne } from '@adonisjs/lucid/orm'
import Period from './period.js'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Package from './package.js'
import Log from './log.js'
import User from './user.js'
import AdsPackage from './ads_package.js'
import mediaService from '#services/media_service'

export default class Advertisement extends BaseModel {
    public static table = 'CMS_MASTER_ADS'

    @column({ columnName: 'ADS_ID', isPrimary: true })
    declare adsId: number

    @column({ columnName: 'ADS_NAME' })
    declare adsName: string | null

    @column({ columnName: 'ADS_COND' })
    declare adsCond: string | null

    @column({ columnName: 'STATUS' })
    declare status: string | null

    @column({ columnName: 'PERIOD_ID' })
    declare periodId: number

    @column({ columnName: 'REDEEM_CODE' })
    declare redeemCode: string | null

    @column({ columnName: 'PACKAGE_ID' })
    declare packageId: number

    @column({ columnName: 'REGIS_LIMIT' })
    declare regisLimit: number | null

    @column({ columnName: 'UPDATED_USER' })
    declare updatedUser: string | null

    @column({ columnName: 'UPDATED_DATE' })
    declare updatedDate: string | DateTime | null
    
    @column({ columnName: 'APPROVE_DATE' })
    declare approveDate: string | DateTime | null

    @column({ columnName: 'APPROVE_USER' })
    declare approveUser: string | null

    @column({ columnName: 'IMAGE_NAME' })
    declare imageName: string | null

    @column({ columnName: 'REF_ADS_ID' })
    declare refAdsId: number | null

    @column({ columnName: 'CONSENT_DESC' })
    declare consentDesc: string | null

    @column({ columnName: 'REC_IN_MTH' })
    declare recInMth: boolean | null

    @column({ columnName: 'REC_NEXT_MTH' })
    declare recNextMth: boolean | null

    @column({ columnName: 'NEXT_MTH' })
    declare nextMth: number | null

    @column({ columnName: 'RGS_STR_DATE' })
    declare rgsStrDate: DateTime | null | string

    @column({ columnName: 'RGS_EXP_DATE' })
    declare rgsExpDate: DateTime | null | string

    @hasOne(() => Period, {
        foreignKey: 'periodId',
        localKey: 'periodId'
    })
    declare period: HasOne<typeof Period>

    @hasOne(() => User, {
        foreignKey: 'userId',
        localKey: 'updatedUser'
    })
    declare userUpdate: HasOne<typeof User>

    @hasOne(() => User, {
        foreignKey: 'userId',
        localKey: 'approveUser'
    })
    declare userApprove: HasOne<typeof User>

    @hasMany(() => Package, {
        foreignKey: 'packageId', // packageId of Package
        localKey: 'packageId' // packageId of Advertisement
    })
    declare packages: HasMany<typeof Package>

    @hasMany(() => AdsPackage, {
        foreignKey: 'adsId',
        localKey: 'adsId'
    })
    declare adsPackages: HasMany<typeof AdsPackage>

    @hasMany(() => Log, {
        foreignKey: 'adsId', // adsId of Log
        localKey: 'adsId' // adsId of Advertisement
    })
    declare logs: HasMany<typeof Log>

    @computed()
    public get packageDesc() {
        return `${this.packages[0].packageDesc}`
    }

    @computed()
    public get medias() {
        if (!this.packages[0].media) {
            return
        }

        return mediaService.changeMediaFormat(this.packages)
    }

    // Override toJSON to exclude `packages` from serialization
    public toJSON() {
        const serialized = super.toJSON()
        delete serialized.packages // Remove `packages` from JSON output
        return serialized
    }
}