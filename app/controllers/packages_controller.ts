import type { HttpContext } from '@adonisjs/core/http'
import package_service from '#services/package_service'

export default class PackagesController {
    async index({ response }: HttpContext) {
        const packages = await package_service.getPackages()
        if (!packages || packages.length === 0) {
            return response.status(404).json({ message: 'Packages not found.' })
        }

        return response.ok(packages)
    }

    async getPackageById({ params, response }: HttpContext) {
        const packageId = params.packageId
        const pk = await package_service.getPackageById(packageId)

        if (!pk) {
            return response.status(404).json({ message: 'Package not found.' })
        }
        return response.ok(pk)
    }
}
