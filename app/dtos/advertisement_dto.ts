import Advertisement from "#models/advertisement"
import { DateTime } from "luxon"
import { UserShortDTO } from "./user_dto.js"
import User from "#models/user"
import time_service from "#services/time_service"

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
    period: {
        periodDesc: string
        period: number
    }
    userUpdate: UserShortDTO | null

    constructor(ads: Partial<AdvertisementListDTO>) {
        this.adsId = ads.adsId || 0
        this.adsName = ads.adsName || ''
        this.status = ads.status || ''
        this.periodId = ads.periodId || 0
        this.redeemCode = ads.redeemCode || ''
        this.packageId = ads.packageId || 0
        this.packageDesc = ads.packageDesc || ''
        this.updatedUser = ads.updatedUser || ''
        this.updatedDate = ads.updatedDate || ''
        this.rgsStrDate = ads.rgsStrDate || ''
        this.period = {
            periodDesc: ads.period?.periodDesc || '',
            period: ads.period?.period || 0
        }
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
    updatedDate: DateTime | string
    approveUser: string
    approveDate: DateTime | string
    imageUrl: string
    refAdsId: number
    consentDesc: string
    recInMth: boolean
    recNextMth: boolean
    nextMth: number
    rgsStrDate: DateTime | string
    rgsExpDate: DateTime | string
    period: {
        periodDesc: string
        period: number
    }
    medias: {
        mediaId: number
        mediaDesc: string
    }[]
    adsPackages: {
        mediaId: number
        mediaDesc: string
    }[]
    userUpdate: User | null
    userApprove: User | null
    logs: {
        itemNo: number
        logHeader: string
        updatedUser: string
        updatedDate: DateTime | string
        user: UserShortDTO
    }[]

    constructor(ads: Partial<Advertisement>) {
        this.adsId = ads.adsId || 0
        this.adsName = ads.adsName || ''
        this.adsCond = ads.adsCond || ''
        this.status = ads.status || ''
        this.periodId = ads.periodId || 0
        this.redeemCode = ads.redeemCode || ''
        this.packageId = ads.packageId || 0
        this.packageDesc = ads.packageDesc || ''
        this.regisLimit = ads.regisLimit || 0
        this.updatedUser = ads.updatedUser || ''
        this.updatedDate = ads.updatedDate || ''
        this.approveUser = ads.approveUser || ''
        this.approveDate = ads.approveDate || ''
        this.imageUrl = ads.imageName || ''
        this.refAdsId = ads.refAdsId || 0
        this.consentDesc = ads.consentDesc || ''
        this.recInMth = ads.recInMth || false
        this.recNextMth = ads.recNextMth || false
        this.nextMth = ads.nextMth || 0
        this.rgsStrDate = ads.rgsStrDate || ''
        this.rgsExpDate = ads.rgsExpDate || ''

        this.period = {
            periodDesc: ads.period?.periodDesc || '',
            period: ads.period?.period || 0
        }

        this.medias = ads.medias?.map((media) => ({
            mediaId: media.mediaId,
            mediaDesc: media.mediaDesc
        })) || []

        this.adsPackages = ads.adsPackages?.map((adsPackage) => ({
            mediaId: adsPackage.mediaId || 0,
            mediaDesc: adsPackage.mediaDesc || ''
        })) || []

        if (ads.userUpdate) {
            this.userUpdate = new User()
            this.userUpdate.comCode = ads.userUpdate.comCode || ''
            this.userUpdate.userId = ads.userUpdate.userId || ''
            this.userUpdate.firstname = ads.userUpdate.firstname || ''
            this.userUpdate.lastname = ads.userUpdate.lastname || ''
            this.userUpdate.email = ads.userUpdate.email || ''
            this.userUpdate.telphone = ads.userUpdate.telphone || ''
            this.userUpdate.loginTime = ads.userUpdate.loginTime || ''
            this.userUpdate.logoutTime = ads.userUpdate.logoutTime || ''
            this.userUpdate.updatedUser = ads.userUpdate.updatedUser || ''
            this.userUpdate.updatedDate = ads.userUpdate.updatedDate || ''
        } else {
            this.userUpdate = null
        }

        if (ads.userApprove) {
            this.userApprove = new User()
            this.userApprove.comCode = ads.userApprove.comCode || ''
            this.userApprove.userId = ads.userApprove.userId || ''
            this.userApprove.firstname = ads.userApprove.firstname || ''
            this.userApprove.lastname = ads.userApprove.lastname || ''
            this.userApprove.email = ads.userApprove.email || ''
            this.userApprove.telphone = ads.userApprove.telphone || ''
            this.userApprove.loginTime = ads.userApprove.loginTime || ''
            this.userApprove.logoutTime = ads.userApprove.logoutTime || ''
            this.userApprove.updatedUser = ads.userApprove.updatedUser || ''
            this.userApprove.updatedDate = ads.userApprove.updatedDate || ''
        } else {
            this.userApprove = null
        }

        this.logs = ads.logs?.map((log) => ({
            itemNo: log.itemNo || 0,
            logHeader: log.logHeader || '',
            updatedUser: log.updatedUser || '',
            updatedDate: log.updatedDate || '',
            user: {
                comCode: log.user.comCode || '',
                userId: log.user.userId || '',
                firstname: log.user.firstname || '',
                lastname: log.user.lastname || ''
            }
        })) || []
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
        this.package = ads.packageDesc || ''
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

export class CreateOrUpdateAdvertisementDTO {
    adsName: string
    adsCond: string
    status: string
    periodId: number
    redeemCode: string
    packageId: number
    regisLimit: number | null
    imageName: string | null
    refAdsId: number | null
    consentDesc: string | null
    recInMth: boolean
    recNextMth: boolean
    nextMth: number | null
    rgsStrDate: string | null
    rgsExpDate: string | null
    logHeader: string
    adsPackages: Array<number> | null

    constructor(data: Partial<CreateOrUpdateAdvertisementDTO>) {
        this.adsName = data.adsName?.trim() || ''
        this.adsCond = data.adsCond?.trim() || ''
        this.status = data.status?.trim() || ''
        this.periodId = data.periodId || 1
        this.redeemCode = data.redeemCode?.trim() || ''
        this.packageId = data.packageId || 1
        this.regisLimit = data.regisLimit || null
        this.imageName = data.imageName?.trim() || null
        this.refAdsId = data.refAdsId || null
        this.consentDesc = data.consentDesc?.trim() || null
        this.recInMth = data.recInMth || false
        this.recNextMth = data.recNextMth || false
        this.nextMth = data.nextMth || null
        this.rgsStrDate = data.rgsStrDate?.trim() || null
        this.rgsExpDate = data.rgsExpDate?.trim() || null
        this.logHeader = data.logHeader?.trim() || ''
        this.adsPackages = data.adsPackages || null
    }

    static fromVinePayload(payload: object): CreateOrUpdateAdvertisementDTO {
        return new CreateOrUpdateAdvertisementDTO(payload as CreateOrUpdateAdvertisementDTO)
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
        this.periodId = ads.periodId || 0
        this.periodDesc = ads.period?.periodDesc || ''
        this.packageId = ads.packageId || 0
        this.packageDesc = ads.packageDesc || ''
        this.rgsStrDate = time_service.ensureDateTimeToString(ads.rgsStrDate) || ''
        this.rgsExpDate = time_service.ensureDateTimeToString(ads.rgsExpDate) || ''
    }
}

