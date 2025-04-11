import { isAccess } from '#abilities/main'
import app from '#config/app'
import registration_service from '#services/registration_service'
import { registrationValidator } from '#validators/registration'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegistrationsController {
    private dashboardActivityId = 3

    async getGetNumberOfRegisAds({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.dashboardActivityId)

        const status = request.input('status') || null
        const orderField = request.input('orderField') || null
        const orderType = request.input('orderType') || null
        const periodId = request.input('periodId') || null
        const monthYear = request.input('monthYear') || null

        const payload = await registrationValidator.validate({ status, orderField, orderType, periodId, monthYear })

        const data = await registration_service.getNumberOfRegisAds(
            payload.status, payload.orderField, payload.orderType, payload.periodId, payload.monthYear
        )
        return response.ok(data)
    }
}
