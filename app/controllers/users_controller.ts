import User from '#models/user'
import user_service from '#services/user_service'
import { paginationAndSearchValidator } from '#validators/pagination'
import { createUserValidator, updateUserValidator, userIdValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
    private defaultPage: number = 1
    private defaultPerPage: number = 10

    async getUsers({ request, response }: HttpContext) {
        const page: number = request.input('page') || this.defaultPage
        const perPage: number = request.input('perPage') || this.defaultPerPage
        const search: string = request.input('search') || ''

        const payload = await paginationAndSearchValidator.validate({
            page: page,
            perPage: perPage,
            search: search
        })

        const users = await user_service.getUsers(payload.page, payload.perPage, payload.search)

        return response.ok(users)
    }

    async getUserById({ params, response }: HttpContext) {
        const userId = params.userId

        const payload = await userIdValidator.validate({
            userId: userId
        })

        const user = await user_service.getUserById(payload.userId)

        return response.ok(user)
    }

    async login({ auth, request }: HttpContext) {
        const { email, password } = request.all()
        const user = await User.verifyCredentials(email, password)

        await user_service.updateUserLoginTime(email)

        return await auth.use('jwt').generate(user)
    }

    async logout({ auth, response }: HttpContext) {
        const user = auth.getUserOrFail()

        await user_service.updateUserLogoutTime(user.userId)

        return response.status(200).json({ message: 'Logout successfully.' })
    }

    async createUser({ request, response }: HttpContext) {
        const data = request.all()

        const payload = await createUserValidator.validate(data)

        await user_service.createUser(payload)

        return response.status(201).json({ message: 'User is created.' })
    }

    async updateUser({ params, request, response, auth }: HttpContext) {
        const userId = params.userId
        const data = request.all()
        const user = auth.getUserOrFail()

        const payload = await updateUserValidator.validate(data)

        await user_service.updateUser(userId, payload, user.userId)

        return response.status(200).json({ message: 'User is updated.' })
    }
}
