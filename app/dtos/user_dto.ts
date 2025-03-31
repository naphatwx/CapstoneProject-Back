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
    status: boolean
    updatedUser: string
    updatedDate: string
    userUpdate: UserShortDTO | null
    company: any
    role: any

    constructor(data: any) {
        this.userId = data.userId
        this.firstname = data.firstname || null
        this.lastname = data.lastname || null
        this.status = data.status || false
        this.updatedUser = data.updatedUser
        this.updatedDate = data.updatedDate
        if (data.userUpdate) {
            this.userUpdate = {
                comCode: data.userUpdate?.comCode || null,
                userId: data.userUpdate?.userId || null,
                firstname: data.userUpdate?.firstname || null,
                lastname: data.userUpdate?.lastname || null
            }
        } else {
            this.userUpdate = null
        }
        this.company = data.company || null
        this.role = {
            roleId: data.userRoleId,
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
    status: boolean
    loginTime: string | null
    logoutTime: string | null
    updatedUser: string
    updatedDate: string
    userUpdate: UserShortDTO | null
    company: any
    role: any

    constructor(data: any) {
        this.comCode = data.comCode
        this.userId = data.userId
        this.firstname = data.firstname || null
        this.lastname = data.lastname || null
        this.email = data.email
        this.telphone = data.telphone || null
        this.status = data.status || false
        this.loginTime = data.loginTime || null
        this.logoutTime = data.logoutTime || null
        this.updatedUser = data.updatedUser
        this.updatedDate = data.updatedDate
        if (data.userUpdate) {
            this.userUpdate = {
                comCode: data.userUpdate?.comCode || null,
                userId: data.userUpdate?.userId || null,
                firstname: data.userUpdate?.firstname || null,
                lastname: data.userUpdate?.lastname || null
            }
        } else {
            this.userUpdate = null
        }
        this.company = data.company || null
        this.role = {
            roleId: data.userRoleId,
            roleName: data.userRoleName
        }
    }
}
