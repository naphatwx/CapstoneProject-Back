import vine from '@vinejs/vine'

export const geographyIdValidator = vine.compile(vine.object({
    geographyId: vine.number().optional()
}))
