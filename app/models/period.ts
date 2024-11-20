import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Period extends BaseModel {
    public static table = 'CMS_ADS_PERIOD'

    @column({ columnName: 'PERIOD_ID', isPrimary: true })
    declare periodId: number

    @column({ columnName: 'PERIOD_DESC' })
    declare periodDesc: string | null

    @column({ columnName: 'PERIOD' })
    declare period: number

    @column({ columnName: 'STATUS' })
    declare status: boolean | null
}