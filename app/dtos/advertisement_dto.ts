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
    userUpdate: UserShortDTO

    constructor(data: Partial<AdvertisementListDTO>) {
        this.adsId = data.adsId || null
        this.adsName = data.adsName || null
        this.status = data.status || null
        this.periodId = data.periodId || null
        this.redeemCode = data.redeemCode || null
        this.packageId = data.packageId || null
        this.packageDesc = data.packageDesc || null
        this.updatedUser = data.updatedUser || null
        this.updatedDate = data.updatedDate || null
        this.rgsStrDate = data.rgsStrDate || null
        this.period = {
            periodDesc: data.period?.periodDesc || null,
            period: data.period?.period || null
        }
        this.userUpdate = {
            comCode: data.userUpdate?.comCode || '',
            userId: data.userUpdate?.userId || '',
            firstname: data.userUpdate?.firstname || '',
            lastname: data.userUpdate?.lastname || ''
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

    constructor(data: Partial<Advertisement>) {
        this.adsId = data.adsId || null
        this.adsName = data.adsName || null
        this.adsCond = data.adsCond || null
        this.status = data.status || null
        this.periodId = data.periodId || null
        this.redeemCode = data.redeemCode || null
        this.packageId = data.packageId || null
        this.packageDesc = data.packageDesc || null
        this.regisLimit = data.regisLimit || null
        this.updatedUser = data.updatedUser || null
        this.updatedDate = data.updatedDate || null
        this.approveUser = data.approveUser || null
        this.approveDate = data.approveDate || null
        this.imageUrl = data.imageName || null
        this.refAdsId = data.refAdsId || null
        this.consentDesc = data.consentDesc || null
        this.recInMth = data.recInMth || false
        this.recNextMth = data.recNextMth || false
        this.nextMth = data.nextMth || null
        this.rgsStrDate = data.rgsStrDate || null
        this.rgsExpDate = data.rgsExpDate || null

        this.period = {
            periodDesc: data.period?.periodDesc || null,
            period: data.period?.period || null
        }

        this.medias = data.medias?.map((media) => ({
            mediaId: media.mediaId,
            mediaDesc: media.mediaDesc
        })) || []

        this.adsPackages = data.adsPackages?.map((adsPackage) => ({
            mediaId: adsPackage.mediaId,
            mediaDesc: adsPackage.mediaDesc
        })) || []

        if (data.userUpdate) {
            this.userUpdate = new User()
            this.userUpdate.comCode = data.userUpdate.comCode || ''
            this.userUpdate.userId = data.userUpdate.userId
            this.userUpdate.firstname = data.userUpdate.firstname || null
            this.userUpdate.lastname = data.userUpdate.lastname || null
            this.userUpdate.email = data.userUpdate.email || ''
            this.userUpdate.telphone = data.userUpdate.telphone || null
            this.userUpdate.loginTime = data.userUpdate.loginTime || null
            this.userUpdate.logoutTime = data.userUpdate.logoutTime || null
            this.userUpdate.updatedUser = data.userUpdate.updatedUser || ''
            this.userUpdate.updatedDate = data.userUpdate.updatedDate || ''
        } else {
            this.userUpdate = null
        }

        if (data.userApprove) {
            this.userApprove = new User()
            this.userApprove.comCode = data.userApprove.comCode || ''
            this.userApprove.userId = data.userApprove.userId
            this.userApprove.firstname = data.userApprove.firstname || null
            this.userApprove.lastname = data.userApprove.lastname || null
            this.userApprove.email = data.userApprove.email || ''
            this.userApprove.telphone = data.userApprove.telphone || null
            this.userApprove.loginTime = data.userApprove.loginTime || null
            this.userApprove.logoutTime = data.userApprove.logoutTime || null
            this.userApprove.updatedUser = data.userApprove.updatedUser || ''
            this.userApprove.updatedDate = data.userApprove.updatedDate || ''
        } else {
            this.userApprove = null
        }

        this.logs = data.logs?.map((log) => ({
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

    constructor(data: Partial<Advertisement>, totalRegistration: number) {
        const dateTimeFormat = 'dd LLLL yyyy HH:mm:ss'

        this.adsId = data.adsId || 0
        this.adsName = data.adsName || ''
        this.status = data.status || ''
        this.period = data.period?.periodDesc || ''
        this.redeemCode = data.redeemCode || ''
        this.package = data.packageDesc || ''
        this.regisLimit = data.regisLimit || 0
        this.updatedUser = (data.userUpdate?.firstname + ' ' + data.userUpdate?.lastname || null) || ''
        this.updatedDate = time_service.changeDateTimeFormat(data.updatedDate, dateTimeFormat)
        this.approveUser = (data.userApprove ? data.userApprove?.firstname + ' ' + data.userApprove?.lastname : null) || ''
        this.approveDate = time_service.changeDateTimeFormat(data.approveDate, dateTimeFormat)
        this.consentDesc = data.consentDesc || ''
        this.refAdsId = data.refAdsId || 0
        this.rgsStrDate = time_service.changeDateTimeFormat(data.rgsStrDate, dateTimeFormat)
        this.rgsExpDate = time_service.changeDateTimeFormat(data.rgsExpDate, dateTimeFormat)
        this.recInMth = data.recInMth || false
        this.recNextMth = data.recNextMth || false
        this.nextMth = data.nextMth || 0
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
    adsId: number | null
    adsName: string | null
    totalRegistration: number | null
    rgsStrDate: string | null
    regisLimit: number | null
    status: string | null
    periodId: number | null

    constructor(data: any, totalRegistration: number) {
        this.adsId = data.adsId
        this.adsName = data.adsName
        this.totalRegistration = totalRegistration
        this.rgsStrDate = data.rgsStrDate
        this.regisLimit = data.regisLimit
        this.status = data.status
        this.periodId = data.periodId
    }
}

export class AdsShortDTO {
    adsId: string
    adsName: string
    status: string
    periodId: number
    periodDesc: string
    packageId: number
    packageDesc: string
    rgsStrDate: string
    rgsExpDate: string

    constructor(ads: any) {
        this.adsId = ads.adsId || 0
        this.adsName = ads.adsName || ''
        this.status = ads.status || ''
        this.periodId = ads.periodId || 0
        this.periodDesc = ads.period.periodDesc || ''
        this.packageId = ads.packageId || 0
        this.packageDesc = ads.packageDesc || ''
        this.rgsStrDate = ads.rgsStrDate || ''
        this.rgsExpDate = ads.rgsExpDate || ''
    }
}

