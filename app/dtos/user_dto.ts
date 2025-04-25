import User from "#models/user"
import time_service from "#services/time_service"
import { CompanyDTO } from "./company_dtos.js"
import { RoleShortDTO } from "./role_dto.js"

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

export class UserDTO {
    comCode: string | null
    userId: string | null
    firstname: string | null
    lastname: string | null
    email: string | null
    telphone: string | null
    loginTime: string | null
    logoutTime: string | null
    updatedUser: string | null
    updatedDate: string | null

    constructor(user: Partial<User>) {
        this.comCode = user.comCode || null
        this.userId = user.userId || null
        this.firstname = user.firstname || null
        this.lastname = user.lastname || null
        this.email = user.email || null
        this.telphone = user.telphone || null
        this.loginTime = time_service.ensureDateTimeToString(user.loginTime) || null
        this.logoutTime = time_service.ensureDateTimeToString(user.logoutTime) || null
        this.updatedUser = user.updatedUser || null
        this.updatedDate = time_service.ensureDateTimeToString(user.updatedDate) || null
    }
}

export class UserListDTO {
    userId: string | null
    firstname: string | null
    lastname: string | null
    status: boolean
    updatedUser: string | null
    updatedDate: string | null
    userUpdate: UserShortDTO | null
    company: CompanyDTO | null
    role: RoleShortDTO | null

    constructor(user: Partial<User>) {
        this.userId = user.userId || null
        this.firstname = user.firstname || null
        this.lastname = user.lastname || null
        this.status = user.status || false
        this.updatedUser = user.updatedUser || null
        this.updatedDate = time_service.ensureDateTimeToString(user.updatedDate) || null
        this.userUpdate = user.userUpdate ? new UserShortDTO(user.userUpdate) : null
        this.company = user.company ? new CompanyDTO(user.company) : null
        this.role = user.userRoleId ? new RoleShortDTO({
            roleId: user.userRoleId,
            roleName: user.userRoleName
        }) : null
    }
}

export class UserDetailDTO {
    comCode: string | null
    userId: string | null
    firstname: string | null
    lastname: string | null
    email: string | null
    telphone: string | null
    status: boolean
    loginTime: string | null
    logoutTime: string | null
    updatedUser: string | null
    updatedDate: string | null
    userUpdate: UserShortDTO | null
    company: CompanyDTO | null
    role: RoleShortDTO | null

    constructor(user: Partial<User>) {
        this.comCode = user.comCode || null
        this.userId = user.userId || null
        this.firstname = user.firstname || null
        this.lastname = user.lastname || null
        this.email = user.email || null
        this.telphone = user.telphone || null
        this.status = user.status || false
        this.loginTime = time_service.ensureDateTimeToString(user.loginTime) || null
        this.logoutTime = time_service.ensureDateTimeToString(user.logoutTime) || null
        this.updatedUser = user.updatedUser || null
        this.updatedDate = time_service.ensureDateTimeToString(user.updatedDate) || null
        this.userUpdate = user.userUpdate ? new UserShortDTO(user.userUpdate) : null
        this.company = user.company ? new CompanyDTO(user.company) : null
        this.role = user.userRoleId ? new RoleShortDTO({
            roleId: user.userRoleId,
            roleName: user.userRoleName
        }) : null
    }
}
