import AdsPackage from "#models/ads_package"

export class AdsPackageDTO {
    mediaId: number | null
    mediaDesc: string | null

    constructor(media: Partial<AdsPackage>) {
        this.mediaId = media.mediaId || null
        this.mediaDesc = media.mediaDesc || null
    }
}