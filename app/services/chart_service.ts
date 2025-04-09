import BadRequestException from "#exceptions/badrequest_exception"
import Advertisement from "#models/advertisement"
import Plant from "#models/plant"
import ThaiAmphure from "#models/thai_amphure"
import ThaiGeography from "#models/thai_geography"
import ThaiProvince from "#models/thai_province"
import ThaiTambon from "#models/thai_tambon"
import { AdsGroupPackage, AdsGroupPeriod, AdsGroupPlant, AdsGrupStatus } from "../dtos/chart_dtos.js"
import time_service from "./time_service.js"

const getThaiLocation = async () => {
    const geographies = await ThaiGeography.query().limit(2)
    const provinces = await ThaiProvince.query().limit(2)
    const amphures = await ThaiAmphure.query().limit(2)
    const tambons = await ThaiTambon.query().limit(2)

    console.log('geographies', geographies)
    console.log('provinces', provinces)
    console.log('amphures', amphures)
    console.log('tambons', tambons)
}

const getAdsGroupStatus = async () => {
    const ads = await Advertisement.query()
        .select('status')
        .whereNotNull('status')
        .where('status', '!=', '')
        .count('* as count')
        .groupBy('status')
        .orderBy('status', 'asc')

    const adsDTO = ads.map((ad) => {
        return new AdsGrupStatus(ad, ad.$extras.count)
    })

    return adsDTO
}

const getAdsGroupPeriod = async () => {
    const ads = await Advertisement.query()
        .select('periodId')
        .whereNotNull('periodId')
        .where('periodId', '!=', 0)
        .count('* as count')
        .groupBy('periodId')
        .orderBy('periodId', 'asc')

    const adsDTO = ads.map((ad) => {
        return new AdsGroupPeriod(ad, ad.$extras.count)
    })

    return adsDTO
}

const getAdsGroupPackage = async () => {
    const ads = await Advertisement.query()
        .select('packageId')
        .whereNotNull('packageId')
        .where('packageId', '!=', 0)
        .count('* as count')
        .groupBy('packageId')
        .orderBy('packageId', 'asc')

    const adsDTO = ads.map((ad) => {
        return new AdsGroupPackage(ad, ad.$extras.count)
    })

    return adsDTO
}

const getTopPlant = async (
    geographyId: number | string | null = null,
    provinceId: number | string | null = null,
    year: number | string | null = null,
    quarter: number | string | null = null,
    limit: number = 10
) => {
    if (!year && quarter) {
        throw new BadRequestException('Quarter cannot be specified without specifying a year')
    }

    let monthYearStart: string
    let monthYearEnd: string
    if (year && quarter) {
        monthYearStart = year + '-' + time_service.convertQuarterToMonth(Number(quarter)).start
        monthYearEnd = year + '-' + time_service.convertQuarterToMonth(Number(quarter)).end
    }

    const plant = await Plant.query()
        .whereHas('tambon', (tambonQuery) => {
            tambonQuery.whereHas('amphure', (amphureQuery) => {
                amphureQuery.whereHas('province', (provinceQuery) => {
                    provinceQuery.if(provinceId, (query) => query.where('id', provinceId!))
                        .whereHas('geography', (geographyQuery) => {
                            geographyQuery.if(geographyId, (query) => query.where('id', geographyId!))
                        })
                })
            })
        })
        .preload('tambon', (tambonQuery) => {
            tambonQuery.preload('amphure', (amphureQuery) => {
                amphureQuery.preload('province', (provinceQuery) => {
                    provinceQuery.preload('geography')
                })
            })
        })
        // Filter plant
        .if(year && quarter, (query) => {
            query.whereHas('registration', (regQuery) => {
                regQuery.whereHas('advertisement', (adQuery) => {
                    adQuery.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') >= ?`, [monthYearStart as string])
                        .whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') <= ?`, [monthYearEnd as string])
                })
            })
        })
        .if(year && !quarter, (query) => {
            query.whereHas('registration', (regQuery) => {
                regQuery.whereHas('advertisement', (adQuery) => {
                    adQuery.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy') = ?`, [year!.toString() as string])
                })
            })
        })
        // Preload with filter
        .preload('registration', (regQuery) => {
            regQuery.whereHas('advertisement', (adQuery) => {
                if (year && quarter) {
                    adQuery.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') >= ?`, [monthYearStart as string])
                        .whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') <= ?`, [monthYearEnd as string])
                }
                if (year && !quarter) {
                    adQuery.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy') = ?`, [year.toString() as string])
                }
            })
            regQuery.preload('advertisement')
        })
        // Count with filter
        .withCount('registration', (regQuery) => {
            regQuery.whereHas('advertisement', (adQuery) => {
                if (year && quarter) {
                    adQuery.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') >= ?`, [monthYearStart as string])
                        .whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') <= ?`, [monthYearEnd as string])
                }
                if (year && !quarter) {
                    adQuery.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy') = ?`, [year.toString() as string])
                }
            })
            regQuery.as('totalRegistration')
        })

        .orderBy('totalRegistration', 'desc')
        .limit(limit)

    const plantDTO = plant.map((pla) => {
        return new AdsGroupPlant(pla,
            pla.tambon.amphure.province.geography,
            pla.tambon.amphure.province,
            pla.tambon.amphure,
            pla.tambon,
            pla.$extras.totalRegistration
        )
    })

    return plantDTO
}



export default {
    getThaiLocation,
    getAdsGroupStatus,
    getAdsGroupPeriod,
    getAdsGroupPackage,
    getTopPlant
}
