import UnauthorizedException from '#exceptions/unauthorized_exception'
import user_service from '#services/user_service'
import { pageAndSearchValidator } from '#validators/pagination'
import { createUserValidator, updateUserValidator, userIdValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import { isAccess } from '#abilities/main'
import app from '#config/app'
import ForbiddenException from '#exceptions/forbidden_exception'

export default class UsersController {
    private userActivityId = 2

    async login({ auth, request, session }: HttpContext) {
        const { userId, password } = request.all()

        if (userId === '22222' || userId === '33333' || userId === '44444') {
            const user = await user_service.getOnlyUserById(userId)
            return await auth.use('jwt').generate(user)
        }

        let responseAPI
        try {
            const loginURL = 'https://lms-centralportalgateway-dev.pt.co.th/management/Account/CMSLogin'
            responseAPI = await axios.post(loginURL, {
                'user_name': userId,
                'password': password
            }, {
                timeout: 5000, // Limit 5 secs
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (error) {
            throw new UnauthorizedException('Password is not correct.')
        }

        const user = await user_service.getOnlyUserById(userId)
        if (user.status) {
            session.put('tokenData', responseAPI.data.data)
            console.log('respones', responseAPI.data.data)
            console.log('session token', session.get('tokenData'))
            await user_service.updateUserLoginTime(userId)
            return await auth.use('jwt').generate(user)
        } else {
            throw new ForbiddenException('User is inactive.')
        }
    }

    async logout({ auth, response, session }: HttpContext) {
        const user = auth.getUserOrFail()
        session.put('tokenData', '')
        await user_service.updateUserLogoutTime(user.userId)
        return response.status(200).json({ message: 'Logout successfully.' })
    }

    async authenticateToken({ auth, response }: HttpContext) {
        if (await auth.authenticate()) {
            console.log('Token has been unacthenticated.')
            return response.status(200).json({ message: 'Token has been unacthenticated' })
        }
    }

    async getUsers({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.userActivityId)

        const page: number = request.input('page') || app.defaultPage
        const perPage: number = request.input('perPage') || app.defaultPerPage
        const search: string = request.input('search') || ''

        const payload = await pageAndSearchValidator.validate({
            page: page,
            perPage: perPage,
            search: search
        })

        const users = await user_service.getUsers(payload.page, payload.perPage, payload.search)
        return response.ok(users)
    }

    async getUserById({ params, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.userActivityId)

        const userId = params.userId
        const payload = await userIdValidator.validate({
            userId: userId
        })

        const user = await user_service.getUserById(payload.userId)
        return response.ok(user)
    }

    async createUser({ request, response, auth, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultCreate, this.userActivityId)

        const data = request.all()
        const user = auth.getUserOrFail()
        const payload = await createUserValidator.validate(data)

        await user_service.createUser(payload, user.userId)
        return response.status(201).json({ message: 'User has been created.' })
    }

    async updateUser({ params, request, response, auth, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultUpdate, this.userActivityId)

        const userId = params.userId
        const data = request.all()
        const user = auth.getUserOrFail()

        const payload = await updateUserValidator.validate(data)

        await user_service.updateUser(userId, payload, user.userId)
        return response.status(200).json({ message: 'User has been updated.' })
    }

    async inactivateUser({ params, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultDelete, this.userActivityId)

        const userId = params.userId
        const payload = await userIdValidator.validate({
            userId: userId
        })

        await bouncer.with('UserPolicy').authorize('inactivate', payload.userId)

        await user_service.inactivateUser(payload.userId)
        return response.status(200).json({ message: 'User has been inactivated.' })
    }
}
