import vine from '@vinejs/vine'

export const periodValidator = vine.compile(vine.object({
    status: vine.boolean().optional(),
    orderField: vine.enum(['periodId', 'periodDesc', 'period']).optional(),
    orderType: vine.enum(['asc', 'desc']).optional(),
}))

export const createOrUpdatePeriodValidator = vine.compile(
    vine.object({
        periodDesc: vine.string().maxLength(500),
        period: vine.number()
    })
)

export const periodIdValidator = vine.compile(
    vine.object({
        periodId: vine.number()
    })
)
