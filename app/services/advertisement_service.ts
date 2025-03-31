import Advertisement from '#models/advertisement'
import { AdvertisementDetailDTO, AdvertisementExportDTO, AdvertisementListDTO, CreateOrUpdateAdvertisementDTO } from '../dtos/advertisement_dto.js'
import ads_package_service from './ads_package_service.js'
import log_service from './log_service.js'
import time_service from './time_service.js'
import AdsPackage from '#models/ads_package'
import HandlerException from '#exceptions/handler_exception'
import { DateTime } from 'luxon'
import BadRequestException from '#exceptions/badrequest_exception'
import file_service from './file_service.js'

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

        const adsDTO: AdvertisementListDTO[] = adsList.all().map((ads) =>
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

        if (ads.approveUser) await ads.load('userApprove')
        if (ads.imageName) ads.imageName = await file_service.getImageUrl(ads.imageName)

        const adsDTO: AdvertisementDetailDTO = new AdvertisementDetailDTO(ads)
        return adsDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getOldestAdsRegisDate = async () => {
    try {
        const ads = await Advertisement.query()
            .whereIn('status', ['A', 'N'])
            .whereNotNull('rgsStrDate')
            .where('rgsStrDate', '!=', '')
            .orderBy('rgsStrDate', 'asc')
            .first()

        if (ads && ads.rgsStrDate) {
            const date = time_service.getDateTimeAsObject(ads.rgsStrDate as string)
            return {
                adsId: ads.adsId,
                ...date
            }
        }
        return ads
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

// const getAdsExport = async (adsIds: number[] = []) => {
//     try {
//         const query = await Advertisement.query()
//             .if(adsIds.length > 0, (query) => {
//                 query.whereIn('adsId', adsIds)
//             })
//             .preload('period', (periodQuery) => {
//                 periodQuery.where('status', true)
//             })
//             .preload('packages', (packageQuery) => {
//                 packageQuery.where('status', true)
//             })
//             .preload('adsPackages')
//             .preload('userUpdate')
//             .withCount('registrations', (registrationQuery) => {
//                 registrationQuery.as('totalRegistration')
//             })

//         if (query.length === 0) {
//             return []
//         }

//         // Only sort if adsIds is not empty
//         const adsList = adsIds.length > 0
//             ? my_service.sortObjectsByReference(query, adsIds, 'adsId')
//             : query

//         const adsDTO = await Promise.all(
//             adsList.map(async (ads) => {
//                 if (ads.approveUser) await ads.load('userApprove')

//                 const dateTimeFormat = 'dd LLLL yyyy HH:mm:ss'
//                 if (ads.updatedDate) ads.updatedDate = time_service.changeDateTimeFormat(ads.updatedDate, dateTimeFormat)
//                 if (ads.approveDate) ads.approveDate = time_service.changeDateTimeFormat(ads.approveDate, dateTimeFormat)
//                 if (ads.rgsStrDate) ads.rgsStrDate = time_service.changeDateTimeFormat(ads.rgsStrDate, dateTimeFormat)
//                 if (ads.rgsExpDate) ads.rgsExpDate = time_service.changeDateTimeFormat(ads.rgsExpDate, dateTimeFormat)

//                 return new AdvertisementExportDTO(ads.toJSON(), ads.$extras.totalRegistration)
//             })
//         )

//         return adsDTO
//     } catch (error) {
//         throw new HandlerException(error.status, error.message)
//     }
// }

const getAdsExport = async (
    status: string | null,
    orderField: string | null,
    orderType: string | null,
    periodId: number | null,
    monthYear: string | null) => {
    try {
        const query = await Advertisement.query()
            .if(status, (query) => {
                console.log('There is status: ' + status)
                query.where('status', status!)
            })
            .if(!status, (query) => {
                console.log('No status: ' + status)
                query.whereIn('status', ['A', 'N'])
            })
            .if(periodId, (query) => {
                console.log('There is period ID: ' + periodId)
                query.where('periodId', periodId!)
            })
            .if(monthYear, (query) => {
                console.log('There is monthYear: ' + monthYear)
                query.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') = ?`, [monthYear as string])
            })
            .preload('period', (periodQuery) => {
                periodQuery.where('status', true)
            })
            .preload('packages', (packageQuery) => {
                packageQuery.where('status', true)
            })
            .preload('adsPackages')
            .preload('userUpdate')
            .withCount('registrations', (registrationQuery) => {
                registrationQuery.as('totalRegistration')
            })
            .if(orderField, (query) => {
                console.log('OrderField: ' + orderField)
                query.orderBy(orderField!, orderType! === 'asc' ? 'asc' : 'desc')
            })

        if (query.length === 0) {
            return []
        }

        const adsDTO = await Promise.all(
            query.map(async (ads) => {
                if (ads.approveUser) await ads.load('userApprove')

                const dateTimeFormat = 'dd LLLL yyyy HH:mm:ss'
                if (ads.updatedDate) ads.updatedDate = time_service.changeDateTimeFormat(ads.updatedDate, dateTimeFormat)
                if (ads.approveDate) ads.approveDate = time_service.changeDateTimeFormat(ads.approveDate, dateTimeFormat)
                if (ads.rgsStrDate) ads.rgsStrDate = time_service.changeDateTimeFormat(ads.rgsStrDate, dateTimeFormat)
                if (ads.rgsExpDate) ads.rgsExpDate = time_service.changeDateTimeFormat(ads.rgsExpDate, dateTimeFormat)

                return new AdvertisementExportDTO(ads.toJSON(), ads.$extras.totalRegistration)
            })
        )

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

const updateAdsImage = async (adsId: number, imageName: string) => {
    try {
        const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()

        if (ads.imageName) {
            await file_service.deleteImage(ads.imageName)
        }

        ads.imageName = imageName
        await ads.save()
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const approveAds = async (adsId: number, userId: string) => {
    try {
        const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()

        if (ads.status === 'A') {
            throw new BadRequestException('Advertisement is already approved.')
        }

        ads.status = 'A'
        ads.approveDate = time_service.getDateTimeNow()
        ads.approveUser = userId
        await ads.save()
        await log_service.createLog('Approve advertisement.', userId, ads.adsId)
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const validateDate = (rgsStrDate: any, rgsExpDate: any) => {
    const newRgsStrDate = DateTime.fromISO(rgsStrDate).setZone('UTC') || null
    const newRgsExpDate = DateTime.fromISO(rgsExpDate).setZone('UTC') || null

    const success = {
        isSuccess: true,
        message: 'Success'
    }

    if (rgsStrDate && rgsExpDate) {
        if (newRgsStrDate > DateTime.now() && newRgsExpDate > DateTime.now()) {
            if (newRgsStrDate < newRgsExpDate) {
                return success
            } else {
                return {
                    isSuccess: false,
                    message: 'Register start date must be before register expire date.'
                }
            }
        } else {
            return {
                isSuccess: false,
                message: 'Register start date and register expire date must be after now.'
            }
        }
    } else if (rgsStrDate && !rgsExpDate) {
        if (newRgsStrDate > DateTime.now()) {
            return success
        } else {
            return {
                isSuccess: false,
                message: 'Register start date must be after now.'
            }
        }
    } else if (!rgsStrDate && rgsExpDate) {
        if (newRgsExpDate > DateTime.now()) {
            return success
        } else {
            return {
                isSuccess: false,
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
    ads.approveUser = checkOldAdsStatus(ads.status, newAdsData.status)
        ? ads.approveUser : (checkNewAdsStatus(newAdsData.status)
            ? userId : null)
    ads.approveDate = checkOldAdsStatus(ads.status, newAdsData.status)
        ? ads.approveDate : (checkNewAdsStatus(newAdsData.status)
            ? time_service.getDateTimeNow() : null)
    ads.status = newAdsData.status
    ads.periodId = newAdsData.periodId
    ads.redeemCode = newAdsData.redeemCode
    ads.packageId = newAdsData.packageId
    ads.regisLimit = newAdsData.regisLimit
    ads.updatedUser = userId
    ads.updatedDate = time_service.getDateTimeNow()
    ads.imageName = newAdsData.imageName
    ads.refAdsId = newAdsData.refAdsId
    ads.consentDesc = newAdsData.consentDesc
    ads.recInMth = newAdsData.recInMth
    ads.recNextMth = newAdsData.recNextMth
    ads.nextMth = newAdsData.nextMth
    ads.rgsStrDate = newAdsData.rgsStrDate === null ? null : time_service.changeDateTimeFormat(newAdsData.rgsStrDate)
    ads.rgsExpDate = newAdsData.rgsExpDate === null ? null : time_service.changeDateTimeFormat(newAdsData.rgsExpDate)

    return ads
}

export default {
    getAdsList,
    getAdsDetail,
    getOldestAdsRegisDate,
    getAdsExport,
    createAds,
    updateAds,
    updateAdsImage,
    approveAds,
    validateDate
}
