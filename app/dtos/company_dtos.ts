import Company from "#models/company"

export class CompanyDTO {
    comCode: string | null
    comName: string | null

    constructor(company: Partial<Company>) {
        this.comCode = company.comCode || null
        this.comName = company.comName || null
    }
}
