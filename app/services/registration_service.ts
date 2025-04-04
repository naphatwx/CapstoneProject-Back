import HandlerException from "#exceptions/handler_exception"
import advertisement_service from "./advertisement_service.js"
import { AdsRegisDTO } from "../dtos/advertisement_dto.js"

const getNumberOfRegisAds = async (
    status: string | null,
    orderField: string | null,
    orderType: string | null,
    periodId: number | null,
    monthYear: string | null) => {
    try {
        const adsRegis = await advertisement_service.getAdsRegistration(status, periodId, monthYear, orderField, orderType, 10)

        if (adsRegis.length === 0) {
            return []
        }

        const adsDTO = await Promise.all(
            adsRegis.map(async (ads) => {
                return new AdsRegisDTO(ads.toJSON(), ads.$extras.totalRegistration)
            })
        )

        return adsDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

export default { getNumberOfRegisAds }