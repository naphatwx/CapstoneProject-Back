import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
    async getUsers({ }: HttpContext) {
        const users = await User.all()
        return users
    }

    async getUserById({ params }: HttpContext) {
        const userId = params.userId
        const user = await User.query().where('userId', userId).first()
        return user
    }
}