import Plant from "#models/plant"
import time_service from "#services/time_service"
import { UserShortDTO } from "./user_dto.js"

export class PlantListDTO {
    comCode: string | null
    comName: string | null
    plantCode: string | null
    plantNameTh: string | null
    plantNameEn: string | null
    status: boolean
    updatedUser: string | null
    updatedDate: string | null
    userUpdate: UserShortDTO | null

    constructor(plant: Partial<Plant>) {
        this.comCode = plant.comCode || null
        this.comName = plant.company?.comName || null
        this.plantCode = plant.plantCode || null
        this.plantNameTh = plant.plantNameTh || null
        this.plantNameEn = plant.plantNameEn || null
        this.status = plant.status || false
        this.updatedUser = plant.updatedUser || null
        this.updatedDate = time_service.ensureDateTimeToString(plant.updatedDate) || null
        this.userUpdate = plant.userUpdate ? new UserShortDTO(plant.userUpdate) : null
    }
}

export class PlantShortDTO {
    plantCode: string | null
    plantNameTh: string | null
    plantNameEn: string | null

    constructor(plant: Partial<Plant>) {
        this.plantCode = plant.plantCode || null
        this.plantNameTh = plant.plantNameTh || null
        this.plantNameEn = plant.plantNameEn || null
    }
}
