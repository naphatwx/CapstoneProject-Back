import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
    /**
     * In debug mode, the exception handler will display verbose errors
     * with pretty printed stack traces.
     */
    protected debug = !app.inProduction

    /**
     * The method is used for handling errors and returning
     * response to the client
     */
    async handle(error: any, ctx: HttpContext) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            const errorMessages = error.messages.map((err: any) => ({
                message: err.message,
                rule: err.rule,
                field: err.field
            }))
            return ctx.response.status(400).send({
                message: error.message,
                details: errorMessages,
            })
        }

        if (error.status === 400) {
            return ctx.response.status(400).send({
                message: 'Bad Request',
                details: error.message,
            })
        }

        if (error.status === 404) {
            return ctx.response.status(404).send({
                message: 'Not Found',
                details: error.message,
            })
        }

        if (error.status === 500) {
            return ctx.response.status(500).send({
                message: 'Internal Server Error',
                details: error.message,
            })
        }

        return super.handle(error, ctx)
    }

    /**
     * The method is used to report error to the logging service or
     * the third party error monitoring service.
     *
     * @note You should not attempt to send a response from this method.
     */
    async report(error: unknown, ctx: HttpContext) {
        return super.report(error, ctx)
    }
}
