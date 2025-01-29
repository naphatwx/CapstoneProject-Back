import Company from "#models/company"

const getCompanies = async () => {
    const companies = await Company.all()
    return companies
}

export default { getCompanies }
