import type { HttpContext } from '@adonisjs/core/http'
import period_service from '#services/period_service'

export default class PeriodsController {
    async index({ response }: HttpContext) {
        const periods = await period_service.getPeriods()
        if (!periods || periods.length === 0) {
            return response.status(404).json({ message: 'Periods not found.' })
        }
        return response.ok(periods)
    }
}
