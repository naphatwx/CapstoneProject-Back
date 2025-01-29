import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Company extends BaseModel {
    public static table = 'MASTER_COMPANY'

    @column({ isPrimary: true, columnName: 'COM_CODE' })
    declare comCode: string

    @column({ columnName: 'COM_NAME' })
    declare comName: string
}
