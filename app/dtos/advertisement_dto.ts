import Advertisement from "#models/advertisement"
import { DateTime } from "luxon"
import { UserShortDTO } from "./user_dto.js"
import User from "#models/user"
import time_service from "#services/time_service"

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
    period: {
        periodDesc: string | null
        period: number | null
    }
    userUpdate: UserShortDTO | null

    constructor(ads: Partial<AdvertisementListDTO>) {
        this.adsId = ads.adsId || null
        this.adsName = ads.adsName || null
        this.status = ads.status || null
        this.periodId = ads.periodId || null
        this.redeemCode = ads.redeemCode || null
        this.packageId = ads.packageId || null
        this.packageDesc = ads.packageDesc || null
        this.updatedUser = ads.updatedUser || null
        this.updatedDate = ads.updatedDate || null
        this.rgsStrDate = ads.rgsStrDate || null
        this.period = {
            periodDesc: ads.period?.periodDesc || null,
            period: ads.period?.period || null
        }
        this.userUpdate = {
            comCode: ads.userUpdate?.comCode || '',
            userId: ads.userUpdate?.userId || '',
            firstname: ads.userUpdate?.firstname || '',
            lastname: ads.userUpdate?.lastname || ''
        }
    }
}

export class AdvertisementShortDTO {
    adsId: number
    adsName: string | null
    status: string | null

    constructor(ads: Advertisement) {
        this.adsId = ads.adsId
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
    updatedDate: DateTime | string | null
    approveUser: string | null
    approveDate: DateTime | string | null
    imageUrl: string | null
    refAdsId: number | null
    consentDesc: string | null
    recInMth: boolean
    recNextMth: boolean
    nextMth: number | null
    rgsStrDate: DateTime | string | null
    rgsExpDate: DateTime | string | null
    period: {
        periodDesc: string | null
        period: number | null
    }
    medias: {
        mediaId: number | null
        mediaDesc: string | null
    }[]
    adsPackages: {
        mediaId: number | null
        mediaDesc: string | null
    }[]
    userUpdate: User | null
    userApprove: User | null
    logs: {
        itemNo: number | null
        logHeader: string | null
        updatedUser: string | null
        updatedDate: DateTime | string | null
        user: UserShortDTO
    }[]

    constructor(ads: Partial<Advertisement>) {
        this.adsId = ads.adsId || null
        this.adsName = ads.adsName || null
        this.adsCond = ads.adsCond || null
        this.status = ads.status || null
        this.periodId = ads.periodId || null
        this.redeemCode = ads.redeemCode || null
        this.packageId = ads.packageId || null
        this.packageDesc = ads.packageDesc || null
        this.regisLimit = ads.regisLimit || null
        this.updatedUser = ads.updatedUser || null
        this.updatedDate = ads.updatedDate || null
        this.approveUser = ads.approveUser || null
        this.approveDate = ads.approveDate || null
        this.imageUrl = ads.imageName || null
        this.refAdsId = ads.refAdsId || null
        this.consentDesc = ads.consentDesc || null
        this.recInMth = ads.recInMth || false
        this.recNextMth = ads.recNextMth || false
        this.nextMth = ads.nextMth || null
        this.rgsStrDate = ads.rgsStrDate || null
        this.rgsExpDate = ads.rgsExpDate || null

        this.period = {
            periodDesc: ads.period?.periodDesc || null,
            period: ads.period?.period || null
        }

        this.medias = ads.medias?.map((media) => ({
            mediaId: media.mediaId,
            mediaDesc: media.mediaDesc
        })) || []

        this.adsPackages = ads.adsPackages?.map((adsPackage) => ({
            mediaId: adsPackage.mediaId,
            mediaDesc: adsPackage.mediaDesc
        })) || []

        if (ads.userUpdate) {
            this.userUpdate = new User()
            this.userUpdate.comCode = ads.userUpdate.comCode || ''
            this.userUpdate.userId = ads.userUpdate.userId
            this.userUpdate.firstname = ads.userUpdate.firstname || null
            this.userUpdate.lastname = ads.userUpdate.lastname || null
            this.userUpdate.email = ads.userUpdate.email || ''
            this.userUpdate.telphone = ads.userUpdate.telphone || null
            this.userUpdate.loginTime = ads.userUpdate.loginTime || null
            this.userUpdate.logoutTime = ads.userUpdate.logoutTime || null
            this.userUpdate.updatedUser = ads.userUpdate.updatedUser || ''
            this.userUpdate.updatedDate = ads.userUpdate.updatedDate || ''
        } else {
            this.userUpdate = null
        }

        if (ads.userApprove) {
            this.userApprove = new User()
            this.userApprove.comCode = ads.userApprove.comCode || ''
            this.userApprove.userId = ads.userApprove.userId
            this.userApprove.firstname = ads.userApprove.firstname || null
            this.userApprove.lastname = ads.userApprove.lastname || null
            this.userApprove.email = ads.userApprove.email || ''
            this.userApprove.telphone = ads.userApprove.telphone || null
            this.userApprove.loginTime = ads.userApprove.loginTime || null
            this.userApprove.logoutTime = ads.userApprove.logoutTime || null
            this.userApprove.updatedUser = ads.userApprove.updatedUser || ''
            this.userApprove.updatedDate = ads.userApprove.updatedDate || ''
        } else {
            this.userApprove = null
        }

        this.logs = ads.logs?.map((log) => ({
            itemNo: log.itemNo,
            logHeader: log.logHeader,
            updatedUser: log.updatedUser,
            updatedDate: log.updatedDate,
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
    recInMth: boolean | null
    recNextMth: boolean | null
    nextMth: number | null
    totalRegistration: number | null

    constructor(ads: Partial<Advertisement>, totalRegistration: number) {
        const dateTimeFormat = 'dd LLLL yyyy HH:mm:ss'

        this.adsId = ads.adsId || null
        this.adsName = ads.adsName || null
        this.status = ads.status || null
        this.period = ads.period?.periodDesc || null
        this.redeemCode = ads.redeemCode || null
        this.package = ads.packageDesc || null
        this.regisLimit = ads.regisLimit || null
        this.updatedUser = (ads.userUpdate?.firstname + ' ' + ads.userUpdate?.lastname || null) || null
        this.updatedDate = time_service.changeDateTimeFormat(ads.updatedDate, dateTimeFormat) || null
        this.approveUser = (ads.userApprove ? ads.userApprove?.firstname + ' ' + ads.userApprove?.lastname : null) || null
        this.approveDate = time_service.changeDateTimeFormat(ads.approveDate, dateTimeFormat) || null
        this.consentDesc = ads.consentDesc || null
        this.refAdsId = ads.refAdsId || null
        this.rgsStrDate = time_service.changeDateTimeFormat(ads.rgsStrDate, dateTimeFormat) || null
        this.rgsExpDate = time_service.changeDateTimeFormat(ads.rgsExpDate, dateTimeFormat) || null
        this.recInMth = ads.recInMth || null
        this.recNextMth = ads.recNextMth || null
        this.nextMth = ads.nextMth || null
        this.totalRegistration = totalRegistration || null
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
        this.periodId = ads.periodId || null
        this.periodDesc = ads.period?.periodDesc || null
        this.packageId = ads.packageId || null
        this.packageDesc = ads.packageDesc || null
        this.rgsStrDate = time_service.ensureDateTimeToString(ads.rgsStrDate) || null
        this.rgsExpDate = time_service.ensureDateTimeToString(ads.rgsExpDate) || null
    }
}

