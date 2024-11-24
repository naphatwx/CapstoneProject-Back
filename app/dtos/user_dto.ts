import User from "#models/user"

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
