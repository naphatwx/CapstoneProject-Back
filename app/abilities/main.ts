/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import User from '#models/user'
import role_service from '#services/role_service'
import { Bouncer } from '@adonisjs/bouncer'

// Delete the following ability to start from scratch
export const editUser = Bouncer.ability(() => {
    return true
})

export const isAccess = Bouncer.ability(async (user: User, field: string, activityId: number) => {
    const role = await role_service.getRoleByRoleIdAndActivityId(user.userRole.roleId, activityId)

    if (role) {
        switch (field) {
            case 'viewed':
                return role.viewed
            case 'created':
                return role.created
            case 'updated':
                return role.updated
            case 'deleted':
                return role.deleted
            case 'approve':
                return role.approve
            case 'export':
                return role.export
            default:
                return false
        }
    } else {
        return false
    }
})
