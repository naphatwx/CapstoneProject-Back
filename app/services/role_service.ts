import HandlerException from "#exceptions/handler_exception"
import NotFoundException from "#exceptions/notfound_exception"
import Activity from "#models/activity"
import Role from "#models/role"

const getRoleOptions = async () => {
    try {
        const roles = await Role.query().select('roleId', 'roleName').groupBy('roleId', 'roleName')
        return roles
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getRolesById = async (roleId: number) => {
    try {
        const roleData = await Role.query().where('roleId', roleId)

        if (roleData.length === 0) {
            throw new NotFoundException('Roles not found.')
        }

        const activityData = await Activity.all()

        const result = activityData.map((activity) => {
            const matchingRole = roleData.find((role) => role.activityId === activity.activityId)
            return {
                ...activity.toJSON(),
                viewed: matchingRole?.viewed || false,
                created: matchingRole?.created || false,
                updated: matchingRole?.updated || false,
                deleted: matchingRole?.deleted || false,
                approve: matchingRole?.approve || false,
                export: matchingRole?.export || false
            }
        })

        return {
            roleId: roleData[0].roleId,
            roleName: roleData[0].roleName,
            access: result
        }
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getRoleByRoleIdAndActivityId = async (roleId: number, activityId: number) => {
    try {
        const role = await Role.query()
            .where('roleId', roleId)
            .where('activityId', activityId)
            .firstOrFail()
        return role
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default { getRoleOptions, getRolesById, getRoleByRoleIdAndActivityId }
