import HandlerException from "#exceptions/handler_exception"
import AdsPackage from "#models/ads_package"
import Media from "#models/media"

const createAdsPackage = async (adsPackages: Array<any>, adsId: number) => {
    try {
        for (let i = 0; i < adsPackages.length; i++) {
            const media = await Media.query().where('mediaId', adsPackages[i]).firstOrFail()

            await AdsPackage.create({
                adsId: adsId,
                mediaId: adsPackages[i],
                mediaDesc: media?.mediaDesc,
                status: true
            })
        }
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default { createAdsPackage }
