import registration_service from '#services/registration_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegistrationsController {
    async getGetNumberOfRegisAds({ request, response }: HttpContext) {
        // Get and validate status
        const status = request.input('status') || null
        if (status && !['A', 'N'].includes(status)) {
            return response.badRequest({ message: 'Invalid status value. Must be A or N.' })
        }

        // Get and validate orderField
        const orderField = request.input('orderField') || null
        if (orderField && !['adsId' , 'totalRegistration'].includes(orderField)) {
            return response.badRequest({ message: 'Invalid order field.' })
        }

        // Convert isDescending to boolean
        const orderType = request.input('orderType') || null
        if (orderType && !['asc' , 'desc'].includes(orderType)) {
            return response.badRequest({ message: 'Invalid order type. Must be asc or desc.' })
        }


        // Get and validate periodId
        const periodId = request.input('periodId') || null
        if (periodId && isNaN(Number(periodId))) {
            return response.badRequest({ message: 'Invalid period ID.' })
        }

        // Get and validate monthYear format (expected: YYYY-MM)
        const monthYear = request.input('monthYear') || null
        if (monthYear && !/^\d{4}-\d{2}$/.test(monthYear)) {
            return response.badRequest({ message: 'Invalid monthYear format. Expected: YYYY-MM' })
        }

        const data = await registration_service.getNumberOfRegisAds(status, orderField, orderType, periodId, monthYear)
        return response.ok(data)
    }
}
