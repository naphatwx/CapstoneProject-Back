import advertisement_service from '#services/advertisement_service'
import { adsIdValidator, createUpdateAdvertisementValidator } from '#validators/advertisement'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateOrUpdateAdvertisementDTO } from '../dtos/advertisement_dto.js'
import { paginationAndSearchValidator } from '#validators/pagination'

export default class AdvertisementsController {
    private defaultPage: number = 1
    private defaultPerPage: number = 10

    async getAds({ request, response }: HttpContext) {
        const page: number = request.input('page') || this.defaultPage
        const perPage: number = request.input('perPage') || this.defaultPerPage
        const search: string = request.input('search') || ''

        const data = {
            page: page,
            perPage: perPage,
            search: search
        }

        const payload = await paginationAndSearchValidator.validate(data)

        const adsList = await advertisement_service.getAdsList(payload.page, payload.perPage, payload.search)

        return response.ok(adsList)
    }

    async getAdsDetail({ params, response }: HttpContext) {
        const adsId: number = params.adsId

        const paylaod = await adsIdValidator.validate({
            adsId: adsId
        })

        const ads = await advertisement_service.getAdsDetail(paylaod.adsId)

        return response.ok(ads)
    }

    async storeAds({ request, response }: HttpContext) {
        const data = request.body()
        const user = {
            userId: 'ADMIN_1',
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
            userId: 'ADMIN_1',
        }

        const payload = await createUpdateAdvertisementValidator.validate(data)

        const adsDTO = CreateOrUpdateAdvertisementDTO.fromVinePayload(payload)

        await advertisement_service.updateAds(adsId, adsDTO, user.userId)

        return response.status(200).json({ message: 'Updated advertisement successfully.' })
    }

    async approveAds({ params, response }: HttpContext) {
        const adsId = params.adsId
        const user = {
            userId: 'ADMIN_1',
        }

        const approve = await advertisement_service.approveAds(adsId, user.userId)

        return response.status(200).json({
            message: approve?.isAlreadyApproved ?
                'Advertisement is already approved.' : 'Approved advertisement successfully.'
        })
    }
}
