import Advertisement from "#models/advertisement"
import Plant from "#models/plant"
import Registration from "#models/registration"
import ThaiAmphure from "#models/thai_amphure"
import ThaiGeography from "#models/thai_geography"
import ThaiProvince from "#models/thai_province"
import ThaiTambon from "#models/thai_tambon"
import { AdsShortDTO } from "./advertisement_dto.js"

export class AdsGrupStatusDTO {
    status: string | null
    count: number

    constructor(ads: Advertisement, count: number) {
        this.status = ads.status || null
        this.count = count || 0
    }
}

export class AdsGroupPeriodDTO {
    periodId: number
    periodDesc: string
    count: number

    constructor(ads: Advertisement, count: number) {
        this.periodId = ads.periodId || 0
        this.periodDesc = ads.period.periodDesc || ''
        this.count = count || 0
    }
}

export class AdsGroupPackageDTO {
    packageId: number
    packageDesc: string
    count: number

    constructor(ads: Advertisement, count: number) {
        this.packageId = ads.packageId || 0
        this.packageDesc = ads.packageDesc || ''
        this.count = count || 0
    }
}

export class TopPlantDTO {
    comCode: string
    plantCode: string
    totalRegistration: number
    geography: {
        id: number
        name: string
    }
    province: {
        id: number
        nameEn: string
        nameTh: string
    }
    amphure: {
        id: number
        nameEn: string
        nameTh: string
    }
    tambon: {
        id: number
        nameEn: string
        nameTh: string
        zipCode: string
    }
    regis: any

    constructor(plant: Plant,
        geography: ThaiGeography,
        province: ThaiProvince,
        amphure: ThaiAmphure,
        tambon: ThaiTambon,
        totalRegistration: number,
    ) {
        this.comCode = plant.comCode
        this.plantCode = plant.plantCode || ''
        this.totalRegistration = totalRegistration || 0
        this.geography = {
            id: geography.id || 0,
            name: geography.name || ''
        }
        this.province = {
            id: province.id || 0,
            nameEn: province.nameEn || '',
            nameTh: province.nameTh || ''
        }
        this.amphure = {
            id: amphure.id || 0,
            nameEn: amphure.nameEn || '',
            nameTh: amphure.nameTh || ''
        }
        this.tambon = {
            id: tambon.id || 0,
            nameEn: tambon.nameEn || '',
            nameTh: tambon.nameTh || '',
            zipCode: tambon.zipcode || ''
        }
        this.regis = plant.registration.map((reg: Registration) => {
            return {
                regisNo: reg.regisNo,
                adsId: reg.advertisement.adsId,
                rgsStrDate: reg.advertisement.rgsStrDate
            }
        })
    }
}

export class TopAdsDTO extends AdsShortDTO {
    totalRegistration: number
    regis: any

    constructor(ads: Advertisement, totalRegistration: number) {
        super(ads)
        this.totalRegistration = totalRegistration || 0
        this.regis = ads.registrations.map((reg: Registration) => {
            return reg.regisNo
        })
    }
}

export class RegisPerMonthByAdsDTO extends AdsShortDTO {
    regisPerMonth: any

    constructor(ads: Advertisement, extra: any) {
        super(ads)
        this.regisPerMonth = extra
    }
}


