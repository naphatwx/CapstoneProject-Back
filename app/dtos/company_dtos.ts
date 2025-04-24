import Company from "#models/company"

export class CompanyDTO {
    comCode: string
    comName: string

    constructor(company: Partial<Company>) {
        this.comCode = company.comCode || ''
        this.comName = company.comName || ''
    }
}