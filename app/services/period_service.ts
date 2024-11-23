import DatabaseException from "#exceptions/database_exception"
import Period from "#models/period"

const getPeriods = async () => {
    try {
        const periods = await Period.query().select('periodId', 'periodDesc', 'period')
        return periods
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

export default { getPeriods }
