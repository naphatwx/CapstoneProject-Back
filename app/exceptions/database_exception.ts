import { Exception } from '@adonisjs/core/exceptions'

export default class DatabaseException extends Exception {
    constructor(status: number = 500, message: string = '') {
        if (!message) {
            if (status === 404) {
                message = 'Data not found'
            } else {
                message = 'Unable to connect to the database'
            }
        }

        super(message, {code: status.toString(), status: status})
    }
}
