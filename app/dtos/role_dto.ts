import Role from "#models/role"

export class RolesDTO {
    roleId: number
    roleName: string
    activityId: number
    activityName: string
    viewed: boolean
    created: boolean
    updated: boolean
    deleted: boolean
    approve: boolean
    export: boolean

    constructor(role: any) {
        this.roleId = role.roleId || 0
        this.roleName = role.roleName || ''
        this.activityId = role.activityId || 0
        this.activityName = role.activityName || ''
        this.viewed = role.viewed || false
        this.created = role.created || false
        this.updated = role.updated || false
        this.deleted = role.deleted || false
        this.approve = role.approve || false
        this.export = role.export || false
    }
}

export class RoleShortDTO {
    roldId: number
    roleName: string

    constructor(role: Partial<Role>) {
        this.roldId = role.roleId || 0
        this.roleName = role.roleName || ''
    }
}
