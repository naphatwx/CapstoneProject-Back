import Period from "#models/period"

export class PeriodDTO {
    periodDesc: string
    period: number

    constructor(period: Partial<Period>) {
        this.periodDesc = period.periodDesc || ''
        this.period = period.period || 0
    }
}