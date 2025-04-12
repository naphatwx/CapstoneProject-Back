import thai_location_service from '#services/thai_location_service'
import { geographyIdValidator } from '#validators/thai_location'
import type { HttpContext } from '@adonisjs/core/http'

export default class ThaiLocationsController {
    async getGeographies({ response }: HttpContext) {
        const geographies = await thai_location_service.getGeographies()
        return response.ok(geographies)
    }

    async getProvinces({ request, response }: HttpContext) {
        const geographyId = request.input('geographyId')
        const payload = await geographyIdValidator.validate({ geographyId })
        const provinces = await thai_location_service.getProvinces(payload.geographyId)
        return response.ok(provinces)
    }
}