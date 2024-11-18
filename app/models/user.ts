import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import Advertisement from './advertisement.js'

// const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
//     uids: ['userId'],
//     passwordColumnName
// })

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

    @column.dateTime({ columnName: 'LOGIN_TIME' })
    declare loginTime: DateTime | null

    @column.dateTime({ columnName: 'LOGOUT_TIME' })
    declare logoutTime: DateTime | null

    @column({ columnName: 'UPDATED_USER' })
    declare updatedUser: string | null

    @column.dateTime({ columnName: 'UPDATED_DATE', autoCreate: true, autoUpdate: true })
    declare updatedDate: DateTime | null

    static accessTokens = DbAccessTokensProvider.forModel(User)
}