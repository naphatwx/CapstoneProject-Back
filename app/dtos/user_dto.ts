import User from "#models/user"
import time_service from "#services/time_service"

export class UserShortDTO {
    comCode: string | null
    userId: string | null
    firstname: string | null
    lastname: string | null

    constructor(user: Partial<User>) {
        this.comCode = user.comCode || null
        this.userId = user.userId || null
        this.firstname = user.firstname || null
        this.lastname = user.lastname || null
    }
}

export class UserListDTO {
    userId: string | null
    firstname: string | null
    lastname: string | null
    status: boolean | null
    updatedUser: string | null
    updatedDate: string | null
    userUpdate: UserShortDTO | null
    company: any
    role: any

    constructor(user: Partial<User>) {
        this.userId = user.userId || null
        this.firstname = user.firstname || null
        this.lastname = user.lastname || null
        this.status = user.status || null
        this.updatedUser = user.updatedUser || null
        this.updatedDate = time_service.ensureDateTimeToString(user.updatedDate) || null
        if (user.userUpdate) {
            this.userUpdate = {
                comCode: user.userUpdate?.comCode || null,
                userId: user.userUpdate?.userId || null,
                firstname: user.userUpdate?.firstname || null,
                lastname: user.userUpdate?.lastname || null
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
    comCode: string | null
    userId: string | null
    firstname: string | null
    lastname: string | null
    email: string | null
    telphone: string | null
    status: boolean | null
    loginTime: string | null
    logoutTime: string | null
    updatedUser: string | null
    updatedDate: string | null
    userUpdate: UserShortDTO | null
    company: any
    role: any

    constructor(user: Partial<User>) {
        this.comCode = user.comCode || null
        this.userId = user.userId || null
        this.firstname = user.firstname || null
        this.lastname = user.lastname || null
        this.email = user.email || null
        this.telphone = user.telphone || null
        this.status = user.status || null
        this.loginTime = time_service.ensureDateTimeToString(user.loginTime) || null
        this.logoutTime = time_service.ensureDateTimeToString(user.logoutTime) || null
        this.updatedUser = user.updatedUser || null
        this.updatedDate = time_service.ensureDateTimeToString(user.updatedDate) || null
        if (user.userUpdate) {
            this.userUpdate = {
                comCode: user.userUpdate?.comCode || null,
                userId: user.userUpdate?.userId || null,
                firstname: user.userUpdate?.firstname || null,
                lastname: user.userUpdate?.lastname || null
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
