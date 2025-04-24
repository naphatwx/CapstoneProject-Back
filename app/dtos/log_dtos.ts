import Log from "#models/log"
import time_service from "#services/time_service"
import { UserShortDTO } from "./user_dto.js"

export class LogDTO {
    itemNo: number
    logHeader: string
    updatedUser: string
    updatedDate: string
    user: UserShortDTO | null

    constructor(log: Partial<Log>) {
        this.itemNo = log.itemNo || 0
        this.logHeader = log.logHeader || ''
        this.updatedUser = log.updatedUser || ''
        this.updatedDate = time_service.ensureDateTimeToString(log.updatedDate)
        this.user = log.user ? new UserShortDTO(log.user) : null
    }
}