import User from "#models/user"
import { DateTime } from "luxon"

export class UserDTO {
    comCode: string | null
    userId: string
    firstname: string | null
    lastname: string | null
    email: string | null
    telphone: string | null
    loginTime: DateTime | string | null
    logoutTime: DateTime | string | null
    updatedUser: string | null
    updatedDate: DateTime | string | null

    constructor(data: Partial<User>) {
        this.comCode = data.comCode || null
        this.userId = data.userId || ''
        this.firstname = data.firstname || null
        this.lastname = data.lastname || null
        this.email = data.email || null
        this.telphone = data.telphone || null
        this.loginTime = data.loginTime || null
        this.logoutTime = data.logoutTime || null
        this.updatedUser = data.updatedUser || null
        this.updatedDate = data.updatedDate || null
    }
}

export class UserShortDTO {
    comCode: string | null
    userId: string | null
    firstname: string | null
    lastname: string | null

    constructor(data: Partial<User>) {
        this.comCode = data.comCode || null
        this.userId = data.userId || null
        this.firstname = data.firstname || null
        this.lastname = data.lastname || null
    }
}
