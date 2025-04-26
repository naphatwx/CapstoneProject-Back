import app from '#config/app'
import plant_service from '#services/plant_service'
import { pageAndSearchValidator } from '#validators/pagination'
import { createPlantValidator, updatePlantValidator } from '#validators/plant'
import type { HttpContext } from '@adonisjs/core/http'

export default class PlantsController {
    async getPlants({ request, response }: HttpContext) {
        const page: number = request.input('page', app.defaultPage)
        const perPage: number = request.input('perPage', app.defaultPerPage)
        const search: string = request.input('search', '')

        const payload = await pageAndSearchValidator.validate({
            page: page,
            perPage: perPage,
            search: search
        })

        const plants = await plant_service.getPlants(payload.page!, payload.perPage!, payload.search!)
        return response.ok(plants)
    }

    async getPlantDetail({ params, response }: HttpContext) {
        const plantCode = params.plantCode
        const plant = await plant_service.getPlantDetail(plantCode)
        return response.ok(plant)
    }

    async getPlantsByComCode({ params, response }: HttpContext) {
        const comCode = params.comCode
        const plants = await plant_service.getPlantsByComCode(comCode)
        return response.ok(plants)
    }

    async createPlant({ request, response, auth }: HttpContext) {
        const user = auth.getUserOrFail()
        const data = request.all()
        const payload = await createPlantValidator.validate(data)
        await plant_service.createPlant(payload, user.userId)
        return response.status(201).json({ message: 'สร้างสาขาเเล้ว' })
    }

    async updatePlant({ request, response, auth }: HttpContext) {
        const user = auth.getUserOrFail()
        const data = request.all()
        const payload = await updatePlantValidator.validate(data)
        await plant_service.updatePlant(payload, user.userId)
        return response.status(200).json({ message: 'แก้ไขสาขาเเล้ว' })
    }
}
