import Media from "#models/media"

export class MediaDTO {
    mediaId: number | null
    mediaDesc: string | null

    constructor(media: Partial<Media>) {
        this.mediaId = media.mediaId || null
        this.mediaDesc = media.mediaDesc || null
    }
}
