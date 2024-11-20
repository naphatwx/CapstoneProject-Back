import vine from '@vinejs/vine'

const regexISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+\-]\d{2}:\d{2}$/

export const createUpdateAdvertisementValidator = vine.compile(
    vine.object({
        adsName: vine.string().trim().maxLength(500),
        adsCond: vine.string().trim().maxLength(500),
        status: vine.string().trim().maxLength(2),
        periodId: vine.number(),
        redeemCode: vine.string().trim().maxLength(100),
        packageId: vine.number(),
        regisLimit: vine.number().nullable(),
        imageName: vine.string().trim().maxLength(500).nullable(),
        refAdsId: vine.number().nullable(),
        consentDesc: vine.string().trim().nullable(),
        recInMth: vine.boolean().nullable(),
        recNextMth: vine.boolean().nullable(),
        nextMth: vine.number().nullable(),
        rgsStrDate: vine.string().trim().regex(regexISO).nullable(),
        rgsExpDate: vine.string().trim().regex(regexISO).nullable(),
        logHeader: vine.string().trim().maxLength(250),
        adsPackages: vine.array(vine.object({
            mediaId: vine.number(),
            mediaDesc: vine.string().trim().maxLength(500).nullable()
        })).optional()
    })
)