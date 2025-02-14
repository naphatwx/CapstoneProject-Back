import User from '#models/user'
import vine from '@vinejs/vine'

export const userIdValidator = vine.compile(vine.object({
    userId: vine.string().maxLength(12)
}))

export const createUserValidator = vine.compile(vine.object({
    comCode: vine.string().trim().maxLength(12),
    userId: vine.string().trim().maxLength(12).unique(async (db, value) => {
        const match = await User.query().select('userId').where('userId', value).first()
        return !match // If matched, it means not unique
    }),
    firstname: vine.string().trim().maxLength(100),
    lastname: vine.string().trim().maxLength(100),
    email: vine.string().trim().maxLength(100).email().normalizeEmail(),
    telphone: vine.string().trim().maxLength(100),
    roleId: vine.number(),
}))

export const updateUserValidator = vine.compile(vine.object({
    oldUserId: vine.string().trim().maxLength(12),
    comCode: vine.string().trim().maxLength(12),
    userId: vine.string().trim().maxLength(12).unique(async (db, value, {parent}) => {
        const oldUserId = parent.oldUserId

        if (oldUserId === value) {
            return true // If not change = pass
        }

        const match = await User.query().select('userId').where('userId', value).whereNot('userId', oldUserId).first()
        return !match // If matched, it means not unique
    }),
    firstname: vine.string().trim().maxLength(100),
    lastname: vine.string().trim().maxLength(100),
    email: vine.string().trim().maxLength(100).email().normalizeEmail(),
    telphone: vine.string().trim().maxLength(100),
    roleId: vine.number(),
}))
