import HandlerException from "#exceptions/handler_exception"
import Plant from "#models/plant"
import { PlantListDTO, PlantShortDTO } from "../dtos/plant_dto.js"
import time_service from "./time_service.js"

const getPlants = async (page: number, perPage: number, search: string) => {
    try {
        const plants = await Plant.query()
            .where('plantCode', 'LIKE', `%${search}%`)
            .orWhere('plantNameTh', 'LIKE', `%${search}%`)
            .orWhere('plantNameEn', 'LIKE', `%${search}%`)
            .preload('company')
            .orderBy('plantCode', 'asc')
            .paginate(page, perPage)

        await Promise.all(plants.all().map(async (plant) => {
            if (plant.updatedUser) {
                await plant.load('userUpdate')
            }
        }))

        const plantsDTO = plants.all().map((plant) => new PlantListDTO(plant.toJSON()))
        return { meta: plants.getMeta(), data: plantsDTO }
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getPlantDetail = async (plantCode: string) => {
    try {
        const plant = await Plant.query().where('plantCode', plantCode)
            .preload('company')
            .firstOrFail()

        if (plant.updatedUser) {
            await plant.load('userUpdate')
        }

        const plantDTO = new PlantListDTO(plant)
        return plantDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const getPlantsByComCode = async (comCode: string) => {
    try {
        const plants = await Plant.query().where('comCode', comCode)
        const plantsDTO = plants.map((plant) => new PlantShortDTO(plant.toJSON()))
        return plantsDTO
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const createPlant = async (data: any, userId: string) => {
    try {
        const newPlant = setValue(new Plant(), data, userId)
        await newPlant.save()
        return newPlant.plantCode
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const updatePlant = async (data: any, userId: string) => {
    try {
        const plant = await Plant.query().where('comCode', data.comCode).where('plantCode', data.plantCode).firstOrFail()
        const newPlant = setValue(plant, data, userId)
        await newPlant.save()
        return newPlant.plantCode
    } catch (error) {
        throw new HandlerException(error.status, error.message)
    }
}

const setValue = (plant: Plant, data: any, userId: string) => {
    plant.comCode = data.comCode
    plant.plantCode = data.plantCode
    plant.plantNameTh = data.plantNameTh
    plant.plantNameEn = data.plantNameEn
    plant.status = data.status
    plant.updatedUser = userId
    plant.updatedDate = time_service.getDateTimeNow()

    return plant
}

export default { getPlants, getPlantDetail, getPlantsByComCode, createPlant, updatePlant }
