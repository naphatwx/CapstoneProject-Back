import { isAccess } from '#abilities/main'
import app from '#config/app'
import BadRequestException from '#exceptions/badrequest_exception'
import advertisement_service from '#services/advertisement_service'
import chart_service from '#services/chart_service'
import my_service from '#services/my_service'
import thai_location_service from '#services/thai_location_service'
import { adsIdValidator } from '#validators/advertisement'
import { topRegisByAdsValidator, topRegisByPlantValidator, yearValidator } from '#validators/chart'
import { searchValidator } from '#validators/pagination'
import type { HttpContext } from '@adonisjs/core/http'

export default class ChartsController {
    private dashbordActivityId = 3

    async getAdsGroupStatus({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.dashbordActivityId)
        const year = request.input('year')
        const payload = await yearValidator.validate({ year })
        const ads = await chart_service.getAdsGroupStatus(payload.year)
        return response.ok(ads)
    }

    async getAdsGroupPeriod({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.dashbordActivityId)
        const year = request.input('year')
        const payload = await yearValidator.validate({ year })
        const ads = await chart_service.getAdsGroupPeriod(payload.year)
        return response.ok(ads)
    }

    async getAdsGroupPackage({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.dashbordActivityId)
        const year = request.input('year')
        const payload = await yearValidator.validate({ year })
        const ads = await chart_service.getAdsGroupPackage(payload.year)
        return response.ok(ads)
    }

    async getTopRegisByPlant({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.dashbordActivityId)
        const geographyId = request.input('geographyId')
        const provinceId = request.input('provinceId')
        const year = request.input('year')
        const quarter = request.input('quarter')
        const limit = request.input('limit')
        const isExport = request.input('isExport', false)

        const payload = await topRegisByPlantValidator.validate({ geographyId, provinceId, year, quarter, limit })

        const result = await thai_location_service.validateProvinceInGeo(payload.geographyId, payload.provinceId)
        if (!result.isSuccess) {
            throw new BadRequestException('จังหวัดนี้ไม่ได้อยู่ในภาคนี้')
        }

        if (my_service.convertToBoolean(isExport)) {
            const filePath = await chart_service.exportTopRegisByPlant(
                payload.geographyId, payload.provinceId, payload.year, Number(payload.quarter)
            )
            return response.download(filePath)
        } else {
            const regis = await chart_service.mapToTopPlantDTO(
                payload.geographyId, payload.provinceId, payload.year, Number(payload.quarter), payload.limit ? payload.limit : 10
            )
            return response.ok(regis)
        }
    }

    async getTopRegisByAds({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.dashbordActivityId)
        const periodId = request.input('periodId')
        const packageId = request.input('packageId')
        const status = request.input('status')
        const year = request.input('year')
        const quarter = request.input('quarter')
        const limit = request.input('limit')
        const isExport = request.input('isExport', false)

        const payload = await topRegisByAdsValidator.validate({ periodId, packageId, status, year, quarter, limit })

        if (my_service.convertToBoolean(isExport)) {
            const filePath = await chart_service.exportTopRegisByAds(
                payload.periodId, payload.packageId, payload.status, payload.year, Number(payload.quarter)
            )
            return response.download(filePath)
        } else {
            const regis = await chart_service.mapToTopAdsDTO(
                payload.periodId, payload.packageId, payload.status, payload.year, Number(payload.quarter), payload.limit ? payload.limit : 10
            )
            return response.ok(regis)
        }
    }

    async getRegisPerMonthByAds({ params, request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.dashbordActivityId)
        const adsId = params.adsId
        const isExport = request.input('isExport', false)

        const payload = await adsIdValidator.validate({ adsId })

        if (my_service.convertToBoolean(isExport)) {
            const filePath = await chart_service.exportRegisPerMonthByAds(adsId)
            return response.download(filePath)
        } else {
            const regis = await chart_service.mapToRegisPerMonthByAdsDTO(payload.adsId)
            return response.ok(regis)
        }
    }

    async getAdsList({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.dashbordActivityId)
        const search = request.input('search', '')

        const payload = await searchValidator.validate({ search })
        const adsList = await advertisement_service.getAdsList(payload.search)
        return response.ok(adsList)
    }
}
