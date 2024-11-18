import AdsPackage from "#models/ads_package"

const createAdsPackage = async (adsPackages: Array<any>, adsId: number) => {
    for (let i = 0; i < adsPackages.length; i++) {
        await AdsPackage.create({
            adsId: adsId,
            mediaId: adsPackages[i].mediaId,
            mediaDesc: adsPackages[i].mediaDesc,
            status: true
        })
    }
}

export default { createAdsPackage }