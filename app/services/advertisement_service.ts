import Advertisement from "#models/advertisement"
import { AdvertisementListDTO, CreateOrUpdateAdvertisementDTO } from "../DTOs/AdvertisementDTO.js"
import ads_package_service from "./ads_package_service.js"
import log_service from "./log_service.js"
import time_service from "./time_service.js"
import AdsPackage from "#models/ads_package"

const getAdsList = async (page: number, perPage: number, search: string) => {
    const adsList = await Advertisement.query()
        // .select('adsId', 'adsName', 'redeemCode', 'packageId', 'periodId', 'rgsStrDate', 'status', 'updatedUser', 'updatedDate')
        .where('adsName', 'LIKE', `%${search}%`)
        .orWhere('redeemCode', search)

        .preload('period', (periodQuery) => {
            periodQuery.select('periodDesc', 'period').where('status', true)
        })
        .orWhereHas('period', (periodQuery) => {
            periodQuery.where('periodDesc', 'LIKE', `%${search}%`)
        })
        .preload('packages', (packageQuery) => {
            packageQuery.where('status', true)
        })
        .orWhereHas('packages', (packageQuery) => {
            packageQuery.where('packageDesc', 'LIKE', `%${search}%`)
        })
        .preload('userUpdate', (userQuery) => {
            userQuery.select('comCode', 'userId', 'firstname', 'lastname')
        })
        .orWhereHas('userUpdate', (userQuery) => {
            userQuery.whereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", [`%${search}%`])
        })

        .orderBy('adsId', 'desc')
        .paginate(page, perPage)

    const adsDTO: Array<AdvertisementListDTO> = adsList.all().map((ads) => new AdvertisementListDTO(ads.toJSON()))

    return {meta: adsList.getMeta(), data: adsDTO}
}

const getAdsDetail = async (adsId: number) => {
    const ads = await Advertisement.query()
        .where('adsId', adsId)
        .preload('period', (periodQuery) => {
            periodQuery.select('periodDesc', 'period').where('status', true)
        })
        .preload('packages', (packageQuery) => {
            packageQuery.where('status', true)
                .preload('media', (mediaQuery) => {
                    mediaQuery.where('status', true)
                })
        })
        .preload('adsPackages', (adsPackageQuery) => {
            adsPackageQuery.select('mediaId', 'mediaDesc').where('status', true)
        })
        .preload('logs', (logQuery) => {
            logQuery.select('itemNo', 'logHeader', 'updatedUser', 'updatedDate')
                .preload('user', (userQuery) => {
                    userQuery.select('userId', 'firstname', 'lastname')
                })
        })
        .preload('userUpdate')
        .first()

    if (ads?.approveUser) {
        await ads.load('userApprove')
    }

    return ads
}

const createAds = async (adsData: CreateOrUpdateAdvertisementDTO, userId: string) => {
    const newAds = await Advertisement.create({
        adsName: adsData.adsName,
        adsCond: adsData.adsCond,
        status: adsData.status,
        periodId: adsData.periodId,
        redeemCode: adsData.redeemCode,
        packageId: adsData.packageId,
        regisLimit: adsData.regisLimit,
        updatedUser: userId,
        updatedDate: time_service.getDateTimeNow(),
        approveDate: checkAdsApprove(adsData.status) ? time_service.getDateTimeNow() : null,
        approveUser: checkAdsApprove(adsData.status) ? userId : null,
        imageName: adsData.imageName,
        refAdsId: adsData.refAdsId,
        consentDesc: adsData.consentDesc,
        recInMth: adsData.recInMth,
        recNextMth: adsData.recNextMth,
        nextMth: adsData.nextMth,
        rgsStrDate: adsData.rgsStrDate == null ? null : time_service.changeDateTimeFormat(adsData.rgsStrDate),
        rgsExpDate: adsData.rgsExpDate == null ? null : time_service.changeDateTimeFormat(adsData.rgsExpDate)
    })

    if (adsData.adsPackages) {
        await ads_package_service.createAdsPackage(adsData.adsPackages, newAds.adsId)
    }

    await log_service.createLog(adsData.logHeader, userId, newAds.adsId)

    return newAds.adsId
}

const updateAds = async (adsId: number, adsData: CreateOrUpdateAdvertisementDTO, userId: string) => {
    const ads = await Advertisement.query().where('adsId', adsId).first()

    if (!ads) {
        throw new Error('Advertisement not found.')
    }

    ads.adsName = adsData.adsName
    ads.adsCond = adsData.adsCond
    ads.status = adsData.status
    ads.periodId = adsData.periodId
    ads.redeemCode = adsData.redeemCode
    ads.packageId = adsData.packageId
    ads.regisLimit = adsData.regisLimit
    ads.updatedUser = userId
    ads.updatedDate = time_service.getDateTimeNow()
    ads.approveDate = checkAdsApprove(adsData.status) ? time_service.getDateTimeNow() : null
    ads.approveUser = checkAdsApprove(adsData.status) ? userId : null
    ads.imageName = adsData.imageName
    ads.refAdsId = adsData.refAdsId
    ads.consentDesc = adsData.consentDesc
    ads.recInMth = adsData.recInMth
    ads.recNextMth = adsData.recNextMth
    ads.nextMth = adsData.nextMth
    ads.rgsStrDate = adsData.rgsStrDate == null ? null : time_service.changeDateTimeFormat(adsData.rgsStrDate)
    ads.rgsExpDate = adsData.rgsExpDate == null ? null : time_service.changeDateTimeFormat(adsData.rgsExpDate)

    await ads.save()

    if (adsData.adsPackages) {
        await AdsPackage.query().where('adsId', ads.adsId).delete()
        await ads_package_service.createAdsPackage(adsData.adsPackages, ads.adsId)
    }

    await log_service.createLog(adsData.logHeader, userId, ads.adsId)

    return ads.adsId
}

const approveAds = async (adsId: number, logHeader: string, userId: string) => {
    const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()

    if (ads.status == 'A') {
        throw new Error('Advertisement already approved.')
    }

    ads.status = 'A'
    ads.approveDate = time_service.getDateTimeNow()
    ads.approveUser = userId

    await ads.save()

    await log_service.createLog(logHeader, userId, ads.adsId)
}

const checkAdsApprove = (status: string) => {
    if (status == 'A') {
        return true
    }

    return false
}

export default { getAdsList, getAdsDetail, createAds, updateAds, approveAds, checkAdsApprove }