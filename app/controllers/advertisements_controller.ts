import advertisement_service from '#services/advertisement_service'
import { adsIdValidator, createUpdateAdvertisementValidator } from '#validators/advertisement'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateOrUpdateAdvertisementDTO } from '../dtos/advertisement_dto.js'
import { pageAndSearchValidator } from '#validators/pagination'
import BadRequestException from '#exceptions/badrequest_exception'
import { isAccess } from '#abilities/main'
import app from '#config/app'
import { imageValidator } from '#validators/file'
import file_service from '#services/file_service'

export default class AdvertisementsController {
    private adsActivityId = 1

    async getAds({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.adsActivityId)

        const page = request.input('page') || app.defaultPage
        const perPage = request.input('perPage') || app.defaultPerPage
        const search = request.input('search') || ''

        const data = {
            page: page,
            perPage: perPage,
            search: search
        }

        const payload = await pageAndSearchValidator.validate(data)
        const adsList = await advertisement_service.getAdsList(payload.page, payload.perPage, payload.search)
        return response.ok(adsList)
    }

    async getAdsDetail({ params, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultView, this.adsActivityId)

        const adsId = params.adsId
        const paylaod = await adsIdValidator.validate({
            adsId: adsId
        })

        const ads = await advertisement_service.getAdsDetail(paylaod.adsId)
        return response.ok(ads)
    }

    async storeAds({ request, response, auth, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultCreate, this.adsActivityId)

        const data = request.body()
        const user = auth.getUserOrFail()

        const payload = await createUpdateAdvertisementValidator.validate(data)
        const result = advertisement_service.compareDate(payload.rgsStrDate, payload.rgsExpDate)

        if (!result.isSuccess) {
            throw new BadRequestException(result.message)
        }

        const adsDTO = CreateOrUpdateAdvertisementDTO.fromVinePayload(payload)
        await advertisement_service.createAds(adsDTO, user.userId)
        return response.status(201).json({ message: 'Advertisement has been created.' })
    }

    async updateAds({ params, request, response, auth, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultUpdate, this.adsActivityId)

        const adsId = params.adsId
        const data = request.body()
        const user = auth.getUserOrFail()

        const payload = await createUpdateAdvertisementValidator.validate(data)
        const result = advertisement_service.compareDate(payload.rgsStrDate, payload.rgsExpDate)

        if (!result.isSuccess) {
            throw new BadRequestException(result.message)
        }

        const adsDTO = CreateOrUpdateAdvertisementDTO.fromVinePayload(payload)
        await advertisement_service.updateAds(adsId, adsDTO, user.userId)
        return response.status(200).json({ message: 'Advertisement has been updated.' })
    }

    async uploadAdsImage({ params, request, response, bouncer }: HttpContext) {
        const isUpdate = request.input('isUpdate') || false

        if (isUpdate) await bouncer.authorize(isAccess, app.defaultUpdate, this.adsActivityId)
        else await bouncer.authorize(isAccess, app.defaultCreate, this.adsActivityId)

        const adsId = params.adsId
        const image = request.file('image')

        const payload = await imageValidator.validate({
            image: image
        })

        if (payload.image) {
            const imageName = await file_service.saveImage(payload.image)
            await advertisement_service.updateAdsImage(adsId, imageName!)
        }

        return response.status(200).json({ message: 'User image is updated.' })
    }

    async approveAds({ params, response, auth, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, app.defaultUpdate, this.adsActivityId)

        const adsId = params.adsId
        const user = auth.getUserOrFail()

        await advertisement_service.approveAds(adsId, user.userId)
        return response.status(200).json({ message: 'Advertisement has been approved.' })
    }
}
