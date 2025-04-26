import { Exception } from '@adonisjs/core/exceptions'

export default class NotFoundException extends Exception {
    constructor(message: string = 'Not found') {
        const status: number = 404
        super(message, {code: status.toString(), status: status})
    }
}
