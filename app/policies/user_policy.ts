import ForbiddenException from '#exceptions/forbidden_exception'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UserPolicy extends BasePolicy {
    inactivate(user: User, userIdToDelete: string): AuthorizerResponse {
        if (user.userRole.roleId !== 1) throw new ForbiddenException('คุณต้องเป็น Admin ถึงสามารถทำรายการนี้ได้')

        if (user.userId === userIdToDelete) throw new ForbiddenException('คุณไม่สามารถปิดใช้งานตัวเองได้')

        return true
    }
}
