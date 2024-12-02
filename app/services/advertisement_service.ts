import Advertisement from '#models/advertisement'
import { AdvertisementDetailDTO, AdvertisementListDTO, CreateOrUpdateAdvertisementDTO } from '../dtos/advertisement_dto.js'
import ads_package_service from './ads_package_service.js'
import log_service from './log_service.js'
import time_service from './time_service.js'
import AdsPackage from '#models/ads_package'
import DatabaseException from '#exceptions/database_exception'

const getAdsList = async (page: number, perPage: number, search: string) => {
    try {
        const adsList = await Advertisement.query()
            .where('adsName', 'LIKE', `%${search}%`)
            .orWhere('redeemCode', search)

            .preload('period', (periodQuery) => {
                periodQuery.where('status', true)
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
            .preload('userUpdate')
            .orWhereHas('userUpdate', (userQuery) => {
                userQuery.whereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", [`%${search}%`])
            })

            .orderBy('adsId', 'desc')
            .paginate(page, perPage)

        const adsDTO: Array<AdvertisementListDTO> = adsList.all().map((ads) => new AdvertisementListDTO(ads.toJSON()))

        return { meta: adsList.getMeta(), data: adsDTO }
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

const getAdsDetail = async (adsId: number) => {
    try {
        const ads = await Advertisement.query()
            .where('adsId', adsId)
            .preload('period', (periodQuery) => {
                periodQuery.where('status', true)
            })
            .preload('packages', (packageQuery) => {
                packageQuery
                    .where('status', true)
                    .preload('media', (mediaQuery) => {
                        mediaQuery.where('status', true)
                    })
            })
            .preload('adsPackages', (adsPackageQuery) => {
                adsPackageQuery.where('status', true)
            })
            .preload('logs', (logQuery) => {
                logQuery.preload('user')
            })
            .preload('userUpdate')
            .firstOrFail()

        if (ads?.approveUser) {
            await ads.load('userApprove')
        }

        const adsDTO: AdvertisementDetailDTO = new AdvertisementDetailDTO(ads)

        return adsDTO
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

const createAds = async (adsData: CreateOrUpdateAdvertisementDTO, userId: string) => {
    try {
        const ads = new Advertisement()
        const newAds = setValueForCreateOrUpdate(ads, adsData, userId)

        await newAds.save()

        if (adsData.adsPackages) {
            await ads_package_service.createAdsPackage(adsData.adsPackages, newAds?.adsId)
        }

        await log_service.createLog(adsData.logHeader, userId, newAds?.adsId)

        return newAds?.adsId
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

const updateAds = async (adsId: number, adsData: CreateOrUpdateAdvertisementDTO, userId: string) => {
    try {
        const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()
        const newAds = setValueForCreateOrUpdate(ads, adsData, userId)

        await newAds.save()

        if (adsData.adsPackages) {
            await AdsPackage.query().where('adsId', newAds.adsId).delete()
            await ads_package_service.createAdsPackage(adsData.adsPackages, newAds.adsId)
        }

        await log_service.createLog(adsData.logHeader, userId, newAds.adsId)

        return newAds.adsId
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

const approveAds = async (adsId: number, logHeader: string, userId: string) => {
    try {
        const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()

        if (ads.status == 'A') {
            throw new Error('Advertisement already approved.')
        }

        ads.status = 'A'
        ads.approveDate = time_service.getDateTimeNow()
        ads.approveUser = userId

        await ads.save()

        await log_service.createLog(logHeader, userId, ads.adsId)
    } catch (error) {
        throw new DatabaseException(error.status)
    }
}

const checkAdsApprove = (oldStatus: string, newStatus: string) => {
    // Already approved
    if (oldStatus === 'A') {
        return false
    }

    if (newStatus === 'A') {
        return true
    }

    return false
}

const setValueForCreateOrUpdate = (ads: Advertisement, adsData: CreateOrUpdateAdvertisementDTO, userId: string) => {
    ads.adsName = adsData.adsName
    ads.adsCond = adsData.adsCond
    ads.status = adsData.status
    ads.periodId = adsData.periodId
    ads.redeemCode = adsData.redeemCode
    ads.packageId = adsData.packageId
    ads.regisLimit = adsData.regisLimit
    ads.updatedUser = userId
    ads.updatedDate = time_service.getDateTimeNow()
    ads.approveDate = checkAdsApprove(ads.status, adsData.status) ? time_service.getDateTimeNow() : null
    ads.approveUser = checkAdsApprove(ads.status, adsData.status) ? userId : null
    ads.imageName = adsData.imageName
    ads.refAdsId = adsData.refAdsId
    ads.consentDesc = adsData.consentDesc
    ads.recInMth = adsData.recInMth
    ads.recNextMth = adsData.recNextMth
    ads.nextMth = adsData.nextMth
    ads.rgsStrDate = adsData.rgsStrDate == null ? null : time_service.changeDateTimeFormat(adsData.rgsStrDate)
    ads.rgsExpDate = adsData.rgsExpDate == null ? null : time_service.changeDateTimeFormat(adsData.rgsExpDate)

    return ads
}

export default { getAdsList, getAdsDetail, createAds, updateAds, approveAds, checkAdsApprove }
