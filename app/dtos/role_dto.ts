import Role from "#models/role"

export class RolesDTO {
    roleId: number | null
    roleName: string | null
    activityId: number | null
    activityName: string | null
    viewed: boolean
    created: boolean
    updated: boolean
    deleted: boolean
    approve: boolean
    export: boolean

    constructor(role: any) {
        this.roleId = role.roleId || null
        this.roleName = role.roleName || null
        this.activityId = role.activityId || null
        this.activityName = role.activityName || null
        this.viewed = role.viewed || false
        this.created = role.created || false
        this.updated = role.updated || false
        this.deleted = role.deleted || false
        this.approve = role.approve || false
        this.export = role.export || false
    }
}

export class RoleShortDTO {
    roleId: number | null
    roleName: string | null

    constructor(role: Partial<Role>) {
        this.roleId = role.roleId || null
        this.roleName = role.roleName || null
    }
}
