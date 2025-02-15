import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UserPolicy extends BasePolicy {
    login(user: User): AuthorizerResponse {
        return user.status
    }

    inactive(user: User, userIdToDelete: string): AuthorizerResponse {
        console.log(user.userRole.roleId)
        return user.userRole.roleId === 1 && user.userId !== userIdToDelete
    }
}
