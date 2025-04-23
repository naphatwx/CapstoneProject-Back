import HandlerException from "#exceptions/handler_exception"
import Package from "#models/package"
import media_service from "./media_service.js"

const getPackages = async () => {
    try {
        const packages = await Package.query().select('packageId', 'packageDesc').groupBy('packageId', 'packageDesc')
        return packages
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getPackageById = async (packageId: number) => {
    try {
        const packages = await Package.query().where('packageId', packageId).preload('media')
        const medias = media_service.changeMediaFormat(packages)
        return { packageId: packages[0].packageId, packageDesc: packages[0].packageDesc, medias: medias }
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}
// data => packageDesc: string, mediaIdList: number[]
const createPackage = async (data: any) => {
    try {
        const lastPackage = await Package.query().orderBy('packageId', 'desc').first()
        const nextPackageId = lastPackage? lastPackage.packageId + 1 : 1
        console.log('nextPackageId', nextPackageId)
        console.log('data mediaIdList', data.mediaIdList.length)
        for (let i = 0; i < data.mediaIdList.length; i++) {
            const mediaId = data.mediaIdList[i]
            await Package.create({
                packageId: nextPackageId,
                mediaId: mediaId,
                packageDesc: data.packageDesc,
                status: true
            })
        }

        return nextPackageId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const updatePackage = async (packageId: number, data: any) => {
    try {
        const oldPackage = await Package.query().where('packageId', packageId).first()
        const oldPackageStatus = oldPackage?.status
        await Package.query().where('packageId', packageId).delete()
        for (let i = 0; i < data.mediaIdList.length; i++) {
            const mediaId = data.mediaIdList[i]
            await Package.create({
                packageId: packageId,
                mediaId: mediaId,
                packageDesc: data.packageDesc,
                status: oldPackageStatus
            })
        }

        return packageId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const inactivatePackage = async (packageId: number) => {
    try {
        await Package.query().where('packageId', packageId).update({
            status: false
        })
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default { getPackages, getPackageById, createPackage, updatePackage, inactivatePackage }
