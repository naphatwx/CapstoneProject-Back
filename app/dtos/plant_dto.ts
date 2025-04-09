import { UserShortDTO } from "./user_dto.js"

export class PlantListDTO {
    comCode: string
    comName: string
    plantCode: string
    plantNameTh: string
    plantNameEn: string
    status: boolean
    updatedUser: string | null
    updatedDate: string | null
    userUpdate: UserShortDTO | null

    constructor(data: any) {
        this.comCode = data.comCode
        this.comName = data.company?.comName
        this.plantCode = data.plantCode
        this.plantNameTh = data.plantNameTh
        this.plantNameEn = data.plantNameEn
        this.status = data.status || false
        this.updatedUser = data.updatedUser || null
        this.updatedDate = data.updatedDate || null
        if (data.userUpdate) {
            this.userUpdate = {
                comCode: data.userUpdate?.comCode || null,
                userId: data.userUpdate?.userId || null,
                firstname: data.userUpdate?.firstname || null,
                lastname: data.userUpdate?.lastname || null
            }
        } else {
            this.userUpdate = null
        }
    }
}

export class PlantShortDTO {
    plantCode: string | null
    plantNameTh: string | null
    plantNameEn: string | null

    constructor(data: any) {
        this.plantCode = data.plantCode || null
        this.plantNameTh = data.plantNameTh || null
        this.plantNameEn = data.plantNameEn || null
    }
}
