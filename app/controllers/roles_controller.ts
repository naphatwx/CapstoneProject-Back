import role_service from '#services/role_service'
import { roleIdValidator } from '#validators/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
    async getRoles({ response }: HttpContext) {
        const roles = await role_service.getRoleOptions()
        return response.ok(roles)
    }

    async getRolesById({ params, response }: HttpContext) {
        const roleId = params.roleId
        const payload = await roleIdValidator.validate({
            roleId: roleId
        })
        const roles = await role_service.getRolesById(payload.roleId)
        return response.ok(roles)
    }
}
