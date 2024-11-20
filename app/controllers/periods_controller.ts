// import type { HttpContext } from '@adonisjs/core/http'

import Period from "#models/period";

export default class PeriodsController {
    async index({}) {
        const periods = await Period.query().select('periodId', 'periodDesc', 'period')

        return periods
    }
}