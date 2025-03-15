import { cuid } from "@adonisjs/core/helpers"
import { MultipartFile } from "@adonisjs/core/bodyparser"
import app from "@adonisjs/core/services/app"
import fs from 'node:fs'
import HandlerException from "#exceptions/handler_exception"

const getImagePath = async (imageName: string) => {
    const path = app.makePath('storage/uploads', imageName)
    console.log(path)
    return path
}

const saveImage = async (image: MultipartFile) => {
    await image.move(app.makePath('storage/uploads'), {
        name: `${cuid()}.${image.extname}`
    })

    return image.fileName
}

const deleteImage = async (imageName: string) => {
    try {
        if (imageName) {
            const absolutePath = app.makePath('storage/uploads', imageName)

            if (fs.existsSync(absolutePath)) {
                await fs.promises.unlink(absolutePath);
            }
        }
    } catch (error) {
        throw new HandlerException(error.status)
    }
}

export default { getImagePath, saveImage, deleteImage }
