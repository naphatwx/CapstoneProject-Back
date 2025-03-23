import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class AdvertisementPolicy extends BasePolicy {
    updateActiveAds(user: User, approveUserId: string): AuthorizerResponse {
        return user.userId === approveUserId
    }
}
