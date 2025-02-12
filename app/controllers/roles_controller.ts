import role_service from '#services/role_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
    async index({ response }: HttpContext) {
        const roles = await role_service.getRoleOptions()
        return response.ok(roles)
    }

    async getRolesById({ params, response }: HttpContext) {
        const roleId = params.roleId
        const roles = await role_service.getRolesById(roleId)
        return response.ok(roles)
    }
}
