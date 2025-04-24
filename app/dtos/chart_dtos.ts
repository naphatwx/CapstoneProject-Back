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
    status: string
    count: number

    constructor(ads: Partial<Advertisement>, count: number) {
        this.status = ads.status || ''
        this.count = count || 0
    }
}

export class AdsGroupPeriodDTO {
    periodId: number
    periodDesc: string
    count: number

    constructor(ads: Partial<Advertisement>, count: number) {
        this.periodId = ads.periodId || 0
        this.periodDesc = ads.period?.periodDesc || ''
        this.count = count || 0
    }
}

export class AdsGroupPackageDTO {
    packageId: number
    packageDesc: string
    count: number

    constructor(ads: Partial<Advertisement>, count: number) {
        this.packageId = ads.packageId || 0
        this.packageDesc = ads.packageDescPackage || ''
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

    constructor(plant: Partial<Plant>,
        geography: Partial<ThaiGeography>,
        province: Partial<ThaiProvince>,
        amphure: Partial<ThaiAmphure>,
        tambon: Partial<ThaiTambon>,
        totalRegistration: number,
    ) {
        this.comCode = plant.comCode || ''
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
        this.regis = plant.registrations?.map((reg: Registration) => {
            return {
                regisNo: reg.regisNo || null,
                adsId: reg.advertisement.adsId || null,
                adsName: reg.advertisement.adsName || null,
                rgsStrDate: reg.advertisement.rgsStrDate || null
            }
        })
    }
}

export class TopAdsDTO extends AdsShortDTO {
    totalRegistration: number
    regis: any

    constructor(ads: Partial<Advertisement>, totalRegistration: number) {
        super(ads)
        this.totalRegistration = totalRegistration || 0
        this.regis = ads.registrations?.map((reg: Registration) => {
            return reg.regisNo || null
        })
    }
}

export class RegisPerMonthByAdsDTO extends AdsShortDTO {
    regisPerMonth: any

    constructor(ads: Partial<Advertisement>, extra: any) {
        super(ads)
        this.regisPerMonth = extra || null
    }
}

export class RegistrationExportDTO {
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
        this.regisDate = time_service.changeDateTimeFormat(regis.regisDate, dateTimeFormat) || ''
        this.adsStartDate = time_service.changeDateTimeFormat(regis.adsStartDate, dateTimeFormat) || ''
        this.adsExpireDate = time_service.changeDateTimeFormat(regis.adsExpireDate, dateTimeFormat) || ''
        this.driveLicense = regis.driveLicense || ''
        this.driveLicenseExp = time_service.changeDateTimeFormat(regis.driveLicenseExp, dateTimeFormat) || ''
        this.carLicense = regis.carLicense || ''
        this.consentCf = regis.consentCf || false
    }

    getDate() {
        return {
            regisNo: this.regisNo,
            citizenId: this.citizenId,
            maxCard: this.maxCard,
            regisDate: this.regisDate,
            adsStartDate: this.adsStartDate,
            adsExpireDate: this.adsExpireDate,
            driveLicense: this.driveLicense,
            driveLicenseExp: this.driveLicenseExp,
            carLicense: this.carLicense,
            consentCf: this.consentCf,
        }
    }
}

export class RegistrationPlantExportDTO {
    comName: string
    plantName: string
    adsId: number
    adsName: string
    regis: Partial<Registration>

    constructor(plant: Partial<Plant>, regis: Partial<Registration>) {
        this.comName = plant.company?.comName || ''
        this.plantName = plant.plantNameTh || ''
        this.adsId = regis.advertisement?.adsId || 0
        this.adsName = regis.advertisement?.adsName || ''
        this.regis = regis
    }

    toOrderData() {
        const baseDate = new RegistrationExportDTO(this.regis)
        return {
            comName: this.comName,
            plantName: this.plantName,
            ...baseDate,
            adsId: this.adsId,
            adsName: this.adsName
        }
    }
}

export class RegistrationAdsExportDTO {
    adsId: number
    adsName: string
    comCode: string
    comName: string
    plantCode: string
    plantNameEn: string
    plantNameTh: string
    ads: Partial<Advertisement>
    regis: Partial<Registration>

    constructor(ads: Partial<Advertisement>, regis: Partial<Registration>) {
        this.adsId = ads.adsId || 0
        this.adsName = ads.adsName || ''
        this.comCode = regis.plant?.company.comCode || ''
        this.comName = regis.plant?.company.comName || ''
        this.plantCode = regis.plant?.plantCode || ''
        this.plantNameEn = regis.plant?.plantNameEn || ''
        this.plantNameTh = regis.plant?.plantNameTh || ''
        this.ads = ads
        this.regis = regis
    }

    toOrderData() {
        const baseDate = new RegistrationExportDTO(this.regis)
        return {
            adsId: this.adsId,
            adsName: this.adsName,
            ...baseDate,
            comCode: this.comCode,
            comName: this.comName,
            plantCode: this.plantCode,
            plantNameEn: this.plantNameEn,
            plantNameTh: this.plantNameTh
        }
    }

    getRegisOnly() {
        const baseDate = new RegistrationExportDTO(this.regis)
        return {
            ...baseDate,
            comCode: this.comCode,
            comName: this.comName,
            plantCode: this.plantCode,
            plantNameEn: this.plantNameEn,
            plantNameTh: this.plantNameTh
        }
    }
}

export class PlantExportDTO {
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


