import Advertisement from '#models/advertisement'
import { AdvertisementDetailDTO, AdvertisementExportDTO, AdvertisementListDTO, AdvertisementShortDTO } from '../dtos/advertisement_dto.js'
import ads_package_service from './ads_package_service.js'
import log_service from './log_service.js'
import time_service from './time_service.js'
import AdsPackage from '#models/ads_package'
import HandlerException from '#exceptions/handler_exception'
import BadRequestException from '#exceptions/badrequest_exception'
import file_service from './file_service.js'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import my_service from './my_service.js'
import ExcelJS from 'exceljs'
import { RegistrationAdsExportDTO } from '../dtos/chart_dtos.js'
import { DateTimeFormat } from '../enums/DateTimeFormat.js'

const getAdsPage = async (
    page: number = 1,
    perPage: number = 10,
    search: string | null = null,
    periodId: number | null = null,
    packageId: number | null = null,
    status: string | null = null,
    orderField: string = 'adsId',
    orderType: string = 'desc'
) => {
    try {
        const adsList = await Advertisement.query()
            .where((query) => {
                // Apply search condition first
                if (search) {
                    query.where((subQuery) => {
                        subQuery.where('adsName', 'LIKE', `%${search}%`)
                            .orWhere('redeemCode', 'LIKE', `%${search}%`)
                    })
                }

                // Then apply other filters with AND logic
                if (periodId) {
                    query.andWhere('periodId', periodId)
                }
                if (packageId) {
                    query.andWhere('packageId', packageId)
                }
                if (status) {
                    query.andWhere('status', status)
                }
            })
            .preload('period', (periodQuery) => {
                periodQuery.where('status', true)
            })
            .preload('packages', (packageQuery) => {
                packageQuery.where('status', true)
            })
            .preload('userUpdate')
            .orderBy(orderField, orderType === 'asc' ? 'asc' : 'desc')
            .paginate(page, perPage)

        const adsDTO: AdvertisementListDTO[] = adsList.all().map((ads) =>
            new AdvertisementListDTO(ads.toJSON())
        )
        return { meta: adsList.getMeta(), data: adsDTO }
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getAdsList = async (search: string = '') => {
    const adsList = await Advertisement.query()
        .whereIn('status', ['A', 'N'])
        .if(search, (query) => {
            if (my_service.isNumber(search)) {
                // If search is number => can filter adsId
                // If search is not number => cannot filter adsId because it will error at .where('adsId', search)
                query.where('adsId', search)
                    .orWhere('adsName', 'LIKE', `%${search}%`)
            } else {
                query.where('adsName', 'LIKE', `%${search}%`)
            }
        })
        .orderBy('adsId', 'desc')

    const adsDTO = adsList.map((ads) => {
        return new AdvertisementShortDTO(ads)
    })

    return adsDTO
}

const getAdsDetail = async (adsId: number, token: string) => {
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
        if (ads.imageName) ads.imageName = await file_service.downloadImageFromLMS(ads.imageName, token)

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

const getAdsRegistration = async (
    status: string | null = null,
    periodId: number | null = null,
    monthYear: string | null = null,
    orderField: string | null = 'adsId',
    orderType: string | null = 'desc',
    limitNumber: number | null = null) => {
    const query = await Advertisement.query()
        .if(status, (query) => query.where('status', status!))
        .if(!status, (query) => query.whereIn('status', ['A', 'N']))
        .if(periodId, (query) => query.where('periodId', periodId!))
        .if(monthYear, (query) => query.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') = ?`, [monthYear as string]))

        .preload('period', (periodQuery) => periodQuery.where('status', true))
        .preload('packages', (packageQuery) => packageQuery.where('status', true))
        .preload('adsPackages')
        .preload('userUpdate')
        .preload('registrations', (query) => query.orderBy('regisDate', 'asc'))
        .withCount('registrations', (registrationQuery) => registrationQuery.as('totalRegistration'))

        .if(orderField, (query) => query.orderBy(orderField!, orderType! === 'asc' ? 'asc' : 'desc'))
        .if(limitNumber, (query) => query.limit(limitNumber!))

    return query.length === 0 ? [] : query
}

const getAdsExport = async (
    status: string | null,
    orderField: string | null,
    orderType: string | null,
    periodId: number | null,
    monthYear: string | null) => {
    try {
        const adsList = await getAdsRegistration(status, periodId, monthYear, orderField, orderType)
        const adsDTO = await Promise.all(
            adsList.map(async (ads) => {
                if (ads.approveUser) await ads.load('userApprove')
                return new AdvertisementExportDTO(ads.toJSON(), ads.$extras.totalRegistration)
            })
        )

        const workbook = new ExcelJS.Workbook()
        const adsListWorksheet = workbook.addWorksheet('Advertisement List')
        await file_service.createTableInWorksheet(adsListWorksheet, adsDTO)
        const adsRegisWorksheet = workbook.addWorksheet("Advertisement's Registrations")

        let registrationList: any[] = []
        for (let i = 0; i < adsList.length; i++) {
            const ads = adsList[i]
            if (ads.$extras.totalRegistration > 0) {
                const regisPromises = ads.registrations.map(async (regis) => {
                    await regis.load('plant', (plantQuery) => {
                        plantQuery.preload('company')
                    })
                    const regisDTO = new RegistrationAdsExportDTO(ads, regis)
                    return regisDTO.toOrderData()
                })

                const regisResults = await Promise.all(regisPromises)
                registrationList = [...registrationList, ...regisResults]
            }
        }

        await file_service.createTableInWorksheet(adsRegisWorksheet, registrationList)
        const filePath = await file_service.generateFileBuffer('Advertisement Data', workbook)
        return filePath
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}


const createAds = async (newAdsData: any, userId: string) => {
    try {
        // If create and send it to approve.
        if (newAdsData.status === 'W') {
            validateDate(newAdsData.rgsStrDate, newAdsData.rgsExpDate)
        }

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

const updateDraftAds = async (adsId: number, newAdsData: any, userId: string) => {
    try {
        const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()

        if (ads.status !== 'D') {
            throw new BadRequestException('ไม่สามารถแก้ไขโครงการโฆษณาที่ไม่อยู่ในสถานะ Draft ได้')
        }

        // Update data and send it to approve. Must validate register date
        if (newAdsData.status === 'W') {
            validateDate(newAdsData.rgsStrDate, newAdsData.rgsExpDate)
        }

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

const updateActiveAds = async (adsId: number, data: any, userId: string) => {
    try {
        const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()

        if (ads.status !== 'A') {
            throw new BadRequestException('ไม่สามารถแก้ไขโครงการโฆษณาที่ไม่อยู่ในสถานะ Active ได้')
        }

        validateDateActiveAds(ads.rgsStrDate, data.rgsExpDate)
        // Only regisLimit, rgsExpDate can be updated.
        ads.regisLimit = data.regisLimit
        ads.rgsExpDate = time_service.changeDateTimeFormat(time_service.setISOTimeToEndOfDay(data.rgsExpDate)) || null
        ads.updatedUser = userId
        ads.updatedDate = time_service.getDateTimeNow()

        await ads.save()
        return ads.adsId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const updateAdsImage = async (adsId: number, imageName: string) => {
    try {
        const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()
        if (ads.imageName) await file_service.deleteImage(ads.imageName)
        ads.imageName = imageName
        await ads.save()
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const updateAdsImageToLMS = async (image: MultipartFile, adsId: number, token: string) => {
    try {
        await file_service.uploadImageToLMS(image, token)
        await updateAdsImage(adsId, image.clientName)
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const approveAds = async (adsId: number, userId: string) => {
    try {
        const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()

        switch (ads.status) {
            case 'D':
                throw new BadRequestException('ไม่สามารถอนุมัติโครงการโฆษณาที่อยู่ในสถานะ Draft')
            case 'A':
                throw new BadRequestException('โครงการโฆษณาเปิดใช้งานเเล้ว')
            case 'N':
                throw new BadRequestException('โครงการโฆษณาปิดใช้งานเเล้ว')
            default:
                break
        }

        ads.status = 'A'
        ads.approveDate = time_service.getDateTimeNow()
        ads.approveUser = userId
        await ads.save()
        await log_service.createLog('Approve advertisement.', userId, ads.adsId)
        return ads.adsId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const rejectWaitAprroveAds = async (adsId: number, userId: string) => {
    try {
        const ads = await Advertisement.query().where('adsId', adsId).firstOrFail()

        if (ads.status !== 'W') {
            throw new BadRequestException('ไม่สามารถปฎิเสธโครงการโฆษณาที่ไม่อยู่ในสถานะ Wait Approve ได้')
        }

        ads.status = 'D'
        await ads.save()
        await log_service.createLog('Reject advertisement.', userId, ads.adsId)
        return ads.adsId
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const inactivateAds = async (adsIds: number[]) => {
    await Advertisement.query().whereIn('adsId', adsIds).update({
        status: 'N' // Inactive status
    })
}

const getExpiredAds = async () => {
    const expiredAdsList = await Advertisement.query()
        .where('status', 'A')
        .whereNotNull('rgsExpDate') // Not null
        .where('rgsExpDate', '<=', time_service.getDateTimeNow())
    return expiredAdsList
}

const validateDate = (rgsStrDate: any, rgsExpDate: any) => {
    const newRgsStrDate = rgsStrDate ? new Date(rgsStrDate) : null
    const newRgsExpDate = rgsExpDate ? new Date(time_service.setISOTimeToEndOfDay(rgsExpDate)) : null
    const now = new Date(time_service.getDateTimeNow(0, DateTimeFormat.ISO8601))

    const success = {
        isSuccess: true,
        message: 'Success'
    }

    // Must have rgsStrDate
    if (newRgsStrDate && newRgsExpDate) {
        if (newRgsStrDate > now && newRgsExpDate > now) {
            if (newRgsStrDate < newRgsExpDate) {
                return success
            } else {
                throw new BadRequestException('วันเริ่มลงทะเบียนโครงการต้องอยู่หลังวันสิ้นสุดลงทะเบียน')
            }
        } else {
            throw new BadRequestException('วันเริ่มลงทะเบียนเเละวันสิ้นสุดลงทะเบียนต้องอยู่หลังปัจจุบัน')
        }
    } else if (newRgsStrDate && !newRgsExpDate) {
        if (newRgsStrDate > now) {
            return success
        } else {
            throw new BadRequestException('วันเริ่มลงทะเบียนต้องอยู่หลังปัจจุบัน')
        }
    } else {
        throw new BadRequestException('ต้องระบุวันเริ่มลงทะเบียน')
    }
}

const validateDateActiveAds = (rgsStrDate: any, rgsExpDate: any) => {
    const newRgsStrDate = rgsStrDate ? new Date(rgsStrDate) : null
    const newRgsExpDate = rgsExpDate ? new Date(time_service.setISOTimeToEndOfDay(rgsExpDate)) : null
    const now = new Date(time_service.getDateTimeNow(0, DateTimeFormat.ISO8601))

    const success = {
        isSuccess: true,
        message: 'Success'
    }

    // If ads is active. Ads always have rgsStrDate.
    if (newRgsStrDate && newRgsExpDate) {
        if (newRgsStrDate < newRgsExpDate && newRgsExpDate > now!) {
            return success
        } else if (newRgsStrDate >= newRgsExpDate) {
            throw new BadRequestException('วันสิ้นสุดลงทะเบียนโครงการต้องอยู่หลังวันเริ่มลงทะเบียน')
        } else {
            throw new BadRequestException('วันสิ้นสุดลงทะเบียนต้องอยู่หลังปัจจุบัน')
        }
    } else {
        // newRgsStrDate && !newRgsExpDate
        return success
    }
}

const setAdsValue = (ads: Advertisement, newAdsData: any, userId: string) => {
    // Required
    ads.adsName = newAdsData.adsName
    ads.adsCond = newAdsData.adsCond
    ads.status = newAdsData.status
    ads.periodId = newAdsData.periodId
    ads.redeemCode = newAdsData.redeemCode
    ads.packageId = newAdsData.packageId

    ads.updatedUser = userId
    ads.updatedDate = time_service.getDateTimeNow()

    // Not required
    ads.regisLimit = newAdsData.regisLimit
    ads.refAdsId = newAdsData.refAdsId
    ads.consentDesc = newAdsData.consentDesc
    ads.recInMth = newAdsData.recInMth
    ads.recNextMth = newAdsData.recNextMth
    ads.nextMth = newAdsData.nextMth
    ads.rgsStrDate = time_service.changeDateTimeFormat(time_service.setISOTimeToStartOfDay(newAdsData.rgsStrDate)) || null
    ads.rgsExpDate = time_service.changeDateTimeFormat(time_service.setISOTimeToEndOfDay(newAdsData.rgsExpDate)) || null

    return ads
}

export default {
    getAdsPage,
    getAdsList,
    getAdsDetail,
    getOldestAdsRegisDate,
    getAdsRegistration,
    getAdsExport,

    createAds,
    updateDraftAds,
    updateActiveAds,
    updateAdsImage,
    updateAdsImageToLMS,

    approveAds,
    rejectWaitAprroveAds,

    inactivateAds,
    getExpiredAds,

    validateDate
}
