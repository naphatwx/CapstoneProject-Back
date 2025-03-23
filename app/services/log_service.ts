import HandlerException from "#exceptions/handler_exception"
import Log from "#models/log"
import time_service from "./time_service.js"

const createLog = async (logHeader: string, userId: string, adsId: number) => {
    try {
        const log = await Log.create({
            logHeader: logHeader,
            updatedUser: userId,
            updatedDate: time_service.getDateTimeNow(),
            adsId: adsId
        })

        return log
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default { createLog }
