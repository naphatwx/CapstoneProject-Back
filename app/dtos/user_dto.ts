import User from "#models/user"
import time_service from "#services/time_service"
import { CompanyDTO } from "./company_dtos.js"
import { RoleShortDTO } from "./role_dto.js"

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

export class UserDTO {
    comCode: string
    userId: string
    firstname: string
    lastname: string
    email: string
    telphone: string
    loginTime: string
    logoutTime: string
    updatedUser: string
    updatedDate: string

    constructor(user: Partial<User>) {
        this.comCode = user.comCode || ''
        this.userId = user.userId || ''
        this.firstname = user.firstname || ''
        this.lastname = user.lastname || ''
        this.email = user.email || ''
        this.telphone = user.telphone || ''
        this.loginTime = time_service.ensureDateTimeToString(user.loginTime) || ''
        this.logoutTime = time_service.ensureDateTimeToString(user.logoutTime) || ''
        this.updatedUser = user.updatedUser || ''
        this.updatedDate = time_service.ensureDateTimeToString(user.updatedDate) || ''
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
    company: CompanyDTO | null
    role: RoleShortDTO | null

    constructor(user: Partial<User>) {
        this.userId = user.userId || ''
        this.firstname = user.firstname || ''
        this.lastname = user.lastname || ''
        this.status = user.status || false
        this.updatedUser = user.updatedUser || ''
        this.updatedDate = time_service.ensureDateTimeToString(user.updatedDate) || ''
        this.userUpdate = user.userUpdate ? new UserShortDTO(user.userUpdate) : null
        this.company = user.company ? new CompanyDTO(user.company) : null
        this.role = user.userRoleId ? new RoleShortDTO({
            roleId: user.userRoleId,
            roleName: user.userRoleName
        }) : null
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
    company: CompanyDTO | null
    role: RoleShortDTO | null

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
        this.userUpdate = user.userUpdate ? new UserShortDTO(user.userUpdate) : null
        this.company = user.company ? new CompanyDTO(user.company) : null
        this.role = user.userRoleId ? new RoleShortDTO({
            roleId: user.userRoleId,
            roleName: user.userRoleName
        }) : null
    }
}
