import advertisement_service from '#services/advertisement_service'
import { adsIdValidator, createUpdateAdvertisementValidator } from '#validators/advertisement'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateOrUpdateAdvertisementDTO } from '../dtos/advertisement_dto.js'
import { paginationAndSearchValidator } from '#validators/pagination'
import BadRequestException from '#exceptions/badrequest_exception'
import ForbiddenException from '#exceptions/forbidden_exception'
import { isAccess } from '#abilities/main'
import app from '#config/app'

export default class AdvertisementsController {
    private defaultActivityId = 1

    async getAds({ request, response, bouncer }: HttpContext) {
        if (await bouncer.denies(isAccess, app.defaultView, this.defaultActivityId)) {
            throw new ForbiddenException()
        }

        const page: number = request.input('page') || app.defaultPage
        const perPage: number = request.input('perPage') || app.defaultPerPage
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

    async getAdsDetail({ params, response, bouncer }: HttpContext) {
        if (await bouncer.denies(isAccess, app.defaultView, this.defaultActivityId)) {
            throw new ForbiddenException()
        }

        const adsId = params.adsId
        const paylaod = await adsIdValidator.validate({
            adsId: adsId
        })

        const ads = await advertisement_service.getAdsDetail(paylaod.adsId)
        return response.ok(ads)
    }

    async storeAds({ request, response, auth, bouncer }: HttpContext) {
        if (await bouncer.denies(isAccess, app.defaultCreate, this.defaultActivityId)) {
            throw new ForbiddenException()
        }

        const data = request.body()
        const user = auth.getUserOrFail()

        const payload = await createUpdateAdvertisementValidator.validate(data)
        const result = advertisement_service.compareDate(payload.rgsStrDate, payload.rgsExpDate)

        if (!result.result) {
            throw new BadRequestException(result.message)
        }

        const adsDTO = CreateOrUpdateAdvertisementDTO.fromVinePayload(payload)
        await advertisement_service.createAds(adsDTO, user.userId)
        return response.status(201).json({ message: 'Created advertisement successfully.' })
    }

    async updateAds({ params, request, response, auth, bouncer }: HttpContext) {
        if (await bouncer.denies(isAccess, app.defaultUpdate, this.defaultActivityId)) {
            throw new ForbiddenException()
        }

        const adsId = params.adsId
        const data = request.body()
        const user = auth.getUserOrFail()

        const payload = await createUpdateAdvertisementValidator.validate(data)
        const result = advertisement_service.compareDate(payload.rgsStrDate, payload.rgsExpDate)

        if (!result.result) {
            throw new BadRequestException(result.message)
        }

        const adsDTO = CreateOrUpdateAdvertisementDTO.fromVinePayload(payload)
        await advertisement_service.updateAds(adsId, adsDTO, user.userId)
        return response.status(200).json({ message: 'Updated advertisement successfully.' })
    }

    async approveAds({ params, response, auth, bouncer }: HttpContext) {
        if (await bouncer.denies(isAccess, app.defaultUpdate, this.defaultActivityId)) {
            throw new ForbiddenException()
        }

        const adsId = params.adsId
        const user = auth.getUserOrFail()

        await advertisement_service.approveAds(adsId, user.userId)
        return response.status(200).json({
            message: 'Approved advertisement successfully.'
        })
    }
}
