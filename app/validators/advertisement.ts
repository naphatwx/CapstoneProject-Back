import vine from '@vinejs/vine'

const regexISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z?$/

export const createUpdateAdvertisementValidator = vine.compile(
    vine.object({
        adsName: vine.string().trim().maxLength(500),
        adsCond: vine.string().trim().maxLength(500),
        status: vine.string().trim().maxLength(2),
        periodId: vine.number(),
        redeemCode: vine.string().trim().maxLength(100),
        packageId: vine.number(),
        regisLimit: vine.number().nullable(),
        // updatedUser: vine.string().trim().maxLength(10).nullable(),
        // approveDate: vine.string().trim().regex(regexISO).nullable(),
        // approveUser: vine.string().trim().maxLength(10).nullable(),
        imageName: vine.string().trim().maxLength(500).nullable(),
        refAdsId: vine.number().nullable(),
        consentDesc: vine.string().trim().nullable(),
        recInMth: vine.boolean().nullable(),
        recNextMth: vine.boolean().nullable(),
        nextMth: vine.number().nullable(),
        rgsStrDate: vine.string().trim().nullable(),
        rgsExpDate: vine.string().trim().nullable(),
        logHeader: vine.string().trim().maxLength(250),
        adsPackages: vine.array(vine.object({
            mediaId: vine.number(),
            mediaDesc: vine.string().trim().maxLength(500).nullable()
        })).optional()
    })
)