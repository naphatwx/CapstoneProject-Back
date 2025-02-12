import HandlerException from "#exceptions/handler_exception"
import UserRole from "#models/user_role"

const getUserRoleByRoleId = async (userId: string) => {
    try {
        const userRole = await UserRole.query().where('userId', userId).firstOrFail()
        return userRole.roleId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const createUserRole = async (userId: string, roleId: number) => {
    try {
        const newUserRole = new UserRole()
        newUserRole.userId = userId
        newUserRole.roleId = roleId
        await newUserRole.save()
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const updateUserRole = async (userId: string, roleId: number) => {
    try {
        const userRole = await UserRole.query().where('userId', userId).firstOrFail()
        userRole.roleId = roleId
        await userRole.save()
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const deleteUserRole = async (userId: string) => {
    try {
        await UserRole.query().where('userId', userId).delete()
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const isLastAdmin = async () => {
    try {
        const user = await UserRole.query().where('roleId', 1)
        return user.length === 1 ? true : false
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default { getUserRoleByRoleId, createUserRole, updateUserRole, deleteUserRole, isLastAdmin }
