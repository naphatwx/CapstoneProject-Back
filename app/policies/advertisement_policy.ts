import ForbiddenException from '#exceptions/forbidden_exception'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class AdvertisementPolicy extends BasePolicy {
    updateActiveAds(user: User, approveUserId: string): AuthorizerResponse {
        if (user.userId === approveUserId) {
            return true
        } else {
            throw new ForbiddenException('คุณไม่มีสิทธิ์อัปเดตโครงการโฆษณานี้ มีแค่ผู้อนุมมัติโครงการโฆษณาที่สามารถแก้ไขได้')
        }
    }
}
