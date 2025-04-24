import User from "#models/user"
import time_service from "#services/time_service"

export class UserShortDTO {
    comCode: string
    userId: string
    firstname: string
    lastname: string

    constructor(user: Partial<User>) {
        this.comCode = user.comCode || ''
        this.userId = user.userId || ''
        this.firstname = user.firstname || ''
        this.lastname = user.lastname || ''
    }
}

export class UserListDTO {
    userId: string
    firstname: string
    lastname: string
    status: boolean
    updatedUser: string
    updatedDate: string
    userUpdate: UserShortDTO | null
    company: any
    role: any

    constructor(user: Partial<User>) {
        this.userId = user.userId || ''
        this.firstname = user.firstname || ''
        this.lastname = user.lastname || ''
        this.status = user.status || false
        this.updatedUser = user.updatedUser || ''
        this.updatedDate = time_service.ensureDateTimeToString(user.updatedDate) || ''
        if (user.userUpdate) {
            this.userUpdate = {
                comCode: user.userUpdate?.comCode || '',
                userId: user.userUpdate?.userId || '',
                firstname: user.userUpdate?.firstname || '',
                lastname: user.userUpdate?.lastname || ''
            }
        } else {
            this.userUpdate = null
        }
        this.company = user.company || null
        this.role = {
            roleId: user.userRoleId,
            roleName: user.userRoleName
        }
    }
}

export class UserDetailDTO {
    comCode: string
    userId: string
    firstname: string
    lastname: string
    email: string
    telphone: string
    status: boolean
    loginTime: string
    logoutTime: string
    updatedUser: string
    updatedDate: string
    userUpdate: UserShortDTO | null
    company: any
    role: any

    constructor(user: Partial<User>) {
        this.comCode = user.comCode || ''
        this.userId = user.userId || ''
        this.firstname = user.firstname || ''
        this.lastname = user.lastname || ''
        this.email = user.email || ''
        this.telphone = user.telphone || ''
        this.status = user.status || false
        this.loginTime = time_service.ensureDateTimeToString(user.loginTime) || ''
        this.logoutTime = time_service.ensureDateTimeToString(user.logoutTime) || ''
        this.updatedUser = user.updatedUser || ''
        this.updatedDate = time_service.ensureDateTimeToString(user.updatedDate) || ''
        if (user.userUpdate) {
            this.userUpdate = {
                comCode: user.userUpdate?.comCode || '',
                userId: user.userUpdate?.userId || '',
                firstname: user.userUpdate?.firstname || '',
                lastname: user.userUpdate?.lastname || ''
            }
        } else {
            this.userUpdate = null
        }
        this.company = user.company || null
        this.role = {
            roleId: user.userRoleId,
            roleName: user.userRoleName
        }
    }
}
