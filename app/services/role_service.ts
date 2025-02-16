import HandlerException from "#exceptions/handler_exception"
import Role from "#models/role"
import { RolesDTO } from "../dtos/role_dto.js"

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
        const roles = await Role.query().where('roleId', roleId).preload('activity')

        if (roles.length === 0) {
            throw new HandlerException(404, 'Roles not found.')
        }

        const rolesDTO = roles.map((role) => new RolesDTO(role.toJSON()))
        return rolesDTO
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
