import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AdsPackage extends BaseModel {
    public static table = 'CMS_ADS_PACKAGE'

    @column({ isPrimary: true, columnName: 'ADS_ID', serializeAs: null })
    declare adsId: number

    @column({ isPrimary: true, columnName: 'MEDIA_ID' })
    declare mediaId: number

    @column({ columnName: 'MEDIA_DESC' })
    declare mediaDesc: string | null

    @column({ columnName: 'STATUS' })
    declare status: boolean | null
}