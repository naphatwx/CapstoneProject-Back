import vine from '@vinejs/vine'

export const paginationAndSearchValidator = vine.compile(
    vine.object({
        page: vine.number(),
        perPage: vine.number(),
        search: vine.string().trim()
    })
)
