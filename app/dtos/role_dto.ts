export class RolesDTO {
    roleId: number | null
    roleName: string | null
    activityId: number | null
    activityName: string | null
    viewd: boolean
    created: boolean
    updated: boolean
    deleted: boolean
    approve: boolean
    export: boolean

    constructor(data: any) {
        this.roleId = data.roleId || null
        this.roleName = data.roleName || null
        this.activityId = data.activity.activityId || null
        this.activityName = data.activity.activityName || null
        this.viewd = data.viewd || false
        this.created = data.created || false
        this.updated = data.updated || false
        this.deleted = data.deleted || false
        this.approve = data.approve || false
        this.export = data.export || false
    }
}
