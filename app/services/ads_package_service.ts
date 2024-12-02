import DatabaseException from "#exceptions/database_exception"
import AdsPackage from "#models/ads_package"
import Media from "#models/media"

const createAdsPackage = async (adsPackages: Array<any>, adsId: number) => {
    for (let i = 0; i < adsPackages.length; i++) {
        const media = await Media.query().where('mediaId', adsPackages[i]).firstOrFail()

        await AdsPackage.create({
            adsId: adsId,
            mediaId: adsPackages[i],
            mediaDesc: media?.mediaDesc,
            status: true
        })
    }
    // try {
    // } catch (error) {
    //     throw new DatabaseException(error.status)
    // }
}

export default { createAdsPackage }
