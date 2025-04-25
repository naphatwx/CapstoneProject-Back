import Period from "#models/period"

export class PeriodDTO {
    periodDesc: string | null
    period: number | null

    constructor(period: Partial<Period>) {
        this.periodDesc = period.periodDesc || null
        this.period = period.period || null
    }
}