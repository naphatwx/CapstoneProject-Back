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
        const rolesDTO = roles.map((role) => new RolesDTO(role.toJSON()))
        return rolesDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getRoleByRoleIdAndAbilityId = async (roleId: number, abilityId: number) => {
    try {
        const role = await Role.query()
            .where('roleId', roleId)
            .where('activityId', abilityId)
            .firstOrFail()
        return role
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default { getRoleOptions, getRolesById, getRoleByRoleIdAndAbilityId }
