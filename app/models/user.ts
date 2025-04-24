import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, beforeFind, column, computed, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import UserRole from './user_role.js'

export default class User extends BaseModel {
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

    @column({ columnName: 'TELPHONE' })
    declare telphone: string | null

    @column({columnName: 'STATUS'})
    declare status: boolean

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

    @beforeFind()
    @beforeFetch()
    public static async preloadUserRole(query: any) {
        query.preload('userRole', (userRoleQuery: any) => {
            userRoleQuery.preload('role')
        })
    }

    @computed()
    public get userRoleId() {
        if (this.userRole.role) {
            return this.userRole.role.roleId
        }
        return 0
    }

    @computed()
    public get userRoleName() {
        if (this.userRole.role) {
            return this.userRole.role.roleName
        }
        return ''
    }
}
