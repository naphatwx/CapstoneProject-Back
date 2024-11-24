import type { HttpContext } from '@adonisjs/core/http'
import package_service from '#services/package_service'
import { packageIdValidator } from '#validators/package'

export default class PackagesController {
    async index({ response }: HttpContext) {
        const packages = await package_service.getPackages()

        return response.ok(packages)
    }

    async getPackageById({ params, response }: HttpContext) {
        const packageId = params.packageId
        const paylaod = await packageIdValidator.validate({
            packageId: packageId
        })
        const pk = await package_service.getPackageById(paylaod.packageId)

        return response.ok(pk)
    }
}
