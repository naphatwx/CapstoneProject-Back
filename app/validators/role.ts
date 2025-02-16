import vine from '@vinejs/vine'

export const roleIdValidator = vine.compile(vine.object({
    roleId: vine.number()
}))
