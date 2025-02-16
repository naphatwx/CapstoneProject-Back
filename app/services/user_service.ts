import app from "#config/app"
import BadRequestException from "#exceptions/badrequest_exception"
import HandlerException from "#exceptions/handler_exception"
import User from "#models/user"
import { UserDetailDTO, UserListDTO } from "../dtos/user_dto.js"
import time_service from "./time_service.js"
import user_role_service from "./user_role_service.js"

const getUsers = async (page: number, perPage: number, search: string) => {
    try {
        const users = await User.query()
            .where('firstname', 'LIKE', `%${search}%`)
            .orWhere('lastname', 'LIKE', `%${search}%`)
            .orderBy('userId', 'desc')
            .paginate(page, perPage)

        await Promise.all(users.all().map(async (user) => {
            if (user.comCode) {
                await user.load('company')
            }
            if (user.updatedUser) {
                await user.load('userUpdate')
            }
        }))

        const usersDTO = users.all().map((user) => new UserListDTO(user.toJSON()))
        return { meta: users.getMeta(), data: usersDTO }
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getUserById = async (userId: string) => {
    try {
        const user = await User.query()
            .where('userId', userId)
            .firstOrFail()

        if (user.comCode) {
            await user.load('company')
        }
        if (user.updatedUser) {
            await user.load('userUpdate')
        }

        const userDTO = new UserDetailDTO(user)
        return userDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getOnlyUserById = async (userId: string) => {
    try {
        const user = await User.query().where('userId', userId).firstOrFail()
        return user
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const createUser = async (data: any, updatedUserId: string) => {
    try {
        const newUser = setValue(new User(), data, updatedUserId)
        await newUser.save()

        await user_role_service.createUserRole(newUser.userId, data.roleId)

        return newUser.userId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const updateUser = async (userId: string, data: any, updatedUserId: string) => {
    try {
        const user = await User.query().where('userId', userId).firstOrFail()
        const newUser = setValue(user, data, updatedUserId)
        await newUser.save()

        await user_role_service.updateUserRole(newUser.userId, data.roleId)

        return newUser.userId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const setValue = (user: User, data: any, updatedUserId: string) => {
    user.comCode = data.comCode
    user.userId = data.userId
    user.firstname = data.firstname
    user.lastname = data.lastname
    user.email = data.email
    user.telphone = data.telphone
    user.updatedDate = time_service.getDateTime()
    user.updatedUser = updatedUserId

    return user
}

const updateUserLoginTime = async (userId: string) => {
    try {
        const user = await User.query().where('userId', userId).firstOrFail()
        user.loginTime = time_service.getDateTime()
        user.logoutTime = time_service.getDateTime(app.tokenExpiration)
        await user.save()
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const updateUserLogoutTime = async (userId: string) => {
    try {
        const user = await User.query().where('userId', userId).firstOrFail()
        user.logoutTime = time_service.getDateTime()
        await user.save()
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const inactivateUser = async (userId: string) => {
    try {
        if (await user_role_service.isLastAdmin()) {
            throw new BadRequestException('Cannot inactivate last admin.')
        } else {
            const user = await User.query().where('userId', userId).firstOrFail()
            if (user.status === false) {
                throw new BadRequestException('User is already inactive.')
            }
            user.status = false
            await user.save()
        }
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default {
    getUsers,
    getUserById,
    getOnlyUserById,
    createUser,
    updateUser,
    updateUserLoginTime,
    updateUserLogoutTime,
    inactivateUser
}
