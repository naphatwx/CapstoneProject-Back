import Period from "#models/period"

const getPeriods = async () => {
    const periods = await Period.query().select('periodId', 'periodDesc', 'period')
    return periods
}

export default { getPeriods }