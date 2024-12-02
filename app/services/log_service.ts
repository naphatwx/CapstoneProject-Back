import DatabaseException from "#exceptions/database_exception"
import Log from "#models/log"
import time_service from "./time_service.js"

const createLog = async (logHeader: string, userId: string, adsId: number) => {
    const log = await Log.create({
        logHeader: logHeader,
        updatedUser: userId,
        updatedDate: time_service.getDateTimeNow(),
        adsId: adsId
    })

    return log
    // try {
    // } catch (error) {
    //     throw new DatabaseException(error.status)
    // }
}

export default { createLog }
