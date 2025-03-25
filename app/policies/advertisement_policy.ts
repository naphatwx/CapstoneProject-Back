import ForbiddenException from '#exceptions/forbidden_exception'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class AdvertisementPolicy extends BasePolicy {
    updateActiveAds(user: User, approveUserId: string): AuthorizerResponse {
        if (user.userId === approveUserId) {
            return true
        }
        throw new ForbiddenException('You cannot update active advertisement. Only approver can update.')
    }
}
