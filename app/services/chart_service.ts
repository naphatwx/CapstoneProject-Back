import HandlerException from "#exceptions/handler_exception"
import Advertisement from "#models/advertisement"
import Plant from "#models/plant"
import Registration from "#models/registration"
import { DateTime } from "luxon"
import { AdsGroupPackageDTO, AdsGroupPeriodDTO, TopPlantDTO, AdsGrupStatusDTO, TopAdsDTO, RegisPerMonthByAdsDTO } from "../dtos/chart_dtos.js"
import time_service from "./time_service.js"
import db from "@adonisjs/lucid/services/db"

const getAdsGroupStatus = async (year: number | null = DateTime.now().year) => {
    try {
        const ads = await Advertisement.query()
            .select('status')
            .whereNotNull('status')
            .where('status', '!=', '')
            .where('status', '!=', 'D') // Do not get draft status
            .if(year, (query) => query.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy') = ?`, [year!]))
            .count('* as count')
            .groupBy('status')
            .orderBy('status', 'asc')

        const adsDTO = ads.map((ad) => {
            return new AdsGrupStatusDTO(ad, ad.$extras.count)
        })
        return adsDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getAdsGroupPeriod = async (year: number | null = DateTime.now().year) => {
    try {
        const ads = await Advertisement.query()
            .select('periodId')
            .whereNotNull('periodId')
            .where('periodId', '!=', 0)
            .if(year, (query) => query.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy') = ?`, [year!]))
            .preload('period')
            .count('* as count')
            .groupBy('periodId')
            .orderBy('periodId', 'asc')

        const adsDTO = ads.map((ad) => {
            return new AdsGroupPeriodDTO(ad, ad.$extras.count)
        })
        return adsDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getAdsGroupPackage = async (year: number | null = DateTime.now().year) => {
    try {
        const ads = await Advertisement.query()
            .select('packageId')
            .whereNotNull('packageId')
            .where('packageId', '!=', 0)
            .if(year, (query) => query.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy') = ?`, [year!]))
            .preload('packages')
            .count('* as count')
            .groupBy('packageId')
            .orderBy('packageId', 'asc')

        const adsDTO = ads.map((ad) => {
            return new AdsGroupPackageDTO(ad, ad.$extras.count)
        })
        return adsDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getTopRegisByPlant = async (
    geographyId: number | string | null = null,
    provinceId: number | string | null = null,
    year: number | string | null = null,
    quarter: number | string | null = null,
    limit: number = 10
) => {
    try {
        time_service.validateYearAndQuarter(year, quarter)

        let monthYearStart: string
        let monthYearEnd: string
        if (year && quarter) {
            monthYearStart = year + '-' + time_service.convertQuarterToMonth(Number(quarter)).start
            monthYearEnd = year + '-' + time_service.convertQuarterToMonth(Number(quarter)).end
        } else if (!year && !quarter) {
            year = DateTime.now().year
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
            return new TopPlantDTO(pla,
                pla.tambon.amphure.province.geography,
                pla.tambon.amphure.province,
                pla.tambon.amphure,
                pla.tambon,
                pla.$extras.totalRegistration
            )
        })

        plantDTO.forEach((pla) => {
            pla.regis = groupRegistrationsByAdsId(pla.regis)
        })

        return plantDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getTopRegisByAds = async (
    periodId: number | string | null = null,
    packageId: number | string | null = null,
    status: string | null = null,
    year: number | string | null = null,
    quarter: number | string | null = null,
    limit: number = 10
) => {
    try {
        time_service.validateYearAndQuarter(year, quarter)

        let monthYearStart: string
        let monthYearEnd: string
        if (year && quarter) {
            monthYearStart = year + '-' + time_service.convertQuarterToMonth(Number(quarter)).start
            monthYearEnd = year + '-' + time_service.convertQuarterToMonth(Number(quarter)).end
        } else if (!year && !quarter) {
            year = DateTime.now().year
        }

        const ads = await Advertisement.query()
            .if(periodId, (query) => query.where('periodId', periodId!))
            .if(packageId, (query) => query.where('packageId', packageId!))
            .if(status, (query) => query.where('status', status!))
            .if(!status, (query) => query.whereIn('status', ['A', 'N']))
            .if(year && quarter, (query) => {
                query.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') >= ?`, [monthYearStart as string])
                    .whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') <= ?`, [monthYearEnd as string])
            })
            .if(year && !quarter, (query) => {
                query.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy') = ?`, [year!.toString() as string])
            })
            .preload('period')
            .preload('packages')
            .preload('registrations')
            .withCount('registrations', (query) => query.as('totalRegistration'))
            .orderBy('totalRegistration', 'desc')
            .limit(limit)

        const adsDTO = ads.map((ad) => {
            return new TopAdsDTO(ad, ad.$extras.totalRegistration)
        })

        return adsDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getRegisPerMonthByAds = async (adsId: number) => {
    try {
        const ads = await Advertisement.query()
            .where('adsId', adsId)
            .preload('period')
            .preload('packages')
            .firstOrFail()

        const regisByAds = await Registration.query()
            .where('adsId', adsId)
            .select(
                db.raw("FORMAT(REGIS_DATE, 'yyyy-MM') as regisMonth"),
                db.raw('COUNT(*) as count')
            )
            .groupByRaw("FORMAT(REGIS_DATE, 'yyyy-MM')")
            .orderBy('regisMonth')

        const result = new RegisPerMonthByAdsDTO(ads, regisByAds.map((reg) => reg.$extras))

        return result
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

interface OldRegisForm {
    regisNo: string
    adsId: number
    adsName: string
    rgsStrDate: string
}

interface GroupedRegistration {
    adsId: number
    adsName: string
    rgsStrDate: string
    numberOfRegis: number
    regisNo: string[]
}

const groupRegistrationsByAdsId = (registrations: OldRegisForm[]) => {
    const result: GroupedRegistration[] = []

    registrations.forEach(item => {
        const existingGroup = result.find(group => group.adsId === item.adsId) // Find existing group

        if (existingGroup) {
            existingGroup.regisNo.push(item.regisNo)
            existingGroup.numberOfRegis = existingGroup.regisNo.length
        } else {
            // No existingGroup => create a new group
            result.push({
                adsId: item.adsId,
                adsName: item.adsName,
                rgsStrDate: item.rgsStrDate,
                numberOfRegis: 1,
                regisNo: [item.regisNo]
            })
        }
    })

    return result

    // return registrations.reduce((result: GroupedRegistration[], item: OldRegisForm) => {
    //     const existingEntry = result.find(group => group.adsId === item.adsId)
    //     console.log(existingEntry)

    //     if (existingEntry) {
    //         existingEntry.regisNo.push(item.regisNo)
    //         existingEntry.numberOfRegis = existingEntry.regisNo.length
    //     } else {
    //         result.push({
    //             adsId: item.adsId,
    //             rgsStrDate: item.rgsStrDate,
    //             numberOfRegis: 1, // Initial count
    //             regisNo: [item.regisNo]
    //         })
    //     }

    //     return result
    // }, [])
}

export default {
    getAdsGroupStatus,
    getAdsGroupPeriod,
    getAdsGroupPackage,

    getTopRegisByPlant,
    getTopRegisByAds,
    getRegisPerMonthByAds
}
