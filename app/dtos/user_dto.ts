export class UserShortDTO {
    comCode: string | null
    userId: string | null
    firstname: string | null
    lastname: string | null

    constructor(data: any) {
        this.comCode = data.comCode || null
        this.userId = data.userId || null
        this.firstname = data.firstname || null
        this.lastname = data.lastname || null
    }
}

export class UserListDTO {
    userId: string
    firstname: string | null
    lastname: string | null
    updatedUser: string
    updatedDate: string
    userUpdate: UserShortDTO
    company: any
    role: any

    constructor(data: any) {
        this.userId = data.userId
        this.firstname = data.firstname || null
        this.lastname = data.lastname || null
        this.updatedUser = data.updatedUser
        this.updatedDate = data.updatedDate
        this.userUpdate = {
            comCode: data.userUpdate?.comCode || null,
            userId: data.userUpdate?.userId || null,
            firstname: data.userUpdate?.firstname || null,
            lastname: data.userUpdate?.lastname || null
        }
        this.company = data.company
        this.role = {
            roleId:  data.userRoleId,
            roleName: data.userRoleName
        }
    }
}

export class UserDetailDTO {
    comCode: string
    userId: string
    firstname: string | null
    lastname: string | null
    email: string
    telphone: string | null
    loginTime: string | null
    logoutTime: string | null
    updatedUser: string
    updatedDate: string
    userUpdate: UserShortDTO
    company: any
    role: any

    constructor(data: any) {
        this.comCode = data.comCode
        this.userId = data.userId
        this.firstname = data.firstname || null
        this.lastname = data.lastname || null
        this.email = data.email
        this.telphone = data.telphone || null
        this.loginTime = data.loginTime || null
        this.logoutTime = data.logoutTime || null
        this.updatedUser = data.updatedUser
        this.updatedDate = data.updatedDate
        this.userUpdate = {
            comCode: data.userUpdate?.comCode || null,
            userId: data.userUpdate?.userId || null,
            firstname: data.userUpdate?.firstname || null,
            lastname: data.userUpdate?.lastname || null
        }
        this.company = data.company
        this.role = {
            roleId:  data.userRoleId,
            roleName: data.userRoleName
        }
    }
}

export class CreateUserDTO {
    comCode: string
    firstname: string
    lastname: string
    email: string
    telphone: string
    password: string

    constructor(data: any) {
        this.comCode = data.comCode
        this.firstname = data.firstname
        this.lastname = data.lastname
        this.email = data.email
        this.telphone = data.telphone
        this.password = data.password
    }

    static fromVinePayload(payload: object): any {
        return new CreateUserDTO(payload as CreateUserDTO)
    }
}
