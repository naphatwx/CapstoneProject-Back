import { DateTime } from 'luxon'
import { BaseModel, column, computed, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import UserRole from './user_role.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
    public static table = 'CMS_USER_MASTER'

    @column({ columnName: 'COM_CODE' })
    declare comCode: string

    @column({ columnName: 'USER_ID', isPrimary: true })
    declare userId: string

    @column({ columnName: 'FIRSTNAME' })
    declare firstname: string | null

    @column({ columnName: 'LASTNAME' })
    declare lastname: string | null

    @column({ columnName: 'EMAIL' })
    declare email: string

    @column({ columnName: 'PASSWORD', serializeAs: null })
    declare password: string

    @column({ columnName: 'TELPHONE' })
    declare telphone: string | null

    @column({ columnName: 'LOGIN_TIME' })
    declare loginTime: DateTime | string | null

    @column({ columnName: 'LOGOUT_TIME' })
    declare logoutTime: DateTime | string | null

    @column({ columnName: 'UPDATED_USER' })
    declare updatedUser: string

    @column({ columnName: 'UPDATED_DATE' })
    declare updatedDate: DateTime | string

    @hasOne(() => User, {
        foreignKey: 'userId',
        localKey: 'updatedUser',
    })
    declare userUpdate: HasOne<typeof User>

    @hasOne(() => Company, {
        foreignKey: 'comCode',
        localKey: 'comCode'
    })
    declare company: HasOne<typeof Company>

    @hasOne(() => UserRole, {
        foreignKey: 'userId',
        localKey: 'userId'
    })
    declare userRole: HasOne<typeof UserRole>

    @computed()
    public get userRoleId() {
        if (this.userRole) {
            return this.userRole.role.roleId
        }
        return
    }

    @computed()
    public get userRoleName() {
        if (this.userRole) {
            return this.userRole.role.roleName
        }
        return
    }
}
