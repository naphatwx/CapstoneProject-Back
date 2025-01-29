import company_service from '#services/company_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class CompaniesController {
    async index({response}:HttpContext) {
        const companies = await company_service.getCompanies()
        return response.ok(companies)
    }
}
