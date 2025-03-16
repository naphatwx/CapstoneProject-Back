import { cuid } from "@adonisjs/core/helpers"
import { MultipartFile } from "@adonisjs/core/bodyparser"
import app from "@adonisjs/core/services/app"
import fs from 'node:fs'
import HandlerException from "#exceptions/handler_exception"

const getImageUrl = async (imageName: string) => {
    return `${process.env.APP_URL}/uploads/${imageName}`
}

const saveImage = async (image: MultipartFile) => {
    await image.move(app.makePath('public/uploads'), {
        name: `${cuid()}.${image.extname}`
    })

    return image.fileName
}

const deleteImage = async (imageName: string) => {
    try {
        if (imageName) {
            const absolutePath = app.makePath('public/uploads', imageName)

            if (fs.existsSync(absolutePath)) {
                await fs.promises.unlink(absolutePath);
            }
        }
    } catch (error) {
        throw new HandlerException(error.status)
    }
}

export default { getImageUrl, saveImage, deleteImage }
