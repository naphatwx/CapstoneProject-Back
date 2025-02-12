import { Exception } from '@adonisjs/core/exceptions'

export default class ForbiddenException extends Exception {
    constructor(message: string = 'Access denied.') {
        const status: number = 403

        super(message, {code: status.toString(), status: status})
    }
}
