import ConflictException from "#exceptions/conflict_exception"
import HandlerException from "#exceptions/handler_exception"
import NotFoundException from "#exceptions/notfound_exception"
import Period from "#models/period"

const getPeriods = async (status: boolean | null = null, orderField: string = 'periodId', orderType: string = 'asc') => {
    try {
        const periods = await Period.query().select('periodId', 'periodDesc', 'period', 'status')
            .if(status !== null, (query) => query.where('status', status!))
            .orderBy(orderField!, orderType === 'asc' ? 'asc' : 'desc')

        if (periods.length === 0) {
            throw new NotFoundException('No periods found.')
        }

        return periods
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const createPeriod = async (data: any) => {
    try {
        const newPeriod = await Period.create({
            periodDesc: data.periodDesc,
            period: data.period,
            status: true
        })
        return newPeriod.periodId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const updatePeriod = async (periodId: number, data: any) => {
    try {
        await Period.query().where('periodId', periodId).update({
            periodDesc: data.periodDesc,
            period: data.period
        })
        return periodId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const inactivatePeriod = async (periodId: number) => {
    try {
        const period = await Period.query().where('periodId', periodId).firstOrFail()

        if (!period.status) {
            throw new ConflictException('Period is already inactive.')
        }

        period.status = false
        await period.save()
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default { getPeriods, createPeriod, updatePeriod, inactivatePeriod }
