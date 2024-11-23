import DatabaseException from "#exceptions/database_exception"
import Package from "#models/package"
import media_service from "./media_service.js"

const getPackages = async () => {
    try {
        const packages = await Package.query().select('packageId', 'packageDesc').groupBy('packageId', 'packageDesc')
        return packages
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

const getPackageById = async (packageId: number) => {
    try {
        const packages = await Package.query().where('packageId', packageId).preload('media')

        const medias = media_service.changeMediaFormat(packages)

        return { packageId: packages[0].packageId, packageDesc: packages[0].packageDesc, medias: medias }
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

export default { getPackages, getPackageById }
