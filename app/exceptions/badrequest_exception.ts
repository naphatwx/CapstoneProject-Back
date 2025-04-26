import { Exception } from '@adonisjs/core/exceptions'

export default class BadRequestException extends Exception {
    constructor(message: string = 'Bad Request') {
        const status: number = 400
        super(message, {code: status.toString(), status: status})
    }
}
