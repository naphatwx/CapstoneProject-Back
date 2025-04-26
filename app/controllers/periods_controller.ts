import { HttpContext } from '@adonisjs/core/http'
import period_service from '#services/period_service'
import { createOrUpdatePeriodValidator, periodIdValidator, periodValidator } from '#validators/period'

export default class PeriodsController {
    async getPeriods({ request, response }: HttpContext) {
        const status = request.input('status', null)
        const orderField = request.input('orderField', 'periodId')
        const orderType = request.input('orderType', 'asc')

        const payload = await periodValidator.validate({ status: status, orderField: orderField, orderType: orderType })
        const periods = await period_service.getPeriods(payload.status, payload.orderField!, payload.orderType)
        return response.ok(periods)
    }

    async createPeriod({ request, response }: HttpContext) {
        const data = request.body()
        const payload = await createOrUpdatePeriodValidator.validate(data)

        const periodIdSuccess = await period_service.createPeriod(payload)
        return response.status(201).json({ message: 'สร้าง Period แล้ว', periodId: periodIdSuccess })
    }

    async updatePeriod({ params, request, response }: HttpContext) {
        const periodId = params.periodId
        const data = request.body()

        const periodIdValidated = await periodIdValidator.validate({ periodId: periodId })
        const payload = await createOrUpdatePeriodValidator.validate(data)

        const periodIdSuccess = await period_service.updatePeriod(periodIdValidated.periodId, payload)
        return response.status(200).json({ message: 'แก้ไข Period แล้ว', periodId: periodIdSuccess })
    }

    async inactivatePeriod({ params, response }: HttpContext) {
        const periodId = params.periodId
        const periodIdValidated = await periodIdValidator.validate({ periodId: periodId })

        await period_service.inactivatePeriod(periodIdValidated.periodId)
        return response.status(200).json({ message: 'ปิดใช้งาน Period แล้ว' })
    }
}
