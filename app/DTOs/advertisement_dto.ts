export class AdvertisementListDTO {
    adsId: number | null
    adsName: string | null
    redeemCode: string | null
    packageId: number | null
    packageDesc: string | null
    periodId: number | null
    rgsStrDate: string | null
    status: string | null
    updatedUser: string | null
    updatedDate: string | null
    period: {
        periodDesc: string | null
        period: number | null
    }
    userUpdate: {
        comCode: string | null
        userId: string | null
        firstname: string | null
        lastname: string | null
    }

    constructor(data: Partial<AdvertisementListDTO>) {
        this.adsId = data.adsId || null
        this.adsName = data.adsName || null
        this.redeemCode = data.redeemCode  || null
        this.packageId = data.packageId || null
        this.packageDesc = data.packageDesc || null
        this.periodId = data.periodId || null
        this.rgsStrDate = data.rgsStrDate || null
        this.status = data.status || null
        this.updatedUser = data.updatedUser || null
        this.updatedDate = data.updatedDate || null
        this.period = data.period || {
            periodDesc: null,
            period: null,
        }
        this.userUpdate = data.userUpdate || {
            comCode: null,
            userId: null,
            firstname: null,
            lastname: null,
        }
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
