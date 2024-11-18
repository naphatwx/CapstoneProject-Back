import AdsPackage from '#models/ads_package'
import Advertisement from '#models/advertisement'
import Log from '#models/log'
import adsPackageService from '#services/ads_package_service'
import { createUpdateAdvertisementValidator } from '#validators/advertisement'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AdvertisementsController {
    private defaultPage: number = 1
    private defaultPerPage: number = 5

    async getAds({ request }: HttpContext) {
        const page: number = request.input('page') || this.defaultPage
        const perPage: number = request.input('perPage') || this.defaultPerPage
        const search: string = request.input('search') || ''

        const ads = await Advertisement.query()
            .select('adsId', 'adsName', 'redeemCode', 'packageId', 'periodId', 'status', 'updatedUser', 'updatedDate')
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

    async getAdsDetail({ params }: HttpContext) {
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
            updatedDate: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
            imageName: payload.imageName,
            refAdsId: payload.refAdsId,
            consentDesc: payload.consentDesc,
            recInMth: payload.recInMth,
            recNextMth: payload.recNextMth,
            nextMth: payload.nextMth,
            rgsStrDate: payload.rgsStrDate == null ? null : DateTime.fromISO(payload.rgsStrDate).toFormat('yyyy-MM-dd HH:mm:ss'),
            rgsExpDate: payload.rgsExpDate == null ? null : DateTime.fromISO(payload.rgsExpDate).toFormat('yyyy-MM-dd HH:mm:ss')
        })

        if (payload.adsPackages) {
            await adsPackageService.createAdsPackage(payload.adsPackages, newAds.adsId)
        }

        await Log.create({
            logHeader: payload.logHeader,
            updatedUser: user.userId,
            updatedDate: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
            adsId: newAds.adsId
        })

        response.ok('Created advertisement successfully')
    }

    async updateAds({ params, request, response, auth }: HttpContext) {
        try {
            const adsId = params.adsId
            const data = request.body()
            // const user = auth.getUserOrFail()
            const user = {
                userId: 'ADMIN_1'
            }
            const payload = await createUpdateAdvertisementValidator.validate(data)

            const ads = await Advertisement.query().where('adsId', adsId).first()
            ads!.adsName = payload.adsName
            ads!.adsCond = payload.adsCond
            ads!.status = payload.status
            ads!.periodId = payload.periodId
            ads!.redeemCode = payload.redeemCode
            ads!.packageId = payload.packageId
            ads!.regisLimit = payload.regisLimit
            ads!.updatedUser = user.userId
            ads!.updatedDate = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
            ads!.imageName = payload.imageName
            ads!.refAdsId = payload.refAdsId
            ads!.consentDesc = payload.consentDesc
            ads!.recInMth = payload.recInMth
            ads!.recNextMth = payload.recNextMth
            ads!.nextMth = payload.nextMth
            ads!.rgsStrDate = payload.rgsStrDate == null ? null : DateTime.fromISO(payload.rgsStrDate).toFormat('yyyy-MM-dd HH:mm:ss')
            ads!.rgsExpDate = payload.rgsExpDate == null ? null : DateTime.fromISO(payload.rgsExpDate).toFormat('yyyy-MM-dd HH:mm:ss')

            if (payload.adsPackages) {
                await AdsPackage.query().where('adsId', ads!.adsId).delete()
                await adsPackageService.createAdsPackage(payload.adsPackages, ads!.adsId)
            }

            await Log.create({
                logHeader: payload.logHeader,
                updatedUser: user.userId,
                updatedDate: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
                adsId: ads!.adsId
            })

            response.ok('Updated advertisement successfully')
        } catch (error) {
            return error
        }

    }
}