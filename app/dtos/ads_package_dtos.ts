import AdsPackage from "#models/ads_package"

export class AdsPackageDTO {
    mediaId: number
    mediaDesc: string

    constructor(media: Partial<AdsPackage>) {
        this.mediaId = media.mediaId || 0
        this.mediaDesc = media.mediaDesc || ''
    }
}