import DatabaseException from "#exceptions/database_exception"
import User from "#models/user"
import { UserDetailDTO, UserListDTO } from "../dtos/user_dto.js"
import time_service from "./time_service.js"
import user_role_service from "./user_role_service.js"

const getUsers = async (page: number, perPage: number, search: string) => {
    try {
        const users = await User.query()
            .where('firstname', 'LIKE', `%${search}%`)
            .orWhere('lastname', 'LIKE', `%${search}%`)

            .preload('company')
            .preload('userUpdate')
            .preload('userRole', (userRoleQuery) => {
                userRoleQuery.preload('role')
            })

            .orderBy('userId', 'desc')
            .paginate(page, perPage)

        const usersDTO = users.all().map((user) => new UserListDTO(user.toJSON()))
        return { meta: users.getMeta(), data: usersDTO }
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

const getUserById = async (userId: string) => {
    try {
        const user = await User.query()
            .where('userId', userId)

            .preload('company')
            .preload('userUpdate')
            .preload('userRole', (userRoleQuery) => {
                userRoleQuery.preload('role')
            })
            .firstOrFail()

        const userDTO = new UserDetailDTO(user)
        return userDTO
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

const createUser = async (data: any) => {
    try {
        const newUser = setValue(new User(), data)
        await newUser.save()

        await user_role_service.createUserRole(newUser.userId, data.roleId)

        return newUser.userId
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

const updateUser = async (userId: string, data: any, updatedUserId: string) => {
    try {
        const user = await User.query().where('userId', userId).firstOrFail()
        setValue(user, data)
        user.updatedUser = updatedUserId
        await user.save()

        await user_role_service.createUserRole(user.userId, data.roleId)

        return user.userId
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

const setValue = (user: User, data: any) => {
    user.comCode = data.comCode
    user.userId = data.userId
    user.firstname = data.firstname
    user.lastname = data.lastname
    user.email = data.email
    user.telphone = data.telphone
    user.password = data.password
    user.updatedDate = time_service.getDateTimeNow()

    return user
}

const updateUserLoginTime = async (email: string) => {
    const user = await User.query().where('email', email).firstOrFail()
    user.loginTime = time_service.getDateTimeNow()
    await user.save()
}

const updateUserLogoutTime = async (userId: string) => {
    const user = await User.query().where('userId', userId).firstOrFail()
    user.logoutTime = time_service.getDateTimeNow()
    await user.save()
}

export default { getUsers, getUserById, createUser, updateUser, updateUserLoginTime, updateUserLogoutTime }
