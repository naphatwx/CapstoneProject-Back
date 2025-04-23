import type { HttpContext } from '@adonisjs/core/http'
import package_service from '#services/package_service'
import { createUpdatePackageValidator, packageIdValidator } from '#validators/package'

export default class PackagesController {
    async getPackages({ response }: HttpContext) {
        const packages = await package_service.getPackages()
        return response.ok(packages)
    }

    async getPackageById({ params, response }: HttpContext) {
        const packageId = params.packageId
        const paylaod = await packageIdValidator.validate({ packageId: packageId })
        const pk = await package_service.getPackageById(paylaod.packageId)
        return response.ok(pk)
    }

    async createPackage({ request, response }: HttpContext) {
        const data = request.body()
        const payload = await createUpdatePackageValidator.validate(data)
        const newPackageId = await package_service.createPackage(payload)
        return response.status(201).json({ message: 'Package has been created.', packageId: newPackageId })
    }

    async updatePackage({ params, request, response }: HttpContext) {
        const packageId = params.packageId
        const data = request.body()

        const payloadPackageId = await packageIdValidator.validate({ packageId: packageId })
        const paylaod = await createUpdatePackageValidator.validate(data)

        const newPackageId = await package_service.updatePackage(payloadPackageId.packageId, paylaod)
        return response.status(200).json({ message: 'Package has been updated.', packaegId: newPackageId })
    }

    async inactivatePackage({ params, response }: HttpContext) {
        const packageId = params.packageId
        const payload = await packageIdValidator.validate({ packageId: packageId })
        await package_service.inactivatePackage(payload.packageId)
        return response.status(200).json({ message: 'Package has been inactivated.' })
    }
}
