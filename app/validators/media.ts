import vine from '@vinejs/vine'

export const mediaValidator = vine.compile(vine.object({
    status: vine.boolean().optional(),
    orderField: vine.enum(['mediaId', 'mediaDesc']).optional(),
    orderType: vine.enum(['asc', 'desc']).optional(),
}))

export const createMediaValidator = vine.compile(vine.object({
    mediaDesc: vine.string().maxLength(500),
}))

export const updateMediaValidator = vine.compile(vine.object({
    mediaId: vine.number(),
    mediaDesc: vine.string().maxLength(500),
}))

export const inactivateMediaValidator = vine.compile(vine.object({
    mediaId: vine.number(),
}))
