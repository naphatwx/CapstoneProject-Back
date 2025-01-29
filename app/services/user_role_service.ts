import UserRole from "#models/user_role"

const createUserRole = async (userId: string, roleId: number) => {
    const newUserRole = new UserRole()
    newUserRole.userId = userId
    newUserRole.roleId = roleId
    await newUserRole.save()
}

export default { createUserRole }
