import role_service from '#services/role_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
    async index({response}: HttpContext) {
        const roles = await role_service.getRoles()

        return response.ok(roles)
    }
}
