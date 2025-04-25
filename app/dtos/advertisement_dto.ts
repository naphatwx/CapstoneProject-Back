import Advertisement from "#models/advertisement"
import { UserDTO, UserShortDTO } from "./user_dto.js"
import time_service from "#services/time_service"
import { PeriodDTO } from "./period_dtos.js"
import { MediaDTO } from "./media_dtos.js"
import { AdsPackageDTO } from "./ads_package_dtos.js"
import { LogDTO } from "./log_dtos.js"

export class AdvertisementListDTO {
    adsId: number | null
    adsName: string | null
    status: string | null
    periodId: number | null
    redeemCode: string | null
    packageId: number | null
    packageDesc: string | null
    updatedUser: string | null
    updatedDate: string | null
    rgsStrDate: string | null
    period: PeriodDTO | null
    userUpdate: UserShortDTO | null

    constructor(ads: Partial<Advertisement>) {
        this.adsId = ads.adsId || null
        this.adsName = ads.adsName || null
        this.status = ads.status || null
        this.periodId = ads.period?.periodId || null
        this.redeemCode = ads.redeemCode || null
        this.packageId = ads.packageIdPackage || null
        this.packageDesc = ads.packageDescPackage || null
        this.updatedUser = ads.updatedUser || null
        this.updatedDate = time_service.ensureDateTimeToString(ads.updatedDate) || null
        this.rgsStrDate = time_service.ensureDateTimeToString(ads.rgsStrDate) || null
        this.period = ads.period ? new PeriodDTO(ads.period) : null
        this.userUpdate = ads.userUpdate ? new UserShortDTO(ads.userUpdate) : null
    }
}

export class AdvertisementShortDTO {
    adsId: number | null
    adsName: string | null
    status: string | null

    constructor(ads: Advertisement) {
        this.adsId = ads.adsId || null
        this.adsName = ads.adsName || null
        this.status = ads.status || null
    }
}

export class AdvertisementDetailDTO {
    adsId: number | null
    adsName: string | null
    adsCond: string | null
    status: string | null
    periodId: number | null
    redeemCode: string | null
    packageId: number | null
    packageDesc: string | null
    regisLimit: number | null
    updatedUser: string | null
    updatedDate: string | null
    approveUser: string | null
    approveDate: string | null
    imageUrl: string | null
    refAdsId: number | null
    consentDesc: string | null
    recInMth: boolean
    recNextMth: boolean
    nextMth: number | null
    rgsStrDate: string | null
    rgsExpDate: string | null
    period: PeriodDTO | null
    medias: MediaDTO[]
    adsPackagess: AdsPackageDTO[]
    userUpdate: UserDTO | null
    userApprove: UserDTO | null
    logs: LogDTO[]

    constructor(ads: Partial<Advertisement>) {
        this.adsId = ads.adsId || null
        this.adsName = ads.adsName || null
        this.adsCond = ads.adsCond || null
        this.status = ads.status || null
        this.periodId = ads.period?.periodId || null
        this.redeemCode = ads.redeemCode || null
        this.packageId = ads.packageIdPackage || null
        this.packageDesc = ads.packageDescPackage || null
        this.regisLimit = ads.regisLimit || null
        this.updatedUser = ads.updatedUser || null
        this.updatedDate = time_service.ensureDateTimeToString(ads.updatedDate) || null
        this.approveUser = ads.approveUser || null
        this.approveDate = time_service.ensureDateTimeToString(ads.approveDate) || null
        this.imageUrl = ads.imageName || null
        this.refAdsId = ads.refAdsId || null
        this.consentDesc = ads.consentDesc || null
        this.recInMth = ads.recInMth || false
        this.recNextMth = ads.recNextMth || false
        this.nextMth = ads.nextMth || null
        this.rgsStrDate = time_service.ensureDateTimeToString(ads.rgsStrDate) || null
        this.rgsExpDate = time_service.ensureDateTimeToString(ads.rgsExpDate) || null
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
    adsId: number | null
    adsName: string | null
    status: string | null
    period: string | null
    redeemCode: string | null
    package: string | null
    regisLimit: number | null
    updatedUser: string | null
    updatedDate: string | null
    approveUser: string | null
    approveDate: string | null
    consentDesc: string | null
    refAdsId: number | null
    rgsStrDate: string | null
    rgsExpDate: string | null
    recInMth: boolean
    recNextMth: boolean
    nextMth: number | null
    totalRegistration: number

    constructor(ads: Partial<Advertisement>, totalRegistration: number) {
        const dateTimeFormat = 'dd LLLL yyyy HH:mm:ss'

        this.adsId = ads.adsId || null
        this.adsName = ads.adsName || null
        this.status = ads.status || null
        this.period = ads.period?.periodDesc || null
        this.redeemCode = ads.redeemCode || null
        this.package = ads.packageDescPackage || null
        this.regisLimit = ads.regisLimit || null
        this.updatedUser = ads.userUpdate ? ads.userUpdate?.firstname + ' ' + ads.userUpdate?.lastname : null
        this.updatedDate = time_service.changeDateTimeFormat(ads.updatedDate, dateTimeFormat) || null
        this.approveUser = ads.userApprove ? ads.userApprove?.firstname + ' ' + ads.userApprove?.lastname : null
        this.approveDate = time_service.changeDateTimeFormat(ads.approveDate, dateTimeFormat) || null
        this.consentDesc = ads.consentDesc || null
        this.refAdsId = ads.refAdsId || null
        this.rgsStrDate = time_service.changeDateTimeFormat(ads.rgsStrDate, dateTimeFormat) || null
        this.rgsExpDate = time_service.changeDateTimeFormat(ads.rgsExpDate, dateTimeFormat) || null
        this.recInMth = ads.recInMth || false
        this.recNextMth = ads.recNextMth || false
        this.nextMth = ads.nextMth || null
        this.totalRegistration = totalRegistration || 0
    }
}

export class AdsRegisDTO {
    adsId: number | null
    adsName: string | null
    totalRegistration: number | null
    rgsStrDate: string | null
    regisLimit: number | null
    status: string | null
    periodId: number | null

    constructor(ads: Partial<Advertisement>, totalRegistration: number) {
        this.adsId = ads.adsId || null
        this.adsName = ads.adsName || null
        this.totalRegistration = totalRegistration || null
        this.rgsStrDate = time_service.ensureDateTimeToString(ads.rgsStrDate) || null
        this.regisLimit = ads.regisLimit || null
        this.status = ads.status || null
        this.periodId = ads.periodId || null
    }
}

export class AdsShortDTO {
    adsId: number | null
    adsName: string | null
    status: string | null
    periodId: number | null
    periodDesc: string | null
    packageId: number | null
    packageDesc: string | null
    rgsStrDate: string | null
    rgsExpDate: string | null

    constructor(ads: Partial<Advertisement>) {
        this.adsId = ads.adsId || null
        this.adsName = ads.adsName || null
        this.status = ads.status || null
        this.periodId = ads.period?.periodId || null
        this.periodDesc = ads.period?.periodDesc || null
        this.packageId = ads.packageIdPackage || null
        this.packageDesc = ads.packageDescPackage || null
        this.rgsStrDate = time_service.ensureDateTimeToString(ads.rgsStrDate) || null
        this.rgsExpDate = time_service.ensureDateTimeToString(ads.rgsExpDate) || null
    }
}

