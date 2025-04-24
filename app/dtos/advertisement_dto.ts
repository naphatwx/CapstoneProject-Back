import Advertisement from "#models/advertisement"
import { UserDTO, UserShortDTO } from "./user_dto.js"
import time_service from "#services/time_service"
import { PeriodDTO } from "./period_dtos.js"
import { MediaDTO } from "./media_dtos.js"
import { AdsPackageDTO } from "./ads_package_dtos.js"
import { LogDTO } from "./log_dtos.js"

export class AdvertisementListDTO {
    adsId: number
    adsName: string
    status: string
    periodId: number
    redeemCode: string
    packageId: number
    packageDesc: string
    updatedUser: string
    updatedDate: string
    rgsStrDate: string
    period: PeriodDTO | null
    userUpdate: UserShortDTO | null

    constructor(ads: Partial<Advertisement>) {
        this.adsId = ads.adsId || 0
        this.adsName = ads.adsName || ''
        this.status = ads.status || ''
        this.periodId = ads.period?.periodId || 0
        this.redeemCode = ads.redeemCode || ''
        this.packageId = ads.packageIdPackage || 0
        this.packageDesc = ads.packageDescPackage || ''
        this.updatedUser = ads.updatedUser || ''
        this.updatedDate = time_service.ensureDateTimeToString(ads.updatedDate) || ''
        this.rgsStrDate = time_service.ensureDateTimeToString(ads.rgsStrDate) || ''
        this.period = ads.period ? new PeriodDTO(ads.period) : null
        this.userUpdate = ads.userUpdate ? new UserShortDTO(ads.userUpdate) : null
    }
}

export class AdvertisementShortDTO {
    adsId: number
    adsName: string
    status: string

    constructor(ads: Advertisement) {
        this.adsId = ads.adsId
        this.adsName = ads.adsName || ''
        this.status = ads.status || ''
    }
}

export class AdvertisementDetailDTO {
    adsId: number
    adsName: string
    adsCond: string
    status: string
    periodId: number
    redeemCode: string
    packageId: number
    packageDesc: string
    regisLimit: number
    updatedUser: string
    updatedDate: string
    approveUser: string
    approveDate: string
    imageUrl: string
    refAdsId: number
    consentDesc: string
    recInMth: boolean
    recNextMth: boolean
    nextMth: number
    rgsStrDate: string
    rgsExpDate: string
    period: PeriodDTO | null
    medias: MediaDTO[]
    adsPackagess: AdsPackageDTO[]
    userUpdate: UserDTO | null
    userApprove: UserDTO | null
    logs: LogDTO[] | null

    constructor(ads: Partial<Advertisement>) {
        this.adsId = ads.adsId || 0
        this.adsName = ads.adsName || ''
        this.adsCond = ads.adsCond || ''
        this.status = ads.status || ''
        this.periodId = ads.period?.periodId || 0
        this.redeemCode = ads.redeemCode || ''
        this.packageId = ads.packageIdPackage || 0
        this.packageDesc = ads.packageDescPackage || ''
        this.regisLimit = ads.regisLimit || 0
        this.updatedUser = ads.updatedUser || ''
        this.updatedDate = time_service.ensureDateTimeToString(ads.updatedDate) || ''
        this.approveUser = ads.approveUser || ''
        this.approveDate = time_service.ensureDateTimeToString(ads.approveDate) || ''
        this.imageUrl = ads.imageName || ''
        this.refAdsId = ads.refAdsId || 0
        this.consentDesc = ads.consentDesc || ''
        this.recInMth = ads.recInMth || false
        this.recNextMth = ads.recNextMth || false
        this.nextMth = ads.nextMth || 0
        this.rgsStrDate = time_service.ensureDateTimeToString(ads.rgsStrDate) || ''
        this.rgsExpDate = time_service.ensureDateTimeToString(ads.rgsExpDate) || ''
        this.period = ads.period ? new PeriodDTO(ads.period) : null
        this.medias = ads.medias && ads.medias.length > 0 ? ads.medias.map((media) => {
            return new MediaDTO(media)
        }) : []
        this.adsPackagess = ads.adsPackages && ads.adsPackages.length > 0 ? ads.adsPackages?.map((adsPackage) => {
            return new AdsPackageDTO(adsPackage)
        }) : []
        this.userUpdate = ads.userUpdate ? new UserDTO(ads.userUpdate) : null
        this.userApprove = ads.userApprove ? new UserDTO(ads.userApprove) : null
        this.logs = ads.logs && ads.logs.length > 0 ? ads.logs.map((log) => {
            return new LogDTO(log)
        }) : []
    }
}

