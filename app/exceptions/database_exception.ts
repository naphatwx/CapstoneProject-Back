import { Exception } from '@adonisjs/core/exceptions'

export default class DatabaseException extends Exception {
    constructor(status: number = 500, message: string = '') {
        if (status === 404) {
            const messageError = message === '' ? 'Data not found' : message
            super(messageError, {code: status.toString(), status: status})
        } else {
            const messageError = message === '' ? 'Unable to connect to the database' : message
            super(messageError, {code: status.toString(), status: status})
        }
    }
}
