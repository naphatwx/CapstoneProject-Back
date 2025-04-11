import thai_location_service from '#services/thai_location_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ThaiLocationsController {
    async getProvinces({ response }: HttpContext) {
        const provinces = await thai_location_service.getProvinces()
        return response.ok(provinces)
    }

    async getGeographies({response}: HttpContext) {
        const geographies = await thai_location_service.getGeographies()
        return response.ok(geographies)
    }
}