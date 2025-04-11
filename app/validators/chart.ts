import vine from '@vinejs/vine'

export const topRegisByPlantValidator = vine.compile(vine.object({
    geographyId: vine.number().optional(),
    provinceId: vine.number().optional(),
    year: vine.number().optional(),
    quarter: vine.enum([1, 2, 3, 4, '1', '2', '3', '4']).optional(),
    limit: vine.number().optional()
}))

export const topRegisByAdsValidator = vine.compile(vine.object({
    periodId: vine.number().optional(),
    packageId: vine.number().optional(),
    status: vine.enum(['A', 'N']).optional(),
    year: vine.number().optional(),
    quarter: vine.enum([1, 2, 3, 4, '1', '2', '3', '4']).optional(),
    limit: vine.number().optional()
}))

export const yearValidator = vine.compile(vine.object({
    year: vine.number().optional()
}))



