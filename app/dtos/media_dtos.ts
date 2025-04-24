import Media from "#models/media"

export class MediaDTO {
    mediaId: number
    mediaDesc: string

    constructor(media: Partial<Media>) {
        this.mediaId = media.mediaId || 0
        this.mediaDesc = media.mediaDesc || ''
    }
}
