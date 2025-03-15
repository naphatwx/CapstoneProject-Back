import vine from '@vinejs/vine'

export const imageValidator = vine.compile(vine.object({
    image: vine.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg']
    })
}))
