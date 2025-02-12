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

export default { getPeriods }
