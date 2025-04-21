import { UserShortDTO } from "./user_dto.js"

export class PlantListDTO {
    comCode: string | null
    comName: string | null
    plantCode: string | null
    plantNameTh: string | null
    plantNameEn: string | null
    status: boolean | null
    updatedUser: string | null
    updatedDate: string | null
    userUpdate: UserShortDTO | null

    constructor(data: any) {
        this.comCode = data.comCode || null
        this.comName = data.company?.comName || null
        this.plantCode = data.plantCode || null
        this.plantNameTh = data.plantNameTh || null
        this.plantNameEn = data.plantNameEn || null
        this.status = data.status || null
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
