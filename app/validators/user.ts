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
    email: vine.string().trim().maxLength(100).email().normalizeEmail().unique(async (db, value, {parent}) => {
        const match = await User.query().select('email').where('email', value).first()
        return !match // If matched, it means not unique
    }),
    telphone: vine.string().trim().maxLength(100),
    password: vine.string().trim().minLength(8).maxLength(16),
    roleId: vine.number(),
}))

export const updateUserValidator = vine.compile(vine.object({
    comCode: vine.string().trim().maxLength(12),
    userId: vine.string().trim().maxLength(12).unique(async (db, value) => {
        const match = await User.query().select('userId').where('userId', value).whereNot('userId', value).first()
        return !match // If matched, it means not unique
    }),
    firstname: vine.string().trim().maxLength(100),
    lastname: vine.string().trim().maxLength(100),
    email: vine.string().trim().maxLength(100).email().normalizeEmail().unique(async (db, value, { parent }) => {
        const userId = parent.userId
        const match = await User.query().select('email').where('email', value).whereNot('userId', userId).first()
        return !match // If matched, it means not unique
    }),
    telphone: vine.string().trim().maxLength(100),
    password: vine.string().trim().minLength(8).maxLength(16),
    roleId: vine.number(),
}))
