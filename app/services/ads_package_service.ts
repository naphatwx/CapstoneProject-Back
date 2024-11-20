import AdsPackage from "#models/ads_package"
import Media from "#models/media"

const createAdsPackage = async (adsPackages: Array<any>, adsId: number) => {
    for (let i = 0; i < adsPackages.length; i++) {
        // const media = await Media.query().where('mediaId', adsPackages[i].mediaId).first()
        await AdsPackage.create({
            adsId: adsId,
            mediaId: adsPackages[i].mediaId,
            mediaDesc: adsPackages[i].mediaDesc,
            // mediaDesc: media?.mediaDesc,
            status: true
        })
    }
}

export default { createAdsPackage }