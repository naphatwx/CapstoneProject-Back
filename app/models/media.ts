import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Media extends BaseModel {
    public static table = 'CMS_MEDIA_CODE'

    @column({ columnName: 'MEDIA_ID', isPrimary: true })
    declare mediaId: number

    @column({ columnName: 'MEDIA_DESC' })
    declare mediaDesc: string | null

    @column({ columnName: 'STATUS' })
    declare status: boolean | null
}