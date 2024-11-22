import Package from "#models/package"
import media_service from "./media_service.js"

const getPackages = async () => {
    const packages = await Package.query().select('packageId', 'packageDesc').groupBy('packageId', 'packageDesc')
    return packages
}

const getPackageById = async (packageId: number) => {
    const packages = await Package.query().where('packageId', packageId).preload('media')

    const medias = media_service.changeMediaFormat(packages)

    return { packageId: packages[0].packageId, packageDesc: packages[0].packageDesc, medias: medias }
}

export default { getPackages, getPackageById }