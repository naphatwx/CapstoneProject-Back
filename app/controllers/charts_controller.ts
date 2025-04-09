import BadRequestException from '#exceptions/badrequest_exception'
import chart_service from '#services/chart_service'
import thai_location_service from '#services/thai_location_service'
import { adsIdValidator } from '#validators/advertisement'
import { topRegisByAdsValidator, topRegisByPlantValidator } from '#validators/chart'
import type { HttpContext } from '@adonisjs/core/http'

export default class ChartsController {

    async getAdsGroupStatus({ response }: HttpContext) {
        const ads = await chart_service.getAdsGroupStatus()
        return response.ok(ads)
    }

    async getAdsGroupPeriod({ response }: HttpContext) {
        const ads = await chart_service.getAdsGroupPeriod()
        return response.ok(ads)
    }

    async getAdsGroupPackage({ response }: HttpContext) {
        const ads = await chart_service.getAdsGroupPackage()
        return response.ok(ads)
    }
    async getTopRegisByPlant({ request, response }: HttpContext) {
        const geographyId = request.input('geographyId')
        const provinceId = request.input('provinceId')
        const year = request.input('year')
        const quarter = request.input('quarter')
        const limit = request.input('limit', 10)

        await topRegisByPlantValidator.validate({ geographyId, provinceId, year, quarter, limit })

        const result = await thai_location_service.validateProvinceInGeo(geographyId, provinceId)
        if (!result.isSuccess) {
            throw new BadRequestException('Province is not in this geography.')
        }

        const regis = await chart_service.getTopRegisByPlant(geographyId, provinceId, year, quarter, limit)
        return response.ok(regis)
    }

    async getTopRegisByAds({ request, response }: HttpContext) {
        const periodId = request.input('periodId')
        const packageId = request.input('packageId')
        const status = request.input('status')
        const year = request.input('year')
        const quarter = request.input('quarter')
        const limit = request.input('limit', 10)

        await topRegisByAdsValidator.validate({ periodId, packageId, status, year, quarter, limit })

        const regis = await chart_service.getTopRegisByAds(periodId, packageId, status, year, quarter, limit)
        return response.ok(regis)
    }

    async getRegisPerMonthByAds({params, response}: HttpContext) {
        const adsId = params.adsId
        await adsIdValidator.validate({adsId})
        const regis = await chart_service.getRegisPerMonthByAds(adsId)
        return response.ok(regis)
    }
}
