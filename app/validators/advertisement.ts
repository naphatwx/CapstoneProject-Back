import vine from '@vinejs/vine'

// For this format "2024-11-19T05:05:05.000+07:00"
// const regexISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+\-]\d{2}:\d{2}$/

// For this format "2024-11-19T05:05:05.000Z"
const regesDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

export const createUpdateAdvertisementValidator = vine.compile(
    vine.object({
        // Required
        adsName: vine.string().trim().maxLength(500),
        adsCond: vine.string().trim(),
        status: vine.string().trim().maxLength(2),
        periodId: vine.number(),
        redeemCode: vine.string().trim().maxLength(100),
        packageId: vine.number(),
        logHeader: vine.string().trim().maxLength(250),

        // Not required
        regisLimit: vine.number().nullable(),
        refAdsId: vine.number().nullable(),
        consentDesc: vine.string().trim().nullable(),
        recInMth: vine.boolean().nullable(),
        recNextMth: vine.boolean().nullable(),
        nextMth: vine.number().nullable(),
        rgsStrDate: vine.string().trim().regex(regesDateTime).nullable(),
        rgsExpDate: vine.string().trim().regex(regesDateTime).nullable(),
        adsPackages: vine.array(vine.number()).nullable()
    })
)

export const updateActiveAdsValidator = vine.compile(
    vine.object({
        regisLimit: vine.number().nullable(),
        rgsExpDate: vine.string().trim().regex(regesDateTime).nullable(),
    })
)

export const adsIdValidator = vine.compile(vine.object({
    adsId: vine.number()
}))
