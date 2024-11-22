import advertisement_service from '#services/advertisement_service'
import { createUpdateAdvertisementValidator } from '#validators/advertisement'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateOrUpdateAdvertisementDTO } from '../DTOs/advertisement_dto.js'

export default class AdvertisementsController {
    private defaultPage: number = 1
    private defaultPerPage: number = 5

    async getAds({ request, response }: HttpContext) {
        const page: number = request.input('page') || this.defaultPage
        const perPage: number = request.input('perPage') || this.defaultPerPage
        const search: string = request.input('search') || ''

        const adsList = await advertisement_service.getAdsList(page, perPage, search)

        if (!adsList.data || adsList.data.length == 0) {
            return response.status(404).json({ message: 'Advertiesment list not found.' })
        }

        return response.ok(adsList)
    }

    async getAdsDetail({ params, response }: HttpContext) {
        const adsId = params.adsId
        const ads = await advertisement_service.getAdsDetail(adsId)

        if (!ads) {
            return response.status(404).json({ message: 'Advertisement not found.' })
        }

        return response.ok(ads)
    }

    async storeAds({ request, response }: HttpContext) {
        const data = request.body()
        // const user = auth.getUserOrFail()
        const user = {
            userId: 'ADMIN_1'
        }

        const payload = await createUpdateAdvertisementValidator.validate(data)

        const adsDTO = CreateOrUpdateAdvertisementDTO.fromVinePayload(payload)

        await advertisement_service.createAds(adsDTO, user.userId)

        return response.status(201).json({ message: 'Created advertisement successfully.' })
    }

    async updateAds({ params, request, response }: HttpContext) {
        const adsId = params.adsId
        const data = request.body()
        const user = {
            userId: 'ADMIN_1'
        }

        const payload = await createUpdateAdvertisementValidator.validate(data)

        const adsDTO = CreateOrUpdateAdvertisementDTO.fromVinePayload(payload)

        await advertisement_service.updateAds(adsId, adsDTO, user.userId)

        return response.status(200).json({ message: 'Updated advertisement successfully.' })
    }

    async approveAds({ params, request, response }: HttpContext) {
        const adsId = params.adsId
        const data = request.only(['logHeader'])
        const user = {
            userId: 'ADMIN_1'
        }

        await advertisement_service.approveAds(adsId, data.logHeader, user.userId)

        return response.status(200).json({ message: 'Updated advertisement successfully.' })
    }
}

