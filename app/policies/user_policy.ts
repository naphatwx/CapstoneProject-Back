import ForbiddenException from '#exceptions/forbidden_exception'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UserPolicy extends BasePolicy {
    inactivate(user: User, userIdToDelete: string): AuthorizerResponse {
        if (user.userRole.roleId !== 1) throw new ForbiddenException('You must be admin to do this action.')

        if (user.userId === userIdToDelete) throw new ForbiddenException('You cannot inactivate yourself.')

        return true
    }
}
