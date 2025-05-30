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

    constructor(ads: Partial<Advertisement>, count: number) {
        this.status = ads.status || null
        this.count = count || 0
    }
}

export class AdsGroupPeriodDTO {
    periodId: number | null
    periodDesc: string | null
    count: number

    constructor(ads: Partial<Advertisement>, count: number) {
        this.periodId = ads.periodId || null
        this.periodDesc = ads.period?.periodDesc || null
        this.count = count || 0
    }
}

export class AdsGroupPackageDTO {
    packageId: number | null
    packageDesc: string | null
    count: number

    constructor(ads: Partial<Advertisement>, count: number) {
        this.packageId = ads.packageId || null
        this.packageDesc = ads.packageDescPackage || null
        this.count = count || 0
    }
}

export class TopPlantDTO {
    comCode: string | null
    plantCode: string | null
    plantNameEn: string | null
    plantNameTh: string | null
    totalRegistration: number
    geography: {
        id: number | null
        name: string | null
    }
    province: {
        id: number | null
        nameEn: string | null
        nameTh: string | null
    }
    amphure: {
        id: number | null
        nameEn: string | null
        nameTh: string | null
    }
    tambon: {
        id: number | null
        nameEn: string | null
        nameTh: string | null
        zipCode: string | null
    }
    regis: any

    constructor(plant: Partial<Plant>,
        geography: Partial<ThaiGeography>,
        province: Partial<ThaiProvince>,
        amphure: Partial<ThaiAmphure>,
        tambon: Partial<ThaiTambon>,
        totalRegistration: number,
    ) {
        this.comCode = plant.comCode || null
        this.plantCode = plant.plantCode || null
        this.plantNameEn = plant.plantNameEn || null
        this.plantNameTh = plant.plantNameTh || null
        this.totalRegistration = totalRegistration || 0
        this.geography = {
            id: geography.id || null,
            name: geography.name || null
        }
        this.province = {
            id: province.id || null,
            nameEn: province.nameEn || null,
            nameTh: province.nameTh || null
        }
        this.amphure = {
            id: amphure.id || null,
            nameEn: amphure.nameEn || null,
            nameTh: amphure.nameTh || null
        }
        this.tambon = {
            id: tambon.id || null,
            nameEn: tambon.nameEn || null,
            nameTh: tambon.nameTh || null,
            zipCode: tambon.zipcode || null
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
    regisNo: string | null
    citizenId: string | null
    maxCard: string | null
    regisDate: string | null
    adsStartDate: string | null
    adsExpireDate: string | null
    driveLicense: string | null
    driveLicenseExp: string | null
    carLicense: string | null
    consentCf: boolean

    constructor(regis: Partial<Registration>) {
        const dateTimeFormat = 'dd LLLL yyyy HH:mm:ss'

        this.regisNo = regis.regisNo || null
        this.citizenId = regis.citizenId || null
        this.maxCard = regis.maxCard || null
        this.regisDate = time_service.changeDateTimeFormat(regis.regisDate, dateTimeFormat) || null
        this.adsStartDate = time_service.changeDateTimeFormat(regis.adsStartDate, dateTimeFormat) || null
        this.adsExpireDate = time_service.changeDateTimeFormat(regis.adsExpireDate, dateTimeFormat) || null
        this.driveLicense = regis.driveLicense || null
        this.driveLicenseExp = time_service.changeDateTimeFormat(regis.driveLicenseExp, dateTimeFormat) || null
        this.carLicense = regis.carLicense || null
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
    comName: string | null
    plantName: string | null
    adsId: number | null
    adsName: string | null
    regis: Partial<Registration>

    constructor(plant: Partial<Plant>, regis: Partial<Registration>) {
        this.comName = plant.company?.comName || null
        this.plantName = plant.plantNameTh || null
        this.adsId = regis.advertisement?.adsId || null
        this.adsName = regis.advertisement?.adsName || null
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
    adsId: number | null
    adsName: string | null
    comCode: string | null
    comName: string | null
    plantCode: string | null
    plantNameEn: string | null
    plantNameTh: string | null
    ads: Partial<Advertisement>
    regis: Partial<Registration>

    constructor(ads: Partial<Advertisement>, regis: Partial<Registration>) {
        this.adsId = ads.adsId || null
        this.adsName = ads.adsName || null
        this.comCode = regis.plant?.company.comCode || null
        this.comName = regis.plant?.company.comName || null
        this.plantCode = regis.plant?.plantCode || null
        this.plantNameEn = regis.plant?.plantNameEn || null
        this.plantNameTh = regis.plant?.plantNameTh || null
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
    comCode: string | null
    comName: string | null
    plantCode: string | null
    plantNameEn: string | null
    plantNameTh: string | null
    geography: string | null
    province: string | null
    amphur: string | null
    tambon: string | null
    zipCode: string | null
    numberOfRegistration: number

    constructor(plant: Partial<Plant>, numberOfRegistration: number) {
        this.comCode = plant.company?.comCode || null
        this.comName = plant.company?.comName || null
        this.plantCode = plant.plantCode || null
        this.plantNameEn = plant.plantNameEn || null
        this.plantNameTh = plant.plantNameTh || null
        this.geography = plant.tambon?.amphure.province.geography.name || null
        this.province = plant.tambon?.amphure.province.nameTh || null
        this.amphur = plant.tambon?.amphure.nameTh || null
        this.tambon = plant.tambon?.nameTh || null
        this.zipCode = plant.tambon?.zipcode || null
        this.numberOfRegistration = numberOfRegistration || 0
    }
}


