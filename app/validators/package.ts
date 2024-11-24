import vine from '@vinejs/vine'

export const packageIdValidator = vine.compile(vine.object({
    packageId: vine.number()
}))
