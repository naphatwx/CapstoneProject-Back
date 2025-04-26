import media_service from '#services/media_service'
import { createMediaValidator, inactivateMediaValidator, mediaValidator, updateMediaValidator } from '#validators/media'
import type { HttpContext } from '@adonisjs/core/http'

export default class MediaController {
    async getMedias({ request, response }: HttpContext) {
        const notInMediaIdList = request.input('notInMediaIdList', [])
        const status = request.input('status', null)
        const orderField = request.input('orderField', 'mediaId')
        const orderType = request.input('orderType', 'asc')

        const payload = await mediaValidator.validate({
            notInMediaIdList: notInMediaIdList,
            status: status,
            orderField: orderField,
            orderType: orderType
        })
        const medias = await media_service.getMedias(
            payload.notInMediaIdList, payload.status, payload.orderField, payload.orderType
        )
        return response.ok(medias)
    }

    async createMedia({ request, response }: HttpContext) {
        const data = request.body()
        const payload = await createMediaValidator.validate({ mediaDesc: data.mediaDesc })
        const mediaIdSucess = await media_service.createMedia(payload.mediaDesc)
        return response.status(201).json({ message: 'สร้าง Media แล้ว', mediaId: mediaIdSucess })
    }

    async updateMedia({ params, request, response }: HttpContext) {
        const mediaId = params.mediaId
        const data = request.body()
        const payload = await updateMediaValidator.validate({ mediaId: mediaId, mediaDesc: data.mediaDesc })
        const mediaIdSucess = await media_service.updateMedia(payload.mediaId, payload.mediaDesc)
        return response.status(200).json({ message: 'แก้ไข Media แล้ว', mediaId: mediaIdSucess })
    }

    async inactivateMedia({ params, response }: HttpContext) {
        const mediaId = params.mediaId
        const payload = await inactivateMediaValidator.validate({ mediaId: mediaId })
        await media_service.inactivateMedia(payload.mediaId)
        return response.status(200).json({ message: 'ปิดใช้งาน Media แล้ว' })
    }
}
