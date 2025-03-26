import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class RegistrationsController {
    async getGetNumberOfRegisAds({ request, response }: HttpContext) {
        const status = request.input('status') || null
        const orderField = request.input('orderField') || ''
        const isDescending = request.input('isDescending') || true
        const periodId = request.input('periodId') || null
        const monthYear = request.input('monthYear') || null

        const data = await db.rawQuery('EXEC GetNumberOfRegisAds ?, ?, ?, ?, ?', [status, orderField, isDescending, periodId, monthYear])
        return response.ok(data)
    }
}
