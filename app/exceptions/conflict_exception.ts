import { Exception } from '@adonisjs/core/exceptions'

export default class ConflictException extends Exception {
    constructor(message: string = 'Conflict') {
        const status: number = 409
        super(message, {code: status.toString(), status: status})
    }
}