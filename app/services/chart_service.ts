import HandlerException from "#exceptions/handler_exception"
import Advertisement from "#models/advertisement"
import Plant from "#models/plant"
import Registration from "#models/registration"
import { DateTime } from "luxon"
import { AdsGroupPackageDTO, AdsGroupPeriodDTO, TopPlantDTO, AdsGrupStatusDTO, TopAdsDTO, RegisPerMonthByAdsDTO, PlantExport, RegistrationPlantExport, RegistrationAdsExport } from "../dtos/chart_dtos.js"
import time_service from "./time_service.js"
import ExcelJS from 'exceljs'
import file_service from "./file_service.js"
import { AdvertisementExportDTO } from "../dtos/advertisement_dto.js"

const getAdsGroupStatus = async (year: number = DateTime.now().year) => {
    try {
        const ads = await Advertisement.query()
            .select('status')
            .whereNotNull('status')
            .where('status', '!=', '')
            .whereIn('status', ['A', 'N'])
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

const getAdsGroupPeriod = async (year: number = DateTime.now().year) => {
    try {
        const ads = await Advertisement.query()
            .select('periodId')
            .whereNotNull('periodId')
            .where('periodId', '!=', 0)
            // Status
            .whereNotNull('status')
            .where('status', '!=', '')
            .whereIn('status', ['A', 'N'])

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

const getAdsGroupPackage = async (year: number = DateTime.now().year) => {
    try {
        const ads = await Advertisement.query()
            .select('packageId')
            .whereNotNull('packageId')
            .where('packageId', '!=', 0)
            // Status
            .whereNotNull('status')
            .where('status', '!=', '')
            .whereIn('status', ['A', 'N'])

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
    geographyId: number | null = null,
    provinceId: number | null = null,
    year: number | null = null,
    quarter: number | null = null,
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

        const plantList = await Plant.query()
            // Load company
            .preload('company')
            // Filter plant by location
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
            // Preload location
            .preload('tambon', (tambonQuery) => {
                tambonQuery.preload('amphure', (amphureQuery) => {
                    amphureQuery.preload('province', (provinceQuery) => {
                        provinceQuery.preload('geography')
                    })
                })
            })
            // Filter plant by year and quarter
            // .if(year && quarter, (query) => {
            //     query.whereHas('registration', (regQuery) => {
            //         regQuery.whereHas('advertisement', (adQuery) => {
            //             adQuery.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') >= ?`, [monthYearStart as string])
            //                 .whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy-MM') <= ?`, [monthYearEnd as string])
            //         })
            //     })
            // })
            // .if(year && !quarter, (query) => {
            //     query.whereHas('registration', (regQuery) => {
            //         regQuery.whereHas('advertisement', (adQuery) => {
            //             adQuery.whereRaw(`FORMAT(RGS_STR_DATE, 'yyyy') = ?`, [year!.toString() as string])
            //         })
            //     })
            // })
            // Preload with filter
            .preload('registrations', (regQuery) => {
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
            .withCount('registrations', (regQuery) => {
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

        return plantList
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const mapToTopPlantDTO = async (
    geographyId: number | null = null,
    provinceId: number | null = null,
    year: number | null = null,
    quarter: number | null = null,
    limit: number = 10
) => {
    const plantList = await getTopRegisByPlant(geographyId, provinceId, year, quarter, limit)
    const plantDTO = plantList.map((pla) => {
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
}

const exportTopRegisByPlant = async (
    geographyId: number | null = null,
    provinceId: number | null = null,
    year: number | null = null,
    quarter: number | null = null,
    limit: number = 10
) => {
    const plantList = await getTopRegisByPlant(geographyId, provinceId, year, quarter, limit)
    const plantDTO = plantList.map((pla) => {
        return new PlantExport(pla, pla.$extras.totalRegistration)
    })

    const workbook = new ExcelJS.Workbook()
    let filePath = await file_service.exportExcel(plantDTO, 'Plant list', 'Plant data', workbook)

    for (let i = 0; i < plantList.length; i++) {
        const plant = plantList[i]
        if (plant.$extras.totalRegistration > 0) {
            const regisDTO = plant.registrations.map((regis) => {
                return new RegistrationPlantExport(regis)
            })
            filePath = await file_service.exportExcel(
                regisDTO, `${plant.company.comCode}_${plant.plantCode} ${plant.plantNameTh}`, 'Plant data', workbook
            )
        }
    }

    return filePath
}

const getTopRegisByAds = async (
    periodId: number | null = null,
    packageId: number | null = null,
    status: string | null = null,
    year: number | null = null,
    quarter: number | null = null,
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

        const adsList = await Advertisement.query()
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

        return adsList
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const mapToTopAdsDTO = async (
    periodId: number | null = null,
    packageId: number | null = null,
    status: string | null = null,
    year: number | null = null,
    quarter: number | null = null,
    limit: number = 10
) => {
    const adsList = await getTopRegisByAds(periodId, packageId, status, year, quarter, limit)
    const adsDTO = adsList.map((ad) => {
        return new TopAdsDTO(ad, ad.$extras.totalRegistration)
    })

    return adsDTO
}

const exportTopRegisByAds = async (
    periodId: number | null = null,
    packageId: number | null = null,
    status: string | null = null,
    year: number | null = null,
    quarter: number | null = null,
    limit: number = 10
) => {
    const adsList = await getTopRegisByAds(periodId, packageId, status, year, quarter, limit)
    const adsDTO = await Promise.all(
        adsList.map(async (ads) => {
            if (ads.updatedUser) await ads.load('userUpdate')
            if (ads.approveUser) await ads.load('userApprove')

            return new AdvertisementExportDTO(ads, ads.$extras.totalRegistration)
        }))

    const workbook = new ExcelJS.Workbook()
    let filePath = await file_service.exportExcel(adsDTO, 'Advertisement list', 'Advertisement data', workbook)

    for (let i = 0; i < adsList.length; i++) {
        const ads = adsList[i]
        if (ads.$extras.totalRegistration > 0) {
            const regisDTO = await Promise.all(
                ads.registrations.map(async (regis) => {
                    await regis.load('plant', (plantQuery) => {
                        plantQuery.preload('company')
                    })

                    console.log(regis)
                    return new RegistrationAdsExport(regis)
                }))


            filePath = await file_service.exportExcel(
                regisDTO, `${ads.adsId}_${ads.adsName}`, 'Advertisement data', workbook
            )
        }
    }

    return filePath
}

const getRegisPerMonthByAds = async (adsId: number) => {
    try {
        const ads = await Advertisement.query()
            .where('adsId', adsId)
            .preload('registrations')
            .preload('period')
            .preload('packages')
            .firstOrFail()
        return ads
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const mapToRegisPerMonthByAdsDTO = async (adsId: number) => {
    const ads = await getRegisPerMonthByAds(adsId)

    const adsMonthToRgs = time_service.getMonthsBetweenDates(ads.rgsStrDate, ads.rgsExpDate)
    const monthlyCounts = convertToMonthlyCount(ads.registrations)
    const finalMonthCount = mergeMonthsWithCounts(adsMonthToRgs, monthlyCounts)

    const result = new RegisPerMonthByAdsDTO(ads, finalMonthCount)
    return result
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
}

// Convert registration array to [{regisMonth: '2025-01', count: 24}]
const convertToMonthlyCount = (data: Registration[]) => {
    const monthCountMap = new Map<string, number>()

    // Process each record
    data.forEach(record => {
        if (record.regisDate) {
            const monthKey = time_service.extractYearMonth(record.regisDate)
            monthCountMap.set(monthKey, (monthCountMap.get(monthKey) || 0) + 1)
        }
    })

    const result = Array.from(monthCountMap.entries())
        .map(([regisMonth, count]) => ({
            regisMonth,
            count
        }))
        .sort((a, b) => a.regisMonth.localeCompare(b.regisMonth))

    return result
}

// Merge ['2024-11', '2024-12] and [{regisMonth: '2024-11', count: 10}]
// to [{regisMonth: '2024-11', count: 10}, {regisMonth: '2024-12', count: 0}]
const mergeMonthsWithCounts = (months: string[], countData: any[]) => {
    // Create a map from the count data for easy lookup
    const countMap = new Map<string, number>()

    // Populate the map with existing count data
    countData.forEach(item => {
        countMap.set(item.regisMonth, item.count)
    })

    // Map each month to an object with regisMonth and count
    return months.map(month => ({
        regisMonth: month,
        count: countMap.get(month) || 0 // Use 0 if no count data exists
    }))
}

export default {
    getAdsGroupStatus,
    getAdsGroupPeriod,
    getAdsGroupPackage,

    getTopRegisByPlant,
    mapToTopPlantDTO,
    exportTopRegisByPlant,

    getTopRegisByAds,
    mapToTopAdsDTO,
    exportTopRegisByAds,

    getRegisPerMonthByAds,
    mapToRegisPerMonthByAdsDTO
}
