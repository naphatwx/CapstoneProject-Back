import DatabaseException from "#exceptions/database_exception"
import Role from "#models/role"

const getRoles = async () => {
    const roles = await Role.query().select('roleId', 'roleName').groupBy('roleId', 'roleName')

    return roles
    // try {

    // } catch (error) {
    //     throw new DatabaseException(error.status)
    // }
}

const getRoleById = async (roleId: number) => {
    const role = await Role.query().where('roleId', roleId).firstOrFail()

    return role
    // try {

    // } catch (error) {
    //     throw new DatabaseException(error.status)
    // }
}

export default { getRoles, getRoleById }
