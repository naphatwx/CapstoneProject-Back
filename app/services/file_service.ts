import { cuid } from "@adonisjs/core/helpers"
import { MultipartFile } from "@adonisjs/core/bodyparser"
import app from "@adonisjs/core/services/app"
import fs from 'node:fs'
import HandlerException from "#exceptions/handler_exception"
import text_service from "./text_service.js"
import ExcelJS from 'exceljs'
import axios from "axios"

const downloadImageUrl = async (imageName: string) => {
    return `${process.env.APP_URL}/uploads/${imageName}`
}

const downloadImageFromLMS = async (imageName: string, token: string) => {
    try {
        // URL
        const downloadURL = 'https://lms-centralportalgateway-dev.pt.co.th/management/Image/DownloadImage'

        // Body
        const body = {
            "containerName": "test",
            "directory": "image.jpg",
            "fileName": imageName
        }

        // Header
        const header = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }

        const response = await axios.post(downloadURL, body, header)

        if (response.status === 200) {
            return response.data.data // return image url
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // console.log('Error data:', error.response?.data)
            // console.log('Error status:', error.response?.status)
            // console.log('Error headers:', error.response?.headers)
            throw new HandlerException(error.response?.status, error.response?.data.status.description)
        } else {
            throw new HandlerException(error.status, error.message)
        }
    }
}

const uploadImage = async (image: MultipartFile) => {
    await image.move(app.makePath('public/uploads'), {
        name: `${cuid()}.${image.extname}`
    })

    return image.fileName
}

const uploadImageToLMS = async (image: MultipartFile, token: string) => {
    try {
        // URL
        const uploadURL = 'https://lms-centralportalgateway-dev.pt.co.th/management/Image/UploadImage'

        // Body
        const formData = new FormData()
        formData.append('ContainerName', 'test')
        formData.append('Directory', 'image.jpg')

        // Header
        const header = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }

        if (image) {
            const blob = await convertMultipartFileToBlob(image)
            formData.append('File', blob, image.clientName)
        }

        await axios.post(uploadURL, formData, header)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // console.log('Error data:', error.response?.data)
            // console.log('Error status:', error.response?.status)
            // console.log('Error headers:', error.response?.headers)
            throw new HandlerException(error.response?.status, error.response?.data.status.description)
        } else {
            throw new HandlerException(error.status, error.message)
        }
    }
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

const exportExcel = async (
    data: any[],
    worksheetName: string,
    filename: string,
    oldWorkbook: ExcelJS.Workbook | null = null
) => {
    // Create a new workbook and worksheet
    const workbook = oldWorkbook ? oldWorkbook : new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(worksheetName)

    await createTableInWorksheet(worksheet, data)
    const filePath = await generateFileBuffer(filename, workbook)
    return filePath
}

const createTableInWorksheet = async (worksheet: ExcelJS.Worksheet, data: any[]) => {
    const minWidth = 25
    const maxWidth = 50

    // Add a blank row if this is not the first table
    if (worksheet.rowCount > 0) {
        worksheet.addRow([])
    }

    // Get the last row number
    const lastRowNumber = worksheet.rowCount

    // Define columns
    const columns = Object.keys(data[0]).map(key => ({
        key: key
    }))
    worksheet.columns = columns

    // Define new header
    const headerRow = worksheet.getRow(lastRowNumber + 1)
    const headers = Object.keys(data[0]).map(key => text_service.changeTextFormat(key))
    headerRow.values = headers

    // Style for headers using worksheet columns
    worksheet.columns.forEach((column, index) => {
        const cell = headerRow.getCell(index + 1)
        cell.font = { bold: true, color: { argb: 'FFFFFF' } }
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4472C4' }
        }
    })

    // Add rows (map data by column's key)
    data.forEach((row, index) => {
        const excelRow = worksheet.addRow(row)
        // Alternate row colors
        if (index % 2 === 0) {
            worksheet.columns.forEach((column, index) => {
                const cell = excelRow.getCell(index + 1)
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F2F2F2' }
                }
            })
        }
    })

    // Add borders and alignment to all cells
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
            cell.alignment = { vertical: 'middle', horizontal: 'center' }
        })
    })

    // Auto-fit columns based on column count (using column count because want most column number to auto-fit column)
    const columnCount = worksheet.columnCount
    for (let i = 1; i <= columnCount; i++) {
        const column = worksheet.getColumn(i)
        // Get the current width or default to minWidth
        const currentWidth = column.width || minWidth
        // Set width between minWidth and maxWidth
        column.width = Math.min(Math.max(currentWidth, minWidth), maxWidth)
    }

    return worksheet
}

const generateFileBuffer = async (filename: string, workbook: ExcelJS.Workbook) => {
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

const convertMultipartFileToBlob = async (multipartFile: MultipartFile): Promise<Blob> => {
    // Read the file as a buffer
    const buffer = await fs.promises.readFile(multipartFile.tmpPath!)

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: multipartFile.type })

    return blob
}

export default {
    downloadImageUrl,
    downloadImageFromLMS,
    uploadImage,
    uploadImageToLMS,
    deleteImage,

    exportExcel,
    createTableInWorksheet,
    generateFileBuffer,
    convertMultipartFileToBlob
}
