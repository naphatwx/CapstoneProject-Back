import User from "#models/user"

const getUsers = async () => {
    const users = await User.all()
    return users
}

const getUserById = async (userId: string) => {
    const user = await User.query().where('userId', userId).firstOrFail()
    return user
}

export default { getUsers, getUserById }