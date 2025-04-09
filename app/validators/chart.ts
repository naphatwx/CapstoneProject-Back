import vine from '@vinejs/vine'

export const topBranchParamValidator = vine.compile(vine.object({
    geographyId: vine.number().optional(),
    provinceId: vine.number().optional(),
    year: vine.number().optional(),
    quarter: vine.enum([1, 2, 3, 4, '1', '2', '3', '4']).optional(),
    limit: vine.number().optional()
}))



