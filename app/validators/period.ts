import vine from '@vinejs/vine'

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
