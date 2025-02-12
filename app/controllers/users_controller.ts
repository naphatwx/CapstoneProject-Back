import HandlerException from '#exceptions/handler_exception'
import ForbiddenException from '#exceptions/forbidden_exception'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import user_service from '#services/user_service'
import { paginationAndSearchValidator } from '#validators/pagination'
import { createUserValidator, updateUserValidator, userIdValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import { isAccess } from '#abilities/main'
import app from '#config/app'

export default class UsersController {
    private defaultActivityId: number = 2

    async login({ auth, request }: HttpContext) {
        try {
            const { userId, password } = request.all()

            const responseAPI = await axios.post('https://lms-centralportalgateway-dev.pt.co.th/management/Account/CMSLogin', {
                'user_name': userId,
                'password': password
            })

            if (responseAPI.status === 200) {
                const user = await user_service.getOnlyUserById(userId)

                if (user.status) {
                    await user_service.updateUserLoginTime(userId)
                    return await auth.use('jwt').generate(user)
                } else {
                    throw new ForbiddenException('User is not active.')
                }
            } else {
                throw new UnauthorizedException('Invalid username or password.')
            }
        } catch (error) {
            throw new HandlerException(
                error.status === 404 ? 401 : error.status,
                error.status === 404 ? 'Invalid username or password.' : error.message
            )
        }
    }

    async logout({ auth, response }: HttpContext) {
        const user = auth.getUserOrFail()

        await user_service.updateUserLogoutTime(user.userId)
        return response.status(200).json({ message: 'Logout successfully.' })
    }

    async getUsers({ request, response, bouncer }: HttpContext) {
        if (await bouncer.denies(isAccess, app.defaultView, this.defaultActivityId)) {
            throw new ForbiddenException()
        }

        const page: number = request.input('page') || app.defaultPage
        const perPage: number = request.input('perPage') || app.defaultPerPage
        const search: string = request.input('search') || ''

        const payload = await paginationAndSearchValidator.validate({
            page: page,
            perPage: perPage,
            search: search
        })

        const users = await user_service.getUsers(payload.page, payload.perPage, payload.search)
        return response.ok(users)
    }

    async getUserById({ params, response, bouncer }: HttpContext) {
        if (await bouncer.denies(isAccess, app.defaultView, this.defaultActivityId)) {
            throw new ForbiddenException()
        }

        const userId = params.userId

        const payload = await userIdValidator.validate({
            userId: userId
        })

        const user = await user_service.getUserById(payload.userId)
        return response.ok(user)
    }

    async createUser({ request, response, auth, bouncer }: HttpContext) {
        if (await bouncer.denies(isAccess, app.defaultCreate, this.defaultActivityId)) {
            throw new ForbiddenException()
        }

        const data = request.all()
        const user = auth.getUserOrFail()

        const payload = await createUserValidator.validate(data)
        await user_service.createUser(payload, user.userId)
        return response.status(201).json({ message: 'User is created.' })
    }

    async updateUser({ params, request, response, auth, bouncer }: HttpContext) {
        if (await bouncer.denies(isAccess, app.defaultUpdate, this.defaultActivityId)) {
            throw new ForbiddenException()
        }

        const userId = params.userId
        const data = request.all()
        const user = auth.getUserOrFail()

        const payload = await updateUserValidator.validate({
            oldUserId: userId,
            comCode: data.comCode,
            userId: data.userId,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            telphone: data.telphone,
            roleId: data.roleId
        })

        await user_service.updateUser(userId, payload, user.userId)
        return response.status(200).json({ message: 'User is updated.' })
    }

    async inactivateUser({ params, response, bouncer }: HttpContext) {
        if (await bouncer.denies(isAccess, app.defaultDelete, this.defaultActivityId)) {
            throw new ForbiddenException()
        }

        const userId = params.userId
        const payload = await userIdValidator.validate({
            userId: userId
        })

        await user_service.inactivateUser(payload.userId)
        return response.status(200).json({ message: 'User has been inactivated.' })
    }
}
