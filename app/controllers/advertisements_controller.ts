import AdsPackage from '#models/ads_package'
import Advertisement from '#models/advertisement'
import Log from '#models/log'
import adsPackageService from '#services/ads_package_service'
import timeService from '#services/time_service'
import { createUpdateAdvertisementValidator } from '#validators/advertisement'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdvertisementsController {
    private defaultPage: number = 1
    private defaultPerPage: number = 5

    async getAds({ request }: HttpContext) {
        const page: number = request.input('page') || this.defaultPage
        const perPage: number = request.input('perPage') || this.defaultPerPage
        const search: string = request.input('search') || ''

        const ads = await Advertisement.query()
            .select('adsId', 'adsName', 'redeemCode', 'packageId', 'periodId', 'rgsStrDate', 'status', 'updatedUser', 'updatedDate')
            .where('adsName', 'LIKE', `%${search}%`)
            .orWhere('redeemCode', search)

            .preload('period', (periodQuery) => {
                periodQuery.select('periodDesc', 'period').where('status', true)
            })
            .orWhereHas('period', (periodQuery) => {
                periodQuery.where('periodDesc', 'LIKE', `%${search}%`)
            })
            .preload('packages', (packageQuery) => {
                packageQuery.where('status', true)
            })
            .orWhereHas('packages', (packageQuery) => {
                packageQuery.where('packageDesc', 'LIKE', `%${search}%`)
            })
            .preload('userUpdate', (userQuery) => {
                userQuery.select('comCode', 'userId', 'firstname', 'lastname')
            })
            .orWhereHas('userUpdate', (userQuery) => {
                userQuery.whereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", [`%${search}%`])
            })

            .orderBy('adsId', 'asc')
            .paginate(page, perPage)

        return ads
    }

    async getAdsDetail({ params, response }: HttpContext) {
        const adsId = params.adsId

        const ad = await Advertisement.query()
            .where('adsId', adsId)
            .preload('period', (periodQuery) => {
                periodQuery.select('periodDesc', 'period').where('status', true)
            })
            .preload('packages', (packageQuery) => {
                packageQuery.where('status', true)
                    .preload('media', (mediaQuery) => {
                        mediaQuery.where('status', true)
                    })
            })
            .preload('adsPackages', (adsPackageQuery) => {
                adsPackageQuery.select('mediaId', 'mediaDesc').where('status', true)
            })
            .preload('logs', (logQuery) => {
                logQuery.select('itemNo', 'logHeader', 'updatedUser', 'updatedDate')
                    .preload('user', (userQuery) => {
                        userQuery.select('userId', 'firstname', 'lastname')
                    })
            })
            .preload('userUpdate')
            .first()

        if (!ad) {
            return response.status(404).json({ message: 'Advertisment not found.' })
        }

        if (ad?.approveUser) {
            await ad.load('userApprove')
        }

        return ad
    }

    async createAds({ request, response, auth }: HttpContext) {
        const data = request.body()
        // const user = auth.getUserOrFail()
        const user = {
            userId: 'ADMIN_1'
        }
        const payload = await createUpdateAdvertisementValidator.validate(data)

        const newAds = await Advertisement.create({
            adsName: payload.adsName,
            adsCond: payload.adsCond,
            status: payload.status,
            periodId: payload.periodId,
            redeemCode: payload.redeemCode,
            packageId: payload.packageId,
            regisLimit: payload.regisLimit,
            updatedUser: user.userId,
            updatedDate: timeService.getDateTimeNow(),
            imageName: payload.imageName,
            refAdsId: payload.refAdsId,
            consentDesc: payload.consentDesc,
            recInMth: payload.recInMth,
            recNextMth: payload.recNextMth,
            nextMth: payload.nextMth,
            rgsStrDate: payload.rgsStrDate == null ? null : timeService.changeDateTimeFormat(payload.rgsStrDate),
            rgsExpDate: payload.rgsExpDate == null ? null : timeService.changeDateTimeFormat(payload.rgsExpDate)
        })

        if (payload.adsPackages) {
            await adsPackageService.createAdsPackage(payload.adsPackages, newAds.adsId)
        }

        await Log.create({
            logHeader: payload.logHeader,
            updatedUser: user.userId,
            updatedDate: timeService.getDateTimeNow(),
            adsId: newAds.adsId
        })

        return response.status(201).json({ message: 'Created advertisment successfully.' })
    }

    async updateAds({ params, request, response, auth }: HttpContext) {
        const adsId = params.adsId
        const data = request.body()
        // const user = auth.getUserOrFail()
        const user = {
            userId: 'ADMIN_1'
        }
        const payload = await createUpdateAdvertisementValidator.validate(data)

        const ads = await Advertisement.query().where('adsId', adsId).first()

        if (!ads) {
            return response.status(404).json({ message: 'Advertisement not found.' })
        }

        ads.adsName = payload.adsName
        ads.adsCond = payload.adsCond
        ads.status = payload.status
        ads.periodId = payload.periodId
        ads.redeemCode = payload.redeemCode
        ads.packageId = payload.packageId
        ads.regisLimit = payload.regisLimit
        ads.updatedUser = user.userId
        ads.updatedDate = timeService.getDateTimeNow()
        ads.imageName = payload.imageName
        ads.refAdsId = payload.refAdsId
        ads.consentDesc = payload.consentDesc
        ads.recInMth = payload.recInMth
        ads.recNextMth = payload.recNextMth
        ads.nextMth = payload.nextMth
        ads.rgsStrDate = payload.rgsStrDate == null ? null : timeService.changeDateTimeFormat(payload.rgsStrDate)
        ads.rgsExpDate = payload.rgsExpDate == null ? null : timeService.changeDateTimeFormat(payload.rgsExpDate)

        await ads.save()

        if (payload.adsPackages) {
            await AdsPackage.query().where('adsId', ads.adsId).delete()
            await adsPackageService.createAdsPackage(payload.adsPackages, ads.adsId)
        }

        await Log.create({
            logHeader: payload.logHeader,
            updatedUser: user.userId,
            updatedDate: timeService.getDateTimeNow(),
            adsId: ads.adsId
        })

        return response.status(200).json({ message: 'Updated advertisment successfully.' })


    }
}