import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class RegistrationsController {
    async getRegistrationCount({ request, response }: HttpContext) {
        const adsIds = request.input('adsIds') || ''
        let adsIdsStr

        if (typeof adsIds !== "string")  adsIdsStr = adsIds.join(',')
        else adsIdsStr = adsIds

        const regisCount = await db.rawQuery(`EXEC GetRegCount ?`, [adsIdsStr])
        return response.ok(regisCount)
    }

    async getAdsRegisCount({ params, response }: HttpContext) {
        const adsId = params.adsId
        const adsRegisCount = await db.rawQuery('EXEC GetAdsRegisCount ?', [adsId])
        return response.ok(adsRegisCount)
    }

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
