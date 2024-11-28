import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class User extends BaseModel {
    public static table = 'CMS_USER_MASTER'

    @column({ columnName: 'COM_CODE' })
    declare comCode: string | null

    @column({ columnName: 'USER_ID', isPrimary: true })
    declare userId: string

    @column({ columnName: 'FIRSTNAME' })
    declare firstname: string | null

    @column({ columnName: 'LASTNAME' })
    declare lastname: string | null

    @column({ columnName: 'EMAIL' })
    declare email: string | null

    @column({ columnName: 'TELPHONE' })
    declare telphone: string | null

    @column({ columnName: 'LOGIN_TIME' })
    declare loginTime: DateTime | string | null

    @column({ columnName: 'LOGOUT_TIME' })
    declare logoutTime: DateTime | string | null

    @column({ columnName: 'UPDATED_USER' })
    declare updatedUser: string | null

    @column({ columnName: 'UPDATED_DATE' })
    declare updatedDate: DateTime | string | null
}
