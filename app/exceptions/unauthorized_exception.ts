import { Exception } from '@adonisjs/core/exceptions'

export default class UnauthorizedException extends Exception {
    constructor(message: string = 'Unauthorized') {
        const status: number = 401
        super(message, {code: status.toString(), status: status})
    }
}
