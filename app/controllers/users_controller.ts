import user_service from '#services/user_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
    async getUsers({ response }: HttpContext) {
        const users = await user_service.getUsers()
        if (!users || users.length === 0) {
            return response.status(404).json({ message: 'Users not found.' })
        }
        return response.ok(users)
    }

    async getUserById({ params, response }: HttpContext) {
        const userId = params.userId
        const user = await user_service.getUserById(userId)
        if (!user) {
            return response.status(404).json({ message: 'User not found.' })
        }
        return response.ok(user)
    }
}
