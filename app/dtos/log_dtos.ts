import Log from "#models/log"
import time_service from "#services/time_service"
import { UserShortDTO } from "./user_dto.js"

export class LogDTO {
    itemNo: number | null
    logHeader: string | null
    updatedUser: string | null
    updatedDate: string | null
    user: UserShortDTO | null

    constructor(log: Partial<Log>) {
        this.itemNo = log.itemNo || null
        this.logHeader = log.logHeader || null
        this.updatedUser = log.updatedUser || null
        this.updatedDate = time_service.ensureDateTimeToString(log.updatedDate) || null
        this.user = log.user ? new UserShortDTO(log.user) : null
    }
}