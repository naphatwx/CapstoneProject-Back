import vine from '@vinejs/vine'

export const pageAndSearchValidator = vine.compile(
    vine.object({
        page: vine.number(),
        perPage: vine.number(),
        search: vine.string().trim()
    })
)

export const searchValidator = vine.compile(vine.object({
    search: vine.string().trim()
}))
