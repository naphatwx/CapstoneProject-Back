import HandlerException from "#exceptions/handler_exception"
import db from "@adonisjs/lucid/services/db"

const getNumberOfRegisAds = async (
    status: string | null,
    orderField: string | null,
    orderType: string | null,
    periodId: number | null,
    monthYear: string | null) => {

    try {
        const data = await db.rawQuery(
            'EXEC GetNumberOfRegisAds ?, ?, ?, ?, ?',
            [status, orderField, orderType, periodId, monthYear]
        )
        return data
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default { getNumberOfRegisAds }