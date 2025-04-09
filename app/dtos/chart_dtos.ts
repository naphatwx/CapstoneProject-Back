import Registration from "#models/registration"
import ThaiAmphure from "#models/thai_amphure"
import ThaiGeography from "#models/thai_geography"
import ThaiProvince from "#models/thai_province"
import ThaiTambon from "#models/thai_tambon"

export class AdsGrupStatus {
    status: string | null
    count: number

    constructor(data: any, count: number) {
        this.status = data.status || null
        this.count = count || 0
    }
}

export class AdsGroupPeriod {
    periodId: number
    count: number

    constructor(data: any, count: number) {
        this.periodId = data.periodId || 0
        this.count = count || 0
    }
}

export class AdsGroupPackage {
    packageId: number
    count: number

    constructor(data: any, count: number) {
        this.packageId = data.packageId || 0
        this.count = count || 0
    }
}

export class AdsGroupPlant {
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

    constructor(data: any,
        geography: ThaiGeography,
        province: ThaiProvince,
        amphure: ThaiAmphure,
        tambon: ThaiTambon,
        totalRegistration: number,
    ) {
        this.comCode = data.comCode
        this.plantCode = data.plantCode || ''
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
        this.regis = data.registration.map((reg: Registration) => {
            return {
                regNo: reg.regisNo,
                adsId: reg.advertisement.adsId,
                regStrDate: reg.advertisement.rgsStrDate
            }
        })
    }
}

