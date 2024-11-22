import type { HttpContext } from '@adonisjs/core/http'

import Package from "#models/package";
import media_service from '#services/media_service';

export default class PackagesController {
    async index({ }) {
        const packages = await Package.query().select('packageId', 'packageDesc').groupBy('packageId', 'packageDesc')

        return packages
    }

    async getMediasByPackage({ request, response }: HttpContext) {
        const packageId = request.input('packageId')
        const packages = await Package.query().where('packageId', packageId).preload('media')

        if (packages.length == 0) {
            return response.status(404).json({ message: 'Package not found.' })
        }

        const medias = media_service.changeMediaFormat(packages)

        return { packageId: packages[0].packageId, packageDesc: packages[0].packageDesc, medias: medias }
    }
}