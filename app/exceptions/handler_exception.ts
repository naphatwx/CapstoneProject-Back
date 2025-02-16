import { Exception } from '@adonisjs/core/exceptions'

export default class HandlerException extends Exception {
    constructor(status: number = 500, message: string = '') {
        if (!message) {
            switch (status) {
                case 400:
                    message = 'Bad Request.'
                    break
                case 401:
                    message = 'Unauthorized.'
                    break
                case 403:
                    message = 'Access denied.'
                    break
                case 404:
                    message = 'Data not found.'
                    break
                default:
                    message = 'Unable to connect to the database.'
                    break;
            }
        }

        super(message, { code: status.toString(), status: status })
    }
}