export class AdvertisementExportDTO {
    adsId: number
    adsName: string
    status: string
    period: string
    redeemCode: string
    package: string
    regisLimit: number
    updatedUser: string
    updatedDate: string
    approveUser: string
    approveDate: string
    consentDesc: string
    refAdsId: number
    rgsStrDate: string
    rgsExpDate: string
    recInMth: boolean
    recNextMth: boolean
    nextMth: number
    totalRegistration: number

    constructor(ads: Partial<Advertisement>, totalRegistration: number) {
        const dateTimeFormat = 'dd LLLL yyyy HH:mm:ss'

        this.adsId = ads.adsId || 0
        this.adsName = ads.adsName || ''
        this.status = ads.status || ''
        this.period = ads.period?.periodDesc || ''
        this.redeemCode = ads.redeemCode || ''
        this.package = ads.packageDescPackage || ''
        this.regisLimit = ads.regisLimit || 0
        this.updatedUser = (ads.userUpdate?.firstname + ' ' + ads.userUpdate?.lastname || null) || ''
        this.updatedDate = time_service.changeDateTimeFormat(ads.updatedDate, dateTimeFormat) || ''
        this.approveUser = (ads.userApprove ? ads.userApprove?.firstname + ' ' + ads.userApprove?.lastname : null) || ''
        this.approveDate = time_service.changeDateTimeFormat(ads.approveDate, dateTimeFormat) || ''
        this.consentDesc = ads.consentDesc || ''
        this.refAdsId = ads.refAdsId || 0
        this.rgsStrDate = time_service.changeDateTimeFormat(ads.rgsStrDate, dateTimeFormat) || ''
        this.rgsExpDate = time_service.changeDateTimeFormat(ads.rgsExpDate, dateTimeFormat) || ''
        this.recInMth = ads.recInMth || false
        this.recNextMth = ads.recNextMth || false
        this.nextMth = ads.nextMth || 0
        this.totalRegistration = totalRegistration || 0
    }
}

export class AdsRegisDTO {
    adsId: number
    adsName: string
    totalRegistration: number
    rgsStrDate: string
    regisLimit: number
    status: string
    periodId: number

    constructor(ads: Partial<Advertisement>, totalRegistration: number) {
        this.adsId = ads.adsId || 0
        this.adsName = ads.adsName || ''
        this.totalRegistration = totalRegistration || 0
        this.rgsStrDate = time_service.ensureDateTimeToString(ads.rgsStrDate) || ''
        this.regisLimit = ads.regisLimit || 0
        this.status = ads.status || ''
        this.periodId = ads.periodId || 0
    }
}

export class AdsShortDTO {
    adsId: number
    adsName: string
    status: string
    periodId: number
    periodDesc: string
    packageId: number
    packageDesc: string
    rgsStrDate: string
    rgsExpDate: string

    constructor(ads: Partial<Advertisement>) {
        this.adsId = ads.adsId || 0
        this.adsName = ads.adsName || ''
        this.status = ads.status || ''
        this.periodId = ads.period?.periodId || 0
        this.periodDesc = ads.period?.periodDesc || ''
        this.packageId = ads.packageIdPackage || 0
        this.packageDesc = ads.packageDescPackage || ''
        this.rgsStrDate = time_service.ensureDateTimeToString(ads.rgsStrDate) || ''
        this.rgsExpDate = time_service.ensureDateTimeToString(ads.rgsExpDate) || ''
    }
}

