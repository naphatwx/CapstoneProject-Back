import Plant from "#models/plant"
import time_service from "#services/time_service"
import { UserShortDTO } from "./user_dto.js"

export class PlantListDTO {
    comCode: string
    comName: string
    plantCode: string
    plantNameTh: string
    plantNameEn: string
    status: boolean
    updatedUser: string
    updatedDate: string
    userUpdate: UserShortDTO | null

    constructor(plant: Partial<Plant>) {
        this.comCode = plant.comCode || ''
        this.comName = plant.company?.comName || ''
        this.plantCode = plant.plantCode || ''
        this.plantNameTh = plant.plantNameTh || ''
        this.plantNameEn = plant.plantNameEn || ''
        this.status = plant.status || false
        this.updatedUser = plant.updatedUser || ''
        this.updatedDate = time_service.ensureDateTimeToString(plant.updatedDate) || ''
        if (plant.userUpdate) {
            this.userUpdate = {
                comCode: plant.userUpdate?.comCode || '',
                userId: plant.userUpdate?.userId || '',
                firstname: plant.userUpdate?.firstname || '',
                lastname: plant.userUpdate?.lastname || ''
            }
        } else {
            this.userUpdate = null
        }
    }
}

export class PlantShortDTO {
    plantCode: string
    plantNameTh: string
    plantNameEn: string

    constructor(plant: Partial<Plant>) {
        this.plantCode = plant.plantCode || ''
        this.plantNameTh = plant.plantNameTh || ''
        this.plantNameEn = plant.plantNameEn || ''
    }
}
