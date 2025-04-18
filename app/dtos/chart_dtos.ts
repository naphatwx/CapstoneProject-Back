import Advertisement from "#models/advertisement"
import Plant from "#models/plant"
import Registration from "#models/registration"
import ThaiAmphure from "#models/thai_amphure"
import ThaiGeography from "#models/thai_geography"
import ThaiProvince from "#models/thai_province"
import ThaiTambon from "#models/thai_tambon"
import time_service from "#services/time_service"
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
    plantNameEn: string
    plantNameTh: string
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
        this.plantNameEn = plant.plantNameEn || ''
        this.plantNameTh = plant.plantNameTh || ''
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
        this.regis = plant.registrations.map((reg: Registration) => {
            return {
                regisNo: reg.regisNo,
                adsId: reg.advertisement.adsId,
                adsName: reg.advertisement.adsName,
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

export class RegistrationExport {
    regisNo: string
    citizenId: string
    maxCard: string
    regisDate: string
    adsStartDate: string
    adsExpireDate: string
    driveLicense: string
    driveLicenseExp: string
    carLicense: string
    consentCf: boolean

    constructor(regis: Partial<Registration>) {
        const dateTimeFormat = 'dd LLLL yyyy HH:mm:ss'

        this.regisNo = regis.regisNo || ''
        this.citizenId = regis.citizenId || ''
        this.maxCard = regis.maxCard || ''
        this.regisDate = time_service.changeDateTimeFormat(regis.regisDate, dateTimeFormat)
        this.adsStartDate = time_service.changeDateTimeFormat(regis.adsStartDate, dateTimeFormat)
        this.adsExpireDate = time_service.changeDateTimeFormat(regis.adsExpireDate, dateTimeFormat)
        this.driveLicense = regis.driveLicense || ''
        this.driveLicenseExp = time_service.changeDateTimeFormat(regis.driveLicenseExp, dateTimeFormat)
        this.carLicense = regis.carLicense || ''
        this.consentCf = regis.consentCf || false
    }
}

export class RegistrationPlantExport extends RegistrationExport {
    adsId: number
    adsName: string

    constructor(regis: Partial<Registration>) {
        super(regis)
        this.adsId = regis.advertisement?.adsId || 0
        this.adsName = regis.advertisement?.adsName || ''
    }
}

export class RegistrationAdsExport extends RegistrationExport {
    comCode: string
    comName: string
    plantCode: string
    plantNameEn: string
    plantNameTh: string

    constructor(regis: Partial<Registration>) {
        super(regis)
        this.comCode = regis.plant?.company.comCode || ''
        this.comName = regis.plant?.company.comName || ''
        this.plantCode = regis.plant?.plantCode || ''
        this.plantNameEn = regis.plant?.plantNameEn || ''
        this.plantNameTh = regis.plant?.plantNameTh || ''
    }
}

export class PlantExport {
    comCode: string
    comName: string
    plantCode: string
    plantNameEn: string
    plantNameTh: string
    geography: string
    province: string
    amphur: string
    tambon: string
    zipCode: string
    numberOfRegistration: number

    constructor(plant: Partial<Plant>, numberOfRegistration: number) {
        this.comCode = plant.company?.comCode || ''
        this.comName = plant.company?.comName || ''
        this.plantCode = plant.plantCode || ''
        this.plantNameEn = plant.plantNameEn || ''
        this.plantNameTh = plant.plantNameTh || ''
        this.geography = plant.tambon?.amphure.province.geography.name || ''
        this.province = plant.tambon?.amphure.province.nameTh || ''
        this.amphur = plant.tambon?.amphure.nameTh || ''
        this.tambon = plant.tambon?.nameTh || ''
        this.zipCode = plant.tambon?.zipcode || ''
        this.numberOfRegistration = numberOfRegistration || 0
    }
}


