import vine from '@vinejs/vine'

export const pageAndSearchValidator = vine.compile(
    vine.object({
        page: vine.number(),
        perPage: vine.number(),
        search: vine.string().trim()
    })
)

export const paramsAdsPageValidator = vine.compile(
    vine.object({
        page: vine.number().optional(),
        perPage: vine.number().optional(),
        search: vine.string().trim().optional(),
        periodId: vine.number().optional(),
        packageId: vine.number().optional(),
        status: vine.string().trim().optional(),
        orderField: vine.enum(['adsId', 'updatedDate', 'rgsStrDate']).optional(),
        orderType: vine.enum(['asc', 'desc']).optional(),
    })
)

export const searchValidator = vine.compile(vine.object({
    search: vine.string().trim()
}))
