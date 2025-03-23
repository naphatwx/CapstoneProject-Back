import { cuid } from "@adonisjs/core/helpers"
import { MultipartFile } from "@adonisjs/core/bodyparser"
import app from "@adonisjs/core/services/app"
import fs from 'node:fs'
import HandlerException from "#exceptions/handler_exception"
import text_service from "./text_service.js"
import ExcelJS from 'exceljs'

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
                await fs.promises.unlink(absolutePath)
            }
        }
    } catch (error) {
        throw new HandlerException(error.status)
    }
}

const exportExcel = async (data: any[], worksheetName: string, filename: string) => {
    const minimumWidth = 25

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(worksheetName)

    // Define columns
    worksheet.columns = Object.keys(data[0]).map(key => ({
        header: text_service.pascalToNormal(key),
        key: key,
        width: minimumWidth
    }))

    // Style for headers
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } }
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' }
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Add rows
    data.forEach((row, index) => {
        const excelRow = worksheet.addRow(row)

        // Alternate row colors
        if (index % 2 === 0) {
            excelRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'F2F2F2' }
            }
        }

        // Center align all cells in the row
        excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
    })

    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        })
    })

    // Auto-fit columns
    worksheet.columns.forEach(column => {
        column.width = Math.max(
            column.width || 10,
            minimumWidth // minimum width
        )
    })

    // Ensure the tmp directory exists
    const tmpDir = app.tmpPath()
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true })
    }

    // Generate file buffer
    const filePath = app.tmpPath(filename + '.xlsx')
    await workbook.xlsx.writeFile(filePath)

    return filePath
}

export default { getImageUrl, saveImage, deleteImage, exportExcel }
