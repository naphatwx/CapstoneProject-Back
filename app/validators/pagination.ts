import vine from '@vinejs/vine'

export const pageAndSearchValidator = vine.compile(
    vine.object({
        page: vine.number(),
        perPage: vine.number(),
        search: vine.string().trim()
    })
)
