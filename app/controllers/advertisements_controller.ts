import advertisement_service from '#services/advertisement_service'
import { adsIdValidator, createUpdateAdvertisementValidator } from '#validators/advertisement'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateOrUpdateAdvertisementDTO } from '../dtos/advertisement_dto.js'
import { pageAndSearchValidator } from '#validators/pagination'
import BadRequestException from '#exceptions/badrequest_exception'
import { isAccess } from '#abilities/main'
import appConfig from '#config/app'
import { imageValidator } from '#validators/file'
import file_service from '#services/file_service'
import my_service from '#services/my_service'
import axios from 'axios'
import HandlerException from '#exceptions/handler_exception'
import { registrationValidator } from '#validators/registration'

export default class AdvertisementsController {
    private adsActivityId = 1

    async getAds({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultView, this.adsActivityId)

        const page = request.input('page') || appConfig.defaultPage
        const perPage = request.input('perPage') || appConfig.defaultPerPage
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
        await bouncer.authorize(isAccess, appConfig.defaultView, this.adsActivityId)

        const adsId = params.adsId
        const paylaod = await adsIdValidator.validate({
            adsId: adsId
        })

        const ads = await advertisement_service.getAdsDetail(paylaod.adsId)
        return response.ok(ads)
    }

    async getOldestAdsRegisDate({ response }: HttpContext) {
        const ads = await advertisement_service.getOldestAdsRegisDate()
        return response.ok(ads)
    }

    async storeAds({ request, response, auth, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultCreate, this.adsActivityId)

        const data = request.body()
        const user = auth.getUserOrFail()

        const payload = await createUpdateAdvertisementValidator.validate(data)
        const result = advertisement_service.compareDate(payload.rgsStrDate, payload.rgsExpDate)

        if (!result.isSuccess) {
            throw new BadRequestException(result.message)
        }

        const adsDTO = CreateOrUpdateAdvertisementDTO.fromVinePayload(payload)
        const newAdsId = await advertisement_service.createAds(adsDTO, user.userId)
        return response.status(201).json({ message: 'Advertisement has been created.', adsId: newAdsId })
    }

    async updateAds({ params, request, response, auth, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultUpdate, this.adsActivityId)

        const adsId = params.adsId
        const data = request.body()
        const user = auth.getUserOrFail()

        const payload = await createUpdateAdvertisementValidator.validate(data)

        const ads = await advertisement_service.getAdsDetail(adsId)

        if (ads.status === 'A') {
            (await bouncer.with('AdvertisementPolicy').authorize('updateActiveAds', ads.approveUser!))
            const result = advertisement_service.compareDate(null, payload.rgsExpDate)
            if (!result.isSuccess) {
                throw new BadRequestException(result.message)
            }
        }

        const adsDTO = CreateOrUpdateAdvertisementDTO.fromVinePayload(payload)
        const newAdsId = await advertisement_service.updateAds(adsId, adsDTO, user.userId)
        return response.status(200).json({ message: 'Advertisement has been updated.', adsId: newAdsId })
    }

    // async uploadAdsImage({ params, request, response, bouncer, session }: HttpContext) {
    //     const isUpdate = Boolean(request.input('isUpdate')) || false

    //     if (isUpdate) await bouncer.authorize(isAccess, appConfig.defaultUpdate, this.adsActivityId)
    //     else await bouncer.authorize(isAccess, appConfig.defaultCreate, this.adsActivityId)

    //     const adsId = params.adsId
    //     const image = request.file('image')
    //     const payload = await imageValidator.validate({
    //         image: image
    //     })

    //     try {
    //         const uploadURL = 'https://lms-centralportalgateway-dev.pt.co.th/management/Image/UploadImage'
    //         const token = session.get('tokenData')
    //         const formData = new FormData()
    //         formData.append('ContainerName', 'test')
    //         formData.append('Directory', 'image.jpg')

    //         if (payload.image) {
    //             const blob = await file_service.convertMultipartFileToBlob(payload.image)
    //             formData.append('File', blob, payload.image.clientName)
    //         }

    //         await axios.post(uploadURL, formData, {
    //             headers: {
    //                 'Authorization': `Bearer ${token.authToken}`,
    //             }
    //         })

    //         await advertisement_service.updateAdsImage(adsId, payload.image.clientName)

    //     } catch (error) {
    //         // if (axios.isAxiosError(error)) {
    //         //     console.log('Error data:', error.response?.data);
    //         //     console.log('Error status:', error.response?.status);
    //         //     console.log('Error headers:', error.response?.headers);
    //         // }
    //         throw new HandlerException(error.status, error.message)
    //     }

    //     return response.status(200).json({ message: 'User image is updated.' })
    // }

    async uploadAdsImage({ params, request, response, bouncer }: HttpContext) {
        const data = request.only(['isUpdate']) || false
        const isUpdate = my_service.convertToBoolean(data.isUpdate)

        if (isUpdate) await bouncer.authorize(isAccess, appConfig.defaultUpdate, this.adsActivityId)
        else await bouncer.authorize(isAccess, appConfig.defaultCreate, this.adsActivityId)


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
        await bouncer.authorize(isAccess, appConfig.defaultApprove, this.adsActivityId)

        const adsId = params.adsId
        const user = auth.getUserOrFail()

        await advertisement_service.approveAds(adsId, user.userId)
        return response.status(200).json({ message: 'Advertisement has been approved.' })
    }

    async exportAdsExcel({ request, response, bouncer }: HttpContext) {
        await bouncer.authorize(isAccess, appConfig.defaultExport, this.adsActivityId)

        const status = request.input('status') || null
        const orderField = request.input('orderField') || null
        const orderType = request.input('orderType') || null
        const periodId = request.input('periodId') || null
        const monthYear = request.input('monthYear') || null // Example 2020-08

        const payload = await registrationValidator.validate({
            status,
            orderField,
            orderType,
            periodId,
            monthYear
        })

        // const data = await advertisement_service.getAdsExport(my_service.convertToNumbers(my_service.ensureArray(adsIds)))
        const data = await advertisement_service.getAdsExport(payload.status, payload.orderField, payload.orderType, payload.periodId, payload.monthYear)

        if (data.length === 0) {
            return response.status(404).json({ message: 'No data to export.' })
        }

        const filePath = await file_service.exportExcel(data, 'Advertisements', 'ads')

        // Send file response
        return response.download(filePath);
    }
}
