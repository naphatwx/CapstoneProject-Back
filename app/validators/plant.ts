import Plant from '#models/plant'
import vine from '@vinejs/vine'

export const createPlantValidator = vine.compile(
    vine.object({
        comCode: vine.string().maxLength(12),
        plantCode: vine.string().maxLength(12).unique(async (db, value, { parent }) => {
            const comCode = parent.comCode
            const exist = await Plant.query()
                .where('comCode', comCode)
                .where('plantCode', value)
                .first()
            return exist ? false : true // If exist, it means not pass
        }),
        plantNameTh: vine.string().maxLength(100),
        plantNameEn: vine.string().maxLength(100),
        status: vine.boolean()
    })
)

export const updatePlantValidator = vine.compile(
    vine.object({
        comCode: vine.string().maxLength(12),
        plantCode: vine.string().maxLength(12).unique(async (db, value, { parent }) => {
            const comCode = parent.comCode
            const exist = await Plant.query()
                .where('comCode', comCode)
                .where('plantCode', value)
                .first()

            return exist ? false : true // If exist, it means not pass
        }),
        plantNameTh: vine.string().maxLength(100),
        plantNameEn: vine.string().maxLength(100),
        status: vine.boolean()
    })
)
