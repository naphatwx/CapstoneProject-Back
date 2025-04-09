import HandlerException from "#exceptions/handler_exception"
import NotFoundException from "#exceptions/notfound_exception"
import Media from "#models/media"

const changeMediaFormat = (packages: Array<any>) => {
    let mediaList = []
    for (let i = 0; i < packages.length; i++) {
        let media = {
            mediaId: Number(packages[i].media.mediaId),
            mediaDesc: packages[i].media.mediaDesc
        }
        mediaList.push(media)
    }

    return mediaList
}

const getMedias = async (status: boolean | null = null, orderField: string = 'mediaId', orderType: string = 'asc') => {
    try {
        const media = await Media.query().select('mediaId', 'mediaDesc', 'status')
            .if(status !== null, (query) => query.where('status', status!))
            .orderBy(orderField!, orderType === 'asc' ? 'asc' : 'desc')

        if (media.length === 0) {
            throw new NotFoundException('No media found.')
        }

        return media
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const createMedia = async (mediaDesc: string) => {
    try {
        const media = await Media.create({
            mediaDesc: mediaDesc,
            status: true
        })
        return media.mediaId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const updateMedia = async (mediaId: number, mediaDesc: string) => {
    try {
        const media = await Media.findOrFail(mediaId)
        media.mediaDesc = mediaDesc
        await media.save()
        return media.mediaId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const inactivateMedia = async (mediaId: number) => {
    try {
        const media = await Media.findOrFail(mediaId)
        media.status = false
        await media.save()
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default { changeMediaFormat, getMedias, createMedia, updateMedia, inactivateMedia }
