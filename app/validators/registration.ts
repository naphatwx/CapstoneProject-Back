import vine from '@vinejs/vine'

export const registrationValidator = vine.compile(vine.object({
    status: vine.string().in(['A', 'N']).nullable(),
    orderField: vine.string().in(['adsId', 'totalRegistration']).nullable(),
    orderType: vine.string().in(['asc', 'desc']).nullable(),
    periodId: vine.number().nullable(),
    monthYear: vine.string().regex(/^\d{4}-\d{2}$/).nullable(),
}))