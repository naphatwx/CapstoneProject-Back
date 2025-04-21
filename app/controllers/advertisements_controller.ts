import advertisement_service from '#services/advertisement_service'
import { adsIdValidator, createUpdateAdvertisementValidator, updateActiveAdsValidator } from '#validators/advertisement'
import type { HttpContext } from '@adonisjs/core/http'
import { paramsAdsPageValidator } from '#validators/pagination'
import { isAccess } from '#abilities/main'
import appConfig from '#config/app'
import { imageValidator } from '#validators/file'
import file_service from '#services/file_service'
import my_service from '#services/my_service'
import { registrationValidator } from '#validators/registration'

export default class AdvertisementsController {
    private adsActivityId = 1

    async getAdsPage({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultView, this.adsActivityId)
        const page = request.input('page', appConfig.defaultPage)
        const perPage = request.input('perPage', appConfig.defaultPerPage)
        const search = request.input('search', '')
        const periodId = request.input('periodId')
        const packageId = request.input('packageId')
        const status = request.input('status')
        const orderField = request.input('orderField')
        const orderType = request.input('orderType')

        const payload = await paramsAdsPageValidator.validate({
            page, perPage, search, periodId, packageId, status, orderField, orderType
        })

        const adsPage = await advertisement_service.getAdsPage(
            payload.page,
            payload.perPage,
            payload.search,
            payload.periodId,
            payload.packageId,
            payload.status,
            payload.orderField,
            payload.orderType
        )
        return response.ok(adsPage)
    }

    async getAdsDetail({ params, response, bouncer, session }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultView, this.adsActivityId)
        const token = session.get('tokenData')
        const adsId = params.adsId

        const paylaod = await adsIdValidator.validate({ adsId })

        const ads = await advertisement_service.getAdsDetail(paylaod.adsId, token.authToken)
        return response.ok(ads)
    }

    async getOldestAdsRegisDate({ response }: HttpContext) {
        const ads = await advertisement_service.getOldestAdsRegisDate()
        return response.ok(ads)
    }

    async createAds({ request, response, auth, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultCreate, this.adsActivityId)
        const data = request.body()
        const user = auth.getUserOrFail()

        const payload = await createUpdateAdvertisementValidator.validate(data)

        const newAdsId = await advertisement_service.createAds(payload, user.userId)
        return response.status(201).json({ message: 'Advertisement has been created.', adsId: newAdsId })
    }

    async updateDraftDate({ params, request, response, auth, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultUpdate, this.adsActivityId)
        const adsId = params.adsId
        const data = request.body()
        const user = auth.getUserOrFail()

        const payload = await createUpdateAdvertisementValidator.validate(data)

        const newAdsId = await advertisement_service.updateDraftAds(adsId, payload, user.userId)
        return response.status(200).json({ message: 'Advertisement has been updated.', adsId: newAdsId })
    }

    async updateActiveAds({ params, request, response, auth, bouncer, session }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultUpdate, this.adsActivityId)
        const token = session.get('tokenData')
        const adsId = params.adsId
        const data = request.body()
        const user = auth.getUserOrFail()

        const payload = await updateActiveAdsValidator.validate(data)
        const ads = await advertisement_service.getAdsDetail(adsId, token.authToken)

        if (ads.status === 'A') {
            await bouncer.with('AdvertisementPolicy').authorize('updateActiveAds', ads.approveUser!)
        }

        const newAdsId = await advertisement_service.updateActiveAds(adsId, payload, user.userId)
        return response.status(200).json({ message: 'Advertisement has been updated.', adsId: newAdsId })
    }

    async uploadAdsImage({ params, request, response, bouncer }: HttpContext) {
        const data = request.only(['isUpdate']) || false
        const isUpdate = my_service.convertToBoolean(data.isUpdate)

        if (isUpdate) await bouncer.authorize(isAccess, appConfig.defaultUpdate, this.adsActivityId)
        else await bouncer.authorize(isAccess, appConfig.defaultCreate, this.adsActivityId)

        const adsId = params.adsId
        const image = request.file('image')

        const payload = await imageValidator.validate({ image })

        if (payload.image) {
            const imageName = await file_service.uploadImage(payload.image)
            await advertisement_service.updateAdsImage(adsId, imageName!)
        }

        return response.status(200).json({ message: 'User image is updated.' })
    }

    async uploadAdsImageToLMS({ params, request, response, bouncer, session }: HttpContext) {
        const data = request.only(['isUpdate']) || false
        const isUpdate = my_service.convertToBoolean(data.isUpdate)

        if (isUpdate) await bouncer.authorize(isAccess, appConfig.defaultUpdate, this.adsActivityId)
        else await bouncer.authorize(isAccess, appConfig.defaultCreate, this.adsActivityId)

        const token = session.get('tokenData')
        const adsId = params.adsId
        const image = request.file('image')

        const payload = await imageValidator.validate({ image })

        await advertisement_service.updateAdsImageToLMS(payload.image, adsId, token.authToken)
        return response.status(200).json({ message: 'User image is updated.' })
    }

    async approveAds({ params, response, auth, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultApprove, this.adsActivityId)
        const adsId = params.adsId
        const user = auth.getUserOrFail()

        await advertisement_service.approveAds(adsId, user.userId)
        return response.status(200).json({ message: 'Advertisement has been approved.', adsId: adsId })
    }

    async rejectAds({ params, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultApprove, this.adsActivityId)
        const adsId = params.adsId

        await advertisement_service.rejectWaitAprroveAds(adsId)
        return response.status(200).json({ message: 'Advertisement has been rejected.', adsId: adsId })
    }

    async exportAdsExcel({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultExport, this.adsActivityId)
        const status = request.input('status', null)
        const orderField = request.input('orderField', null)
        const orderType = request.input('orderType', null)
        const periodId = request.input('periodId', null)
        const monthYear = request.input('monthYear', null)  // Example 2020-08

        const payload = await registrationValidator.validate({
            status, orderField, orderType, periodId, monthYear
        })

        const filePath = await advertisement_service.getAdsExport(
            payload.status, payload.orderField, payload.orderType, payload.periodId, payload.monthYear
        )
        return response.download(filePath);
    }
}
