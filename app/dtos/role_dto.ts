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

    constructor(data: any) {
        this.roleId = data.roleId || 0
        this.roleName = data.roleName || ''
        this.activityId = data.activityId || 0
        this.activityName = data.activityName || ''
        this.viewed = data.viewed || false
        this.created = data.created || false
        this.updated = data.updated || false
        this.deleted = data.deleted || false
        this.approve = data.approve || false
        this.export = data.export || false
    }
}
