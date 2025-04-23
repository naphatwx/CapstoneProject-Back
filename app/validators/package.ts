import vine from '@vinejs/vine'

export const packageIdValidator = vine.compile(vine.object({
    packageId: vine.number()
}))

export const createUpdatePackageValidator = vine.compile(vine.object({
    packageDesc: vine.string().maxLength(500),
    mediaIdList: vine.array(vine.number())
}))
