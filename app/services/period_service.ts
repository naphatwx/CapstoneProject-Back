import ConflictException from "#exceptions/conflict_exception"
import HandlerException from "#exceptions/handler_exception"
import Period from "#models/period"

const getPeriods = async () => {
    try {
        const periods = await Period.query().select('periodId', 'periodDesc', 'period')
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
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default { getPeriods, createPeriod, updatePeriod, inactivatePeriod }
