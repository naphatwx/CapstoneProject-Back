import DatabaseException from "#exceptions/database_exception"
import User from "#models/user"

const getUsers = async () => {
    try {
        const users = await User.all()
        return users
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}


const getUserById = async (userId: string) => {
    try {
        const user = await User.query().where('userId', userId).firstOrFail()
        return user
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

export default { getUsers, getUserById }
