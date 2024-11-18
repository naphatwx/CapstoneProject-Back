import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Media from './media.js'

export default class Package extends BaseModel {
    public static table = 'CMS_PACKAGE'

    @column({ columnName: 'PACKAGE_ID', isPrimary: true })
    declare packageId: number

    @column({ columnName: 'MEDIA_ID' })
    declare mediaId: number

    @column({ columnName: 'PACKAGE_DESC' })
    declare packageDesc: string | null

    @column({ columnName: 'STATUS' })
    declare status: boolean | null

    @hasOne(() => Media, {
        foreignKey: 'mediaId',
        localKey: 'mediaId'
    })
    declare media: HasOne<typeof Media>
}