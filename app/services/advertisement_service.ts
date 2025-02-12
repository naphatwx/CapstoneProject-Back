import Advertisement from '#models/advertisement'
import { AdvertisementDetailDTO, AdvertisementListDTO, CreateOrUpdateAdvertisementDTO } from '../dtos/advertisement_dto.js'
import ads_package_service from './ads_package_service.js'
import log_service from './log_service.js'
import time_service from './time_service.js'
import AdsPackage from '#models/ads_package'
import HandlerException from '#exceptions/handler_exception'
import { DateTime } from 'luxon'

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

        const adsDTO: Array<AdvertisementListDTO> = adsList.all().map((ads) =>
            new AdvertisementListDTO(ads.toJSON())
        )
        return { meta: adsList.getMeta(), data: adsDTO }
    } catch (error) {
        throw new HandlerException(error.status, error.message)
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

        if (ads.approveUser) {
            await ads.load('userApprove')
        }

        const adsDTO: AdvertisementDetailDTO = new AdvertisementDetailDTO(ads)
        return adsDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const createAds = async (newAdsData: CreateOrUpdateAdvertisementDTO, userId: string) => {
    try {
        const ads = new Advertisement()

        const newAds = setAdsValue(ads, newAdsData, userId)

        await newAds.save()

        if (newAdsData.adsPackages) {
            await ads_package_service.createAdsPackage(newAdsData.adsPackages, newAds.adsId)
        }

        await log_service.createLog(newAdsData.logHeader, userId, newAds.adsId)
        return newAds.adsId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const updateAds = async (adsId: number, newAdsData: CreateOrUpdateAdvertisementDTO, userId: string) => {
    try {
        const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()
        const newAds = setAdsValue(ads, newAdsData, userId)
        await newAds.save()

        if (newAdsData.adsPackages) {
            await AdsPackage.query().where('adsId', newAds.adsId).delete()
            await ads_package_service.createAdsPackage(newAdsData.adsPackages, newAds.adsId)
        }

        await log_service.createLog(newAdsData.logHeader, userId, newAds.adsId)
        return newAds.adsId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const approveAds = async (adsId: number, userId: string) => {
    try {
        const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()
        if (ads.status === 'A') {
            return { isAlreadyApproved: true }
        }
        ads.status = 'A'
        ads.approveDate = time_service.getDateTime()
        ads.approveUser = userId
        await ads.save()

        await log_service.createLog('Approve advertisement.', userId, ads.adsId)
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const compareDate = (rgsStrDate: any, rgsExpDate: any) => {
    const newRgsStrDate = DateTime.fromISO(rgsStrDate).setZone('UTC')
    const newRgsExpDate = DateTime.fromISO(rgsExpDate).setZone('UTC')

    const success = {
        result: true,
        message: 'Success'
    }

    if (rgsStrDate && rgsExpDate) {
        if (newRgsStrDate > DateTime.now() && newRgsExpDate > DateTime.now()) {
            if (newRgsStrDate < newRgsExpDate) {
                return success
            } else {
                return {
                    result: false,
                    message: 'Register start date must be before register expire date.'
                }
            }
        } else {
            return {
                result: false,
                message: 'Register start date and register expire date must be after now.'
            }
        }
    } else if (rgsStrDate && !rgsExpDate) {
        if (newRgsStrDate > DateTime.now()) {
            return success
        } else {
            return {
                result: false,
                message: 'Register start date must be after now.'
            }
        }
    } else if (!rgsStrDate && rgsExpDate) {
        if (newRgsExpDate > DateTime.now()) {
            return success
        } else {
            return {
                result: false,
                message: 'Register expire date must be after now.'
            }
        }
    } else {
        return success
    }
}

const checkNewAdsStatus = (newStatus: string) => {
    if (newStatus === 'A') {
        return true
    } else {
        return false
    }
}

const checkOldAdsStatus = (oldStatus: any, newStatus: string) => {
    if (oldStatus && oldStatus === 'A' && newStatus === 'A') {
        return true
    } else {
        return false
    }
}

const setAdsValue = (ads: Advertisement, newAdsData: CreateOrUpdateAdvertisementDTO, userId: string) => {
    ads.adsName = newAdsData.adsName
    ads.adsCond = newAdsData.adsCond
    ads.approveUser = checkOldAdsStatus(ads.status, newAdsData.status) ? ads.approveUser : (checkNewAdsStatus(newAdsData.status) ? userId : null)
    ads.approveDate = checkOldAdsStatus(ads.status, newAdsData.status) ? ads.approveDate : (checkNewAdsStatus(newAdsData.status) ? time_service.getDateTime() : null)
    ads.status = newAdsData.status
    ads.periodId = newAdsData.periodId
    ads.redeemCode = newAdsData.redeemCode
    ads.packageId = newAdsData.packageId
    ads.regisLimit = newAdsData.regisLimit
    ads.updatedUser = userId
    ads.updatedDate = time_service.getDateTime()
    ads.imageName = newAdsData.imageName
    ads.refAdsId = newAdsData.refAdsId
    ads.consentDesc = newAdsData.consentDesc
    ads.recInMth = newAdsData.recInMth
    ads.recNextMth = newAdsData.recNextMth
    ads.nextMth = newAdsData.nextMth
    ads.rgsStrDate = newAdsData.rgsStrDate == null ? null : time_service.changeDateTimeFormat(newAdsData.rgsStrDate)
    ads.rgsExpDate = newAdsData.rgsExpDate == null ? null : time_service.changeDateTimeFormat(newAdsData.rgsExpDate)

    return ads
}

export default { getAdsList, getAdsDetail, createAds, updateAds, approveAds, compareDate }
