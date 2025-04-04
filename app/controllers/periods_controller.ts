import { HttpContext } from '@adonisjs/core/http'
import period_service from '#services/period_service'
import { createOrUpdatePeriodValidator, periodIdValidator } from '#validators/period'

export default class PeriodsController {
    async getPeriods({ response }: HttpContext) {
        const periods = await period_service.getPeriods()
        if (!periods || periods.length === 0) {
            return response.status(404).json({ message: 'Periods not found.' })
        }
        return response.ok(periods)
    }

    async createPeriod({ request, response }: HttpContext) {
        const data = request.body()
        const payload = await createOrUpdatePeriodValidator.validate(data)

        const periodIdSuccess = await period_service.createPeriod(payload)
        return response.status(201).json({ message: 'Period has been created', periodId: periodIdSuccess })
    }

    async updatePeriod({ params, request, response }: HttpContext) {
        const periodId = params.periodId
        const data = request.body()

        const periodIdValidated = await periodIdValidator.validate({ periodId: periodId })
        const payload = await createOrUpdatePeriodValidator.validate(data)

        const periodIdSuccess = await period_service.updatePeriod(periodIdValidated.periodId, payload)
        return response.status(200).json({ message: 'Period has been updated', periodId: periodIdSuccess })
    }

    async inactivatePeriod({ params, response }: HttpContext) {
        const periodId = params.periodId
        const periodIdValidated = await periodIdValidator.validate({ periodId: periodId })
        
        await period_service.inactivatePeriod(periodIdValidated.periodId)
        return response.status(200).json({ message: 'Period has been inactivated.' })
    }
}
